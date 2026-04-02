import type {
  CompilePlan,
  DoctrineGraph,
  PlannedDocument,
  SurfaceDef,
  WorkflowStepDef
} from "../../core/index.js";
import { getOutgoingLinks } from "../../graph/index.js";
import { doc, paragraph, section, unorderedList } from "../../doc/index.js";
import type { NonSectionDocBlockNode, ParagraphNode } from "../../doc/index.js";

function titleCase(input: string): string {
  return input
    .split("_")
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function formatIds(label: string, ids: readonly string[]): string {
  return `${label}: ${ids.length > 0 ? ids.join(", ") : "none"}`;
}

function getReadSectionIds(graph: DoctrineGraph, nodeId: string): string[] {
  return graph.indexes.readSectionIdsByReaderId[nodeId] ?? [];
}

function describeWorkflowStep(graph: DoctrineGraph, step: WorkflowStepDef): NonSectionDocBlockNode[] {
  return [
    paragraph(step.purpose),
    unorderedList([
      `Role: ${step.roleId}`,
      formatIds("Reads", getReadSectionIds(graph, step.id)),
      formatIds("Required inputs", step.requiredInputIds),
      formatIds("Support inputs", step.supportInputIds ?? []),
      formatIds("Interim artifacts", step.interimArtifactIds ?? []),
      formatIds("Required outputs", step.requiredOutputIds),
      `Stop line: ${step.stopLine}`,
      step.nextGateId ? `Next gate: ${step.nextGateId}` : `Next step: ${step.nextStepId ?? "none"}`
    ])
  ];
}

function describeNode(graph: DoctrineGraph, node: DoctrineGraph["nodes"][number]): NonSectionDocBlockNode[] {
  switch (node.kind) {
    case "role":
      return [
        paragraph(node.purpose),
        unorderedList([
          ...node.boundaries?.map((boundary) => `Boundary: ${boundary}`) ?? [],
          formatIds("Reads", getReadSectionIds(graph, node.id))
        ])
      ];
    case "workflow_step":
      return describeWorkflowStep(graph, node);
    case "review_gate": {
      const reads = getReadSectionIds(graph, node.id);
      return [paragraph(node.purpose), unorderedList([formatIds("Checks", node.checkIds), formatIds("Reads", reads)])];
    }
    case "packet_contract":
      return [
        paragraph(`Packet contract for ${node.name}.`),
        unorderedList([
          formatIds("Reads", getReadSectionIds(graph, node.id)),
          formatIds("Conceptual artifacts", node.conceptualArtifactIds),
          formatIds("Runtime artifacts", node.runtimeArtifactIds ?? [])
        ])
      ];
    case "artifact":
      return [
        paragraph(`Artifact class: ${node.artifactClass}.`),
        unorderedList([
          `Runtime path: ${node.runtimePath ?? "none"}`,
          `Conceptual only: ${node.conceptualOnly ? "yes" : "no"}`,
          `Compatibility only: ${node.compatibilityOnly ? "yes" : "no"}`
        ])
      ];
    case "reference":
      return [
        paragraph(`Reference class: ${node.referenceClass}.`),
        unorderedList([`Source path: ${node.sourcePath ?? "none"}`, `URL: ${node.url ?? "none"}`])
      ];
    case "generated_target":
      return [paragraph(`Generated target: ${node.path}.`), unorderedList([formatIds("Source ids", node.sourceIds)])];
    case "surface":
      return [paragraph(`Runtime path: ${node.runtimePath}.`), unorderedList([`Surface class: ${node.surfaceClass}`])];
    case "surface_section":
      return [paragraph(`Stable section slug: ${node.stableSlug}.`), unorderedList([`Title: ${node.title}`])];
  }
}

function getSectionBlocks(graph: DoctrineGraph, sectionId: string): NonSectionDocBlockNode[] {
  const documentedNodes = getOutgoingLinks(graph, sectionId, "documents")
    .map((link) => graph.nodeById[link.to])
    .filter((node): node is DoctrineGraph["nodes"][number] => node !== undefined);

  if (documentedNodes.length === 0) {
    return [paragraph("No documented source units are attached to this section yet.")];
  }

  return documentedNodes.flatMap((node) => describeNode(graph, node));
}

function getDocumentTitle(surface: SurfaceDef, graph: DoctrineGraph): string {
  const documentedNodes = getOutgoingLinks(graph, surface.id, "documents")
    .map((link) => graph.nodeById[link.to])
    .filter((node): node is DoctrineGraph["nodes"][number] => node !== undefined);
  const firstDocumentedNode = documentedNodes[0];

  switch (surface.surfaceClass) {
    case "role_home":
      return firstDocumentedNode?.kind === "role" ? `Role Home: ${firstDocumentedNode.name}` : "Role Home";
    case "workflow_owner":
      return "Workflow Owner";
    case "packet_workflow":
      return firstDocumentedNode?.kind === "packet_contract" ? `Packet Workflow: ${firstDocumentedNode.name}` : "Packet Workflow";
    case "gate":
      return firstDocumentedNode?.kind === "review_gate" ? `Gate: ${firstDocumentedNode.name}` : "Gate";
    case "technical_reference":
      return firstDocumentedNode?.kind === "reference" ? `Technical Reference: ${firstDocumentedNode.name}` : "Technical Reference";
    default:
      return titleCase(surface.surfaceClass);
  }
}

function getIntro(surfaceClass: SurfaceDef["surfaceClass"]): ParagraphNode {
  const messages: Record<SurfaceDef["surfaceClass"], string> = {
    role_home: "This role-home document states the contract for one runtime role.",
    shared_entrypoint: "This shared entrypoint introduces the setup-wide doctrine surface.",
    workflow_owner: "This workflow owner document describes the operational turn order and stop lines.",
    packet_workflow: "This packet workflow document describes the trusted packet contract.",
    standard: "This standard document records reusable doctrine rules.",
    gate: "This gate document records review and acceptance checks.",
    technical_reference: "This technical reference captures support material that shapes implementation.",
    how_to: "This how-to document explains a repeatable operational procedure.",
    coordination: "This coordination document records shared execution expectations."
  };

  return paragraph(messages[surfaceClass]);
}

export function renderSurfaceDocumentAst(
  graph: DoctrineGraph,
  plan: CompilePlan,
  document: PlannedDocument
) {
  const surface = graph.nodeById[document.surfaceId];
  if (!surface || surface.kind !== "surface") {
    throw new Error(`Expected planned document "${document.id}" to reference a surface node.`);
  }

  const sectionNodes = plan.sections
    .filter((sectionPlan) => sectionPlan.documentId === document.id)
    .map((sectionPlan) => {
      const surfaceSection = graph.nodeById[sectionPlan.surfaceSectionId];
      if (!surfaceSection || surfaceSection.kind !== "surface_section") {
        throw new Error(`Expected planned section "${sectionPlan.id}" to reference a surface section node.`);
      }

      return section(surfaceSection.stableSlug, surfaceSection.title, getSectionBlocks(graph, sectionPlan.surfaceSectionId));
    });

  return doc(getDocumentTitle(surface, graph), [getIntro(surface.surfaceClass), ...sectionNodes]);
}
