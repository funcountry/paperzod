import type { DoctrineGraph, DoctrineGraphIndexes } from "../core/graph.js";
import type { DoctrineNodeDef, LinkDef, SetupDef } from "../core/index.js";

function addToIndex(
  index: Record<string, string[]>,
  key: string,
  value: string,
  options?: { preserveOrder?: boolean | undefined }
): void {
  const values = index[key] ?? [];
  if (!values.includes(value)) {
    values.push(value);
    if (!options?.preserveOrder) {
      values.sort();
    }
  }
  index[key] = values;
}

function buildNodeById(nodes: readonly DoctrineNodeDef[]): Record<string, DoctrineNodeDef> {
  return Object.fromEntries(nodes.map((node) => [node.id, node]));
}

function isArtifactNode(node: DoctrineNodeDef | undefined): node is Extract<DoctrineNodeDef, { kind: "artifact" }> {
  return node?.kind === "artifact";
}

function isSurfaceNode(node: DoctrineNodeDef | undefined): node is Extract<DoctrineNodeDef, { kind: "surface" }> {
  return node?.kind === "surface";
}

function isSurfaceSectionNode(node: DoctrineNodeDef | undefined): node is Extract<DoctrineNodeDef, { kind: "surface_section" }> {
  return node?.kind === "surface_section";
}

export function buildGraphIndexes(setup: SetupDef, links: readonly LinkDef[]): DoctrineGraphIndexes {
  const nodes = [
    ...setup.roles,
    ...setup.workflowSteps,
    ...setup.reviewGates,
    ...setup.packetContracts,
    ...setup.artifacts,
    ...setup.surfaces,
    ...setup.surfaceSections,
    ...setup.references,
    ...setup.generatedTargets
  ] satisfies DoctrineNodeDef[];
  const nodeById = buildNodeById(nodes);

  const indexes: DoctrineGraphIndexes = {
    roleIdByWorkflowStepId: {},
    workflowStepIdsByRoleId: {},
    ownerIdsByNodeId: {},
    ownedNodeIdsByOwnerId: {},
    readTargetIdsByReaderId: {},
    readerIdsByReadTargetId: {},
    readSectionIdsByReaderId: {},
    readerIdsBySectionId: {},
    readSurfaceIdsByReaderId: {},
    readerIdsBySurfaceId: {},
    producerIdsByArtifactId: {},
    consumerIdsByArtifactId: {},
    supporterIdsByArtifactId: {},
    checkerIdsByArtifactId: {},
    checkerIdsByNodeId: {},
    checkedNodeIdsByCheckerId: {},
    routeTargetIdsByNodeId: {},
    routeSourceIdsByNodeId: {},
    surfaceSectionIdsBySurfaceId: {},
    rootSectionIdsBySurfaceId: {},
    childSectionIdsBySectionId: {},
    surfaceIdBySectionId: {},
    parentSectionIdBySectionId: {},
    sectionIdBySurfaceIdAndStableSlug: {},
    documentedByNodeId: {},
    groundingReferenceIdsByNodeId: {},
    referenceIdsByNodeId: {},
    runtimeMappingIdsBySourceId: {},
    generatedSourceIdsByTargetId: {},
    generatedTargetIdsBySourceId: {}
  };

  for (const step of setup.workflowSteps) {
    indexes.roleIdByWorkflowStepId[step.id] = step.roleId;
    addToIndex(indexes.workflowStepIdsByRoleId, step.roleId, step.id);

    for (const artifactId of step.requiredOutputIds) {
      addToIndex(indexes.producerIdsByArtifactId, artifactId, step.id);
    }

    for (const artifactId of step.requiredInputIds) {
      addToIndex(indexes.consumerIdsByArtifactId, artifactId, step.id);
    }

    for (const artifactId of step.supportInputIds ?? []) {
      addToIndex(indexes.supporterIdsByArtifactId, artifactId, step.id);
    }

    for (const artifactId of step.interimArtifactIds ?? []) {
      addToIndex(indexes.supporterIdsByArtifactId, artifactId, step.id);
    }

    if (step.nextStepId) {
      addToIndex(indexes.routeTargetIdsByNodeId, step.id, step.nextStepId);
      addToIndex(indexes.routeSourceIdsByNodeId, step.nextStepId, step.id);
    }

    if (step.nextGateId) {
      addToIndex(indexes.routeTargetIdsByNodeId, step.id, step.nextGateId);
      addToIndex(indexes.routeSourceIdsByNodeId, step.nextGateId, step.id);
    }
  }

  for (const gate of setup.reviewGates) {
    for (const checkId of gate.checkIds) {
      addToIndex(indexes.checkerIdsByNodeId, checkId, gate.id);
      addToIndex(indexes.checkedNodeIdsByCheckerId, gate.id, checkId);

      if (isArtifactNode(nodeById[checkId])) {
        addToIndex(indexes.checkerIdsByArtifactId, checkId, gate.id);
      }
    }
  }

  for (const section of setup.surfaceSections) {
    addToIndex(indexes.surfaceSectionIdsBySurfaceId, section.surfaceId, section.id, { preserveOrder: true });
    indexes.surfaceIdBySectionId[section.id] = section.surfaceId;
    indexes.sectionIdBySurfaceIdAndStableSlug[section.surfaceId] ??= {};
    indexes.sectionIdBySurfaceIdAndStableSlug[section.surfaceId]![section.stableSlug] ??= section.id;
    if (section.parentSectionId) {
      addToIndex(indexes.childSectionIdsBySectionId, section.parentSectionId, section.id, { preserveOrder: true });
      indexes.parentSectionIdBySectionId[section.id] = section.parentSectionId;
    } else {
      addToIndex(indexes.rootSectionIdsBySurfaceId, section.surfaceId, section.id, { preserveOrder: true });
    }
  }

  for (const target of setup.generatedTargets) {
    for (const sourceId of target.sourceIds) {
      addToIndex(indexes.generatedSourceIdsByTargetId, target.id, sourceId);
      addToIndex(indexes.generatedTargetIdsBySourceId, sourceId, target.id);
    }
  }

  for (const link of links) {
    switch (link.kind) {
      case "owns":
        addToIndex(indexes.ownerIdsByNodeId, link.to, link.from);
        addToIndex(indexes.ownedNodeIdsByOwnerId, link.from, link.to);
        break;
      case "reads":
        addToIndex(indexes.readTargetIdsByReaderId, link.from, link.to, { preserveOrder: true });
        addToIndex(indexes.readerIdsByReadTargetId, link.to, link.from, { preserveOrder: true });
        if (isSurfaceSectionNode(nodeById[link.to])) {
          addToIndex(indexes.readSectionIdsByReaderId, link.from, link.to, { preserveOrder: true });
          addToIndex(indexes.readerIdsBySectionId, link.to, link.from, { preserveOrder: true });
        }
        if (isSurfaceNode(nodeById[link.to])) {
          addToIndex(indexes.readSurfaceIdsByReaderId, link.from, link.to, { preserveOrder: true });
          addToIndex(indexes.readerIdsBySurfaceId, link.to, link.from, { preserveOrder: true });
        }
        break;
      case "produces":
        if (isArtifactNode(nodeById[link.to])) {
          addToIndex(indexes.producerIdsByArtifactId, link.to, link.from);
        }
        break;
      case "consumes":
        if (isArtifactNode(nodeById[link.to])) {
          addToIndex(indexes.consumerIdsByArtifactId, link.to, link.from);
        }
        break;
      case "supports":
        if (isArtifactNode(nodeById[link.to])) {
          addToIndex(indexes.supporterIdsByArtifactId, link.to, link.from);
        }
        break;
      case "checks":
        addToIndex(indexes.checkerIdsByNodeId, link.to, link.from);
        addToIndex(indexes.checkedNodeIdsByCheckerId, link.from, link.to);
        if (isArtifactNode(nodeById[link.to])) {
          addToIndex(indexes.checkerIdsByArtifactId, link.to, link.from);
        }
        break;
      case "routes_to":
        addToIndex(indexes.routeTargetIdsByNodeId, link.from, link.to);
        addToIndex(indexes.routeSourceIdsByNodeId, link.to, link.from);
        break;
      case "documents":
        addToIndex(indexes.documentedByNodeId, link.to, link.from);
        break;
      case "grounds":
        addToIndex(indexes.groundingReferenceIdsByNodeId, link.from, link.to);
        break;
      case "references":
        addToIndex(indexes.referenceIdsByNodeId, link.from, link.to);
        break;
      case "maps_to_runtime":
        addToIndex(indexes.runtimeMappingIdsBySourceId, link.from, link.to);
        break;
      case "generated_from":
        addToIndex(indexes.generatedSourceIdsByTargetId, link.from, link.to);
        addToIndex(indexes.generatedTargetIdsBySourceId, link.to, link.from);
        break;
      default:
        break;
    }
  }

  return indexes;
}

export function summarizeGraphIndexes(graph: DoctrineGraph): Record<string, unknown> {
  return {
    nodeCount: graph.nodes.length,
    linkCount: graph.links.length,
    roleIdByWorkflowStepId: graph.indexes.roleIdByWorkflowStepId,
    readTargetIdsByReaderId: graph.indexes.readTargetIdsByReaderId,
    readSectionIdsByReaderId: graph.indexes.readSectionIdsByReaderId,
    readSurfaceIdsByReaderId: graph.indexes.readSurfaceIdsByReaderId,
    producerIdsByArtifactId: graph.indexes.producerIdsByArtifactId,
    checkerIdsByNodeId: graph.indexes.checkerIdsByNodeId,
    routeTargetIdsByNodeId: graph.indexes.routeTargetIdsByNodeId,
    surfaceSectionIdsBySurfaceId: graph.indexes.surfaceSectionIdsBySurfaceId,
    sectionIdBySurfaceIdAndStableSlug: graph.indexes.sectionIdBySurfaceIdAndStableSlug,
    rootSectionIdsBySurfaceId: graph.indexes.rootSectionIdsBySurfaceId,
    childSectionIdsBySectionId: graph.indexes.childSectionIdsBySectionId
  };
}
