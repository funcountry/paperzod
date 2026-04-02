import type { DoctrineGraph } from "../core/graph.js";
import type {
  DoctrineNodeDef,
  LinkDef,
  LinkKind,
  SurfaceSectionDef
} from "../core/index.js";

function isLink(value: LinkDef | undefined): value is LinkDef {
  return value !== undefined;
}

export function getNode(graph: DoctrineGraph, id: string): DoctrineNodeDef | undefined {
  return graph.nodeById[id];
}

export function getNodesByKind<K extends DoctrineNodeDef["kind"]>(
  graph: DoctrineGraph,
  kind: K
): Extract<DoctrineNodeDef, { kind: K }>[] {
  return graph.nodeIdsByKind[kind].map((id) => graph.nodeById[id] as Extract<DoctrineNodeDef, { kind: K }>);
}

export function getOutgoingLinks(graph: DoctrineGraph, from: string, kind?: LinkKind): LinkDef[] {
  const links = (graph.outgoingLinkIdsByNodeId[from] ?? []).map((id) => graph.linkById[id]).filter(isLink);
  return kind ? links.filter((link) => link.kind === kind) : links;
}

export function getIncomingLinks(graph: DoctrineGraph, to: string, kind?: LinkKind): LinkDef[] {
  const links = (graph.incomingLinkIdsByNodeId[to] ?? []).map((id) => graph.linkById[id]).filter(isLink);
  return kind ? links.filter((link) => link.kind === kind) : links;
}

function isNode(value: DoctrineNodeDef | undefined): value is DoctrineNodeDef {
  return value !== undefined;
}

function isSurfaceSection(value: DoctrineNodeDef | undefined): value is SurfaceSectionDef {
  return value?.kind === "surface_section";
}

export function getReadSections(graph: DoctrineGraph, readerId: string): SurfaceSectionDef[] {
  return (graph.indexes.readSectionIdsByReaderId[readerId] ?? [])
    .map((id) => graph.nodeById[id])
    .filter(isSurfaceSection);
}

export function getReadersOfSection(graph: DoctrineGraph, sectionId: string): DoctrineNodeDef[] {
  return (graph.indexes.readerIdsBySectionId[sectionId] ?? [])
    .map((id) => graph.nodeById[id])
    .filter(isNode);
}

export function getCheckTargets(graph: DoctrineGraph, checkerId: string): DoctrineNodeDef[] {
  return (graph.indexes.checkedNodeIdsByCheckerId[checkerId] ?? [])
    .map((id) => graph.nodeById[id])
    .filter(isNode);
}

export function getCheckersOfNode(graph: DoctrineGraph, nodeId: string): DoctrineNodeDef[] {
  return (graph.indexes.checkerIdsByNodeId[nodeId] ?? [])
    .map((id) => graph.nodeById[id])
    .filter(isNode);
}
