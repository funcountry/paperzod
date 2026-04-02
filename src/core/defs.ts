export type NodeKind =
  | "setup"
  | "role"
  | "workflow_step"
  | "review_gate"
  | "packet_contract"
  | "artifact"
  | "surface"
  | "surface_section"
  | "reference"
  | "generated_target";

export type SurfaceClass =
  | "role_home"
  | "shared_entrypoint"
  | "workflow_owner"
  | "packet_workflow"
  | "standard"
  | "gate"
  | "technical_reference"
  | "how_to"
  | "coordination";

export type ReferenceClass =
  | "runtime_reference"
  | "support_reference"
  | "grounding_reference"
  | "imported_reference"
  | "external_reference";

export type ArtifactClass = "required" | "conditional" | "support" | "reference" | "legacy";

export type LinkKind =
  | "owns"
  | "reads"
  | "produces"
  | "consumes"
  | "supports"
  | "checks"
  | "routes_to"
  | "documents"
  | "grounds"
  | "references"
  | "maps_to_runtime"
  | "generated_from";

export interface SetupMetaDef {
  kind: "setup";
  id: string;
  name: string;
  description?: string;
}

export interface RoleDef {
  kind: "role";
  id: string;
  setupId: string;
  name: string;
  purpose: string;
  boundaries?: string[];
}

export interface WorkflowStepDef {
  kind: "workflow_step";
  id: string;
  setupId: string;
  roleId: string;
  purpose: string;
  requiredInputIds: string[];
  supportInputIds?: string[];
  interimArtifactIds?: string[];
  requiredOutputIds: string[];
  stopLine: string;
  nextStepId?: string;
  nextGateId?: string;
}

export interface ReviewGateDef {
  kind: "review_gate";
  id: string;
  setupId: string;
  name: string;
  purpose: string;
  checkIds: string[];
}

export interface PacketContractDef {
  kind: "packet_contract";
  id: string;
  setupId: string;
  name: string;
  conceptualArtifactIds: string[];
  runtimeArtifactIds?: string[];
}

export interface ArtifactDef {
  kind: "artifact";
  id: string;
  setupId: string;
  name: string;
  artifactClass: ArtifactClass;
  runtimePath?: string;
  conceptualOnly?: boolean;
  compatibilityOnly?: boolean;
}

export interface SurfaceDef {
  kind: "surface";
  id: string;
  setupId: string;
  surfaceClass: SurfaceClass;
  runtimePath: string;
}

export interface SurfaceSectionDef {
  kind: "surface_section";
  id: string;
  setupId: string;
  surfaceId: string;
  stableSlug: string;
  title: string;
}

export interface ReferenceDef {
  kind: "reference";
  id: string;
  setupId: string;
  referenceClass: ReferenceClass;
  name: string;
  sourcePath?: string;
  url?: string;
}

export interface GeneratedTargetDef {
  kind: "generated_target";
  id: string;
  setupId: string;
  path: string;
  sourceIds: string[];
  sectionId?: string;
}

export interface LinkDef {
  id: string;
  setupId: string;
  kind: LinkKind;
  from: string;
  to: string;
}

export type DoctrineNodeDef =
  | RoleDef
  | WorkflowStepDef
  | ReviewGateDef
  | PacketContractDef
  | ArtifactDef
  | SurfaceDef
  | SurfaceSectionDef
  | ReferenceDef
  | GeneratedTargetDef;

export interface SetupDef {
  setup: SetupMetaDef;
  roles: RoleDef[];
  workflowSteps: WorkflowStepDef[];
  reviewGates: ReviewGateDef[];
  packetContracts: PacketContractDef[];
  artifacts: ArtifactDef[];
  surfaces: SurfaceDef[];
  surfaceSections: SurfaceSectionDef[];
  references: ReferenceDef[];
  generatedTargets: GeneratedTargetDef[];
  links: LinkDef[];
}
