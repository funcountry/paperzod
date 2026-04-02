import { createDiagnostic, sortDiagnostics } from "../core/diagnostics.js";
import type { CompilePlan, Diagnostic, DoctrineGraph, PlannedDocument, PlannedSection } from "../core/index.js";
import { getOutgoingLinks } from "../graph/index.js";

export type CompilePlanResult =
  | { success: true; data: CompilePlan }
  | { success: false; diagnostics: Diagnostic[] };

const generatedFromTargetKinds = new Set([
  "role",
  "workflow_step",
  "review_gate",
  "packet_contract",
  "artifact",
  "reference",
  "surface_section"
] as const);

function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].sort();
}

function isGeneratedFromTargetKind(kind: DoctrineGraph["nodes"][number]["kind"]): boolean {
  return generatedFromTargetKinds.has(kind as (typeof generatedFromTargetKinds extends Set<infer T> ? T : never));
}

function getSectionDocumentedNodeIds(graph: DoctrineGraph, sectionId: string): string[] {
  return getOutgoingLinks(graph, sectionId, "documents").map((link) => link.to);
}

function getSectionGeneratedSourceIds(
  graph: DoctrineGraph,
  generatedTargetIds: readonly string[],
  sectionId: string,
  documentedNodeIds: readonly string[]
): string[] {
  const relevantIds = new Set([sectionId, ...documentedNodeIds]);

  return uniqueSorted(
    generatedTargetIds.flatMap((targetId) => {
      const target = graph.nodeById[targetId];
      if (!target || target.kind !== "generated_target") {
        return [];
      }

      const explicitSourceIds = new Set<string>();
      if (target.sectionId === sectionId) {
        explicitSourceIds.add(sectionId);
        for (const sourceId of target.sourceIds) {
          explicitSourceIds.add(sourceId);
        }
      }

      for (const link of getOutgoingLinks(graph, targetId, "generated_from")) {
        if (relevantIds.has(link.to)) {
          explicitSourceIds.add(link.to);
        }
      }

      return [...explicitSourceIds];
    })
  );
}

function buildSectionSourceIds(graph: DoctrineGraph, generatedTargetIds: readonly string[], sectionId: string): string[] {
  const documentedNodeIds = getSectionDocumentedNodeIds(graph, sectionId);
  const generatedSourceIds = getSectionGeneratedSourceIds(graph, generatedTargetIds, sectionId, documentedNodeIds);
  return uniqueSorted([sectionId, ...documentedNodeIds, ...generatedSourceIds]);
}

function buildDocumentSourceIds(graph: DoctrineGraph, surfaceId: string, sectionIds: readonly string[], generatedTargetIds: readonly string[]): string[] {
  const surfaceDocumentedNodeIds = getOutgoingLinks(graph, surfaceId, "documents").map((link) => link.to);
  const generatedSourceIds = generatedTargetIds.flatMap((targetId) => graph.indexes.generatedSourceIdsByTargetId[targetId] ?? []);
  return uniqueSorted([surfaceId, ...sectionIds, ...surfaceDocumentedNodeIds, ...generatedSourceIds]);
}

export function buildCompilePlan(graph: DoctrineGraph): CompilePlanResult {
  const diagnostics: Diagnostic[] = [];
  const documents: PlannedDocument[] = [];
  const sections: PlannedSection[] = [];

  for (const targetId of graph.nodeIdsByKind.generated_target) {
    const target = graph.nodeById[targetId];
    if (!target || target.kind !== "generated_target") {
      continue;
    }

    for (const sourceId of target.sourceIds) {
      if (!graph.nodeById[sourceId]) {
        diagnostics.push(
          createDiagnostic({
            code: "plan.generated_target_missing_source",
            severity: "error",
            phase: "plan",
            message: `Generated target "${target.id}" references missing source "${sourceId}".`,
            nodeId: target.id,
            relatedIds: [sourceId]
          })
        );
      }
    }

    if (target.sectionId) {
      const section = graph.nodeById[target.sectionId];
      if (!section || section.kind !== "surface_section") {
        diagnostics.push(
          createDiagnostic({
            code: "plan.generated_target_invalid_section_ref",
            severity: "error",
            phase: "plan",
            message: `Generated target "${target.id}" references invalid section "${target.sectionId}".`,
            nodeId: target.id,
            relatedIds: [target.sectionId]
          })
        );
      } else {
        const surface = graph.nodeById[section.surfaceId];
        if (!surface || surface.kind !== "surface" || surface.runtimePath !== target.path) {
          diagnostics.push(
            createDiagnostic({
              code: "plan.generated_target_section_path_mismatch",
              severity: "error",
              phase: "plan",
              message: `Generated target "${target.id}" does not match the runtime path of section "${target.sectionId}".`,
              nodeId: target.id,
              relatedIds: [target.sectionId]
            })
          );
        }
      }
    }
  }

  for (const link of graph.links) {
    if (link.kind !== "generated_from") {
      continue;
    }

    if (graph.nodeById[link.from]?.kind !== "generated_target") {
      diagnostics.push(
        createDiagnostic({
          code: "plan.generated_from_source_invalid",
          severity: "error",
          phase: "plan",
          message: `generated_from link "${link.id}" must originate from a generated target.`,
          nodeId: link.id,
          relatedIds: [link.from]
        })
      );
    }

    const targetNode = graph.nodeById[link.to];
    if (!targetNode || !isGeneratedFromTargetKind(targetNode.kind)) {
      diagnostics.push(
        createDiagnostic({
          code: "plan.generated_from_target_invalid",
          severity: "error",
          phase: "plan",
          message: `generated_from link "${link.id}" must target a semantic source unit or surface section.`,
          nodeId: link.id,
          relatedIds: [link.to]
        })
      );
    }
  }

  for (const surfaceId of graph.nodeIdsByKind.surface) {
    const surface = graph.nodeById[surfaceId];
    if (!surface || surface.kind !== "surface") {
      continue;
    }

    const generatedTargetIds = graph.nodeIdsByKind.generated_target.filter((targetId) => {
      const target = graph.nodeById[targetId];
      return target?.kind === "generated_target" && target.path === surface.runtimePath;
    });

    if (generatedTargetIds.length === 0) {
      diagnostics.push(
        createDiagnostic({
          code: "plan.document_missing_source_backing",
          severity: "error",
          phase: "plan",
          message: `Surface "${surface.id}" has no generated target backing for path "${surface.runtimePath}".`,
          nodeId: surface.id
        })
      );
      continue;
    }

    const sectionIds = [...(graph.indexes.surfaceSectionIdsBySurfaceId[surface.id] ?? [])].sort();
    for (const sectionId of sectionIds) {
      const ownerIds = graph.indexes.ownerIdsByNodeId[sectionId] ?? [];
      if (ownerIds.length > 1) {
        diagnostics.push(
          createDiagnostic({
            code: "plan.conflicting_section_owner",
            severity: "error",
            phase: "plan",
            message: `Section "${sectionId}" has conflicting owners.`,
            nodeId: sectionId,
            relatedIds: ownerIds
          })
        );
      }

      const documentedNodeIds = getSectionDocumentedNodeIds(graph, sectionId);
      const generatedSourceIds = getSectionGeneratedSourceIds(graph, generatedTargetIds, sectionId, documentedNodeIds);
      if (generatedSourceIds.length === 0) {
        diagnostics.push(
          createDiagnostic({
            code: "plan.section_missing_generation_provenance",
            severity: "error",
            phase: "plan",
            message: `Section "${sectionId}" is not backed by any declared generated-target provenance.`,
            nodeId: sectionId,
            relatedIds: [...generatedTargetIds]
          })
        );
      }
    }

    const document: PlannedDocument = {
      id: surface.id,
      surfaceId: surface.id,
      surfaceClass: surface.surfaceClass,
      path: surface.runtimePath,
      generatedTargetIds: [...generatedTargetIds].sort(),
      sourceIds: buildDocumentSourceIds(graph, surface.id, sectionIds, generatedTargetIds),
      sectionIds
    };
    documents.push(document);

    for (const sectionId of sectionIds) {
      const section = graph.nodeById[sectionId];
      if (!section || section.kind !== "surface_section") {
        continue;
      }

      sections.push({
        id: section.id,
        documentId: document.id,
        surfaceSectionId: section.id,
        stableSlug: section.stableSlug,
        title: section.title,
        sourceIds: buildSectionSourceIds(graph, generatedTargetIds, section.id)
      });
    }
  }

  const sortedDiagnostics = sortDiagnostics(diagnostics);
  if (sortedDiagnostics.length > 0) {
    return { success: false, diagnostics: sortedDiagnostics };
  }

  const sortedDocuments = [...documents].sort((left, right) => left.path.localeCompare(right.path));
  const sortedSections = [...sections].sort((left, right) =>
    left.documentId.localeCompare(right.documentId) || left.stableSlug.localeCompare(right.stableSlug)
  );

  return {
    success: true,
    data: {
      setupId: graph.setup.id,
      documents: sortedDocuments,
      sections: sortedSections,
      documentById: Object.fromEntries(sortedDocuments.map((document) => [document.id, document])),
      sectionById: Object.fromEntries(sortedSections.map((section) => [section.id, section])),
      pathManifest: Object.fromEntries(sortedDocuments.map((document) => [document.id, document.path]))
    }
  };
}

export * from "./targets.js";
