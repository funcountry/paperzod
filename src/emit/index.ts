import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { RenderedDocument } from "../markdown/index.js";
import type { TargetManifest } from "../plan/index.js";

export type EmitStatus = "create" | "update" | "unchanged";

export interface EmittedFile {
  documentId: string;
  path: string;
  status: EmitStatus;
  diff?: string;
}

export interface EmitResult {
  files: EmittedFile[];
}

export interface EmitOptions {
  write: boolean;
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

export async function emitDocuments(
  renderedDocuments: readonly RenderedDocument[],
  manifest: TargetManifest,
  options: EmitOptions
): Promise<EmitResult> {
  const files: EmittedFile[] = [];

  for (const document of renderedDocuments) {
    const filePath = manifest.documentPaths[document.id];
    if (!filePath) {
      continue;
    }

    const existingContent = await readExistingContent(filePath);
    const status: EmitStatus =
      existingContent === undefined ? "create" : existingContent === document.markdown ? "unchanged" : "update";
    const diff = status === "update" ? buildDiff(existingContent ?? "", document.markdown) : undefined;

    if (options.write && status !== "unchanged") {
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, document.markdown, "utf8");
    }

    files.push({
      documentId: document.id,
      path: filePath,
      status,
      ...(diff ? { diff } : {})
    });
  }

  return { files };
}

export function parseGeneratedMarkdown(): never {
  throw new Error("paperzod is a one-way compiler. Generated markdown is runtime output, not semantic source.");
}
