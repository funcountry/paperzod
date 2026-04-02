import type {
  ArtifactDef,
  GeneratedTargetDef,
  LinkDef,
  PacketContractDef,
  ReferenceDef,
  ReviewGateDef,
  RoleDef,
  SetupDef,
  SetupMetaDef,
  SurfaceDef,
  SurfaceSectionDef,
  WorkflowStepDef
} from "../core/defs.js";
import type { ValidationResult } from "./schemas.js";
import { setupSchema, validateWithSchema } from "./schemas.js";
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

function normalizeSetupMeta(input: SetupInput): SetupMetaDef {
  return {
    kind: "setup",
    id: input.id,
    name: input.name,
    ...(input.description ? { description: input.description } : {})
  };
}

function normalizeRoles(setupId: string, roles: readonly RoleInput[]): RoleDef[] {
  return roles.map((role) => ({
    kind: "role",
    id: role.id,
    setupId,
    name: role.name,
    purpose: role.purpose,
    ...(role.boundaries ? { boundaries: role.boundaries } : {})
  }));
}

function normalizeWorkflowSteps(setupId: string, steps: readonly WorkflowStepInput[]): WorkflowStepDef[] {
  return steps.map((step) => ({
    kind: "workflow_step",
    id: step.id,
    setupId,
    roleId: step.roleId,
    purpose: step.purpose,
    requiredInputIds: step.requiredInputIds,
    ...(step.supportInputIds ? { supportInputIds: step.supportInputIds } : {}),
    ...(step.interimArtifactIds ? { interimArtifactIds: step.interimArtifactIds } : {}),
    requiredOutputIds: step.requiredOutputIds,
    stopLine: step.stopLine,
    ...(step.nextStepId ? { nextStepId: step.nextStepId } : {}),
    ...(step.nextGateId ? { nextGateId: step.nextGateId } : {})
  }));
}

function normalizeReviewGates(setupId: string, gates: readonly ReviewGateInput[]): ReviewGateDef[] {
  return gates.map((gate) => ({
    kind: "review_gate",
    id: gate.id,
    setupId,
    name: gate.name,
    purpose: gate.purpose,
    checkIds: gate.checkIds
  }));
}

function normalizePacketContracts(setupId: string, contracts: readonly PacketContractInput[]): PacketContractDef[] {
  return contracts.map((contract) => ({
    kind: "packet_contract",
    id: contract.id,
    setupId,
    name: contract.name,
    conceptualArtifactIds: contract.conceptualArtifactIds,
    ...(contract.runtimeArtifactIds ? { runtimeArtifactIds: contract.runtimeArtifactIds } : {})
  }));
}

function normalizeArtifacts(setupId: string, artifacts: readonly ArtifactInput[]): ArtifactDef[] {
  return artifacts.map((artifact) => ({
    kind: "artifact",
    id: artifact.id,
    setupId,
    name: artifact.name,
    artifactClass: artifact.artifactClass,
    ...(artifact.runtimePath ? { runtimePath: artifact.runtimePath } : {}),
    ...(artifact.conceptualOnly !== undefined ? { conceptualOnly: artifact.conceptualOnly } : {}),
    ...(artifact.compatibilityOnly !== undefined ? { compatibilityOnly: artifact.compatibilityOnly } : {})
  }));
}

function normalizeSurfaces(setupId: string, surfaces: readonly SurfaceInput[]): SurfaceDef[] {
  return surfaces.map((surface) => ({
    kind: "surface",
    id: surface.id,
    setupId,
    surfaceClass: surface.surfaceClass,
    runtimePath: surface.runtimePath,
    ...(surface.title !== undefined ? { title: surface.title } : {}),
    ...(surface.intro !== undefined ? { intro: surface.intro } : {}),
    ...(surface.preamble !== undefined ? { preamble: surface.preamble } : {})
  }));
}

function normalizeSurfaceSections(setupId: string, sections: readonly SurfaceSectionInput[]): SurfaceSectionDef[] {
  return sections.map((section) => ({
    kind: "surface_section",
    id: section.id,
    setupId,
    surfaceId: section.surfaceId,
    stableSlug: section.stableSlug,
    title: section.title,
    ...(section.parentSectionId !== undefined ? { parentSectionId: section.parentSectionId } : {}),
    ...(section.body !== undefined ? { body: section.body } : {})
  }));
}

function normalizeReferences(setupId: string, references: readonly ReferenceInput[]): ReferenceDef[] {
  return references.map((reference) => ({
    kind: "reference",
    id: reference.id,
    setupId,
    referenceClass: reference.referenceClass,
    name: reference.name,
    ...(reference.sourcePath ? { sourcePath: reference.sourcePath } : {}),
    ...(reference.url ? { url: reference.url } : {})
  }));
}

function normalizeGeneratedTargets(setupId: string, targets: readonly GeneratedTargetInput[]): GeneratedTargetDef[] {
  return targets.map((target) => ({
    kind: "generated_target",
    id: target.id,
    setupId,
    path: target.path,
    sourceIds: target.sourceIds,
    ...(target.sectionId ? { sectionId: target.sectionId } : {})
  }));
}

function normalizeLinks(setupId: string, links: readonly LinkInput[]): LinkDef[] {
  return links.map((link) => ({
    id: link.id,
    setupId,
    kind: link.kind,
    from: link.from,
    to: link.to,
    ...(link.kind === "reads" && link.condition !== undefined ? { condition: link.condition } : {}),
    ...(link.kind === "reads" && link.context !== undefined ? { context: link.context } : {})
  }));
}

export function normalizeSetup(input: unknown): ValidationResult<SetupDef> {
  const validated = validateWithSchema(setupSchema, input);
  if (!validated.success) {
    return validated;
  }

  const setup = validated.data;
  const setupId = setup.id;

  return {
    success: true,
    data: {
      setup: normalizeSetupMeta(setup),
      roles: normalizeRoles(setupId, setup.roles ?? []),
      workflowSteps: normalizeWorkflowSteps(setupId, setup.workflowSteps ?? []),
      reviewGates: normalizeReviewGates(setupId, setup.reviewGates ?? []),
      packetContracts: normalizePacketContracts(setupId, setup.packetContracts ?? []),
      artifacts: normalizeArtifacts(setupId, setup.artifacts ?? []),
      surfaces: normalizeSurfaces(setupId, setup.surfaces ?? []),
      surfaceSections: normalizeSurfaceSections(setupId, setup.surfaceSections ?? []),
      references: normalizeReferences(setupId, setup.references ?? []),
      generatedTargets: normalizeGeneratedTargets(setupId, setup.generatedTargets ?? []),
      links: normalizeLinks(setupId, setup.links ?? [])
    }
  };
}
