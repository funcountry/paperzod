import { createDiagnostic } from "../core/diagnostics.js";
import type { Diagnostic } from "../core/index.js";
import type { CheckRule } from "../checks/registry.js";
import type { SetupInput } from "./builders.js";

export type OwnedOutputScopeInput = { kind: "root"; path: string } | { kind: "file"; path: string };

export interface SetupModuleDef {
  setup: SetupInput;
  checks?: readonly CheckRule[] | undefined;
  outputOwnership?: readonly OwnedOutputScopeInput[] | undefined;
}

export type SetupModuleInput = SetupInput | SetupModuleDef;

export interface ResolvedSetupModuleInput {
  setup: unknown;
  checks: readonly CheckRule[];
  outputOwnership: readonly OwnedOutputScopeInput[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function createSourceModuleDiagnostic(code: string, message: string): Diagnostic {
  return createDiagnostic({
    code,
    severity: "error",
    phase: "source",
    message
  });
}

function isSetupModuleLike(input: unknown): input is SetupModuleDef {
  return isRecord(input) && "setup" in input;
}

export function defineSetupModule<const T extends SetupModuleDef>(module: T): T {
  return module;
}

export function resolveSetupModuleInput(input: unknown):
  | { success: true; data: ResolvedSetupModuleInput }
  | { success: false; diagnostics: Diagnostic[] } {
  // Source-envelope fields configure the compiler around semantic setup truth.
  if (!isSetupModuleLike(input)) {
    return {
      success: true,
      data: {
        setup: input,
        checks: [],
        outputOwnership: []
      }
    };
  }

  const diagnostics: Diagnostic[] = [];
  const checks = input.checks ?? [];
  const outputOwnership = input.outputOwnership ?? [];

  if (!Array.isArray(checks)) {
    diagnostics.push(
      createSourceModuleDiagnostic(
        "source.setup_module_invalid_checks",
        'Setup module "checks" must be an array of check rules when provided.'
      )
    );
  }

  if (!Array.isArray(outputOwnership)) {
    diagnostics.push(
      createSourceModuleDiagnostic(
        "source.setup_module_invalid_output_ownership",
        'Setup module "outputOwnership" must be an array of owned output scopes when provided.'
      )
    );
  }

  if (diagnostics.length > 0) {
    return { success: false, diagnostics };
  }

  return {
    success: true,
    data: {
      setup: input.setup,
      checks,
      outputOwnership
    }
  };
}
