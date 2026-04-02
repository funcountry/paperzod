import { renderMarkdown } from "../doc/index.js";
import type { CompilePlan, DoctrineGraph, PlannedDocument } from "../core/index.js";
import { renderGateDocument } from "./renderers/gate.js";
import { renderPacketWorkflowDocument } from "./renderers/packet-workflow.js";
import { renderReferenceDocument } from "./renderers/reference.js";
import { renderRoleHomeDocument } from "./renderers/role-home.js";
import { renderSharedEntrypointDocument } from "./renderers/shared-entrypoint.js";
import { renderStandardDocument } from "./renderers/standard.js";
import { renderWorkflowOwnerDocument } from "./renderers/workflow-owner.js";

export interface RenderedDocument {
  id: string;
  path: string;
  markdown: string;
}

function renderDocumentAst(graph: DoctrineGraph, plan: CompilePlan, document: PlannedDocument) {
  switch (document.surfaceClass) {
    case "role_home":
      return renderRoleHomeDocument(graph, plan, document);
    case "project_home_root":
    case "shared_entrypoint":
      return renderSharedEntrypointDocument(graph, plan, document);
    case "workflow_owner":
      return renderWorkflowOwnerDocument(graph, plan, document);
    case "packet_workflow":
      return renderPacketWorkflowDocument(graph, plan, document);
    case "standard":
      return renderStandardDocument(graph, plan, document);
    case "gate":
    case "how_to":
    case "coordination":
      return renderGateDocument(graph, plan, document);
    case "technical_reference":
      return renderReferenceDocument(graph, plan, document);
  }
}

export function renderPlannedDocument(graph: DoctrineGraph, plan: CompilePlan, documentId: string): RenderedDocument {
  const document = plan.documentById[documentId];
  if (!document) {
    throw new Error(`Unknown planned document "${documentId}".`);
  }

  return {
    id: document.id,
    path: document.path,
    markdown: renderMarkdown(renderDocumentAst(graph, plan, document))
  };
}

export function renderDocuments(graph: DoctrineGraph, plan: CompilePlan): RenderedDocument[] {
  return plan.documents.map((document) => renderPlannedDocument(graph, plan, document.id));
}
