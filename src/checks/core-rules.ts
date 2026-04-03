import { createDiagnostic } from "../core/diagnostics.js";
import type { ArtifactDef, AuthoredContentBlock, AuthoredInlineRefDef, Diagnostic, DoctrineGraph, DoctrineNodeDef } from "../core/index.js";
import { findDuplicateIds, visitInlineRefsInBlocks } from "../core/index.js";
import { getCatalog, getCatalogEntry, getSurfaceSectionByStableSlug } from "../graph/index.js";
import type { CheckRule } from "./registry.js";

const semanticDocumentTargetKinds = new Set<DoctrineNodeDef["kind"]>([
  "role",
  "workflow_step",
  "review_gate",
  "packet_contract",
  "artifact",
  "reference"
]);
const readableSourceKinds = new Set<DoctrineNodeDef["kind"]>(["role", "workflow_step", "review_gate", "packet_contract"]);
const gateCheckTargetKinds = new Set<DoctrineNodeDef["kind"]>(["artifact", "packet_contract", "surface_section"]);
const ownerSourceKinds = new Set<DoctrineNodeDef["kind"]>([
  "role",
  "workflow_step",
  "review_gate",
  "packet_contract",
  "surface",
  "surface_section",
  "reference"
]);
const ownerTargetKinds = new Set<DoctrineNodeDef["kind"]>(["surface", "surface_section"]);
const referenceSourceKinds = new Set<DoctrineNodeDef["kind"]>([
  "role",
  "workflow_step",
  "review_gate",
  "packet_contract",
  "surface",
  "surface_section"
]);

function isArtifactLike(node: DoctrineNodeDef | undefined): node is ArtifactDef {
  return node?.kind === "artifact";
}

function isWorkflowRouteSourceNode(node: DoctrineNodeDef | undefined): boolean {
  return node?.kind === "workflow_step";
}

function isWorkflowRouteTargetNode(node: DoctrineNodeDef | undefined): boolean {
  return node?.kind === "workflow_step" || node?.kind === "review_gate";
}

function isRequiredInputNode(node: DoctrineNodeDef | undefined): boolean {
  return node?.kind === "artifact" || node?.kind === "packet_contract";
}

function isProducedOrConsumedTargetNode(node: DoctrineNodeDef | undefined): boolean {
  return node?.kind === "artifact" || node?.kind === "packet_contract";
}

function isSupportInputNode(node: DoctrineNodeDef | undefined): boolean {
  return node?.kind === "artifact" || node?.kind === "reference";
}

function isSupportTargetNode(node: DoctrineNodeDef | undefined): boolean {
  return node?.kind === "artifact" || node?.kind === "reference";
}

function isSurfaceDocumentNode(node: DoctrineNodeDef | undefined): boolean {
  return node?.kind === "surface" || node?.kind === "surface_section";
}

function isReferenceNode(node: DoctrineNodeDef | undefined): boolean {
  return node?.kind === "reference";
}

function isOwnerSourceNode(node: DoctrineNodeDef | undefined): boolean {
  return node !== undefined && ownerSourceKinds.has(node.kind);
}

function isOwnerTargetNode(node: DoctrineNodeDef | undefined): boolean {
  return node !== undefined && ownerTargetKinds.has(node.kind);
}

function isReadableSourceNode(node: DoctrineNodeDef | undefined): boolean {
  return node !== undefined && readableSourceKinds.has(node.kind);
}

function isReadableTargetNode(node: DoctrineNodeDef | undefined): boolean {
  return node?.kind === "surface" || node?.kind === "surface_section";
}

function isReferenceSourceNode(node: DoctrineNodeDef | undefined): boolean {
  return node !== undefined && referenceSourceKinds.has(node.kind);
}

function isGateCheckTargetNode(node: DoctrineNodeDef | undefined): boolean {
  return node !== undefined && gateCheckTargetKinds.has(node.kind);
}

function isMapsToRuntimeSourceNode(node: DoctrineNodeDef | undefined): boolean {
  return node?.kind === "artifact" || node?.kind === "packet_contract";
}

function isMapsToRuntimeTargetNode(node: DoctrineNodeDef | undefined): boolean {
  return (node?.kind === "artifact" && Boolean(node.runtimePath)) || node?.kind === "surface";
}

function uniqueOverlap(left: readonly string[], right: readonly string[]): string[] {
  return [...new Set(left.filter((id) => right.includes(id)))].sort();
}

function getTrustedOutputCandidateIds(graph: DoctrineGraph, outputId: string): string[] {
  const outputNode = graph.nodeById[outputId];
  const candidateIds = new Set<string>([outputId]);

  if (outputNode?.kind === "artifact") {
    for (const packetId of graph.nodeIdsByKind.packet_contract) {
      const packet = graph.nodeById[packetId];
      if (packet?.kind === "packet_contract" && packet.conceptualArtifactIds.includes(outputId)) {
        candidateIds.add(packet.id);
      }
    }
  }

  if (outputNode?.kind === "packet_contract") {
    for (const artifactId of outputNode.conceptualArtifactIds) {
      candidateIds.add(artifactId);
    }
  }

  return [...candidateIds].sort();
}

function hasDownstreamConsumerOrGate(graph: DoctrineGraph, producerStepId: string, outputId: string): boolean {
  const candidateIds = getTrustedOutputCandidateIds(graph, outputId);

  const hasConsumer = graph.nodeIdsByKind.workflow_step.some((stepId) => {
    if (stepId === producerStepId) {
      return false;
    }

    const step = graph.nodeById[stepId];
    return step?.kind === "workflow_step" && step.requiredInputIds.some((inputId) => candidateIds.includes(inputId));
  });

  if (hasConsumer) {
    return true;
  }

  const hasConsumeLink = graph.links.some((link) => link.kind === "consumes" && candidateIds.includes(link.to) && link.from !== producerStepId);
  if (hasConsumeLink) {
    return true;
  }

  const hasGateCheck = graph.nodeIdsByKind.review_gate.some((gateId) => {
    const gate = graph.nodeById[gateId];
    return gate?.kind === "review_gate" && gate.checkIds.some((checkId) => candidateIds.includes(checkId));
  });

  if (hasGateCheck) {
    return true;
  }

  return graph.links.some((link) => link.kind === "checks" && candidateIds.includes(link.to));
}

function createCheckDiagnostic(input: Omit<Diagnostic, "phase" | "severity">): Diagnostic {
  return createDiagnostic({
    severity: "error",
    phase: "check",
    ...input
  });
}

function validateInlineRef(graph: DoctrineGraph, ownerNodeId: string, ref: AuthoredInlineRefDef): Diagnostic[] {
  switch (ref.refKind) {
    case "artifact":
    case "surface":
    case "role": {
      const node = graph.nodeById[ref.id];
      if (!node) {
        return [
          createCheckDiagnostic({
            code: "check.inline_ref.missing_node",
            message: `Doctrine unit "${ownerNodeId}" references missing ${ref.refKind} "${ref.id}".`,
            nodeId: ownerNodeId,
            relatedIds: [ref.id]
          })
        ];
      }

      if (node.kind !== ref.refKind) {
        return [
          createCheckDiagnostic({
            code: "check.inline_ref.wrong_kind",
            message: `Doctrine unit "${ownerNodeId}" expected ${ref.refKind} "${ref.id}" but found ${node.kind}.`,
            nodeId: ownerNodeId,
            relatedIds: [ref.id]
          })
        ];
      }

      return [];
    }
    case "section": {
      if (getSurfaceSectionByStableSlug(graph, ref.surfaceId, ref.stableSlug)) {
        return [];
      }

      return [
        createCheckDiagnostic({
          code: "check.inline_ref.missing_section",
          message: `Doctrine unit "${ownerNodeId}" references missing section "${ref.surfaceId}::${ref.stableSlug}".`,
          nodeId: ownerNodeId,
          relatedIds: [ref.surfaceId, ref.stableSlug]
        })
      ];
    }
    case "catalog_entry": {
      const catalog = getCatalog(graph, ref.catalogKind);
      if (!catalog) {
        return [
          createCheckDiagnostic({
            code: "check.inline_ref.missing_catalog",
            message: `Doctrine unit "${ownerNodeId}" references missing ${ref.catalogKind} catalog.`,
            nodeId: ownerNodeId,
            relatedIds: [ref.catalogKind]
          })
        ];
      }

      if (getCatalogEntry(graph, ref.catalogKind, ref.entryId)) {
        return [];
      }

      return [
        createCheckDiagnostic({
          code: "check.inline_ref.missing_catalog_entry",
          message: `Doctrine unit "${ownerNodeId}" references missing ${ref.catalogKind} "${ref.entryId}".`,
          nodeId: ownerNodeId,
          relatedIds: [ref.catalogKind, ref.entryId]
        })
      ];
    }
  }
}

function collectInlineRefDiagnostics(
  graph: DoctrineGraph,
  ownerNodeId: string,
  blocks: readonly AuthoredContentBlock[]
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  // Typed refs are setup truth and must fail in check, not at markdown emission time.
  visitInlineRefsInBlocks(blocks, (ref) => {
    diagnostics.push(...validateInlineRef(graph, ownerNodeId, ref));
  });

  return diagnostics;
}

function findArtifactEvidenceCycle(
  startArtifactId: string,
  dependencyIdsByArtifactId: Record<string, string[]>,
  trail: string[] = [startArtifactId]
): string[] | undefined {
  const currentArtifactId = trail[trail.length - 1];
  if (!currentArtifactId) {
    return undefined;
  }

  for (const dependencyId of dependencyIdsByArtifactId[currentArtifactId] ?? []) {
    if (dependencyId === startArtifactId) {
      return [...trail, dependencyId];
    }

    if (trail.includes(dependencyId)) {
      continue;
    }

    const cycle = findArtifactEvidenceCycle(startArtifactId, dependencyIdsByArtifactId, [...trail, dependencyId]);
    if (cycle) {
      return cycle;
    }
  }

  return undefined;
}

export const workflowContractsRule: CheckRule = {
  id: "workflow_contracts",
  run(graph) {
    const diagnostics: Diagnostic[] = [];

    for (const stepId of graph.nodeIdsByKind.workflow_step) {
      const step = graph.nodeById[stepId];
      if (!step || step.kind !== "workflow_step") {
        continue;
      }

      const role = graph.nodeById[step.roleId];
      if (!role || role.kind !== "role") {
        diagnostics.push(
          createCheckDiagnostic({
            code: "check.workflow.missing_role",
            message: `Workflow step "${step.id}" references missing role "${step.roleId}".`,
            nodeId: step.id,
            relatedIds: [step.roleId]
          })
        );
      }

      for (const inputId of step.requiredInputIds) {
        if (!isRequiredInputNode(graph.nodeById[inputId])) {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.workflow.missing_required_input",
              message: `Workflow step "${step.id}" references missing or invalid required input "${inputId}".`,
              nodeId: step.id,
              relatedIds: [inputId]
            })
          );
        }
      }

      for (const outputId of step.requiredOutputIds) {
        if (!isRequiredInputNode(graph.nodeById[outputId])) {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.workflow.missing_required_output",
              message: `Workflow step "${step.id}" references missing or invalid required output "${outputId}".`,
              nodeId: step.id,
              relatedIds: [outputId]
            })
          );
        }
      }

      for (const supportId of step.supportInputIds ?? []) {
        if (!isSupportInputNode(graph.nodeById[supportId])) {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.workflow.missing_support_input",
              message: `Workflow step "${step.id}" references missing or invalid support input "${supportId}".`,
              nodeId: step.id,
              relatedIds: [supportId]
            })
          );
        }
      }

      for (const interimId of step.interimArtifactIds ?? []) {
        if (!isArtifactLike(graph.nodeById[interimId])) {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.workflow.missing_interim_artifact",
              message: `Workflow step "${step.id}" references missing interim artifact "${interimId}".`,
              nodeId: step.id,
              relatedIds: [interimId]
            })
          );
        }
      }

      if ((graph.indexes.routeTargetIdsByNodeId[step.id] ?? []).length === 0) {
        diagnostics.push(
          createCheckDiagnostic({
            code: "check.workflow.missing_route",
            message: `Workflow step "${step.id}" has no declared next step or next gate.`,
            nodeId: step.id
          })
        );
      }

      if (step.nextStepId) {
        const nextStep = graph.nodeById[step.nextStepId];
        if (!nextStep || nextStep.kind !== "workflow_step") {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.workflow.invalid_next_step_target",
              message: `Workflow step "${step.id}" routes to invalid next step "${step.nextStepId}".`,
              nodeId: step.id,
              relatedIds: [step.nextStepId]
            })
          );
        }
      }

      if (step.nextGateId) {
        const nextGate = graph.nodeById[step.nextGateId];
        if (!nextGate || nextGate.kind !== "review_gate") {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.workflow.invalid_next_gate_target",
              message: `Workflow step "${step.id}" routes to invalid next gate "${step.nextGateId}".`,
              nodeId: step.id,
              relatedIds: [step.nextGateId]
            })
          );
        }
      }

      const overlap = uniqueOverlap(step.requiredInputIds, step.supportInputIds ?? []);
      if (overlap.length > 0) {
        diagnostics.push(
          createCheckDiagnostic({
            code: "check.workflow.input_support_overlap",
            message: `Workflow step "${step.id}" declares the same ids as required and support inputs.`,
            nodeId: step.id,
            relatedIds: overlap
          })
        );
      }

      const interimOverlap = uniqueOverlap(step.requiredOutputIds, step.interimArtifactIds ?? []);
      if (interimOverlap.length > 0) {
        diagnostics.push(
          createCheckDiagnostic({
            code: "check.workflow.interim_output_overlap",
            message: `Workflow step "${step.id}" declares the same ids as interim and required outputs.`,
            nodeId: step.id,
            relatedIds: interimOverlap
          })
        );
      }
    }

    for (const link of graph.links) {
      if (link.kind !== "routes_to") {
        continue;
      }

      if (!isWorkflowRouteSourceNode(graph.nodeById[link.from])) {
        diagnostics.push(
          createCheckDiagnostic({
            code: "check.link.routes_to_source_invalid",
            message: `routes_to link "${link.id}" must originate from a workflow step.`,
            nodeId: link.id,
            relatedIds: [link.from]
          })
        );
      }

      if (!isWorkflowRouteTargetNode(graph.nodeById[link.to])) {
        diagnostics.push(
          createCheckDiagnostic({
            code: "check.link.routes_to_target_invalid",
            message: `routes_to link "${link.id}" must target a workflow step or review gate.`,
            nodeId: link.id,
            relatedIds: [link.to]
          })
        );
      }
    }

    return diagnostics;
  }
};

export const artifactAndPacketSemanticsRule: CheckRule = {
  id: "artifact_and_packet_semantics",
  run(graph) {
    const diagnostics: Diagnostic[] = [];

    for (const artifactId of graph.nodeIdsByKind.artifact) {
      const artifact = graph.nodeById[artifactId];
      if (!artifact || artifact.kind !== "artifact") {
        continue;
      }

      if (artifact.conceptualOnly && artifact.runtimePath) {
        diagnostics.push(
          createCheckDiagnostic({
            code: "check.artifact.conceptual_has_runtime",
            message: `Artifact "${artifact.id}" is marked conceptualOnly but also has a runtimePath.`,
            nodeId: artifact.id
          })
        );
      }

      if (artifact.compatibilityOnly && (!artifact.runtimePath || artifact.artifactClass !== "legacy")) {
        diagnostics.push(
          createCheckDiagnostic({
            code: "check.artifact.compatibility_requires_runtime",
            message: `Artifact "${artifact.id}" is marked compatibilityOnly but is not a legacy runtime artifact.`,
            nodeId: artifact.id
          })
        );
      }
    }

    for (const packetId of graph.nodeIdsByKind.packet_contract) {
      const packet = graph.nodeById[packetId];
      if (!packet || packet.kind !== "packet_contract") {
        continue;
      }

      for (const artifactId of packet.conceptualArtifactIds) {
        const artifact = graph.nodeById[artifactId];
        if (!artifact || artifact.kind !== "artifact" || artifact.compatibilityOnly || artifact.artifactClass === "legacy") {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.packet.invalid_conceptual_artifact",
              message: `Packet contract "${packet.id}" references invalid conceptual artifact "${artifactId}".`,
              nodeId: packet.id,
              relatedIds: [artifactId]
            })
          );
        }
      }

      for (const artifactId of packet.runtimeArtifactIds ?? []) {
        const artifact = graph.nodeById[artifactId];
        if (!artifact || artifact.kind !== "artifact" || !artifact.runtimePath || !artifact.compatibilityOnly) {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.packet.invalid_runtime_artifact",
              message: `Packet contract "${packet.id}" references invalid runtime artifact "${artifactId}".`,
              nodeId: packet.id,
              relatedIds: [artifactId]
            })
          );
        }
      }
    }

    for (const gateId of graph.nodeIdsByKind.review_gate) {
      const gate = graph.nodeById[gateId];
      if (!gate || gate.kind !== "review_gate") {
        continue;
      }

      for (const checkId of gate.checkIds) {
        const target = graph.nodeById[checkId];
        if (!isGateCheckTargetNode(target)) {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.review_gate.invalid_check_target",
              message: `Review gate "${gate.id}" references invalid check target "${checkId}".`,
              nodeId: gate.id,
              relatedIds: [checkId]
            })
          );
        }
      }
    }

    for (const link of graph.links) {
      if (link.kind !== "maps_to_runtime") {
        continue;
      }

      if (!isMapsToRuntimeSourceNode(graph.nodeById[link.from])) {
        diagnostics.push(
          createCheckDiagnostic({
            code: "check.link.maps_to_runtime_source_invalid",
            message: `maps_to_runtime link "${link.id}" must originate from an artifact or packet contract.`,
            nodeId: link.id,
            relatedIds: [link.from]
          })
        );
      }

      if (!isMapsToRuntimeTargetNode(graph.nodeById[link.to])) {
        diagnostics.push(
          createCheckDiagnostic({
            code: "check.link.maps_to_runtime_target_invalid",
            message: `maps_to_runtime link "${link.id}" must target a runtime artifact or runtime surface.`,
            nodeId: link.id,
            relatedIds: [link.to]
          })
        );
      }
    }

    for (const stepId of graph.nodeIdsByKind.workflow_step) {
      const step = graph.nodeById[stepId];
      if (!step || step.kind !== "workflow_step") {
        continue;
      }

      for (const inputId of step.requiredInputIds) {
        const inputNode = graph.nodeById[inputId];
        if (
          inputNode &&
          inputNode.kind === "artifact" &&
          (inputNode.artifactClass === "support" || inputNode.artifactClass === "reference" || inputNode.artifactClass === "legacy")
        ) {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.artifact.untrusted_required_input",
              message: `Workflow step "${step.id}" trusts non-contract artifact "${inputId}" as a required input.`,
              nodeId: step.id,
              relatedIds: [inputId]
            })
          );
        }
      }

      for (const outputId of step.requiredOutputIds) {
        if (graph.nodeById[outputId] && !hasDownstreamConsumerOrGate(graph, step.id, outputId)) {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.workflow.output_missing_downstream_consumer",
              message: `Workflow step "${step.id}" produces "${outputId}" without any downstream consumer or gate.`,
              nodeId: step.id,
              relatedIds: [outputId]
            })
          );
        }
      }
    }

    for (const link of graph.links) {
      switch (link.kind) {
        case "produces": {
          if (graph.nodeById[link.from]?.kind !== "workflow_step") {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.produces_source_invalid",
                message: `Produces link "${link.id}" must originate from a workflow step.`,
                nodeId: link.id,
                relatedIds: [link.from]
              })
            );
          }

          if (!isProducedOrConsumedTargetNode(graph.nodeById[link.to])) {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.produces_target_invalid",
                message: `Produces link "${link.id}" must target an artifact or packet contract.`,
                nodeId: link.id,
                relatedIds: [link.to]
              })
            );
          }
          break;
        }
        case "consumes": {
          if (graph.nodeById[link.from]?.kind !== "workflow_step") {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.consumes_source_invalid",
                message: `Consumes link "${link.id}" must originate from a workflow step.`,
                nodeId: link.id,
                relatedIds: [link.from]
              })
            );
          }

          if (!isProducedOrConsumedTargetNode(graph.nodeById[link.to])) {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.consumes_target_invalid",
                message: `Consumes link "${link.id}" must target an artifact or packet contract.`,
                nodeId: link.id,
                relatedIds: [link.to]
              })
            );
          }
          break;
        }
        case "supports": {
          if (graph.nodeById[link.from]?.kind !== "workflow_step") {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.supports_source_invalid",
                message: `Supports link "${link.id}" must originate from a workflow step.`,
                nodeId: link.id,
                relatedIds: [link.from]
              })
            );
          }

          if (!isSupportTargetNode(graph.nodeById[link.to])) {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.supports_target_invalid",
                message: `Supports link "${link.id}" must target an artifact or reference.`,
                nodeId: link.id,
                relatedIds: [link.to]
              })
            );
          }
          break;
        }
        default:
          break;
      }
    }

    return diagnostics;
  }
};

export const registryAndEvidenceSemanticsRule: CheckRule = {
  id: "registry_and_evidence_semantics",
  run(graph) {
    const diagnostics: Diagnostic[] = [];
    const duplicateCatalogKinds = findDuplicateIds(graph.catalogs.map((catalog) => catalog.kind));
    const duplicateRegistryIds = findDuplicateIds(graph.registries.map((registry) => registry.id));
    const evidenceDependencyIdsByArtifactId: Record<string, string[]> = {};

    for (const catalogKind of duplicateCatalogKinds) {
      diagnostics.push(
        createCheckDiagnostic({
          code: "check.catalog.duplicate_kind",
          message: `Catalog kind "${catalogKind}" is declared more than once.`,
          nodeId: catalogKind
        })
      );
    }

    for (const catalog of graph.catalogs) {
      const duplicateEntryIds = findDuplicateIds(catalog.entries.map((entry) => entry.id));

      for (const entryId of duplicateEntryIds) {
        diagnostics.push(
          createCheckDiagnostic({
            code: "check.catalog.duplicate_entry_id",
            message: `Catalog "${catalog.kind}" declares entry id "${entryId}" more than once.`,
            nodeId: catalog.kind,
            relatedIds: [entryId]
          })
        );
      }
    }

    for (const registryId of duplicateRegistryIds) {
      diagnostics.push(
        createCheckDiagnostic({
          code: "check.registry.duplicate_registry_id",
          message: `Registry id "${registryId}" is declared more than once.`,
          nodeId: registryId
        })
      );
    }

    for (const registry of graph.registries) {
      const duplicateEntryIds = findDuplicateIds(registry.entries.map((entry) => entry.id));

      for (const entryId of duplicateEntryIds) {
        diagnostics.push(
          createCheckDiagnostic({
            code: "check.registry.duplicate_entry_id",
            message: `Registry "${registry.id}" declares entry id "${entryId}" more than once.`,
            nodeId: registry.id,
            relatedIds: [entryId]
          })
        );
      }
    }

    for (const artifactId of graph.nodeIdsByKind.artifact) {
      const artifact = graph.nodeById[artifactId];
      if (!artifact || artifact.kind !== "artifact" || !artifact.evidence) {
        continue;
      }

      const dependencyIds: string[] = [];

      for (const requiredArtifactId of artifact.evidence.requiredArtifactIds ?? []) {
        const requiredArtifact = graph.nodeById[requiredArtifactId];
        if (!requiredArtifact || requiredArtifact.kind !== "artifact") {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.artifact_evidence.unknown_required_artifact",
              message: `Artifact "${artifact.id}" references missing or invalid required evidence artifact "${requiredArtifactId}".`,
              nodeId: artifact.id,
              relatedIds: [requiredArtifactId]
            })
          );
          continue;
        }

        dependencyIds.push(requiredArtifactId);
      }

      evidenceDependencyIdsByArtifactId[artifact.id] = dependencyIds;

      for (const claim of artifact.evidence.requiredClaims ?? []) {
        const allowedValue = claim.allowedValue;
        if (!allowedValue) {
          continue;
        }

        const registry = graph.registryById[allowedValue.registryId];
        if (!registry) {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.registry.unknown_allowed_value_registry",
              message: `Artifact "${artifact.id}" claim "${claim.id}" references unknown registry "${allowedValue.registryId}".`,
              nodeId: artifact.id,
              relatedIds: [claim.id, allowedValue.registryId]
            })
          );
          continue;
        }

        const entry = registry.entries.find((candidate) => candidate.id === allowedValue.entryId);
        if (!entry) {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.registry.unknown_allowed_value_entry",
              message: `Artifact "${artifact.id}" claim "${claim.id}" references unknown registry entry "${allowedValue.entryId}" in "${registry.id}".`,
              nodeId: artifact.id,
              relatedIds: [claim.id, registry.id, allowedValue.entryId]
            })
          );
        }
      }
    }

    for (const artifactId of graph.nodeIdsByKind.artifact) {
      const cycle = findArtifactEvidenceCycle(artifactId, evidenceDependencyIdsByArtifactId);
      if (!cycle) {
        continue;
      }

      diagnostics.push(
        createCheckDiagnostic({
          code: "check.artifact_evidence.circular_dependency",
          message: `Artifact "${artifactId}" participates in a circular evidence dependency chain.`,
          nodeId: artifactId,
          relatedIds: cycle
        })
      );
    }

    return diagnostics;
  }
};

export const surfaceAndReferenceSemanticsRule: CheckRule = {
  id: "surface_and_reference_semantics",
  run(graph) {
    const diagnostics: Diagnostic[] = [];
    const seenSlugs = new Map<string, string>();
    const sectionOrder = new Map(graph.nodeIdsByKind.surface_section.map((sectionId, index) => [sectionId, index]));

    for (const surfaceId of graph.nodeIdsByKind.surface) {
      const surface = graph.nodeById[surfaceId];
      if (!surface || surface.kind !== "surface") {
        continue;
      }

      if (surface.intro) {
        diagnostics.push(...collectInlineRefDiagnostics(graph, surface.id, surface.intro));
      }

      if (surface.preamble) {
        diagnostics.push(...collectInlineRefDiagnostics(graph, surface.id, surface.preamble));
      }
    }

    for (const sectionId of graph.nodeIdsByKind.surface_section) {
      const section = graph.nodeById[sectionId];
      if (!section || section.kind !== "surface_section") {
        continue;
      }

      const surface = graph.nodeById[section.surfaceId];
      if (!surface || surface.kind !== "surface") {
        diagnostics.push(
          createCheckDiagnostic({
            code: "check.surface_section.missing_surface",
            message: `Surface section "${section.id}" references missing surface "${section.surfaceId}".`,
            nodeId: section.id,
            relatedIds: [section.surfaceId]
          })
        );
      }

      if (section.parentSectionId) {
        const parentSection = graph.nodeById[section.parentSectionId];
        if (!parentSection || parentSection.kind !== "surface_section") {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.surface_section.missing_parent",
              message: `Surface section "${section.id}" references missing parent section "${section.parentSectionId}".`,
              nodeId: section.id,
              relatedIds: [section.parentSectionId]
            })
          );
        } else if (parentSection.surfaceId !== section.surfaceId) {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.surface_section.parent_surface_mismatch",
              message: `Surface section "${section.id}" must share a surface with parent "${section.parentSectionId}".`,
              nodeId: section.id,
              relatedIds: [section.parentSectionId, section.surfaceId, parentSection.surfaceId]
            })
          );
        } else if ((sectionOrder.get(parentSection.id) ?? Number.MAX_SAFE_INTEGER) > (sectionOrder.get(section.id) ?? Number.MAX_SAFE_INTEGER)) {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.surface_section.parent_declared_after_child",
              message: `Surface section "${section.id}" must be declared after parent section "${section.parentSectionId}" to preserve authored doctrine order.`,
              nodeId: section.id,
              relatedIds: [section.parentSectionId]
            })
          );
        }
      }

      const slugKey = `${section.surfaceId}::${section.stableSlug}`;
      const firstSectionId = seenSlugs.get(slugKey);
      if (firstSectionId) {
        diagnostics.push(
          createCheckDiagnostic({
            code: "check.surface_section.duplicate_slug",
            message: `Surface sections "${firstSectionId}" and "${section.id}" share the same stable slug "${section.stableSlug}".`,
            nodeId: section.id,
            relatedIds: [firstSectionId]
          })
        );
      } else {
        seenSlugs.set(slugKey, section.id);
      }

      const hasOutgoingDocuments = (graph.outgoingLinkIdsByNodeId[section.id] ?? [])
        .map((linkId) => graph.linkById[linkId])
        .some((link) => link?.kind === "documents");
      const hasReaders = (graph.indexes.readerIdsBySectionId[section.id] ?? []).length > 0;
      const hasOwners = (graph.indexes.ownerIdsByNodeId[section.id] ?? []).length > 0;
      const hasCheckers = (graph.indexes.checkerIdsByNodeId[section.id] ?? []).length > 0;
      const hasChildren = (graph.indexes.childSectionIdsBySectionId[section.id] ?? []).length > 0;

      if (section.body) {
        diagnostics.push(...collectInlineRefDiagnostics(graph, section.id, section.body));
      }

      if (!hasOutgoingDocuments && !hasReaders && !hasOwners && !hasCheckers && !hasChildren) {
        diagnostics.push(
          createCheckDiagnostic({
            code: "check.surface_section.orphaned",
            message: `Surface section "${section.id}" is not connected to any owner, reader, checker, or documented doctrine unit.`,
            nodeId: section.id
          })
        );
      }
    }

    for (const sectionId of graph.nodeIdsByKind.surface_section) {
      const ancestry = new Set<string>([sectionId]);
      let currentId = sectionId;

      while (true) {
        const parentSectionId = graph.indexes.parentSectionIdBySectionId[currentId];
        if (!parentSectionId) {
          break;
        }

        if (ancestry.has(parentSectionId)) {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.surface_section.parent_cycle",
              message: `Surface section "${sectionId}" participates in a parent-section cycle.`,
              nodeId: sectionId,
              relatedIds: [...ancestry, parentSectionId]
            })
          );
          break;
        }

        ancestry.add(parentSectionId);
        const parentSection = graph.nodeById[parentSectionId];
        if (!parentSection || parentSection.kind !== "surface_section") {
          break;
        }
        currentId = parentSectionId;
      }
    }

    for (const surfaceId of graph.nodeIdsByKind.surface) {
      const surface = graph.nodeById[surfaceId];
      if (!surface || surface.kind !== "surface" || !surface.requiredSectionSlugs?.length) {
        continue;
      }

      const sectionIds = graph.indexes.surfaceSectionIdsBySurfaceId[surface.id] ?? [];
      const declaredSlugs = new Set(
        sectionIds
          .map((sectionId) => graph.nodeById[sectionId])
          .filter((section): section is Extract<DoctrineNodeDef, { kind: "surface_section" }> => section?.kind === "surface_section")
          .map((section) => section.stableSlug)
      );

      for (const requiredSlug of [...new Set(surface.requiredSectionSlugs)]) {
        if (!declaredSlugs.has(requiredSlug)) {
          diagnostics.push(
            createCheckDiagnostic({
              code: "check.surface.missing_required_section",
              message: `Surface "${surface.id}" is missing required section slug "${requiredSlug}".`,
              nodeId: surface.id,
              relatedIds: [requiredSlug]
            })
          );
        }
      }
    }

    for (const [nodeId, ownerIds] of Object.entries(graph.indexes.ownerIdsByNodeId)) {
      if (ownerIds.length > 1) {
        diagnostics.push(
          createCheckDiagnostic({
            code: "check.ownership.conflicting_owner",
            message: `Doctrine unit "${nodeId}" has conflicting canonical owners.`,
            nodeId,
            relatedIds: ownerIds
          })
        );
      }
    }

    for (const link of graph.links) {
      switch (link.kind) {
        case "owns": {
          if (!isOwnerSourceNode(graph.nodeById[link.from])) {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.owns_source_invalid",
                message: `Owns link "${link.id}" must originate from a canonical doctrine owner node.`,
                nodeId: link.id,
                relatedIds: [link.from]
              })
            );
          }

          if (!isOwnerTargetNode(graph.nodeById[link.to])) {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.owns_target_invalid",
                message: `Owns link "${link.id}" must target a runtime surface or surface section.`,
                nodeId: link.id,
                relatedIds: [link.to]
              })
            );
          }
          break;
        }
        case "reads": {
          if (!isReadableSourceNode(graph.nodeById[link.from])) {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.reads_source_invalid",
                message: `Reads link "${link.id}" must originate from a role, workflow step, review gate, or packet contract.`,
                nodeId: link.id,
                relatedIds: [link.from]
              })
            );
          }

          if (!isReadableTargetNode(graph.nodeById[link.to])) {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.reads_target_invalid",
                message: `Reads link "${link.id}" must target a runtime surface or exact surface section.`,
                nodeId: link.id,
                relatedIds: [link.to]
              })
            );
          }
          break;
        }
        case "documents": {
          const source = graph.nodeById[link.from];
          const target = graph.nodeById[link.to];

          if (!isSurfaceDocumentNode(source)) {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.documents_source_invalid",
                message: `Documents link "${link.id}" must originate from a surface or surface section.`,
                nodeId: link.id,
                relatedIds: [link.from]
              })
            );
          }

          if (!target || !semanticDocumentTargetKinds.has(target.kind)) {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.documents_target_invalid",
                message: `Documents link "${link.id}" must target a semantic doctrine node.`,
                nodeId: link.id,
                relatedIds: [link.to]
              })
            );
          }
          break;
        }
        case "checks": {
          if (graph.nodeById[link.from]?.kind !== "review_gate") {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.checks_source_invalid",
                message: `Checks link "${link.id}" must originate from a review gate.`,
                nodeId: link.id,
                relatedIds: [link.from]
              })
            );
          }

          if (!isGateCheckTargetNode(graph.nodeById[link.to])) {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.checks_target_invalid",
                message: `Checks link "${link.id}" must target an artifact, packet contract, or surface section.`,
                nodeId: link.id,
                relatedIds: [link.to]
              })
            );
          }
          break;
        }
        case "grounds": {
          if (!isReferenceSourceNode(graph.nodeById[link.from])) {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.grounds_source_invalid",
                message: `Grounds link "${link.id}" must originate from a doctrine unit that can depend on grounding material.`,
                nodeId: link.id,
                relatedIds: [link.from]
              })
            );
          }

          if (!isReferenceNode(graph.nodeById[link.to])) {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.grounds_target_invalid",
                message: `Grounds link "${link.id}" must target a reference node.`,
                nodeId: link.id,
                relatedIds: [link.to]
              })
            );
          }
          break;
        }
        case "references": {
          if (!isReferenceSourceNode(graph.nodeById[link.from])) {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.references_source_invalid",
                message: `References link "${link.id}" must originate from a doctrine unit that can cite support material.`,
                nodeId: link.id,
                relatedIds: [link.from]
              })
            );
          }

          if (!isReferenceNode(graph.nodeById[link.to])) {
            diagnostics.push(
              createCheckDiagnostic({
                code: "check.link.references_target_invalid",
                message: `References link "${link.id}" must target a reference node.`,
                nodeId: link.id,
                relatedIds: [link.to]
              })
            );
          }
          break;
        }
        default:
          break;
      }
    }

    return diagnostics;
  }
};

export const coreCheckRules: readonly CheckRule[] = [
  workflowContractsRule,
  artifactAndPacketSemanticsRule,
  registryAndEvidenceSemanticsRule,
  surfaceAndReferenceSemanticsRule
];
