import type {
  AuthoredContentBlock,
  AuthoredDefinitionListItem,
  AuthoredListEntry,
  CompilePlan,
  DoctrineGraph,
  PlannedDocument,
  PlannedSection,
  SurfaceDef,
  WorkflowStepDef
} from "../../core/index.js";
import { getOutgoingLinks } from "../../graph/index.js";
import { codeBlock, doc, listItem, orderedList, paragraph, section, table, unorderedList } from "../../doc/index.js";
import type { ListItemNode, NonSectionDocBlockNode, ParagraphNode, SectionNode } from "../../doc/index.js";

function titleCase(input: string): string {
  return input
    .split("_")
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

const tokenDisplayNames: Record<string, string> = {
  API: "API",
  GITHUB: "GitHub",
  KB: "KB",
  PR: "PR",
  PSMOBILE: "PSMobile",
  QR: "QR",
  README: "README",
  TS: "TS",
  URL: "URL"
};

export function humanizeIdentifier(input: string): string {
  return input
    .split(/[_-]+/)
    .filter((segment) => segment.length > 0)
    .map((segment) => {
      const upper = segment.toUpperCase();
      return tokenDisplayNames[upper] ?? `${segment.slice(0, 1).toUpperCase()}${segment.slice(1).toLowerCase()}`;
    })
    .join(" ");
}

export function getRuntimePathTitle(path: string): string {
  const filename = path.split("/").at(-1) ?? path;
  const stem = filename.replace(/\.[^.]+$/, "");
  return humanizeIdentifier(stem);
}

function compactLines(lines: Array<string | undefined>): string[] {
  return lines.filter((line): line is string => line !== undefined);
}

function formatLabel(label: string, values: readonly string[]): string {
  return `${label}: ${values.length > 0 ? values.join(", ") : "none"}`;
}

export interface SurfaceSectionRenderContext {
  graph: DoctrineGraph;
  plan: CompilePlan;
  document: PlannedDocument;
  sectionPlan: PlannedSection;
  surface: SurfaceDef;
  surfaceSection: Extract<DoctrineGraph["nodes"][number], { kind: "surface_section" }>;
}

export interface SurfaceDocumentRenderOptions {
  title?: string | undefined;
  introBlocks?: NonSectionDocBlockNode[] | undefined;
  renderSectionBlocks?: ((context: SurfaceSectionRenderContext) => NonSectionDocBlockNode[] | undefined) | undefined;
}

export function getDocumentTitle(surface: SurfaceDef, graph: DoctrineGraph): string {
  const documentedNodes = getOutgoingLinks(graph, surface.id, "documents")
    .map((link) => graph.nodeById[link.to])
    .filter((node): node is DoctrineGraph["nodes"][number] => node !== undefined);
  const firstDocumentedNode = documentedNodes[0];

  switch (surface.surfaceClass) {
    case "role_home":
      return firstDocumentedNode?.kind === "role" ? `Role Home: ${firstDocumentedNode.name}` : "Role Home";
    case "project_home_root":
      return "Project Home";
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

export function getNodeDisplayName(graph: DoctrineGraph, nodeId: string): string {
  const node = graph.nodeById[nodeId];
  if (!node) {
    return nodeId;
  }

  switch (node.kind) {
    case "role":
      return node.name;
    case "workflow_step":
      return node.id;
    case "review_gate":
      return node.name;
    case "packet_contract":
      return node.name;
    case "artifact":
      return node.name;
    case "surface":
      return getDocumentTitle(node, graph);
    case "surface_section":
      return titleCase(node.stableSlug.replaceAll("-", "_"));
    case "reference":
      return node.name;
    case "generated_target":
      return node.path;
  }
}

function formatNodeRefs(graph: DoctrineGraph, label: string, ids: readonly string[]): string {
  return formatLabel(label, ids.map((id) => getNodeDisplayName(graph, id)));
}

function toListItemNodes(entries: readonly AuthoredListEntry[]): ListItemNode[] {
  return entries.map((entry) =>
    typeof entry === "string"
      ? listItem(entry)
      : listItem(entry.text, entry.children ? toListItemNodes(entry.children) : undefined)
  );
}

function definitionItemsToListItemNodes(items: readonly AuthoredDefinitionListItem[]): ListItemNode[] {
  return items.map((item) => listItem(item.term, toListItemNodes(item.definitions)));
}

function exampleCaseTitle(label: string, title: string | undefined): string {
  return title ? `${label}: ${title}` : label;
}

export function getDocumentedNodes(graph: DoctrineGraph, nodeId: string): DoctrineGraph["nodes"][number][] {
  return getOutgoingLinks(graph, nodeId, "documents")
    .map((link) => graph.nodeById[link.to])
    .filter((node): node is DoctrineGraph["nodes"][number] => node !== undefined);
}

export function authoredBlocksToDocBlocks(blocks: readonly AuthoredContentBlock[]): NonSectionDocBlockNode[] {
  return blocks.flatMap((block) => {
    switch (block.kind) {
      case "paragraph":
        return [paragraph(block.text)];
      case "unordered_list":
        return [unorderedList(toListItemNodes(block.items))];
      case "ordered_list":
      case "ordered_steps":
        return [orderedList(toListItemNodes(block.items))];
      case "rule_list":
        return [unorderedList(toListItemNodes(block.items))];
      case "definition_list":
        return [unorderedList(definitionItemsToListItemNodes(block.items))];
      case "table":
        return [table(block.headers, block.rows)];
      case "code_block":
        return [codeBlock(block.language, block.code)];
      case "example":
        return [paragraph(exampleCaseTitle("Example", block.title)), ...authoredBlocksToDocBlocks(block.blocks)];
      case "good_bad_examples":
        return [
          paragraph("Good examples"),
          ...block.good.flatMap((item) => [paragraph(exampleCaseTitle("Good", item.title)), ...authoredBlocksToDocBlocks(item.blocks)]),
          paragraph("Bad examples"),
          ...block.bad.flatMap((item) => [paragraph(exampleCaseTitle("Bad", item.title)), ...authoredBlocksToDocBlocks(item.blocks)])
        ];
    }
  });
}

function describeReadRequirements(graph: DoctrineGraph, nodeId: string): string[] {
  const readLinks = getOutgoingLinks(graph, nodeId, "reads");
  if (readLinks.length === 0) {
    return [formatLabel("Read before acting", [])];
  }

  return readLinks.flatMap((link) => {
    const requirements = [formatLabel("Read before acting", [getNodeDisplayName(graph, link.to)])];
    if (link.kind === "reads" && link.condition) {
      requirements.push(`Read when: ${link.condition}`);
    }
    if (link.kind === "reads" && link.context) {
      requirements.push(`Read context: ${link.context}`);
    }
    return requirements;
  });
}

export function getWorkflowStepFacts(graph: DoctrineGraph, step: WorkflowStepDef): string[] {
  return [
    `Current owner: ${getNodeDisplayName(graph, step.roleId)}`,
    ...describeReadRequirements(graph, step.id),
    formatNodeRefs(graph, "Required inputs", step.requiredInputIds),
    formatNodeRefs(graph, "Support inputs", step.supportInputIds ?? []),
    formatNodeRefs(graph, "Interim artifacts", step.interimArtifactIds ?? []),
    formatNodeRefs(graph, "Outputs the next owner may trust", step.requiredOutputIds),
    `Stop line: ${step.stopLine}`,
    step.nextGateId
      ? `Hand off to gate: ${getNodeDisplayName(graph, step.nextGateId)}`
      : `Hand off to step: ${step.nextStepId ? getNodeDisplayName(graph, step.nextStepId) : "none"}`
  ];
}

function describeWorkflowStep(graph: DoctrineGraph, step: WorkflowStepDef): NonSectionDocBlockNode[] {
  return [paragraph(step.purpose), unorderedList(getWorkflowStepFacts(graph, step))];
}

function describeArtifactForSurface(surface: SurfaceDef, node: Extract<DoctrineGraph["nodes"][number], { kind: "artifact" }>): NonSectionDocBlockNode[] {
  const leadBySurface: Record<SurfaceDef["surfaceClass"], string> = {
    role_home: `This role home points to \`${node.name}\` as a role-local artifact.`,
    project_home_root: `This project-home surface points to \`${node.name}\` as a project artifact.`,
    shared_entrypoint: `This shared entrypoint points to \`${node.name}\` as supporting runtime material.`,
    workflow_owner: `This workflow owner surface points to \`${node.name}\` as workflow support material.`,
    packet_workflow: `This packet workflow points to \`${node.name}\` as packet support material.`,
    standard: `This standard currently governs \`${node.name}\`.`,
    gate: `This gate surface points to \`${node.name}\` as a checked artifact.`,
    technical_reference: `This technical reference points to \`${node.name}\` as supporting artifact material.`,
    how_to: `Use this procedure with \`${node.name}\` as the working artifact.`,
    coordination: `This coordination surface uses \`${node.name}\` as the shared handoff artifact.`
  };

  return [
    paragraph(leadBySurface[surface.surfaceClass]),
    unorderedList(
      compactLines([
        `Artifact role: ${node.artifactClass}`,
        node.runtimePath ? `Runtime path: ${node.runtimePath}` : undefined,
        node.conceptualOnly ? "Treat this artifact as conceptual-only; do not expect a runtime file." : undefined,
        node.compatibilityOnly ? "Treat this artifact as a compatibility bridge, not the canonical runtime file." : undefined,
        !node.runtimePath && !node.conceptualOnly && !node.compatibilityOnly ? "No extra runtime qualifiers are declared yet." : undefined
      ])
    )
  ];
}

function describeReferenceForSurface(surface: SurfaceDef, node: Extract<DoctrineGraph["nodes"][number], { kind: "reference" }>): NonSectionDocBlockNode[] {
  const leadBySurface: Record<SurfaceDef["surfaceClass"], string> = {
    role_home: `Use \`${node.name}\` as supporting reference material for this role.`,
    project_home_root: `Use \`${node.name}\` as supporting project-home reference material.`,
    shared_entrypoint: `Use \`${node.name}\` as supporting reference material for this shared entrypoint.`,
    workflow_owner: `Use \`${node.name}\` as supporting reference material for workflow routing and handoff decisions.`,
    packet_workflow: `Use \`${node.name}\` as supporting reference material for this packet workflow.`,
    standard: `Use \`${node.name}\` as supporting reference material for this standard.`,
    gate: `Use \`${node.name}\` as supporting reference material for this gate.`,
    technical_reference: `Use \`${node.name}\` as the reference this doctrine points to.`,
    how_to: `Use \`${node.name}\` as supporting reference material for this procedure.`,
    coordination: `Use \`${node.name}\` as supporting reference material for this coordination surface.`
  };

  return [
    paragraph(leadBySurface[surface.surfaceClass]),
    unorderedList(
      compactLines([
        `Reference role: ${node.referenceClass}`,
        node.sourcePath ? `Source path: ${node.sourcePath}` : undefined,
        node.url ? `External URL: ${node.url}` : undefined,
        !node.sourcePath && !node.url ? "No source path or external URL is declared yet." : undefined
      ])
    )
  ];
}

function describeNodeForSurface(
  graph: DoctrineGraph,
  surface: SurfaceDef,
  node: DoctrineGraph["nodes"][number]
): NonSectionDocBlockNode[] {
  switch (node.kind) {
    case "role":
      return [
        paragraph(node.purpose),
        unorderedList([
          ...node.boundaries?.map((boundary) => `Boundary: ${boundary}`) ?? [],
          ...describeReadRequirements(graph, node.id)
        ])
      ];
    case "workflow_step":
      return describeWorkflowStep(graph, node);
    case "review_gate": {
      return [
        paragraph(node.purpose),
        unorderedList([formatNodeRefs(graph, "Checks that must pass", node.checkIds), ...describeReadRequirements(graph, node.id)])
      ];
    }
    case "packet_contract":
      return [
        paragraph(`Use ${node.name} as the packet this surface expects readers to trust.`),
        unorderedList([
          ...describeReadRequirements(graph, node.id),
          formatNodeRefs(graph, "Conceptual artifacts", node.conceptualArtifactIds),
          formatNodeRefs(graph, "Runtime artifacts", node.runtimeArtifactIds ?? [])
        ])
      ];
    case "artifact":
      return describeArtifactForSurface(surface, node);
    case "reference":
      return describeReferenceForSurface(surface, node);
    case "generated_target":
      return [paragraph(`This document emits to \`${node.path}\`.`), unorderedList([formatNodeRefs(graph, "Generated from", node.sourceIds)])];
    case "surface":
      return [paragraph(`This doctrine surface emits to \`${node.runtimePath}\`.`), unorderedList([`Surface family: ${titleCase(node.surfaceClass)}`])];
    case "surface_section":
      return [paragraph(`This doctrine section renders as \`${node.title}\`.`), unorderedList([`Stable slug: ${node.stableSlug}`])];
  }
}

function getSectionBlocks(graph: DoctrineGraph, surface: SurfaceDef, sectionId: string): NonSectionDocBlockNode[] {
  const surfaceSection = graph.nodeById[sectionId];
  if (surfaceSection?.kind === "surface_section" && surfaceSection.body && surfaceSection.body.length > 0) {
    return authoredBlocksToDocBlocks(surfaceSection.body);
  }

  const documentedNodes = getDocumentedNodes(graph, sectionId);

  if (documentedNodes.length === 0) {
    return [paragraph("No documented source units are attached to this section yet.")];
  }

  return documentedNodes.flatMap((node) => describeNodeForSurface(graph, surface, node));
}

function buildPlannedSectionTree(
  graph: DoctrineGraph,
  plan: CompilePlan,
  documentId: string,
  parentSectionId: string | undefined,
  level: number,
  options?: SurfaceDocumentRenderOptions
): SectionNode[] {
  const sectionPlans = plan.sections.filter(
    (sectionPlan) => sectionPlan.documentId === documentId && sectionPlan.parentSectionId === parentSectionId
  );

  return sectionPlans.map((sectionPlan) => renderPlannedSection(graph, plan, sectionPlan, level, options));
}

function renderPlannedSection(
  graph: DoctrineGraph,
  plan: CompilePlan,
  sectionPlan: PlannedSection,
  level: number,
  options?: SurfaceDocumentRenderOptions
): SectionNode {
  const surfaceSection = graph.nodeById[sectionPlan.surfaceSectionId];
  if (!surfaceSection || surfaceSection.kind !== "surface_section") {
    throw new Error(`Expected planned section "${sectionPlan.id}" to reference a surface section node.`);
  }
  const surface = graph.nodeById[surfaceSection.surfaceId];
  if (!surface || surface.kind !== "surface") {
    throw new Error(`Expected section "${sectionPlan.id}" to belong to a surface node.`);
  }

  const childSections = buildPlannedSectionTree(graph, plan, sectionPlan.documentId, sectionPlan.id, level + 1, options);
  const customBlocks = options?.renderSectionBlocks?.({
    graph,
    plan,
    document: plan.documentById[sectionPlan.documentId]!,
    sectionPlan,
    surface,
    surfaceSection
  });

  return section(
    surfaceSection.stableSlug,
    surfaceSection.title,
    [...(customBlocks ?? getSectionBlocks(graph, surface, sectionPlan.surfaceSectionId)), ...childSections],
    level
  );
}

function getIntro(surfaceClass: SurfaceDef["surfaceClass"]): ParagraphNode {
  const messages: Record<SurfaceDef["surfaceClass"], string> = {
    role_home: "This role-home document states the contract for one runtime role.",
    project_home_root: "This project-home root maps the runtime doctrine surface for one Paperclip project home.",
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
  document: PlannedDocument,
  options?: SurfaceDocumentRenderOptions
) {
  const surface = graph.nodeById[document.surfaceId];
  if (!surface || surface.kind !== "surface") {
    throw new Error(`Expected planned document "${document.id}" to reference a surface node.`);
  }

  const sectionNodes = buildPlannedSectionTree(graph, plan, document.id, undefined, 2, options);

  const preambleBlocks = surface.preamble ? authoredBlocksToDocBlocks(surface.preamble) : [];
  const introBlocks = options?.introBlocks ?? [getIntro(surface.surfaceClass)];

  return doc(options?.title ?? getDocumentTitle(surface, graph), [...introBlocks, ...preambleBlocks, ...sectionNodes]);
}
