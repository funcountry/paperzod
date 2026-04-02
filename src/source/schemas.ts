import { z } from "zod";

import type { Diagnostic } from "../core/diagnostics.js";
import { createDiagnostic } from "../core/diagnostics.js";
import type {
  ArtifactInput,
  GeneratedTargetInput,
  LinkInput,
  PacketContractInput,
  ReferenceInput,
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

export const artifactSchema = z.object({
  id: idSchema,
  name: nonEmptyStringSchema,
  artifactClass: z.enum(["required", "conditional", "support", "reference", "legacy"]),
  runtimePath: nonEmptyStringSchema.optional(),
  conceptualOnly: z.boolean().optional(),
  compatibilityOnly: z.boolean().optional()
}) satisfies z.ZodType<ArtifactInput>;

export const surfaceSchema = z.object({
  id: idSchema,
  surfaceClass: z.enum([
    "role_home",
    "shared_entrypoint",
    "workflow_owner",
    "packet_workflow",
    "standard",
    "gate",
    "technical_reference",
    "how_to",
    "coordination"
  ]),
  runtimePath: nonEmptyStringSchema
}) satisfies z.ZodType<SurfaceInput>;

export const surfaceSectionSchema = z.object({
  id: idSchema,
  surfaceId: idSchema,
  stableSlug: sectionSlugSchema,
  title: nonEmptyStringSchema
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

export const linkSchema = z.object({
  id: idSchema,
  kind: z.enum([
    "owns",
    "reads",
    "produces",
    "consumes",
    "supports",
    "checks",
    "routes_to",
    "documents",
    "grounds",
    "references",
    "maps_to_runtime",
    "generated_from"
  ]),
  from: idSchema,
  to: idSchema
}) satisfies z.ZodType<LinkInput>;

export const setupSchema = z.object({
  id: idSchema,
  name: nonEmptyStringSchema,
  description: nonEmptyStringSchema.optional(),
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
