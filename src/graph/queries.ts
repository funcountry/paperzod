import type { DoctrineGraph } from "../core/graph.js";
import type {
  CatalogDef,
  CatalogEntryDef,
  DoctrineNodeDef,
  LinkDef,
  LinkKind,
  RegistryDef,
  RegistryEntryDef,
  SurfaceDef,
  SurfaceSectionDef
} from "../core/index.js";

function isLink(value: LinkDef | undefined): value is LinkDef {
  return value !== undefined;
}

export function getNode(graph: DoctrineGraph, id: string): DoctrineNodeDef | undefined {
  return graph.nodeById[id];
}

export function getCatalog(graph: DoctrineGraph, kind: CatalogDef["kind"]): CatalogDef | undefined {
  return graph.catalogByKind[kind];
}

export function getCatalogEntry(graph: DoctrineGraph, kind: CatalogDef["kind"], entryId: string): CatalogEntryDef | undefined {
  return graph.catalogByKind[kind]?.entries.find((entry) => entry.id === entryId);
}

export function getRegistry(graph: DoctrineGraph, id: string): RegistryDef | undefined {
  return graph.registryById[id];
}

export function getRegistryEntry(graph: DoctrineGraph, registryId: string, entryId: string): RegistryEntryDef | undefined {
  return graph.registryById[registryId]?.entries.find((entry) => entry.id === entryId);
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

function isSurface(value: DoctrineNodeDef | undefined): value is SurfaceDef {
  return value?.kind === "surface";
}

function isReadableTarget(value: DoctrineNodeDef | undefined): value is SurfaceDef | SurfaceSectionDef {
  return isSurface(value) || isSurfaceSection(value);
}

export function getReadTargets(graph: DoctrineGraph, readerId: string): Array<SurfaceDef | SurfaceSectionDef> {
  return (graph.indexes.readTargetIdsByReaderId[readerId] ?? [])
    .map((id) => graph.nodeById[id])
    .filter(isReadableTarget);
}

export function getSurfaceSectionByStableSlug(
  graph: DoctrineGraph,
  surfaceId: string,
  stableSlug: string
): SurfaceSectionDef | undefined {
  const sectionId = graph.indexes.sectionIdBySurfaceIdAndStableSlug[surfaceId]?.[stableSlug];
  const section = sectionId ? graph.nodeById[sectionId] : undefined;
  return isSurfaceSection(section) ? section : undefined;
}

export function getReadSections(graph: DoctrineGraph, readerId: string): SurfaceSectionDef[] {
  return (graph.indexes.readSectionIdsByReaderId[readerId] ?? [])
    .map((id) => graph.nodeById[id])
    .filter(isSurfaceSection);
}

export function getReadSurfaces(graph: DoctrineGraph, readerId: string): SurfaceDef[] {
  return (graph.indexes.readSurfaceIdsByReaderId[readerId] ?? [])
    .map((id) => graph.nodeById[id])
    .filter(isSurface);
}

export function getReadersOfReadTarget(graph: DoctrineGraph, targetId: string): DoctrineNodeDef[] {
  return (graph.indexes.readerIdsByReadTargetId[targetId] ?? [])
    .map((id) => graph.nodeById[id])
    .filter(isNode);
}

export function getReadersOfSection(graph: DoctrineGraph, sectionId: string): DoctrineNodeDef[] {
  return (graph.indexes.readerIdsBySectionId[sectionId] ?? [])
    .map((id) => graph.nodeById[id])
    .filter(isNode);
}

export function getReadersOfSurface(graph: DoctrineGraph, surfaceId: string): DoctrineNodeDef[] {
  return (graph.indexes.readerIdsBySurfaceId[surfaceId] ?? [])
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
