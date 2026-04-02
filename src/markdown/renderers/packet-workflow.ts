import type { CompilePlan, DoctrineGraph, PlannedDocument } from "../../core/index.js";
import { paragraph, unorderedList } from "../../doc/index.js";
import { getDocumentedNodes, getNodeDisplayName, getWorkflowStepFacts, renderSurfaceDocumentAst } from "./common.js";

function getSurfaceDocumentedPacketContract(graph: DoctrineGraph, surfaceId: string) {
  return getDocumentedNodes(graph, surfaceId).find(
    (node): node is Extract<DoctrineGraph["nodes"][number], { kind: "packet_contract" }> => node.kind === "packet_contract"
  );
}

function getFirstDocumentedWorkflowStep(graph: DoctrineGraph, plan: CompilePlan, document: PlannedDocument) {
  for (const sectionId of document.sectionIds) {
    const documentedStep = getDocumentedNodes(graph, sectionId).find(
      (node): node is Extract<DoctrineGraph["nodes"][number], { kind: "workflow_step" }> => node.kind === "workflow_step"
    );
    if (documentedStep) {
      return documentedStep;
    }
  }

  return undefined;
}

export function renderPacketWorkflowDocument(graph: DoctrineGraph, plan: CompilePlan, document: PlannedDocument) {
  const packetContract = getSurfaceDocumentedPacketContract(graph, document.surfaceId);
  const documentedStep = getFirstDocumentedWorkflowStep(graph, plan, document);
  const roleName = documentedStep ? getNodeDisplayName(graph, documentedStep.roleId) : undefined;

  return renderSurfaceDocumentAst(graph, plan, document, {
    title: roleName ? `${roleName} Workflow` : packetContract ? `${packetContract.name} Workflow` : undefined,
    introBlocks: roleName
      ? [
          paragraph(`This file defines the shared workflow for the ${roleName} lane.`),
          paragraph("It does not define handoff mechanics, the shared packet file rules, or critic verdicts.")
        ]
      : undefined,
    renderSectionBlocks: ({ surfaceSection }) => {
      if ((surfaceSection.body?.length ?? 0) > 0) {
        return undefined;
      }

      const step = getDocumentedNodes(graph, surfaceSection.id).find(
        (node): node is Extract<DoctrineGraph["nodes"][number], { kind: "workflow_step" }> => node.kind === "workflow_step"
      );

      switch (surfaceSection.stableSlug) {
        case "what-this-lane-must-do":
        case "lane-order":
        case "default-order":
        case "release-shape": {
          if (!step) {
            return undefined;
          }

          const facts = getWorkflowStepFacts(graph, step);
          return [
            ...(packetContract ? [paragraph(`Use this section as the lane contract for the \`${packetContract.name}\` packet.`)] : []),
            paragraph(step.purpose),
            unorderedList(facts)
          ];
        }
        default:
          return undefined;
      }
    }
  });
}
