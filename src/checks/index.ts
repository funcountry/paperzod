import { createDiagnostic, sortDiagnostics } from "../core/diagnostics.js";
import type { Diagnostic, DoctrineGraph } from "../core/index.js";
import { coreCheckRules } from "./core-rules.js";
import { runCheckRegistry, type CheckRule } from "./registry.js";

export * from "./core-rules.js";
export * from "./registry.js";

export const defaultCheckRules = coreCheckRules;

function duplicateRuleDiagnostics(rules: readonly CheckRule[]): Diagnostic[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const rule of rules) {
    if (seen.has(rule.id)) {
      duplicates.add(rule.id);
      continue;
    }
    seen.add(rule.id);
  }

  return [...duplicates].map((id) =>
    createDiagnostic({
      code: "check.registry.duplicate_rule_id",
      severity: "error",
      phase: "check",
      message: `Check rule id "${id}" is registered more than once.`,
      nodeId: id
    })
  );
}

export function runChecks(graph: DoctrineGraph, additionalRules: readonly CheckRule[] = []) {
  const rules = [...defaultCheckRules, ...additionalRules];
  const diagnostics = duplicateRuleDiagnostics(rules);
  if (diagnostics.length > 0) {
    return sortDiagnostics(diagnostics);
  }

  return runCheckRegistry(graph, rules);
}
