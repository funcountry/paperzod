import { z } from "zod";

import type {
  AuthoredCatalogInlineRefDef,
  AuthoredDefinitionListItem,
  AuthoredInlineRefDef,
  AuthoredInlineTextDef,
  AuthoredListEntry,
  AuthoredNodeInlineRefDef,
  AuthoredSectionInlineRefDef
} from "../core/defs.js";
import type { Diagnostic } from "../core/diagnostics.js";
import { createDiagnostic } from "../core/diagnostics.js";
import type {
  ArtifactInput,
  ArtifactEvidenceClaimInput,
  ArtifactEvidenceInput,
  CatalogEntryInput,
  CatalogInput,
  GeneratedTargetInput,
  LinkInput,
  PacketContractInput,
  ReferenceInput,
  RegistryEntryInput,
  RegistryEntryRefInput,
  RegistryInput,
  ReviewGateInput,
  RoleInput,
  SetupInput,
  SurfaceInput,
  SurfaceSectionInput,
  WorkflowStepInput
} from "./builders.js";

const idSchema = z.string().min(1);
const nonEmptyStringSchema = z.string().min(1);
const sectionSlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const nodeInlineRefSchema = z
  .object({
    kind: z.literal("ref"),
    refKind: z.enum(["artifact", "surface", "role"]),
    id: idSchema
  })
  .strict() satisfies z.ZodType<AuthoredNodeInlineRefDef>;
const sectionInlineRefSchema = z
  .object({
    kind: z.literal("ref"),
    refKind: z.literal("section"),
    surfaceId: idSchema,
    stableSlug: sectionSlugSchema
  })
  .strict() satisfies z.ZodType<AuthoredSectionInlineRefDef>;
const catalogInlineRefSchema = z
  .object({
    kind: z.literal("ref"),
    refKind: z.literal("catalog_entry"),
    catalogKind: z.enum(["command"]),
    entryId: idSchema
  })
  .strict() satisfies z.ZodType<AuthoredCatalogInlineRefDef>;
export const inlineRefSchema = z.union([
  nodeInlineRefSchema,
  sectionInlineRefSchema,
  catalogInlineRefSchema
]) satisfies z.ZodType<AuthoredInlineRefDef>;
export const inlineTextSchema = z.union([
  nonEmptyStringSchema,
  z.array(z.union([nonEmptyStringSchema, inlineRefSchema])).min(1)
]) satisfies z.ZodType<AuthoredInlineTextDef>;
const listEntrySchema: z.ZodType<AuthoredListEntry> = z.lazy(() =>
  z.union([
    inlineTextSchema,
    z.object({
      text: inlineTextSchema,
      children: z.array(listEntrySchema).min(1).optional()
    })
  ])
);
const definitionListItemSchema = z.object({
  term: inlineTextSchema,
  definitions: z.array(listEntrySchema).min(1)
}) satisfies z.ZodType<AuthoredDefinitionListItem>;
const tableBlockSchema = z
  .object({
    kind: z.literal("table"),
    headers: z.array(nonEmptyStringSchema).min(1),
    rows: z.array(z.array(nonEmptyStringSchema).min(1)).min(1)
  })
  .refine((value) => value.rows.every((row) => row.length === value.headers.length), {
    message: "Each table row must match the header column count."
  });
const simpleContentBlockSchema = z.union([
  z.object({
    kind: z.literal("paragraph"),
    text: inlineTextSchema
  }),
  z.object({
    kind: z.literal("unordered_list"),
    items: z.array(listEntrySchema).min(1)
  }),
  z.object({
    kind: z.literal("ordered_list"),
    items: z.array(listEntrySchema).min(1)
  }),
  z.object({
    kind: z.literal("ordered_steps"),
    items: z.array(listEntrySchema).min(1)
  }),
  z.object({
    kind: z.literal("rule_list"),
    items: z.array(listEntrySchema).min(1)
  }),
  z.object({
    kind: z.literal("definition_list"),
    items: z.array(definitionListItemSchema).min(1)
  }),
  tableBlockSchema,
  z.object({
    kind: z.literal("code_block"),
    code: nonEmptyStringSchema,
    language: nonEmptyStringSchema.optional()
  })
]);
const exampleCaseSchema = z.object({
  title: nonEmptyStringSchema.optional(),
  blocks: z.array(simpleContentBlockSchema).min(1)
});
const contentBlockSchema = z.union([
  simpleContentBlockSchema,
  z.object({
    kind: z.literal("example"),
    title: nonEmptyStringSchema.optional(),
    blocks: z.array(simpleContentBlockSchema).min(1)
  }),
  z.object({
    kind: z.literal("good_bad_examples"),
    good: z.array(exampleCaseSchema).min(1),
    bad: z.array(exampleCaseSchema).min(1)
  })
]);

export const roleSchema = z.object({
  id: idSchema,
  name: nonEmptyStringSchema,
  purpose: nonEmptyStringSchema,
  boundaries: z.array(nonEmptyStringSchema).optional()
}) satisfies z.ZodType<RoleInput>;

export const workflowStepSchema = z
  .object({
    id: idSchema,
    roleId: idSchema,
    purpose: nonEmptyStringSchema,
    requiredInputIds: z.array(idSchema),
    supportInputIds: z.array(idSchema).optional(),
    interimArtifactIds: z.array(idSchema).optional(),
    requiredOutputIds: z.array(idSchema).min(1),
    stopLine: nonEmptyStringSchema,
    nextStepId: idSchema.optional(),
    nextGateId: idSchema.optional()
  })
  .refine((value) => !(value.nextStepId && value.nextGateId), {
    message: "A workflow step may route to either nextStepId or nextGateId, not both."
  }) satisfies z.ZodType<WorkflowStepInput>;

export const reviewGateSchema = z.object({
  id: idSchema,
  name: nonEmptyStringSchema,
  purpose: nonEmptyStringSchema,
  checkIds: z.array(idSchema).min(1)
}) satisfies z.ZodType<ReviewGateInput>;

export const packetContractSchema = z.object({
  id: idSchema,
  name: nonEmptyStringSchema,
  conceptualArtifactIds: z.array(idSchema).min(1),
  runtimeArtifactIds: z.array(idSchema).optional()
}) satisfies z.ZodType<PacketContractInput>;

export const registryEntryRefSchema = z.object({
  registryId: idSchema,
  entryId: idSchema
}) satisfies z.ZodType<RegistryEntryRefInput>;

export const artifactEvidenceClaimSchema = z
  .object({
    id: idSchema,
    label: nonEmptyStringSchema,
    description: nonEmptyStringSchema.optional(),
    allowedValue: registryEntryRefSchema.optional()
  })
  .strict() satisfies z.ZodType<ArtifactEvidenceClaimInput>;

export const artifactEvidenceSchema = z
  .object({
    requiredArtifactIds: z.array(idSchema).min(1).optional(),
    requiredClaims: z.array(artifactEvidenceClaimSchema).min(1).optional()
  })
  .strict()
  .refine((value) => value.requiredArtifactIds !== undefined || value.requiredClaims !== undefined, {
    message: "Artifact evidence must declare requiredArtifactIds, requiredClaims, or both."
  }) satisfies z.ZodType<ArtifactEvidenceInput>;

export const registryEntrySchema = z
  .object({
    id: idSchema,
    label: nonEmptyStringSchema,
    description: nonEmptyStringSchema.optional()
  })
  .strict() satisfies z.ZodType<RegistryEntryInput>;

export const catalogEntrySchema = z
  .object({
    id: idSchema,
    display: nonEmptyStringSchema,
    description: nonEmptyStringSchema.optional()
  })
  .strict() satisfies z.ZodType<CatalogEntryInput>;

export const catalogSchema = z
  .object({
    kind: z.enum(["command"]),
    entries: z.array(catalogEntrySchema).min(1)
  })
  .strict() satisfies z.ZodType<CatalogInput>;

export const registrySchema = z
  .object({
    id: idSchema,
    name: nonEmptyStringSchema,
    description: nonEmptyStringSchema.optional(),
    entries: z.array(registryEntrySchema).min(1)
  })
  .strict() satisfies z.ZodType<RegistryInput>;

export const artifactSchema = z.object({
  id: idSchema,
  name: nonEmptyStringSchema,
  artifactClass: z.enum(["required", "conditional", "support", "reference", "legacy"]),
  runtimePath: nonEmptyStringSchema.optional(),
  conceptualOnly: z.boolean().optional(),
  compatibilityOnly: z.boolean().optional(),
  evidence: artifactEvidenceSchema.optional()
}) satisfies z.ZodType<ArtifactInput>;

export const surfaceSchema = z.object({
  id: idSchema,
  surfaceClass: z.enum([
    "role_home",
    "project_home_root",
    "shared_entrypoint",
    "workflow_owner",
    "packet_workflow",
    "standard",
    "gate",
    "technical_reference",
    "how_to",
    "coordination"
  ]),
  runtimePath: nonEmptyStringSchema,
  title: nonEmptyStringSchema.optional(),
  intro: z.array(contentBlockSchema).optional(),
  preamble: z.array(contentBlockSchema).optional(),
  requiredSectionSlugs: z.array(sectionSlugSchema).min(1).optional()
}) satisfies z.ZodType<SurfaceInput>;

export const surfaceSectionSchema = z.object({
  id: idSchema,
  surfaceId: idSchema,
  stableSlug: sectionSlugSchema,
  title: nonEmptyStringSchema,
  parentSectionId: idSchema.optional(),
  body: z.array(contentBlockSchema).optional()
}).refine((value) => value.parentSectionId !== value.id, {
  message: "A surface section may not parent itself."
}) satisfies z.ZodType<SurfaceSectionInput>;

export const referenceSchema = z.object({
  id: idSchema,
  referenceClass: z.enum([
    "runtime_reference",
    "support_reference",
    "grounding_reference",
    "imported_reference",
    "external_reference"
  ]),
  name: nonEmptyStringSchema,
  sourcePath: nonEmptyStringSchema.optional(),
  url: z.string().url().optional()
}) satisfies z.ZodType<ReferenceInput>;

export const generatedTargetSchema = z.object({
  id: idSchema,
  path: nonEmptyStringSchema,
  sourceIds: z.array(idSchema).min(1),
  sectionId: idSchema.optional()
}) satisfies z.ZodType<GeneratedTargetInput>;

function basicLinkSchema<const TKind extends Exclude<LinkInput["kind"], "reads">>(kind: TKind) {
  return z
    .object({
      id: idSchema,
      kind: z.literal(kind),
      from: idSchema,
      to: idSchema
    })
    .strict();
}

export const linkSchema = z.union([
  z
    .object({
      id: idSchema,
      kind: z.literal("reads"),
      from: idSchema,
      to: idSchema,
      condition: nonEmptyStringSchema.optional(),
      context: nonEmptyStringSchema.optional()
    })
    .strict(),
  basicLinkSchema("owns"),
  basicLinkSchema("produces"),
  basicLinkSchema("consumes"),
  basicLinkSchema("supports"),
  basicLinkSchema("checks"),
  basicLinkSchema("routes_to"),
  basicLinkSchema("documents"),
  basicLinkSchema("grounds"),
  basicLinkSchema("references"),
  basicLinkSchema("maps_to_runtime"),
  basicLinkSchema("generated_from")
]) satisfies z.ZodType<LinkInput>;

export const setupSchema = z.object({
  id: idSchema,
  name: nonEmptyStringSchema,
  description: nonEmptyStringSchema.optional(),
  catalogs: z.array(catalogSchema).optional(),
  registries: z.array(registrySchema).optional(),
  roles: z.array(roleSchema).optional(),
  workflowSteps: z.array(workflowStepSchema).optional(),
  reviewGates: z.array(reviewGateSchema).optional(),
  packetContracts: z.array(packetContractSchema).optional(),
  artifacts: z.array(artifactSchema).optional(),
  surfaces: z.array(surfaceSchema).optional(),
  surfaceSections: z.array(surfaceSectionSchema).optional(),
  references: z.array(referenceSchema).optional(),
  generatedTargets: z.array(generatedTargetSchema).optional(),
  links: z.array(linkSchema).optional()
}) satisfies z.ZodType<SetupInput>;

export type ValidationResult<T> = { success: true; data: T } | { success: false; diagnostics: Diagnostic[] };

export function issuesToDiagnostics(issues: z.ZodIssue[]): Diagnostic[] {
  return issues.map((issue, index) =>
    createDiagnostic({
      code: `source.validation_${index}`,
      severity: "error",
      phase: "source",
      message: issue.message,
      path: issue.path.map(String)
    })
  );
}

export function validateWithSchema<T>(schema: z.ZodType<T>, value: unknown): ValidationResult<T> {
  const result = schema.safeParse(value);
  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    diagnostics: issuesToDiagnostics(result.error.issues)
  };
}
