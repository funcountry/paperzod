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
  | "project_home_root"
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
export type CatalogKind = "command" | "env_var";

export interface CatalogEntryDef {
  id: string;
  display: string;
  description?: string;
}

export interface CatalogDef {
  kind: CatalogKind;
  entries: CatalogEntryDef[];
}

export interface RegistryEntryRefDef {
  registryId: string;
  entryId: string;
}

export interface RegistryEntryDef {
  id: string;
  label: string;
  description?: string;
}

export interface RegistryDef {
  id: string;
  name: string;
  description?: string;
  entries: RegistryEntryDef[];
}

export interface ArtifactEvidenceClaimDef {
  id: string;
  label: string;
  description?: string;
  allowedValue?: RegistryEntryRefDef;
}

export interface ArtifactEvidenceDef {
  requiredArtifactIds?: string[];
  requiredClaims?: ArtifactEvidenceClaimDef[];
}

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

export interface AuthoredNodeInlineRefDef {
  kind: "ref";
  refKind: "artifact" | "surface" | "role" | "review_gate" | "packet_contract" | "reference";
  id: string;
}

export interface AuthoredSectionInlineRefDef {
  kind: "ref";
  refKind: "section";
  surfaceId: string;
  stableSlug: string;
}

export interface AuthoredCatalogInlineRefDef {
  kind: "ref";
  refKind: "catalog_entry";
  catalogKind: CatalogKind;
  entryId: string;
}

export type AuthoredInlineRefDef =
  | AuthoredNodeInlineRefDef
  | AuthoredSectionInlineRefDef
  | AuthoredCatalogInlineRefDef;

export type AuthoredInlineTextSegmentDef = string | AuthoredInlineRefDef;
export type AuthoredInlineTextDef = string | AuthoredInlineTextSegmentDef[];

export interface AuthoredListItem {
  text: AuthoredInlineTextDef;
  children?: AuthoredListEntry[] | undefined;
}

export type AuthoredListEntry = AuthoredInlineTextDef | AuthoredListItem;

export interface AuthoredDefinitionListItem {
  term: AuthoredInlineTextDef;
  definitions: AuthoredListEntry[];
}

export type AuthoredSimpleContentBlock =
  | {
      kind: "paragraph";
      text: AuthoredInlineTextDef;
    }
  | {
      kind: "unordered_list";
      items: AuthoredListEntry[];
    }
  | {
      kind: "ordered_list";
      items: AuthoredListEntry[];
    }
  | {
      kind: "ordered_steps";
      items: AuthoredListEntry[];
    }
  | {
      kind: "rule_list";
      items: AuthoredListEntry[];
    }
  | {
      kind: "definition_list";
      items: AuthoredDefinitionListItem[];
    }
  | {
      kind: "table";
      headers: string[];
      rows: string[][];
    }
  | {
      kind: "code_block";
      code: string;
      language?: string | undefined;
    };

export interface AuthoredExampleCase {
  title?: string | undefined;
  blocks: AuthoredSimpleContentBlock[];
}

export type AuthoredContentBlock =
  | AuthoredSimpleContentBlock
  | {
      kind: "example";
      title?: string | undefined;
      blocks: AuthoredSimpleContentBlock[];
    }
  | {
      kind: "good_bad_examples";
      good: AuthoredExampleCase[];
      bad: AuthoredExampleCase[];
    };

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
  evidence?: ArtifactEvidenceDef;
}

export interface SurfaceDef {
  kind: "surface";
  id: string;
  setupId: string;
  surfaceClass: SurfaceClass;
  runtimePath: string;
  title?: string;
  intro?: AuthoredContentBlock[];
  preamble?: AuthoredContentBlock[];
  requiredSectionSlugs?: string[];
}

export interface SurfaceSectionDef {
  kind: "surface_section";
  id: string;
  setupId: string;
  surfaceId: string;
  stableSlug: string;
  title: string;
  parentSectionId?: string | undefined;
  body?: AuthoredContentBlock[];
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

export interface BaseLinkDef {
  id: string;
  setupId: string;
  from: string;
  to: string;
}

export interface ReadLinkDef extends BaseLinkDef {
  kind: "reads";
  condition?: string | undefined;
  context?: string | undefined;
}

export interface GenericLinkDef extends BaseLinkDef {
  kind: Exclude<LinkKind, "reads">;
}

export type LinkDef = GenericLinkDef | ReadLinkDef;

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
  catalogs: CatalogDef[];
  registries: RegistryDef[];
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
