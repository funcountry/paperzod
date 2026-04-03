import type { AuthoredContentBlock, SurfaceClass } from "../core/defs.js";
import type { LinkInput, SetupInput, SurfaceInput, SurfaceSectionInput } from "./builders.js";
import type { SetupPart } from "./compose.js";

export interface DocumentTemplateSection<TKey extends string = string> {
  key: TKey;
  id?: string | undefined;
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

export interface ProjectHomeRootDocumentOptions<TKey extends string> extends BaseDocumentOptions<TKey> {}

export interface RoleHomeDocumentOptions<TKey extends string> extends BaseDocumentOptions<TKey> {
  roleId: string;
}

export interface SharedEntrypointDocumentOptions<TKey extends string> extends BaseDocumentOptions<TKey> {}

export interface WorkflowOwnerDocumentOptions<TKey extends string> extends BaseDocumentOptions<TKey> {
  workflowStepId?: string | undefined;
}

export interface PacketWorkflowDocumentOptions<TKey extends string> extends BaseDocumentOptions<TKey> {
  packetContractId: string;
  workflowStepId?: string | undefined;
}

export interface StandardDocumentOptions<TKey extends string> extends BaseDocumentOptions<TKey> {
  artifactId: string;
}

export interface GateDocumentOptions<TKey extends string> extends BaseDocumentOptions<TKey> {
  reviewGateId: string;
}

export interface ReferenceDocumentOptions<TKey extends string> extends BaseDocumentOptions<TKey> {
  referenceId: string;
}

export type TechnicalReferenceDocumentOptions<TKey extends string> = ReferenceDocumentOptions<TKey>;
export type HowToDocumentOptions<TKey extends string> = ReferenceDocumentOptions<TKey>;
export type CoordinationDocumentOptions<TKey extends string> = ReferenceDocumentOptions<TKey>;

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
  id?: string | undefined;
  title: string;
  stableSlug: string;
  parentKey?: TKey | undefined;
};

function uniqueIds(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function toTargetIds(value: string | readonly string[]): string[] {
  return uniqueIds(typeof value === "string" ? [value] : [...value]);
}

function resolveTargetIds(value: string | readonly string[] | undefined, defaults: readonly string[]): string[] {
  if (value === undefined) {
    return uniqueIds([...defaults]);
  }

  return toTargetIds(value);
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

function buildSectionId(surfaceId: string, section: NormalizedSection<string>): string {
  return section.id ?? `${surfaceId}_${toIdSegment(section.stableSlug)}`;
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
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const normalized = sections.map((section) => {
    if (seenKeys.has(section.key)) {
      throw new Error(`Template "${templateId}" reuses section key "${section.key}".`);
    }
    seenKeys.add(section.key);

    if (section.id) {
      if (seenIds.has(section.id)) {
        throw new Error(`Template "${templateId}" reuses section id "${section.id}".`);
      }
      seenIds.add(section.id);
    }

    const stableSlug = section.stableSlug ? toStableSlug(section.stableSlug) : toStableSlug(section.key);
    if (seenSlugs.has(stableSlug)) {
      throw new Error(`Template "${templateId}" reuses stable slug "${stableSlug}".`);
    }
    seenSlugs.add(stableSlug);

    return {
      key: section.key,
      ...(section.id ? { id: section.id } : {}),
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
  options: BaseDocumentOptions<TKey>,
  requiredSectionSlugs?: readonly string[]
): SurfaceInput {
  return {
    id: options.surfaceId,
    surfaceClass,
    runtimePath: options.runtimePath,
    ...(options.title !== undefined ? { title: options.title } : {}),
    ...(options.intro !== undefined ? { intro: options.intro } : {}),
    ...(options.preamble !== undefined ? { preamble: options.preamble } : {}),
    ...(requiredSectionSlugs && requiredSectionSlugs.length > 0 ? { requiredSectionSlugs: [...requiredSectionSlugs] } : {})
  };
}

function resolveRequiredSectionSlugs<TKey extends string>(
  templateId: string,
  sections: readonly NormalizedSection<TKey>[],
  requiredSections: readonly TKey[] | undefined
): string[] {
  if (!requiredSections || requiredSections.length === 0) {
    return [];
  }

  const sectionByKey = new Map(sections.map((section) => [section.key, section]));

  return uniqueIds(
    requiredSections.map((requiredKey) => {
      const section = sectionByKey.get(requiredKey);
      if (!section) {
        throw new Error(`Template "${templateId}" references missing required section key "${requiredKey}".`);
      }

      return section.stableSlug;
    })
  );
}

function createDocumentPart<TKey extends string>(
  surfaceClass: SurfaceClass,
  sections: readonly NormalizedSection<TKey>[],
  options: BaseDocumentOptions<TKey>,
  requiredSectionSlugs: readonly string[],
  defaults: {
    surfaceDocumentsTo: string[];
    sectionDocumentsTo: (sectionKey: TKey) => string[];
  }
): SetupPart {
  const sectionIdByKey = new Map(
    sections.map((section) => [section.key, buildSectionId(options.surfaceId, section as NormalizedSection<string>)])
  );
  const resolvedSurfaceDocumentsTo = resolveTargetIds(options.surfaceDocumentsTo, defaults.surfaceDocumentsTo);
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
    const resolvedSectionDocumentsTo = resolveTargetIds(sectionOptions?.documentsTo, defaultDocumentsTo);

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
    surfaces: [createSurface(surfaceClass, options, requiredSectionSlugs)],
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
  definition: { id: string; sections: TSections; requiredSections?: readonly TSections[number]["key"][] | undefined },
  instantiate: (
    sections: readonly NormalizedSection<TSections[number]["key"]>[],
    requiredSectionSlugs: readonly string[],
    options: TOptions
  ) => SetupPart
): DocumentTemplate<TSurfaceClass, TSections[number]["key"], TOptions> {
  const normalizedSections = normalizeSections(definition.id, definition.sections);
  const requiredSectionSlugs = resolveRequiredSectionSlugs(definition.id, normalizedSections, definition.requiredSections);

  return {
    id: definition.id,
    surfaceClass,
    sections: normalizedSections,
    document(options) {
      return instantiate(normalizedSections, requiredSectionSlugs, options);
    }
  };
}

function createSurfaceTemplateDefinition<
  TSurfaceClass extends SurfaceClass,
  const TSections extends readonly DocumentTemplateSection<string>[],
  TOptions extends BaseDocumentOptions<TSections[number]["key"]>
>(
  surfaceClass: TSurfaceClass,
  definition: { id: string; sections: TSections; requiredSections?: readonly TSections[number]["key"][] | undefined },
  defaults: (options: TOptions) => {
    surfaceDocumentsTo: string[];
    sectionDocumentsTo: (sectionKey: TSections[number]["key"]) => string[];
  }
): DocumentTemplate<TSurfaceClass, TSections[number]["key"], TOptions> {
  return createTemplateDefinition(surfaceClass, definition, (sections, requiredSectionSlugs, options) =>
    createDocumentPart(surfaceClass, sections, options, requiredSectionSlugs, defaults(options))
  );
}

export function defineProjectHomeRootTemplate<const TSections extends readonly DocumentTemplateSection<string>[]>(
  definition: {
    id: string;
    sections: TSections;
    requiredSections?: readonly TSections[number]["key"][] | undefined;
  }
): DocumentTemplate<"project_home_root", TSections[number]["key"], ProjectHomeRootDocumentOptions<TSections[number]["key"]>> {
  return createSurfaceTemplateDefinition("project_home_root", definition, () => ({
    surfaceDocumentsTo: [],
    sectionDocumentsTo: () => []
  }));
}

export function defineRoleHomeTemplate<const TSections extends readonly DocumentTemplateSection<string>[]>(
  definition: {
    id: string;
    sections: TSections;
    requiredSections?: readonly TSections[number]["key"][] | undefined;
  }
): DocumentTemplate<"role_home", TSections[number]["key"], RoleHomeDocumentOptions<TSections[number]["key"]>> {
  return createSurfaceTemplateDefinition("role_home", definition, (options) => ({
    surfaceDocumentsTo: [options.roleId],
    sectionDocumentsTo: () => [options.roleId]
  }));
}

export function defineSharedEntrypointTemplate<const TSections extends readonly DocumentTemplateSection<string>[]>(
  definition: {
    id: string;
    sections: TSections;
    requiredSections?: readonly TSections[number]["key"][] | undefined;
  }
): DocumentTemplate<"shared_entrypoint", TSections[number]["key"], SharedEntrypointDocumentOptions<TSections[number]["key"]>> {
  return createSurfaceTemplateDefinition("shared_entrypoint", definition, () => ({
    surfaceDocumentsTo: [],
    sectionDocumentsTo: () => []
  }));
}

export function defineWorkflowOwnerTemplate<const TSections extends readonly DocumentTemplateSection<string>[]>(
  definition: {
    id: string;
    sections: TSections;
    requiredSections?: readonly TSections[number]["key"][] | undefined;
  }
): DocumentTemplate<"workflow_owner", TSections[number]["key"], WorkflowOwnerDocumentOptions<TSections[number]["key"]>> {
  return createSurfaceTemplateDefinition("workflow_owner", definition, (options) => {
    const defaultDocumentsTo = options.workflowStepId ? [options.workflowStepId] : [];
    return {
      surfaceDocumentsTo: defaultDocumentsTo,
      sectionDocumentsTo: () => defaultDocumentsTo
    };
  });
}

export function definePacketWorkflowTemplate<const TSections extends readonly DocumentTemplateSection<string>[]>(
  definition: {
    id: string;
    sections: TSections;
    requiredSections?: readonly TSections[number]["key"][] | undefined;
  }
): DocumentTemplate<"packet_workflow", TSections[number]["key"], PacketWorkflowDocumentOptions<TSections[number]["key"]>> {
  return createSurfaceTemplateDefinition("packet_workflow", definition, (options) => ({
    surfaceDocumentsTo: [options.packetContractId],
    sectionDocumentsTo: () => (options.workflowStepId ? [options.workflowStepId] : [options.packetContractId])
  }));
}

export function defineStandardTemplate<const TSections extends readonly DocumentTemplateSection<string>[]>(
  definition: {
    id: string;
    sections: TSections;
    requiredSections?: readonly TSections[number]["key"][] | undefined;
  }
): DocumentTemplate<"standard", TSections[number]["key"], StandardDocumentOptions<TSections[number]["key"]>> {
  return createSurfaceTemplateDefinition("standard", definition, (options) => ({
    surfaceDocumentsTo: [options.artifactId],
    sectionDocumentsTo: () => [options.artifactId]
  }));
}

export function defineGateTemplate<const TSections extends readonly DocumentTemplateSection<string>[]>(
  definition: {
    id: string;
    sections: TSections;
    requiredSections?: readonly TSections[number]["key"][] | undefined;
  }
): DocumentTemplate<"gate", TSections[number]["key"], GateDocumentOptions<TSections[number]["key"]>> {
  return createSurfaceTemplateDefinition("gate", definition, (options) => ({
    surfaceDocumentsTo: [options.reviewGateId],
    sectionDocumentsTo: () => [options.reviewGateId]
  }));
}

function createReferenceTemplateDefinition<
  TSurfaceClass extends "technical_reference" | "how_to" | "coordination",
  const TSections extends readonly DocumentTemplateSection<string>[]
>(
  surfaceClass: TSurfaceClass,
  definition: {
    id: string;
    sections: TSections;
    requiredSections?: readonly TSections[number]["key"][] | undefined;
  }
): DocumentTemplate<TSurfaceClass, TSections[number]["key"], ReferenceDocumentOptions<TSections[number]["key"]>> {
  return createSurfaceTemplateDefinition(surfaceClass, definition, (options) => ({
    surfaceDocumentsTo: [options.referenceId],
    sectionDocumentsTo: () => [options.referenceId]
  }));
}

export function defineTechnicalReferenceTemplate<const TSections extends readonly DocumentTemplateSection<string>[]>(
  definition: {
    id: string;
    sections: TSections;
    requiredSections?: readonly TSections[number]["key"][] | undefined;
  }
): DocumentTemplate<"technical_reference", TSections[number]["key"], TechnicalReferenceDocumentOptions<TSections[number]["key"]>> {
  return createReferenceTemplateDefinition("technical_reference", definition);
}

export function defineHowToTemplate<const TSections extends readonly DocumentTemplateSection<string>[]>(
  definition: {
    id: string;
    sections: TSections;
    requiredSections?: readonly TSections[number]["key"][] | undefined;
  }
): DocumentTemplate<"how_to", TSections[number]["key"], HowToDocumentOptions<TSections[number]["key"]>> {
  return createReferenceTemplateDefinition("how_to", definition);
}

export function defineCoordinationTemplate<const TSections extends readonly DocumentTemplateSection<string>[]>(
  definition: {
    id: string;
    sections: TSections;
    requiredSections?: readonly TSections[number]["key"][] | undefined;
  }
): DocumentTemplate<"coordination", TSections[number]["key"], CoordinationDocumentOptions<TSections[number]["key"]>> {
  return createReferenceTemplateDefinition("coordination", definition);
}
