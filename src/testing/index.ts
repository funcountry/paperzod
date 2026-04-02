import type { Diagnostic } from "../core/index.js";

export function stableJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function collectDiagnosticCodes(diagnostics: readonly Diagnostic[]): string[] {
  return diagnostics.map((diagnostic) => diagnostic.code);
}

export function requireSuccess<T>(result: { success: true; data: T } | { success: false; diagnostics: Diagnostic[] }): T {
  if (!result.success) {
    const codes = collectDiagnosticCodes(result.diagnostics).join(", ");
    throw new Error(`Expected success but received diagnostics: ${codes}`);
  }

  return result.data;
}
