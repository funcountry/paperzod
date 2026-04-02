import type { DoctrineGraph } from "../core/index.js";
import { coreCheckRules } from "./core-rules.js";
import { paperclipCheckRules } from "./paperclip-rules.js";
import { runCheckRegistry } from "./registry.js";

export * from "./core-rules.js";
export * from "./paperclip-rules.js";
export * from "./registry.js";

export const defaultCheckRules = [...coreCheckRules, ...paperclipCheckRules] as const;

export function runChecks(graph: DoctrineGraph) {
  return runCheckRegistry(graph, defaultCheckRules);
}
