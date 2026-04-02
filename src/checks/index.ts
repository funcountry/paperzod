import type { DoctrineGraph } from "../core/index.js";
import { coreCheckRules } from "./core-rules.js";
import { runCheckRegistry } from "./registry.js";

export * from "./core-rules.js";
export * from "./registry.js";

export const defaultCheckRules = coreCheckRules;

export function runChecks(graph: DoctrineGraph) {
  return runCheckRegistry(graph, defaultCheckRules);
}
