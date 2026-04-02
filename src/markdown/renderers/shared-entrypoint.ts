import type { CompilePlan, DoctrineGraph, PlannedDocument } from "../../core/index.js";
import { orderedList, paragraph } from "../../doc/index.js";
import { renderSurfaceDocumentAst } from "./common.js";

function titleCase(input: string): string {
  return input
    .split("_")
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function getProjectHomeSegment(path: string): string | undefined {
  const segments = path.split("/");
  const projectHomesIndex = segments.indexOf("project_homes");
  if (projectHomesIndex < 0 || projectHomesIndex + 1 >= segments.length) {
    return undefined;
  }

  return segments[projectHomesIndex + 1];
}

function getProjectName(path: string): string | undefined {
  const segment = getProjectHomeSegment(path);
  if (!segment) {
    return undefined;
  }

  return titleCase(segment.replaceAll("-", "_"));
}

function getProjectHomePrefix(path: string): string | undefined {
  const segments = path.split("/");
  const projectHomesIndex = segments.indexOf("project_homes");
  if (projectHomesIndex < 0 || projectHomesIndex + 2 >= segments.length) {
    return undefined;
  }

  return segments.slice(0, projectHomesIndex + 2).join("/");
}

function getDocumentsForProject(plan: CompilePlan, path: string) {
  const prefix = getProjectHomePrefix(path);
  if (!prefix) {
    return [];
  }

  return plan.documents.filter((document) => document.path.startsWith(prefix));
}

function getProjectHomeTitle(document: PlannedDocument): string {
  const projectName = getProjectName(document.path);
  return projectName ? `${projectName} Project Home` : "Project Home";
}

function getSharedEntrypointTitle(document: PlannedDocument): string {
  const projectName = getProjectName(document.path);
  return projectName ? `${projectName} Shared Doctrine` : "Shared Entrypoint";
}

export function renderSharedEntrypointDocument(graph: DoctrineGraph, plan: CompilePlan, document: PlannedDocument) {
  const projectName = getProjectName(document.path);
  const projectDocuments = getDocumentsForProject(plan, document.path);

  if (document.surfaceClass === "project_home_root") {
    const sharedEntrypoint = projectDocuments.find((candidate) => candidate.surfaceClass === "shared_entrypoint");
    const workflowOwners = projectDocuments.filter((candidate) => candidate.surfaceClass === "workflow_owner");
    const roleHomes = plan.documents.filter((candidate) => candidate.surfaceClass === "role_home");

    return renderSurfaceDocumentAst(graph, plan, document, {
      title: getProjectHomeTitle(document),
      introBlocks: projectName
        ? [paragraph(`This is the repo home for ${projectName} shared doctrine and role-local runtime guidance.`)]
        : undefined,
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
    title: getSharedEntrypointTitle(document),
    introBlocks: projectName
      ? [
          paragraph(`This folder is the live shared doctrine home for the ${projectName} project.`),
          paragraph("Start here, then open the one surface that owns your current question.")
        ]
      : undefined,
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
