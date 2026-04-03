import type { SetupInput } from "./builders.js";
import { composeSetup } from "./compose.js";

const idOverrideCollectionKeys = [
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

const kindOverrideCollectionKeys = ["catalogs"] as const satisfies readonly (keyof Omit<SetupInput, "id" | "name" | "description">)[];

type IdOverrideCollectionKey = (typeof idOverrideCollectionKeys)[number];
type KindOverrideCollectionKey = (typeof kindOverrideCollectionKeys)[number];
type IdCollectionItem<TKey extends IdOverrideCollectionKey> = NonNullable<SetupInput[TKey]>[number];
type KindCollectionItem<TKey extends KindOverrideCollectionKey> = NonNullable<SetupInput[TKey]>[number];
type ReplacementValue<T> = T | ((current: T) => T);

export interface KeyedOverride<T extends { id: string }> {
  id: T["id"];
  replace: ReplacementValue<T>;
}

export interface KindOverride<T extends { kind: string }> {
  kind: T["kind"];
  replace: ReplacementValue<T>;
}

export type SetupOverrides = Partial<{
  [TKey in IdOverrideCollectionKey]: readonly KeyedOverride<IdCollectionItem<TKey>>[] | undefined;
}> &
  Partial<{
    [TKey in KindOverrideCollectionKey]: readonly KindOverride<KindCollectionItem<TKey>>[] | undefined;
  }>;

function duplicateIds(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
      continue;
    }

    seen.add(value);
  }

  return [...duplicates].sort();
}

function applyIdCollectionOverrides<TKey extends IdOverrideCollectionKey>(
  setup: SetupInput,
  key: TKey,
  overrides: readonly KeyedOverride<IdCollectionItem<TKey>>[]
): void {
  const collection = setup[key] as IdCollectionItem<TKey>[] | undefined;
  if (!collection || collection.length === 0) {
    throw new Error(`Override collection "${key}" is empty, so keyed replacement is not available.`);
  }

  const ambiguousIds = duplicateIds(collection.map((item) => item.id));
  if (ambiguousIds.length > 0) {
    throw new Error(`Override collection "${key}" contains duplicate ids: ${ambiguousIds.join(", ")}.`);
  }

  const duplicateOverrideIds = duplicateIds(overrides.map((override) => override.id));
  if (duplicateOverrideIds.length > 0) {
    throw new Error(`Override collection "${key}" reuses override ids: ${duplicateOverrideIds.join(", ")}.`);
  }

  for (const override of overrides) {
    const index = collection.findIndex((item) => item.id === override.id);
    if (index === -1) {
      throw new Error(`Override collection "${key}" references missing id "${override.id}".`);
    }

    const current = collection[index];
    if (!current) {
      throw new Error(`Override collection "${key}" could not resolve id "${override.id}".`);
    }

    const next =
      typeof override.replace === "function"
        ? override.replace(structuredClone(current) as IdCollectionItem<TKey>)
        : override.replace;

    if (next.id !== override.id) {
      throw new Error(`Override collection "${key}" may not change stable id "${override.id}".`);
    }

    collection[index] = next;
  }
}

function applyKindCollectionOverrides<TKey extends KindOverrideCollectionKey>(
  setup: SetupInput,
  key: TKey,
  overrides: readonly KindOverride<KindCollectionItem<TKey>>[]
): void {
  const collection = setup[key] as KindCollectionItem<TKey>[] | undefined;
  if (!collection || collection.length === 0) {
    throw new Error(`Override collection "${key}" is empty, so keyed replacement is not available.`);
  }

  const ambiguousKinds = duplicateIds(collection.map((item) => item.kind));
  if (ambiguousKinds.length > 0) {
    throw new Error(`Override collection "${key}" contains duplicate kinds: ${ambiguousKinds.join(", ")}.`);
  }

  const duplicateOverrideKinds = duplicateIds(overrides.map((override) => override.kind));
  if (duplicateOverrideKinds.length > 0) {
    throw new Error(`Override collection "${key}" reuses override kinds: ${duplicateOverrideKinds.join(", ")}.`);
  }

  for (const override of overrides) {
    const index = collection.findIndex((item) => item.kind === override.kind);
    if (index === -1) {
      throw new Error(`Override collection "${key}" references missing kind "${override.kind}".`);
    }

    const current = collection[index];
    if (!current) {
      throw new Error(`Override collection "${key}" could not resolve kind "${override.kind}".`);
    }

    const next =
      typeof override.replace === "function"
        ? override.replace(structuredClone(current) as KindCollectionItem<TKey>)
        : override.replace;

    if (next.kind !== override.kind) {
      throw new Error(`Override collection "${key}" may not change stable kind "${override.kind}".`);
    }

    collection[index] = next;
  }
}

function applyIdOverridesForKey<TKey extends IdOverrideCollectionKey>(setup: SetupInput, overrides: SetupOverrides, key: TKey): void {
  const collectionOverrides = overrides[key] as readonly KeyedOverride<IdCollectionItem<TKey>>[] | undefined;
  if (!collectionOverrides || collectionOverrides.length === 0) {
    return;
  }

  applyIdCollectionOverrides(setup, key, collectionOverrides);
}

function applyKindOverridesForKey<TKey extends KindOverrideCollectionKey>(setup: SetupInput, overrides: SetupOverrides, key: TKey): void {
  const collectionOverrides = overrides[key] as readonly KindOverride<KindCollectionItem<TKey>>[] | undefined;
  if (!collectionOverrides || collectionOverrides.length === 0) {
    return;
  }

  // Catalog identity is compiler-owned by `kind`, so the override helper must stay equally plain.
  applyKindCollectionOverrides(setup, key, collectionOverrides);
}

export function applyKeyedOverrides(baseSetup: SetupInput, overrides: SetupOverrides): SetupInput {
  // Stable selectors are the only legal override surface for setup composition.
  const result = composeSetup(baseSetup);

  for (const key of idOverrideCollectionKeys) {
    applyIdOverridesForKey(result, overrides, key);
  }

  for (const key of kindOverrideCollectionKeys) {
    applyKindOverridesForKey(result, overrides, key);
  }

  return result;
}
