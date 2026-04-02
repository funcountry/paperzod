import type { DoctrineNodeDef, LinkDef, LinkKind, SetupMetaDef } from "./defs.js";

export interface DoctrineGraphIndexes {
  roleIdByWorkflowStepId: Record<string, string>;
  workflowStepIdsByRoleId: Record<string, string[]>;
  ownerIdsByNodeId: Record<string, string[]>;
  ownedNodeIdsByOwnerId: Record<string, string[]>;
  readTargetIdsByReaderId: Record<string, string[]>;
  readerIdsByReadTargetId: Record<string, string[]>;
  readSectionIdsByReaderId: Record<string, string[]>;
  readerIdsBySectionId: Record<string, string[]>;
  readSurfaceIdsByReaderId: Record<string, string[]>;
  readerIdsBySurfaceId: Record<string, string[]>;
  producerIdsByArtifactId: Record<string, string[]>;
  consumerIdsByArtifactId: Record<string, string[]>;
  supporterIdsByArtifactId: Record<string, string[]>;
  checkerIdsByArtifactId: Record<string, string[]>;
  checkerIdsByNodeId: Record<string, string[]>;
  checkedNodeIdsByCheckerId: Record<string, string[]>;
  routeTargetIdsByNodeId: Record<string, string[]>;
  routeSourceIdsByNodeId: Record<string, string[]>;
  surfaceSectionIdsBySurfaceId: Record<string, string[]>;
  rootSectionIdsBySurfaceId: Record<string, string[]>;
  childSectionIdsBySectionId: Record<string, string[]>;
  surfaceIdBySectionId: Record<string, string>;
  parentSectionIdBySectionId: Record<string, string>;
  documentedByNodeId: Record<string, string[]>;
  groundingReferenceIdsByNodeId: Record<string, string[]>;
  referenceIdsByNodeId: Record<string, string[]>;
  runtimeMappingIdsBySourceId: Record<string, string[]>;
  generatedSourceIdsByTargetId: Record<string, string[]>;
  generatedTargetIdsBySourceId: Record<string, string[]>;
}

export interface DoctrineGraph {
  setup: SetupMetaDef;
  nodes: DoctrineNodeDef[];
  nodeById: Record<string, DoctrineNodeDef>;
  nodeIdsByKind: Record<DoctrineNodeDef["kind"], string[]>;
  links: LinkDef[];
  linkById: Record<string, LinkDef>;
  linkIdsByKind: Record<LinkKind, string[]>;
  outgoingLinkIdsByNodeId: Record<string, string[]>;
  incomingLinkIdsByNodeId: Record<string, string[]>;
  indexes: DoctrineGraphIndexes;
}
