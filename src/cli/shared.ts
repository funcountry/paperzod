import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import type { Diagnostic } from "../core/index.js";
import type { PipelineResult, RenderSetupResult } from "../index.js";
import { createPaperclipMarkdownTarget, createTargetAdapter, renderSetup, type TargetAdapter } from "../index.js";

function formatUsage(): string {
  return [
    "Usage:",
    "  paperzod validate <setup-path>",
    "  paperzod compile <setup-path> [--repo-root <path>] [--output-root <path>] [--target generic|paperclip] [--write]",
    "  paperzod doctor <setup-path>"
  ].join("\n");
}

export function fail(message: string): never {
  throw new Error(message);
}

export async function loadSetupInput(filePath: string): Promise<unknown> {
  const absolutePath = path.resolve(filePath);
  const extension = path.extname(absolutePath);

  if (extension === ".json") {
    return JSON.parse(await readFile(absolutePath, "utf8")) as unknown;
  }

  if (extension === ".js" || extension === ".mjs" || extension === ".cjs") {
    const module = (await import(pathToFileURL(absolutePath).href)) as { default?: unknown };
    return module.default ?? module;
  }

  fail(`Unsupported setup file extension "${extension}". Use .json, .js, .mjs, or .cjs.`);
}

export function analyzeSetupInput(input: unknown): AnalyzeResult {
  return renderSetup(input);
}

export function createAdapterFromArgs(args: string[]): TargetAdapter {
  const repoRoot = readFlag(args, "--repo-root") ?? process.cwd();
  const outputRoot = readFlag(args, "--output-root") ?? ".";
  const target = readFlag(args, "--target") ?? "generic";

  if (target === "paperclip") {
    return createPaperclipMarkdownTarget({ repoRoot, outputRoot });
  }

  return createTargetAdapter({ name: "generic", repoRoot, outputRoot });
}

export function readFlag(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

export function hasFlag(args: string[], flag: string): boolean {
  return args.includes(flag);
}

export function formatDiagnostic(diagnostic: Diagnostic): string {
  const lines = [`[${diagnostic.phase}] ${diagnostic.code}`, diagnostic.message];
  if (diagnostic.nodeId) {
    lines.push(`Node: ${diagnostic.nodeId}`);
  }
  if (diagnostic.relatedIds && diagnostic.relatedIds.length > 0) {
    lines.push(`Related: ${diagnostic.relatedIds.join(", ")}`);
  }
  return lines.join("\n");
}

export function fixSurfaceForDiagnostic(diagnostic: Diagnostic): string {
  if (diagnostic.phase === "source") {
    return "source setup declarations";
  }
  if (diagnostic.phase === "graph") {
    return "stable ids and cross-node links";
  }
  if (diagnostic.code.startsWith("check.workflow.")) {
    return "source role and workflow declarations";
  }
  if (diagnostic.code.startsWith("check.artifact.") || diagnostic.code.startsWith("check.packet.")) {
    return "artifact and packet contract declarations";
  }
  if (diagnostic.code.startsWith("check.surface_section.") || diagnostic.code.startsWith("check.link.")) {
    return "surface, section, and reference declarations";
  }
  if (diagnostic.phase === "plan") {
    return "generated target and output path planning";
  }
  return "the relevant source declarations";
}

export function formatDoctorReport(setupId: string, diagnostics: readonly Diagnostic[]): string {
  const lines = [`Doctor report for ${setupId}`, ""];
  for (const diagnostic of diagnostics) {
    lines.push(formatDiagnostic(diagnostic));
    lines.push(`Fix surface: ${fixSurfaceForDiagnostic(diagnostic)}`);
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

export function successExitCode(): number {
  return 0;
}

export function failureExitCode(): number {
  return 1;
}

export { formatUsage };

export type AnalyzeResult = PipelineResult<RenderSetupResult>;
