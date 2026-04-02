import type { AuthoredContentBlock, SurfaceClass } from "../core/defs.js";
import type { LinkInput, SetupInput, SurfaceInput, SurfaceSectionInput } from "./builders.js";
import type { SetupPart } from "./compose.js";

export interface DocumentTemplateSection<TKey extends string = string> {
  key: TKey;
  title: string;
  stableSlug?: string | undefined;
  parentKey?: TKey | undefined;
}

export interface DocumentSectionOptions {
  body?: AuthoredContentBlock[] | undefined;
  documentsTo?: string | readonly string[] | undefined;
  sourceIds?: readonly string[] | undefined;
}

interface BaseDocumentOptions<TKey extends string> {
  surfaceId: string;
  runtimePath: string;
  title?: string | undefined;
  intro?: AuthoredContentBlock[] | undefined;
  preamble?: AuthoredContentBlock[] | undefined;
  sourceIds?: readonly string[] | undefined;
  surfaceDocumentsTo?: string | readonly string[] | undefined;
  sections?: Partial<Record<TKey, DocumentSectionOptions>> | undefined;
}

export interface RoleHomeDocumentOptions<TKey extends string> extends BaseDocumentOptions<TKey> {
  roleId: string;
}

export interface WorkflowOwnerDocumentOptions<TKey extends string> extends BaseDocumentOptions<TKey> {
  workflowStepId?: string | undefined;
}

export interface StandardDocumentOptions<TKey extends string> extends BaseDocumentOptions<TKey> {
  artifactId: string;
}

export interface DocumentTemplate<
  TSurfaceClass extends SurfaceClass,
  TKey extends string,
  TDocumentOptions extends BaseDocumentOptions<TKey>
> {
  id: string;
  surfaceClass: TSurfaceClass;
  sections: readonly DocumentTemplateSection<TKey>[];
  document(options: TDocumentOptions): SetupPart;
}

type NormalizedSection<TKey extends string> = {
  key: TKey;
  title: string;
  stableSlug: string;
  parentKey?: TKey | undefined;
};

function uniqueIds(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function toTargetIds(value: string | readonly string[] | undefined): string[] {
  if (value === undefined) {
    return [];
  }

  return uniqueIds(typeof value === "string" ? [value] : [...value]);
}

function toStableSlug(value: string): string {
  const stableSlug = value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .toLowerCase()
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (stableSlug.length === 0) {
    throw new Error(`Unable to derive a stable slug from "${value}".`);
  }

  return stableSlug;
}

function toIdSegment(value: string): string {
  return value.replace(/-/g, "_");
}

function buildSectionId(surfaceId: string, stableSlug: string): string {
  return `${surfaceId}_${toIdSegment(stableSlug)}`;
}

function buildDocumentsLinkId(fromId: string, toId: string): string {
  return `${fromId}_documents_${toId.replace(/[^a-zA-Z0-9]+/g, "_")}`;
}

function normalizeSections<TKey extends string>(
  templateId: string,
  sections: readonly DocumentTemplateSection<TKey>[]
): NormalizedSection<TKey>[] {
  if (sections.length === 0) {
    throw new Error(`Template "${templateId}" must define at least one section.`);
  }

  const seenKeys = new Set<string>();
  const seenSlugs = new Set<string>();
  const normalized = sections.map((section) => {
    if (seenKeys.has(section.key)) {
      throw new Error(`Template "${templateId}" reuses section key "${section.key}".`);
    }
    seenKeys.add(section.key);

    const stableSlug = section.stableSlug ? toStableSlug(section.stableSlug) : toStableSlug(section.key);
    if (seenSlugs.has(stableSlug)) {
      throw new Error(`Template "${templateId}" reuses stable slug "${stableSlug}".`);
    }
    seenSlugs.add(stableSlug);

    return {
      key: section.key,
      title: section.title,
      stableSlug,
      ...(section.parentKey ? { parentKey: section.parentKey } : {})
    };
  });

  const knownKeys = new Set(normalized.map((section) => section.key));
  for (const section of normalized) {
    if (section.parentKey && !knownKeys.has(section.parentKey)) {
      throw new Error(`Template "${templateId}" references missing parent key "${section.parentKey}" from "${section.key}".`);
    }
    if (section.parentKey === section.key) {
      throw new Error(`Template "${templateId}" may not parent section "${section.key}" to itself.`);
    }
  }

  return normalized;
}

function createSurface<TKey extends string>(
  surfaceClass: SurfaceClass,
  options: BaseDocumentOptions<TKey>
): SurfaceInput {
  return {
    id: options.surfaceId,
    surfaceClass,
    runtimePath: options.runtimePath,
    ...(options.title !== undefined ? { title: options.title } : {}),
    ...(options.intro !== undefined ? { intro: options.intro } : {}),
    ...(options.preamble !== undefined ? { preamble: options.preamble } : {})
  };
}

function createDocumentPart<TKey extends string>(
  surfaceClass: SurfaceClass,
  sections: readonly NormalizedSection<TKey>[],
  options: BaseDocumentOptions<TKey>,
  defaults: {
    surfaceDocumentsTo: string[];
    sectionDocumentsTo: (sectionKey: TKey) => string[];
  }
): SetupPart {
  const sectionIdByKey = new Map(sections.map((section) => [section.key, buildSectionId(options.surfaceId, section.stableSlug)]));
  const surfaceDocumentsTo = toTargetIds(options.surfaceDocumentsTo);
  const resolvedSurfaceDocumentsTo = surfaceDocumentsTo.length > 0 ? surfaceDocumentsTo : defaults.surfaceDocumentsTo;
  const sharedSourceIds = uniqueIds([...(options.sourceIds ?? [])]);
  const links: LinkInput[] = resolvedSurfaceDocumentsTo.map((to) => ({
    id: buildDocumentsLinkId(options.surfaceId, to),
    kind: "documents",
    from: options.surfaceId,
    to
  }));

  const surfaceSections: SurfaceSectionInput[] = [];
  const generatedTargets: NonNullable<SetupInput["generatedTargets"]> = [];

  // Templates are just authoring sugar. They always lower into ordinary setup arrays.
  for (const section of sections) {
    const sectionId = sectionIdByKey.get(section.key);
    if (!sectionId) {
      throw new Error(`Template section "${String(section.key)}" did not resolve to a section id.`);
    }

    const sectionOptions = options.sections?.[section.key];
    const defaultDocumentsTo = defaults.sectionDocumentsTo(section.key);
    const sectionDocumentsTo = toTargetIds(sectionOptions?.documentsTo);
    const resolvedSectionDocumentsTo = sectionDocumentsTo.length > 0 ? sectionDocumentsTo : defaultDocumentsTo;

    surfaceSections.push({
      id: sectionId,
      surfaceId: options.surfaceId,
      stableSlug: section.stableSlug,
      title: section.title,
      ...(section.parentKey ? { parentSectionId: sectionIdByKey.get(section.parentKey) } : {}),
      ...(sectionOptions?.body !== undefined ? { body: sectionOptions.body } : {})
    });

    generatedTargets.push({
      id: `${sectionId}_target`,
      path: options.runtimePath,
      sourceIds: uniqueIds([sectionId, ...resolvedSectionDocumentsTo, ...sharedSourceIds, ...(sectionOptions?.sourceIds ?? [])]),
      sectionId
    });

    for (const to of resolvedSectionDocumentsTo) {
      links.push({
        id: buildDocumentsLinkId(sectionId, to),
        kind: "documents",
        from: sectionId,
        to
      });
    }
  }

  return {
    surfaces: [createSurface(surfaceClass, options)],
    surfaceSections,
    generatedTargets,
    ...(links.length > 0 ? { links } : {})
  };
}

function createTemplateDefinition<
  TSurfaceClass extends SurfaceClass,
  const TSections extends readonly DocumentTemplateSection<string>[],
  TOptions extends BaseDocumentOptions<TSections[number]["key"]>
>(
  surfaceClass: TSurfaceClass,
  definition: { id: string; sections: TSections },
  instantiate: (
    sections: readonly NormalizedSection<TSections[number]["key"]>[],
    options: TOptions
  ) => SetupPart
): DocumentTemplate<TSurfaceClass, TSections[number]["key"], TOptions> {
  const normalizedSections = normalizeSections(definition.id, definition.sections);

  return {
    id: definition.id,
    surfaceClass,
    sections: normalizedSections,
    document(options) {
      return instantiate(normalizedSections, options);
    }
  };
}

export function defineRoleHomeTemplate<const TSections extends readonly DocumentTemplateSection<string>[]>(
  definition: {
    id: string;
    sections: TSections;
  }
): DocumentTemplate<"role_home", TSections[number]["key"], RoleHomeDocumentOptions<TSections[number]["key"]>> {
  return createTemplateDefinition("role_home", definition, (sections, options) =>
    createDocumentPart("role_home", sections, options, {
      surfaceDocumentsTo: [options.roleId],
      sectionDocumentsTo: () => [options.roleId]
    })
  );
}

export function defineWorkflowOwnerTemplate<const TSections extends readonly DocumentTemplateSection<string>[]>(
  definition: {
    id: string;
    sections: TSections;
  }
): DocumentTemplate<"workflow_owner", TSections[number]["key"], WorkflowOwnerDocumentOptions<TSections[number]["key"]>> {
  return createTemplateDefinition("workflow_owner", definition, (sections, options) => {
    const defaultDocumentsTo = options.workflowStepId ? [options.workflowStepId] : [];
    return createDocumentPart("workflow_owner", sections, options, {
      surfaceDocumentsTo: defaultDocumentsTo,
      sectionDocumentsTo: () => defaultDocumentsTo
    });
  });
}

export function defineStandardTemplate<const TSections extends readonly DocumentTemplateSection<string>[]>(
  definition: {
    id: string;
    sections: TSections;
  }
): DocumentTemplate<"standard", TSections[number]["key"], StandardDocumentOptions<TSections[number]["key"]>> {
  return createTemplateDefinition("standard", definition, (sections, options) =>
    createDocumentPart("standard", sections, options, {
      surfaceDocumentsTo: [options.artifactId],
      sectionDocumentsTo: () => [options.artifactId]
    })
  );
}
