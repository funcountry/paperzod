import type { SetupInput } from "./builders.js";

const setupCollectionKeys = [
  "catalogs",
  "registries",
  "roles",
  "workflowSteps",
  "reviewGates",
  "packetContracts",
  "artifacts",
  "surfaces",
  "surfaceSections",
  "references",
  "generatedTargets",
  "links"
] as const satisfies readonly (keyof Omit<SetupInput, "id" | "name" | "description">)[];

type SetupCollectionKey = (typeof setupCollectionKeys)[number];

export type SetupPart = Partial<Pick<SetupInput, SetupCollectionKey>>;

function cloneCollection<TKey extends SetupCollectionKey>(setup: SetupInput, key: TKey): SetupInput[TKey] {
  const values = setup[key];
  if (values === undefined) {
    return undefined as SetupInput[TKey];
  }

  return [...values] as SetupInput[TKey];
}

function appendCollection<TKey extends SetupCollectionKey>(setup: SetupInput, part: SetupPart, key: TKey): void {
  const values = part[key];
  if (values === undefined) {
    return;
  }

  const existing = setup[key] ?? [];
  setup[key] = [...existing, ...values] as SetupInput[TKey];
}

function replaceCollection<TKey extends SetupCollectionKey>(setup: SetupInput, key: TKey, values: SetupInput[TKey]): void {
  setup[key] = values;
}

export function composeSetup(baseSetup: SetupInput, ...parts: readonly SetupPart[]): SetupInput {
  // Helper-layer composition must lower straight back into plain SetupInput.
  const result: SetupInput = { ...baseSetup };

  for (const key of setupCollectionKeys) {
    const cloned = cloneCollection(baseSetup, key);
    if (cloned !== undefined) {
      replaceCollection(result, key, cloned);
    }
  }

  for (const part of parts) {
    for (const key of setupCollectionKeys) {
      appendCollection(result, part, key);
    }
  }

  return result;
}
