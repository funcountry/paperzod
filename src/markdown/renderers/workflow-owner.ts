import type { CompilePlan, DoctrineGraph, PlannedDocument } from "../../core/index.js";
import { orderedList, paragraph, unorderedList } from "../../doc/index.js";
import { getDocumentedNodes, getNodeDisplayName, getWorkflowStepFacts, renderSurfaceDocumentAst } from "./common.js";

function getOrderedWorkflowSteps(graph: DoctrineGraph) {
  return graph.nodeIdsByKind.workflow_step
    .map((id) => graph.nodeById[id])
    .filter((node): node is Extract<DoctrineGraph["nodes"][number], { kind: "workflow_step" }> => node?.kind === "workflow_step");
}

export function renderWorkflowOwnerDocument(graph: DoctrineGraph, plan: CompilePlan, document: PlannedDocument) {
  const orderedSteps = getOrderedWorkflowSteps(graph);

  return renderSurfaceDocumentAst(graph, plan, document, {
    introBlocks: orderedSteps.length > 0 ? [paragraph("Use this file for represented workflow order, owner routing, and lane contracts.")] : undefined,
    renderSectionBlocks: ({ surfaceSection }) => {
      if ((surfaceSection.body?.length ?? 0) > 0) {
        return undefined;
      }

      const documentedStep = getDocumentedNodes(graph, surfaceSection.id).find(
        (node): node is Extract<DoctrineGraph["nodes"][number], { kind: "workflow_step" }> => node.kind === "workflow_step"
      );

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
  });
}
