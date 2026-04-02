import type { CompilePlan, DoctrineGraph, PlannedDocument } from "../../core/index.js";
import { orderedList, paragraph } from "../../doc/index.js";
import { renderSurfaceDocumentAst } from "./common.js";

export function renderSharedEntrypointDocument(graph: DoctrineGraph, plan: CompilePlan, document: PlannedDocument) {
  const projectDocuments = plan.documents;

  if (document.surfaceClass === "project_home_root") {
    const sharedEntrypoint = projectDocuments.find((candidate) => candidate.surfaceClass === "shared_entrypoint");
    const workflowOwners = projectDocuments.filter((candidate) => candidate.surfaceClass === "workflow_owner");
    const roleHomes = plan.documents.filter((candidate) => candidate.surfaceClass === "role_home");

    return renderSurfaceDocumentAst(graph, plan, document, {
      renderSectionBlocks: ({ surfaceSection }) => {
        if (surfaceSection.body?.length || surfaceSection.stableSlug !== "project-home-map") {
          return undefined;
        }

        const items = [
          sharedEntrypoint ? `Start with \`${sharedEntrypoint.path}\` for the shared doctrine entrypoint.` : undefined,
          workflowOwners.length > 0
            ? `Use \`${workflowOwners[0]!.path}\` as the authoritative workflow owner for routing and handoff decisions.`
            : undefined,
          roleHomes.length > 0 ? "Use `paperclip_home/agents/<role>/AGENTS.md` for role-local guidance." : undefined
        ].filter((item): item is string => item !== undefined);

        if (items.length === 0) {
          return undefined;
        }

        return [paragraph("Use this project home as the runtime doctrine map for this project."), orderedList(items)];
      }
    });
  }

  const workflowOwners = projectDocuments.filter((candidate) => candidate.surfaceClass === "workflow_owner");

  return renderSurfaceDocumentAst(graph, plan, document, {
    renderSectionBlocks: ({ surfaceSection }) => {
      if (surfaceSection.body?.length || surfaceSection.stableSlug !== "read-order" || workflowOwners.length === 0) {
        return undefined;
      }

      return [
        paragraph("After this map, read in this order."),
        orderedList(workflowOwners.map((workflowOwner) => `\`${workflowOwner.path}\``)),
        paragraph("Open packet workflows, standards, and coordination docs only when the workflow owner points you there.")
      ];
    }
  });
}
