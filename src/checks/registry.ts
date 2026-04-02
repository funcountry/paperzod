import { sortDiagnostics } from "../core/diagnostics.js";
import type { Diagnostic, DoctrineGraph } from "../core/index.js";

export interface CheckRule {
  id: string;
  run(graph: DoctrineGraph): Diagnostic[];
}

export function runCheckRegistry(graph: DoctrineGraph, rules: readonly CheckRule[]): Diagnostic[] {
  const diagnostics = rules.flatMap((rule) => rule.run(graph));
  return sortDiagnostics(diagnostics);
}
