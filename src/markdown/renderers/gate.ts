import type { CompilePlan, DoctrineGraph, PlannedDocument } from "../../core/index.js";
import { paragraph, unorderedList } from "../../doc/index.js";
import { getOutgoingLinks } from "../../graph/index.js";
import { getDocumentedNodes, getNodeDisplayName, getRuntimePathTitle, renderSurfaceDocumentAst } from "./common.js";

function getGateReadFacts(graph: DoctrineGraph, gateId: string): string[] {
  const readLinks = getOutgoingLinks(graph, gateId, "reads");
  if (readLinks.length === 0) {
    return ["Read before acting: none"];
  }

  return readLinks.map((link) => `Read before acting: ${getNodeDisplayName(graph, link.to)}`);
}

export function renderGateDocument(graph: DoctrineGraph, plan: CompilePlan, document: PlannedDocument) {
  if (document.surfaceClass === "gate") {
    const gate = getDocumentedNodes(graph, document.surfaceId).find(
      (node): node is Extract<DoctrineGraph["nodes"][number], { kind: "review_gate" }> => node.kind === "review_gate"
    );
    const title = gate?.name ?? getRuntimePathTitle(document.path);

    return renderSurfaceDocumentAst(graph, plan, document, {
      title,
      introBlocks: [
        paragraph(gate ? `This file owns what ${gate.name} checks before work moves on.` : `This file owns the acceptance criteria for ${title}.`),
        paragraph("Use it with the governing workflow and any supporting standards for this gate.")
      ],
      renderSectionBlocks: ({ surfaceSection }) => {
        if ((surfaceSection.body?.length ?? 0) > 0 || !gate) {
          return undefined;
        }

        return [
          paragraph(gate.purpose),
          unorderedList([`Checks that must pass: ${gate.checkIds.map((id) => getNodeDisplayName(graph, id)).join(", ") || "none"}`, ...getGateReadFacts(graph, gate.id)])
        ];
      }
    });
  }

  const reference = getDocumentedNodes(graph, document.surfaceId).find(
    (node): node is Extract<DoctrineGraph["nodes"][number], { kind: "reference" }> => node.kind === "reference"
  );
  const title = reference?.name ?? getRuntimePathTitle(document.path);

  if (document.surfaceClass === "how_to") {
    return renderSurfaceDocumentAst(graph, plan, document, {
      title,
      renderSectionBlocks: ({ surfaceSection }) => {
        if ((surfaceSection.body?.length ?? 0) > 0) {
          return undefined;
        }

        const sectionReference = getDocumentedNodes(graph, surfaceSection.id).find(
          (node): node is Extract<DoctrineGraph["nodes"][number], { kind: "reference" }> => node.kind === "reference"
        );
        const activeReference = sectionReference ?? reference;
        if (!activeReference) {
          return undefined;
        }

        return [
          paragraph(`Use this guide when the current task depends on \`${activeReference.name}\`.`),
          unorderedList([`Procedure source: \`${activeReference.sourcePath ?? activeReference.name}\`.`])
        ];
      }
    });
  }

  return renderSurfaceDocumentAst(graph, plan, document, {
    title,
    renderSectionBlocks: ({ surfaceSection }) => {
      if ((surfaceSection.body?.length ?? 0) > 0) {
        return undefined;
      }

      const sectionReference = getDocumentedNodes(graph, surfaceSection.id).find(
        (node): node is Extract<DoctrineGraph["nodes"][number], { kind: "reference" }> => node.kind === "reference"
      );
      const activeReference = sectionReference ?? reference;
      if (!activeReference) {
        return undefined;
      }

      return [
        paragraph(`Use this guide when the current task depends on \`${activeReference.name}\`.`),
        unorderedList([`Coordination source: \`${activeReference.sourcePath ?? activeReference.name}\`.`])
      ];
    }
  });
}
