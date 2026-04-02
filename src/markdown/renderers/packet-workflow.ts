import type { CompilePlan, DoctrineGraph, PlannedDocument } from "../../core/index.js";
import { renderSurfaceDocumentAst } from "./common.js";

export function renderPacketWorkflowDocument(graph: DoctrineGraph, plan: CompilePlan, document: PlannedDocument) {
  return renderSurfaceDocumentAst(graph, plan, document);
}
