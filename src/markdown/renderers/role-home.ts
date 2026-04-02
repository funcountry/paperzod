import type { CompilePlan, DoctrineGraph, PlannedDocument } from "../../core/index.js";
import { paragraph, unorderedList } from "../../doc/index.js";
import { getOutgoingLinks } from "../../graph/index.js";
import { getDocumentedNodes, getNodeDisplayName, renderSurfaceDocumentAst } from "./common.js";

function describeReadTarget(graph: DoctrineGraph, roleId: string): string[] {
  const readLinks = getOutgoingLinks(graph, roleId, "reads");
  if (readLinks.length === 0) {
    return ["No additional shared doctrine reads are declared yet."];
  }

  return readLinks.map((link) => {
    const clauses = [`Read \`${getNodeDisplayName(graph, link.to)}\`.`];
    if (link.kind === "reads" && link.condition) {
      clauses.push(`When: ${link.condition}.`);
    }
    if (link.kind === "reads" && link.context) {
      clauses.push(`Context: ${link.context}.`);
    }
    return clauses.join(" ");
  });
}

function getSectionBodyLength(graph: DoctrineGraph, plan: CompilePlan, documentId: string, stableSlug: string): number {
  const sectionPlan = plan.sections.find((candidate) => candidate.documentId === documentId && candidate.stableSlug === stableSlug);
  if (!sectionPlan) {
    return 0;
  }

  const section = graph.nodeById[sectionPlan.surfaceSectionId];
  if (!section || section.kind !== "surface_section") {
    return 0;
  }

  return section.body?.length ?? 0;
}

function documentHasSection(plan: CompilePlan, documentId: string, stableSlug: string): boolean {
  return plan.sections.some((candidate) => candidate.documentId === documentId && candidate.stableSlug === stableSlug);
}

export function renderRoleHomeDocument(graph: DoctrineGraph, plan: CompilePlan, document: PlannedDocument) {
  const surface = graph.nodeById[document.surfaceId];
  if (!surface || surface.kind !== "surface") {
    throw new Error(`Expected planned document "${document.id}" to reference a surface node.`);
  }

  const role = getDocumentedNodes(graph, surface.id).find((node) => node.kind === "role");

  return renderSurfaceDocumentAst(graph, plan, document, {
    title: role?.name ?? "Role Home",
    introBlocks: role
      ? [paragraph(`You are the ${role.name}.`), paragraph(`Your repo-owned role home is \`${surface.runtimePath}\`.`)]
      : undefined,
    renderSectionBlocks: ({ document, surfaceSection }) => {
      if (!role || surfaceSection.body?.length) {
        return undefined;
      }

      switch (surfaceSection.stableSlug) {
        case "read-first": {
          const hasRoleContract = documentHasSection(plan, document.id, "role-contract");
          return [
            ...(hasRoleContract ? [] : [paragraph(role.purpose)]),
            paragraph("Read these shared doctrine surfaces before taking a turn."),
            unorderedList(describeReadTarget(graph, role.id))
          ];
        }
        case "role-contract": {
          const readFirstIsFallback = documentHasSection(plan, document.id, "read-first") && getSectionBodyLength(graph, plan, document.id, "read-first") === 0;
          const items = [
            ...(role.boundaries && role.boundaries.length > 0 ? role.boundaries : ["No additional role boundaries are declared yet."]),
            ...(readFirstIsFallback ? [] : describeReadTarget(graph, role.id))
          ];

          return [paragraph(role.purpose), unorderedList(items)];
        }
        default:
          return undefined;
      }
    }
  });
}
