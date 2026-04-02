const STABLE_ID_PATTERN = /^[a-z][a-z0-9_]*(?:[.-][a-z0-9_]+)*$/;

export type StableId = string & { readonly __brand: "StableId" };
export type SectionSlug = string & { readonly __brand: "SectionSlug" };

export function makeStableId(input: string): StableId {
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");

  assertStableId(normalized);
  return normalized;
}

export function assertStableId(value: string): asserts value is StableId {
  if (!STABLE_ID_PATTERN.test(value)) {
    throw new Error(`Invalid stable id: ${value}`);
  }
}

export function compareStableIds(left: string, right: string): number {
  return left.localeCompare(right);
}

export function toSectionSlug(input: string): SectionSlug {
  const slug = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  if (!slug) {
    throw new Error("Section slug cannot be empty");
  }

  return slug as SectionSlug;
}

export function findDuplicateIds(ids: readonly string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const id of ids) {
    if (seen.has(id)) {
      duplicates.add(id);
    } else {
      seen.add(id);
    }
  }

  return [...duplicates].sort(compareStableIds);
}
