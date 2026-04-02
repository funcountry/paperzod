import type { CompilePlan, DoctrineGraph, PlannedDocument } from "../../core/index.js";
import { paragraph, unorderedList } from "../../doc/index.js";
import { getDocumentedNodes, getRuntimePathTitle, renderSurfaceDocumentAst } from "./common.js";

function getReferenceIntro(document: PlannedDocument, referenceName: string | undefined): string[] {
  const title = getRuntimePathTitle(document.path);
  if (title === "Poker KB") {
    return [
      "This file owns the Lessons-local PokerKB runner path, URL routing, query discipline, and example commands.",
      "Use it when the current task needs repo-owned PokerKB runner or query discipline guidance."
    ];
  }

  return [`This file records the project-local reference contract for ${referenceName ?? title}.`];
}

export function renderReferenceDocument(graph: DoctrineGraph, plan: CompilePlan, document: PlannedDocument) {
  const documentedReference = getDocumentedNodes(graph, document.surfaceId).find(
    (node): node is Extract<DoctrineGraph["nodes"][number], { kind: "reference" }> => node.kind === "reference"
  );
  const title = documentedReference?.name ?? getRuntimePathTitle(document.path);

  return renderSurfaceDocumentAst(graph, plan, document, {
    title,
    introBlocks: getReferenceIntro(document, documentedReference?.name).map((line) => paragraph(line)),
    renderSectionBlocks: ({ surfaceSection }) => {
      if ((surfaceSection.body?.length ?? 0) > 0) {
        return undefined;
      }

      const reference = getDocumentedNodes(graph, surfaceSection.id).find(
        (node): node is Extract<DoctrineGraph["nodes"][number], { kind: "reference" }> => node.kind === "reference"
      );

      if (!reference) {
        return undefined;
      }

      if (title === "Poker KB" && surfaceSection.stableSlug === "poker-kb") {
        return [
          paragraph("Use this section when the current task needs the local PokerKB runner or query-discipline guidance."),
          unorderedList([`Reference source: \`${reference.sourcePath ?? reference.name}\`.`])
        ];
      }

      return [
        paragraph(`Use this section when the current task depends on \`${reference.name}\`.`),
        unorderedList([`Reference source: \`${reference.sourcePath ?? reference.name}\`.`])
      ];
    }
  });
}
