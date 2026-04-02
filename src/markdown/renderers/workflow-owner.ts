import type { CompilePlan, DoctrineGraph, PlannedDocument } from "../../core/index.js";
import { orderedList, paragraph, unorderedList } from "../../doc/index.js";
import { getDocumentedNodes, getNodeDisplayName, getWorkflowStepFacts, renderSurfaceDocumentAst } from "./common.js";

function titleCase(input: string): string {
  return input
    .split("_")
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function getProjectName(path: string): string | undefined {
  const segments = path.split("/");
  const projectHomesIndex = segments.indexOf("project_homes");
  if (projectHomesIndex < 0 || projectHomesIndex + 1 >= segments.length) {
    return undefined;
  }

  return titleCase(segments[projectHomesIndex + 1]!.replaceAll("-", "_"));
}

function getOrderedWorkflowSteps(graph: DoctrineGraph) {
  return graph.nodeIdsByKind.workflow_step
    .map((id) => graph.nodeById[id])
    .filter((node): node is Extract<DoctrineGraph["nodes"][number], { kind: "workflow_step" }> => node?.kind === "workflow_step");
}

export function renderWorkflowOwnerDocument(graph: DoctrineGraph, plan: CompilePlan, document: PlannedDocument) {
  const projectName = getProjectName(document.path);
  const orderedSteps = getOrderedWorkflowSteps(graph);

  return renderSurfaceDocumentAst(graph, plan, document, {
    title: projectName ? `${projectName} Workflow` : undefined,
    introBlocks: projectName
      ? [
          paragraph(`This is the top-level workflow for ${projectName}.`),
          paragraph("Use this file for lane order, same-issue handoff, and owner routing.")
        ]
      : undefined,
    renderSectionBlocks: ({ surfaceSection }) => {
      if ((surfaceSection.body?.length ?? 0) > 0) {
        return undefined;
      }

      const documentedStep = getDocumentedNodes(graph, surfaceSection.id).find(
        (node): node is Extract<DoctrineGraph["nodes"][number], { kind: "workflow_step" }> => node.kind === "workflow_step"
      );

      switch (surfaceSection.stableSlug) {
        case "owner-map":
        case "default-order":
        case "lane-order":
        case "release-shape": {
          if (!documentedStep) {
            return undefined;
          }

          const workflowOrder = orderedSteps.map((step) => `${getNodeDisplayName(graph, step.roleId)}: ${step.purpose}`);
          const laneFacts = getWorkflowStepFacts(graph, documentedStep).filter((fact) => !fact.startsWith("Current owner:"));

          return [
            paragraph("Use this section to understand the represented workflow order for the current setup."),
            orderedList(workflowOrder.length > 0 ? workflowOrder : ["No workflow steps are declared yet."]),
            paragraph(`This section currently documents the ${getNodeDisplayName(graph, documentedStep.roleId)} lane.`),
            unorderedList(laneFacts)
          ];
        }
        case "comment-shape": {
          const documentedNode = getDocumentedNodes(graph, surfaceSection.id)[0];
          return documentedNode
            ? [paragraph(`Use \`${getNodeDisplayName(graph, documentedNode.id)}\` as the shared handoff comment contract.`)]
            : [paragraph("Use this section as the shared handoff comment contract.")];
        }
        case "specialist-turn-shape": {
          const documentedNode = getDocumentedNodes(graph, surfaceSection.id)[0];
          return documentedNode
            ? [paragraph(`Use \`${getNodeDisplayName(graph, documentedNode.id)}\` as the shared specialist-turn contract.`)]
            : [paragraph("Use this section as the shared specialist-turn contract.")];
        }
        default:
          return undefined;
      }
    }
  });
}
