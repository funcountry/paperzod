import type { SetupPart } from "./compose.js";
import type { AuthoredContentBlock, SurfaceClass } from "../core/defs.js";
import type { DocumentSectionOptions, DocumentTemplate } from "./templates.js";

type SectionOptionsByKey<TKey extends string> = Partial<Record<TKey, DocumentSectionOptions>>;

interface DocumentOptionsWithSections<TKey extends string> {
  surfaceId: string;
  runtimePath: string;
  title?: string | undefined;
  intro?: AuthoredContentBlock[] | undefined;
  preamble?: AuthoredContentBlock[] | undefined;
  sourceIds?: readonly string[] | undefined;
  surfaceDocumentsTo?: string | readonly string[] | undefined;
  sections?: SectionOptionsByKey<TKey> | undefined;
}

export type ProjectDocumentSectionsDestination<
  TKey extends string,
  TDocumentOptions extends DocumentOptionsWithSections<TKey>
> = Omit<TDocumentOptions, "sections"> & {
  sections?: SectionOptionsByKey<TKey> | undefined;
};

export interface ProjectDocumentSectionsOptions<
  TKey extends string,
  TDocumentOptions extends DocumentOptionsWithSections<TKey>
> {
  sections?: SectionOptionsByKey<TKey> | undefined;
  destinations: readonly ProjectDocumentSectionsDestination<TKey, TDocumentOptions>[];
}

function uniqueIds(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function mergeSectionOptions(
  shared: DocumentSectionOptions | undefined,
  local: DocumentSectionOptions | undefined
): DocumentSectionOptions | undefined {
  if (shared === undefined && local === undefined) {
    return undefined;
  }

  const mergedSourceIds = uniqueIds([...(shared?.sourceIds ?? []), ...(local?.sourceIds ?? [])]);

  return {
    ...(shared?.body !== undefined ? { body: shared.body } : {}),
    ...(local?.body !== undefined ? { body: local.body } : {}),
    ...(shared?.documentsTo !== undefined ? { documentsTo: shared.documentsTo } : {}),
    ...(local?.documentsTo !== undefined ? { documentsTo: local.documentsTo } : {}),
    ...(mergedSourceIds.length > 0 ? { sourceIds: mergedSourceIds } : {})
  };
}

function validateSectionKeys<TKey extends string>(
  template: DocumentTemplate<any, TKey, any>,
  sectionOptions: SectionOptionsByKey<TKey> | undefined,
  context: string
): void {
  if (!sectionOptions) {
    return;
  }

  const knownKeys = new Set(template.sections.map((section) => section.key));
  for (const key of Object.keys(sectionOptions)) {
    if (!knownKeys.has(key as TKey)) {
      throw new Error(`Projection for template "${template.id}" references unknown section key "${key}" in ${context}.`);
    }
  }
}

function mergeSections<TKey extends string>(
  template: DocumentTemplate<any, TKey, any>,
  sharedSections: SectionOptionsByKey<TKey> | undefined,
  localSections: SectionOptionsByKey<TKey> | undefined
): SectionOptionsByKey<TKey> | undefined {
  validateSectionKeys(template, sharedSections, "shared sections");
  validateSectionKeys(template, localSections, "destination sections");

  const keys = uniqueIds([...(sharedSections ? Object.keys(sharedSections) : []), ...(localSections ? Object.keys(localSections) : [])]) as TKey[];
  if (keys.length === 0) {
    return undefined;
  }

  const mergedEntries = keys.flatMap((key) => {
    const merged = mergeSectionOptions(sharedSections?.[key], localSections?.[key]);
    return merged ? [[key, merged] as const] : [];
  });

  return Object.fromEntries(mergedEntries) as SectionOptionsByKey<TKey>;
}

export function projectDocumentSections<
  TSurfaceClass extends SurfaceClass,
  TKey extends string,
  TDocumentOptions extends DocumentOptionsWithSections<TKey>
>(
  template: DocumentTemplate<TSurfaceClass, TKey, TDocumentOptions>,
  options: ProjectDocumentSectionsOptions<TKey, TDocumentOptions>
): SetupPart[] {
  // Projection is helper-only lowering. It still emits ordinary setup parts per destination document.
  return options.destinations.map((destination) =>
    template.document({
      ...destination,
      sections: mergeSections(template, options.sections, destination.sections)
    } as TDocumentOptions)
  );
}
