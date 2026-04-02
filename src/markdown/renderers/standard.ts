import type { CompilePlan, DoctrineGraph, PlannedDocument } from "../../core/index.js";
import { paragraph, unorderedList } from "../../doc/index.js";
import { getDocumentedNodes, getRuntimePathTitle, renderSurfaceDocumentAst } from "./common.js";

export function renderStandardDocument(graph: DoctrineGraph, plan: CompilePlan, document: PlannedDocument) {
  const title = getRuntimePathTitle(document.path);

  return renderSurfaceDocumentAst(graph, plan, document, {
    title,
    introBlocks: [paragraph(`This file records the shared standard for ${title}.`)],
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

      return [
        paragraph(`Use this section as the shared standard for \`${documentedArtifact.name}\`.`),
        unorderedList([`Current standard source: \`${documentedArtifact.name}\`.`])
      ];
    }
  });
}
