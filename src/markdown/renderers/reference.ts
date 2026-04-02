import type { CompilePlan, DoctrineGraph, PlannedDocument } from "../../core/index.js";
import { paragraph, unorderedList } from "../../doc/index.js";
import { getDocumentedNodes, getRuntimePathTitle, renderSurfaceDocumentAst } from "./common.js";

export function renderReferenceDocument(graph: DoctrineGraph, plan: CompilePlan, document: PlannedDocument) {
  const documentedReference = getDocumentedNodes(graph, document.surfaceId).find(
    (node): node is Extract<DoctrineGraph["nodes"][number], { kind: "reference" }> => node.kind === "reference"
  );
  const title = documentedReference?.name ?? getRuntimePathTitle(document.path);

  return renderSurfaceDocumentAst(graph, plan, document, {
    title,
    introBlocks: [paragraph(`This file records the project-local reference contract for ${documentedReference?.name ?? title}.`)],
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

      return [
        paragraph(`Use this section when the current task depends on \`${reference.name}\`.`),
        unorderedList([`Reference source: \`${reference.sourcePath ?? reference.name}\`.`])
      ];
    }
  });
}
