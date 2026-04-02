import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { createDiagnostic, sortDiagnostics } from "../core/diagnostics.js";
import type { Diagnostic } from "../core/index.js";
import type { RenderedDocument } from "../markdown/index.js";
import type { TargetManifest } from "../plan/index.js";

export type EmitStatus = "create" | "update" | "unchanged" | "delete";

export interface EmittedFile {
  documentId?: string;
  path: string;
  status: EmitStatus;
  diff?: string;
}

export interface EmitResult {
  files: EmittedFile[];
}

export interface EmitOptions {
  write: boolean;
  prune?: boolean | undefined;
}

export type EmitDocumentsResult = { success: true; data: EmitResult } | { success: false; diagnostics: Diagnostic[] };

interface PlannedDocumentEmit {
  file: EmittedFile;
  markdown: string;
  shouldWrite: boolean;
}

function buildDiff(currentContent: string, nextContent: string): string {
  return ["--- current", "+++ generated", currentContent.trimEnd(), nextContent.trimEnd()].join("\n");
}

async function readExistingContent(filePath: string): Promise<string | undefined> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return undefined;
    }

    throw error;
  }
}

async function listFilesRecursively(rootPath: string): Promise<string[]> {
  try {
    const entries = await readdir(rootPath, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(rootPath, entry.name);
        if (entry.isDirectory()) {
          return listFilesRecursively(entryPath);
        }
        if (entry.isFile()) {
          return [entryPath];
        }
        return [];
      })
    );

    return files.flat();
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function collectOwnedFilePaths(manifest: TargetManifest): Promise<string[]> {
  const collected = await Promise.all(
    manifest.ownedScopes.map(async (scope) => {
      if (scope.kind === "file") {
        const existing = await readExistingContent(scope.absolutePath);
        return existing === undefined ? [] : [scope.absolutePath];
      }

      return listFilesRecursively(scope.absolutePath);
    })
  );

  return [...new Set(collected.flat())].sort();
}

export async function emitDocuments(
  renderedDocuments: readonly RenderedDocument[],
  manifest: TargetManifest,
  options: EmitOptions
): Promise<EmitDocumentsResult> {
  const plannedDocumentEmits: PlannedDocumentEmit[] = [];
  const currentDocumentPaths = new Set(Object.values(manifest.documentPaths));

  for (const document of renderedDocuments) {
    const filePath = manifest.documentPaths[document.id];
    if (!filePath) {
      continue;
    }

    const existingContent = await readExistingContent(filePath);
    const status: EmitStatus =
      existingContent === undefined ? "create" : existingContent === document.markdown ? "unchanged" : "update";
    const diff = status === "update" ? buildDiff(existingContent ?? "", document.markdown) : undefined;

    plannedDocumentEmits.push({
      file: {
        documentId: document.id,
        path: filePath,
        status,
        ...(diff ? { diff } : {})
      },
      markdown: document.markdown,
      shouldWrite: status !== "unchanged"
    });
  }

  const staleOwnedFilePaths = (await collectOwnedFilePaths(manifest)).filter((filePath) => !currentDocumentPaths.has(filePath));
  const deleteFiles: EmittedFile[] = staleOwnedFilePaths.map((filePath) => ({
    path: filePath,
    status: "delete"
  }));

  // Source declares ownership; CLI only authorizes destructive apply.
  if (options.write && staleOwnedFilePaths.length > 0 && !options.prune) {
    return {
      success: false,
      diagnostics: sortDiagnostics([
        createDiagnostic({
          code: "emit.prune_required",
          severity: "error",
          phase: "emit",
          message: `Owned output scopes contain ${staleOwnedFilePaths.length} stale file(s). Re-run with --prune to apply deletes.`,
          path: staleOwnedFilePaths
        })
      ])
    };
  }

  if (options.write) {
    for (const planned of plannedDocumentEmits) {
      if (!planned.shouldWrite) {
        continue;
      }

      await mkdir(path.dirname(planned.file.path), { recursive: true });
      await writeFile(planned.file.path, planned.markdown, "utf8");
    }

    if (options.prune) {
      for (const filePath of staleOwnedFilePaths) {
        await rm(filePath, { force: true });
      }
    }
  }

  return {
    success: true,
    data: {
      files: [...plannedDocumentEmits.map((planned) => planned.file), ...deleteFiles]
    }
  };
}

export function parseGeneratedMarkdown(): never {
  throw new Error("paperzod is a one-way compiler. Generated markdown is runtime output, not semantic source.");
}
