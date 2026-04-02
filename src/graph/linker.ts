import { createDiagnostic, sortDiagnostics } from "../core/diagnostics.js";
import type { DoctrineNodeDef, LinkDef, SetupDef } from "../core/index.js";
import type { DoctrineGraph } from "../core/index.js";
import { findDuplicateIds } from "../core/index.js";
import { buildGraphIndexes } from "./indexes.js";

export type GraphBuildResult =
  | { success: true; data: DoctrineGraph }
  | { success: false; diagnostics: ReturnType<typeof sortDiagnostics> };

function collectNodes(setup: SetupDef): DoctrineNodeDef[] {
  return [
    ...setup.roles,
    ...setup.workflowSteps,
    ...setup.reviewGates,
    ...setup.packetContracts,
    ...setup.artifacts,
    ...setup.surfaces,
    ...setup.surfaceSections,
    ...setup.references,
    ...setup.generatedTargets
  ];
}

function buildNodeIdsByKind(nodes: readonly DoctrineNodeDef[]): DoctrineGraph["nodeIdsByKind"] {
  return {
    role: nodes.filter((node) => node.kind === "role").map((node) => node.id),
    workflow_step: nodes.filter((node) => node.kind === "workflow_step").map((node) => node.id),
    review_gate: nodes.filter((node) => node.kind === "review_gate").map((node) => node.id),
    packet_contract: nodes.filter((node) => node.kind === "packet_contract").map((node) => node.id),
    artifact: nodes.filter((node) => node.kind === "artifact").map((node) => node.id),
    surface: nodes.filter((node) => node.kind === "surface").map((node) => node.id),
    surface_section: nodes.filter((node) => node.kind === "surface_section").map((node) => node.id),
    reference: nodes.filter((node) => node.kind === "reference").map((node) => node.id),
    generated_target: nodes.filter((node) => node.kind === "generated_target").map((node) => node.id)
  };
}

function buildLinkIdsByKind(links: readonly LinkDef[]): DoctrineGraph["linkIdsByKind"] {
  return {
    owns: links.filter((link) => link.kind === "owns").map((link) => link.id),
    reads: links.filter((link) => link.kind === "reads").map((link) => link.id),
    produces: links.filter((link) => link.kind === "produces").map((link) => link.id),
    consumes: links.filter((link) => link.kind === "consumes").map((link) => link.id),
    supports: links.filter((link) => link.kind === "supports").map((link) => link.id),
    checks: links.filter((link) => link.kind === "checks").map((link) => link.id),
    routes_to: links.filter((link) => link.kind === "routes_to").map((link) => link.id),
    documents: links.filter((link) => link.kind === "documents").map((link) => link.id),
    grounds: links.filter((link) => link.kind === "grounds").map((link) => link.id),
    references: links.filter((link) => link.kind === "references").map((link) => link.id),
    maps_to_runtime: links.filter((link) => link.kind === "maps_to_runtime").map((link) => link.id),
    generated_from: links.filter((link) => link.kind === "generated_from").map((link) => link.id)
  };
}

function buildLinkDirectionIndexes(links: readonly LinkDef[]): Pick<DoctrineGraph, "incomingLinkIdsByNodeId" | "outgoingLinkIdsByNodeId"> {
  const outgoingLinkIdsByNodeId: Record<string, string[]> = {};
  const incomingLinkIdsByNodeId: Record<string, string[]> = {};

  for (const link of links) {
    const outgoing = outgoingLinkIdsByNodeId[link.from] ?? [];
    outgoing.push(link.id);
    outgoingLinkIdsByNodeId[link.from] = outgoing;

    const incoming = incomingLinkIdsByNodeId[link.to] ?? [];
    incoming.push(link.id);
    incomingLinkIdsByNodeId[link.to] = incoming;
  }

  return { outgoingLinkIdsByNodeId, incomingLinkIdsByNodeId };
}

function validateNodeAndLinkIds(setup: SetupDef, nodes: readonly DoctrineNodeDef[], links: readonly LinkDef[]) {
  const diagnostics = [];
  const duplicateNodeIds = findDuplicateIds(nodes.map((node) => node.id));
  const duplicateLinkIds = findDuplicateIds(links.map((link) => link.id));

  for (const id of duplicateNodeIds) {
    diagnostics.push(
      createDiagnostic({
        code: "graph.duplicate_node_id",
        severity: "error",
        phase: "graph",
        message: `Duplicate node id "${id}" found in setup "${setup.setup.id}".`,
        path: [setup.setup.id, id]
      })
    );
  }

  for (const id of duplicateLinkIds) {
    diagnostics.push(
      createDiagnostic({
        code: "graph.duplicate_link_id",
        severity: "error",
        phase: "graph",
        message: `Duplicate link id "${id}" found in setup "${setup.setup.id}".`,
        path: [setup.setup.id, id]
      })
    );
  }

  return diagnostics;
}

function validateLinks(nodeById: Record<string, DoctrineNodeDef>, links: readonly LinkDef[]) {
  const diagnostics = [];

  for (const link of links) {
    if (!nodeById[link.from]) {
      diagnostics.push(
        createDiagnostic({
          code: "graph.unknown_link_source",
          severity: "error",
          phase: "graph",
          message: `Link "${link.id}" references unknown source "${link.from}".`,
          path: ["links", link.id, "from"]
        })
      );
    }

    if (!nodeById[link.to]) {
      diagnostics.push(
        createDiagnostic({
          code: "graph.unknown_link_target",
          severity: "error",
          phase: "graph",
          message: `Link "${link.id}" references unknown target "${link.to}".`,
          path: ["links", link.id, "to"]
        })
      );
    }
  }

  return diagnostics;
}

export function buildGraph(setup: SetupDef): GraphBuildResult {
  const nodes = collectNodes(setup);
  const links = [...setup.links];
  const nodeById = Object.fromEntries(nodes.map((node) => [node.id, node])) satisfies Record<string, DoctrineNodeDef>;
  const diagnostics = sortDiagnostics([...validateNodeAndLinkIds(setup, nodes, links), ...validateLinks(nodeById, links)]);

  if (diagnostics.length > 0) {
    return { success: false, diagnostics };
  }

  const linkById = Object.fromEntries(links.map((link) => [link.id, link])) satisfies Record<string, LinkDef>;
  const directionIndexes = buildLinkDirectionIndexes(links);

  return {
    success: true,
    data: {
      setup: setup.setup,
      nodes,
      nodeById,
      nodeIdsByKind: buildNodeIdsByKind(nodes),
      links,
      linkById,
      linkIdsByKind: buildLinkIdsByKind(links),
      ...directionIndexes,
      indexes: buildGraphIndexes(setup, links)
    }
  };
}
