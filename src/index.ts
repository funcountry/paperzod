export const packageRootReady = true;

export * as core from "./core/index.js";
export * from "./emit/index.js";
export * from "./graph/index.js";
export * from "./markdown/index.js";
export * from "./plan/index.js";
export * from "./source/index.js";
export * from "./checks/index.js";

import type { Diagnostic, SetupDef } from "./core/index.js";
import type { CompilePlan, DoctrineGraph } from "./core/index.js";
import { runChecks } from "./checks/index.js";
import { emitDocuments, type EmitOptions, type EmitResult } from "./emit/index.js";
import type { TargetAdapter, TargetManifest } from "./plan/index.js";
import { buildGraph } from "./graph/index.js";
import { renderDocuments, type RenderedDocument } from "./markdown/index.js";
import { buildCompilePlan, resolveTargetManifest } from "./plan/index.js";
import { normalizeSetup } from "./source/index.js";

export type PipelineResult<T> = { success: true; data: T } | { success: false; diagnostics: Diagnostic[] };

export interface RenderSetupResult {
  setup: SetupDef;
  graph: DoctrineGraph;
  plan: CompilePlan;
  documents: RenderedDocument[];
  rendered: {
    documents: RenderedDocument[];
  };
}

export interface CompileSetupResult extends RenderSetupResult {
  manifest: TargetManifest;
}

export interface CompileAndEmitSetupResult extends CompileSetupResult {
  emit: EmitResult;
}

export function validateSetup(input: unknown) {
  return normalizeSetup(input);
}

export function renderSetup(input: unknown): PipelineResult<RenderSetupResult> {
  const normalized = normalizeSetup(input);
  if (!normalized.success) {
    return normalized;
  }

  const graph = buildGraph(normalized.data);
  if (!graph.success) {
    return graph;
  }

  const diagnostics = runChecks(graph.data);
  if (diagnostics.length > 0) {
    return { success: false, diagnostics };
  }

  const plan = buildCompilePlan(graph.data);
  if (!plan.success) {
    return plan;
  }

  const documents = renderDocuments(graph.data, plan.data);

  return {
    success: true,
    data: {
      setup: normalized.data,
      graph: graph.data,
      plan: plan.data,
      documents,
      rendered: {
        documents
      }
    }
  };
}

export function compileSetup(input: unknown, adapter: TargetAdapter): PipelineResult<CompileSetupResult> {
  const rendered = renderSetup(input);
  if (!rendered.success) {
    return rendered;
  }

  const manifest = resolveTargetManifest(rendered.data.plan, adapter);
  if (!manifest.success) {
    return manifest;
  }

  return {
    success: true,
    data: {
      ...rendered.data,
      manifest: manifest.data
    }
  };
}

export async function compileAndEmitSetup(
  input: unknown,
  adapter: TargetAdapter,
  options: EmitOptions
): Promise<PipelineResult<CompileAndEmitSetupResult>> {
  const compiled = compileSetup(input, adapter);
  if (!compiled.success) {
    return compiled;
  }

  const emit = await emitDocuments(compiled.data.documents, compiled.data.manifest, options);

  return {
    success: true,
    data: {
      ...compiled.data,
      emit
    }
  };
}
