import type {
  AuthoredContentBlock,
  ArtifactClass,
  LinkKind,
  ReferenceClass,
  SurfaceClass
} from "../core/defs.js";

export interface RoleInput {
  id: string;
  name: string;
  purpose: string;
  boundaries?: string[] | undefined;
}

export interface WorkflowStepInput {
  id: string;
  roleId: string;
  purpose: string;
  requiredInputIds: string[];
  supportInputIds?: string[] | undefined;
  interimArtifactIds?: string[] | undefined;
  requiredOutputIds: string[];
  stopLine: string;
  nextStepId?: string | undefined;
  nextGateId?: string | undefined;
}

export interface ReviewGateInput {
  id: string;
  name: string;
  purpose: string;
  checkIds: string[];
}

export interface PacketContractInput {
  id: string;
  name: string;
  conceptualArtifactIds: string[];
  runtimeArtifactIds?: string[] | undefined;
}

export interface ArtifactInput {
  id: string;
  name: string;
  artifactClass: ArtifactClass;
  runtimePath?: string | undefined;
  conceptualOnly?: boolean | undefined;
  compatibilityOnly?: boolean | undefined;
}

export interface SurfaceInput {
  id: string;
  surfaceClass: SurfaceClass;
  runtimePath: string;
  preamble?: AuthoredContentBlock[] | undefined;
}

export interface SurfaceSectionInput {
  id: string;
  surfaceId: string;
  stableSlug: string;
  title: string;
  parentSectionId?: string | undefined;
  body?: AuthoredContentBlock[] | undefined;
}

export interface ReferenceInput {
  id: string;
  referenceClass: ReferenceClass;
  name: string;
  sourcePath?: string | undefined;
  url?: string | undefined;
}

export interface GeneratedTargetInput {
  id: string;
  path: string;
  sourceIds: string[];
  sectionId?: string | undefined;
}

export interface BaseLinkInput {
  id: string;
  from: string;
  to: string;
}

export interface ReadLinkInput extends BaseLinkInput {
  kind: "reads";
  condition?: string | undefined;
  context?: string | undefined;
}

export interface GenericLinkInput extends BaseLinkInput {
  kind: Exclude<LinkKind, "reads">;
}

export type LinkInput = GenericLinkInput | ReadLinkInput;

export interface SetupInput {
  id: string;
  name: string;
  description?: string | undefined;
  roles?: RoleInput[] | undefined;
  workflowSteps?: WorkflowStepInput[] | undefined;
  reviewGates?: ReviewGateInput[] | undefined;
  packetContracts?: PacketContractInput[] | undefined;
  artifacts?: ArtifactInput[] | undefined;
  surfaces?: SurfaceInput[] | undefined;
  surfaceSections?: SurfaceSectionInput[] | undefined;
  references?: ReferenceInput[] | undefined;
  generatedTargets?: GeneratedTargetInput[] | undefined;
  links?: LinkInput[] | undefined;
}

export function defineSetup<const T extends SetupInput>(setup: T): T {
  return setup;
}

export function defineRole<const T extends RoleInput>(role: T): T {
  return role;
}

export function defineWorkflowStep<const T extends WorkflowStepInput>(step: T): T {
  return step;
}

export function defineSurface<const T extends SurfaceInput>(surface: T): T {
  return surface;
}
