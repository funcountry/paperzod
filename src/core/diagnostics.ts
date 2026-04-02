export type DiagnosticSeverity = "error" | "warning" | "info";
export type DiagnosticPhase = "source" | "graph" | "check" | "plan" | "render" | "emit";

export interface Diagnostic {
  code: string;
  severity: DiagnosticSeverity;
  phase: DiagnosticPhase;
  message: string;
  nodeId?: string;
  relatedIds?: string[];
  path?: string[];
}

export function createDiagnostic(input: Diagnostic): Diagnostic {
  return {
    ...input,
    ...(input.relatedIds ? { relatedIds: [...input.relatedIds].sort() } : {}),
    ...(input.path ? { path: [...input.path] } : {})
  };
}

export function diagnosticSortKey(diagnostic: Diagnostic): string {
  return [
    diagnostic.phase,
    diagnostic.severity,
    diagnostic.code,
    diagnostic.nodeId ?? "",
    diagnostic.message
  ].join("\u0000");
}

export function compareDiagnostics(left: Diagnostic, right: Diagnostic): number {
  return diagnosticSortKey(left).localeCompare(diagnosticSortKey(right));
}

export function sortDiagnostics(diagnostics: readonly Diagnostic[]): Diagnostic[] {
  return [...diagnostics].sort(compareDiagnostics);
}
