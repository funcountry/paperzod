import type { CompilePlan, DoctrineGraph, PlannedDocument } from "../../core/index.js";
import { paragraph, unorderedList } from "../../doc/index.js";
import { getDocumentedNodes, getRuntimePathTitle, renderSurfaceDocumentAst } from "./common.js";

function getStandardIntro(title: string): string[] {
  switch (title) {
    case "Lessons Packet Shapes":
      return [
        "This file owns the packet families used to start Lessons work.",
        "Use it to answer one question: what packet shape should I create for this job?"
      ];
    case "Lessons Quality Bar":
      return [
        "This is the shared qualitative standard for judging Lessons output.",
        "Use it when the current task needs the quality bar the critic and downstream lanes should trust."
      ];
    default:
      return [`This file records the shared standard for ${title}.`];
  }
}

export function renderStandardDocument(graph: DoctrineGraph, plan: CompilePlan, document: PlannedDocument) {
  const title = getRuntimePathTitle(document.path);

  return renderSurfaceDocumentAst(graph, plan, document, {
    title,
    introBlocks: getStandardIntro(title).map((line) => paragraph(line)),
    renderSectionBlocks: ({ surfaceSection }) => {
      if ((surfaceSection.body?.length ?? 0) > 0) {
        return undefined;
      }

      const documentedArtifact = getDocumentedNodes(graph, surfaceSection.id).find(
        (node): node is Extract<DoctrineGraph["nodes"][number], { kind: "artifact" }> => node.kind === "artifact"
      );

      if (!documentedArtifact) {
        return undefined;
      }

      if (title === "Lessons Packet Shapes" && surfaceSection.stableSlug === "packet-shape") {
        return [
          paragraph("Use this section when the current job needs the canonical packet-shape rule."),
          unorderedList([`Current standard source: \`${documentedArtifact.name}\`.`])
        ];
      }

      if (title === "Lessons Quality Bar" && surfaceSection.stableSlug === "quality-bar") {
        return [
          paragraph("Use this section as the shared quality bar the critic and downstream lanes should trust."),
          unorderedList([`Current standard source: \`${documentedArtifact.name}\`.`])
        ];
      }

      return [
        paragraph(`Use this section as the shared standard for \`${documentedArtifact.name}\`.`),
        unorderedList([`Current standard source: \`${documentedArtifact.name}\`.`])
      ];
    }
  });
}
