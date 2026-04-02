import path from "node:path/posix";

import { createDiagnostic, sortDiagnostics } from "../core/diagnostics.js";
import type { CompilePlan, Diagnostic, PlannedDocument, SurfaceClass } from "../core/index.js";

export interface TargetAdapter {
  name: string;
  repoRoot: string;
  outputRoot: string;
  resolveDocumentPath(document: PlannedDocument): string;
  validateDocument(document: PlannedDocument): Diagnostic[];
}

export interface TargetManifest {
  adapterName: string;
  repoRoot: string;
  outputRoot: string;
  documentPaths: Record<string, string>;
}

export type TargetManifestResult =
  | { success: true; data: TargetManifest }
  | { success: false; diagnostics: Diagnostic[] };

export interface TargetAdapterOptions {
  name: string;
  repoRoot: string;
  outputRoot: string;
  validateDocument?: (document: PlannedDocument) => Diagnostic[];
}

function createTargetDiagnostic(input: Omit<Diagnostic, "phase" | "severity">): Diagnostic {
  return createDiagnostic({
    severity: "error",
    phase: "plan",
    ...input
  });
}

export function createTargetAdapter(options: TargetAdapterOptions): TargetAdapter {
  return {
    name: options.name,
    repoRoot: options.repoRoot,
    outputRoot: options.outputRoot,
    resolveDocumentPath(document) {
      return path.resolve(options.repoRoot, options.outputRoot, document.path);
    },
    validateDocument(document) {
      return options.validateDocument ? options.validateDocument(document) : [];
    }
  };
}

function isWithinOutputRoot(repoRoot: string, outputRoot: string, documentPath: string): boolean {
  const outputRootAbsolute = path.resolve(repoRoot, outputRoot);
  const resolvedDocumentPath = path.resolve(repoRoot, outputRoot, documentPath);
  return resolvedDocumentPath === outputRootAbsolute || resolvedDocumentPath.startsWith(`${outputRootAbsolute}/`);
}

function paperclipPathError(document: PlannedDocument, message: string): Diagnostic {
  return createTargetDiagnostic({
    code: "plan.paperclip_invalid_surface_path",
    message,
    nodeId: document.id,
    relatedIds: [document.surfaceId]
  });
}

function validatePaperclipSurfacePath(document: PlannedDocument): Diagnostic[] {
  const relativePath = document.path;
  const isSharedMarkdownPath = (pathValue: string) =>
    /^paperclip_home\/project_homes\/[^/]+\/shared\/.+\.md$/.test(pathValue) && !pathValue.endsWith("/README.md");
  const validators: Record<SurfaceClass, (pathValue: string) => boolean> = {
    role_home: (pathValue) => /^paperclip_home\/agents\/[^/]+\/AGENTS\.md$/.test(pathValue),
    project_home_root: (pathValue) => /^paperclip_home\/project_homes\/[^/]+\/README\.md$/.test(pathValue),
    shared_entrypoint: (pathValue) => /^paperclip_home\/project_homes\/[^/]+\/shared\/README\.md$/.test(pathValue),
    workflow_owner: isSharedMarkdownPath,
    packet_workflow: isSharedMarkdownPath,
    standard: isSharedMarkdownPath,
    gate: isSharedMarkdownPath,
    technical_reference: isSharedMarkdownPath,
    how_to: isSharedMarkdownPath,
    coordination: isSharedMarkdownPath
  };

  return validators[document.surfaceClass](relativePath)
    ? []
    : [
        paperclipPathError(
          document,
          `Document "${document.id}" with surface class "${document.surfaceClass}" does not match Paperclip path conventions.`
        )
      ];
}

export function createPaperclipMarkdownTarget(options: Omit<TargetAdapterOptions, "name" | "validateDocument">): TargetAdapter {
  return createTargetAdapter({
    ...options,
    name: "paperclip_markdown",
    validateDocument: validatePaperclipSurfacePath
  });
}

export function resolveTargetManifest(plan: CompilePlan, adapter: TargetAdapter): TargetManifestResult {
  const diagnostics: Diagnostic[] = [];
  const documentPaths: Record<string, string> = {};
  const documentIdByResolvedPath: Record<string, string> = {};

  for (const document of plan.documents) {
    if (!isWithinOutputRoot(adapter.repoRoot, adapter.outputRoot, document.path)) {
      diagnostics.push(
        createTargetDiagnostic({
          code: "plan.target_path_out_of_scope",
          message: `Document "${document.id}" resolves outside the configured output root.`,
          nodeId: document.id
        })
      );
      continue;
    }

    diagnostics.push(...adapter.validateDocument(document));

    const resolvedPath = adapter.resolveDocumentPath(document);
    const existingDocumentId = documentIdByResolvedPath[resolvedPath];
    if (existingDocumentId) {
      diagnostics.push(
        createTargetDiagnostic({
          code: "plan.target_path_collision",
          message: `Documents "${existingDocumentId}" and "${document.id}" resolve to the same target path.`,
          nodeId: document.id,
          relatedIds: [existingDocumentId]
        })
      );
      continue;
    }

    documentIdByResolvedPath[resolvedPath] = document.id;
    documentPaths[document.id] = resolvedPath;
  }

  const sortedDiagnostics = sortDiagnostics(diagnostics);
  if (sortedDiagnostics.length > 0) {
    return { success: false, diagnostics: sortedDiagnostics };
  }

  return {
    success: true,
    data: {
      adapterName: adapter.name,
      repoRoot: adapter.repoRoot,
      outputRoot: adapter.outputRoot,
      documentPaths
    }
  };
}
