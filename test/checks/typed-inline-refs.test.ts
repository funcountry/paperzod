import { describe, expect, it } from "vitest";

import { runChecks } from "../../src/checks/index.js";
import { buildGraph } from "../../src/graph/index.js";
import { normalizeSetup } from "../../src/source/index.js";

function runChecksFor(input: unknown) {
  const normalized = normalizeSetup(input);
  expect(normalized.success).toBe(true);
  if (!normalized.success) {
    throw new Error("Expected setup normalization to succeed.");
  }

  const graph = buildGraph(normalized.data);
  expect(graph.success).toBe(true);
  if (!graph.success) {
    throw new Error("Expected graph build to succeed.");
  }

  return runChecks(graph.data);
}

describe("typed inline ref checks", () => {
  it("accepts valid graph-backed and command-backed refs", () => {
    expect(
      runChecksFor({
        id: "typed_ref_valid",
        name: "Typed Ref Valid",
        catalogs: [{ kind: "command", entries: [{ id: "paperclip_status", display: "./paperclip status" }] }],
        roles: [{ id: "author", name: "Author", purpose: "Author the doctrine." }],
        artifacts: [{ id: "action_authority", name: "ACTION_AUTHORITY.md", artifactClass: "required" }],
        surfaces: [
          {
            id: "author_home",
            surfaceClass: "role_home",
            runtimePath: "generated/author/AGENTS.md",
            preamble: [
              {
                kind: "paragraph",
                text: ["Read ", { kind: "ref", refKind: "artifact", id: "action_authority" }, " before acting."]
              }
            ]
          },
          {
            id: "workflow_surface",
            surfaceClass: "workflow_owner",
            runtimePath: "generated/WORKFLOW.md"
          }
        ],
        surfaceSections: [
          {
            id: "read_first",
            surfaceId: "author_home",
            stableSlug: "read-first",
            title: "Read First",
            body: [
              {
                kind: "paragraph",
                text: [
                  "Then open ",
                  { kind: "ref", refKind: "section", surfaceId: "workflow_surface", stableSlug: "owner-map" },
                  " and run ",
                  { kind: "ref", refKind: "catalog_entry", catalogKind: "command", entryId: "paperclip_status" },
                  "."
                ]
              }
            ]
          },
          { id: "owner_map", surfaceId: "workflow_surface", stableSlug: "owner-map", title: "Owner Map" }
        ],
        generatedTargets: [{ id: "read_first_target", path: "generated/author/AGENTS.md", sourceIds: ["author"], sectionId: "read_first" }],
        links: [
          { id: "read_first_documents_author", kind: "documents", from: "read_first", to: "author" },
          { id: "owner_map_documents_author", kind: "documents", from: "owner_map", to: "author" }
        ]
      })
    ).toEqual([]);
  });

  it("rejects missing nodes, wrong kinds, missing sections, missing catalogs, and missing catalog entries", () => {
    const diagnostics = runChecksFor({
      id: "typed_ref_conflicts",
      name: "Typed Ref Conflicts",
      roles: [{ id: "author", name: "Author", purpose: "Author the doctrine." }],
      artifacts: [{ id: "action_authority", name: "ACTION_AUTHORITY.md", artifactClass: "required" }],
      surfaces: [
        {
          id: "author_home",
          surfaceClass: "role_home",
          runtimePath: "generated/author/AGENTS.md",
          preamble: [
            { kind: "paragraph", text: ["Read ", { kind: "ref", refKind: "artifact", id: "missing_artifact" }, "."] },
            { kind: "paragraph", text: ["Open ", { kind: "ref", refKind: "surface", id: "action_authority" }, "."] },
            {
              kind: "paragraph",
              text: ["Use ", { kind: "ref", refKind: "catalog_entry", catalogKind: "command", entryId: "paperclip_status" }, "."]
            }
          ]
        }
      ],
      surfaceSections: [
        {
          id: "read_first",
          surfaceId: "author_home",
          stableSlug: "read-first",
          title: "Read First",
          body: [
            {
              kind: "paragraph",
              text: ["Then open ", { kind: "ref", refKind: "section", surfaceId: "author_home", stableSlug: "missing-section" }, "."]
            }
          ]
        }
      ],
      generatedTargets: [{ id: "read_first_target", path: "generated/author/AGENTS.md", sourceIds: ["author"], sectionId: "read_first" }],
      links: [{ id: "read_first_documents_author", kind: "documents", from: "read_first", to: "author" }]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "check.inline_ref.missing_catalog",
      "check.inline_ref.missing_node",
      "check.inline_ref.missing_section",
      "check.inline_ref.wrong_kind"
    ]);
  });

  it("rejects missing command entries and duplicate catalog entries", () => {
    const diagnostics = runChecksFor({
      id: "typed_ref_catalog_conflicts",
      name: "Typed Ref Catalog Conflicts",
      catalogs: [
        {
          kind: "command",
          entries: [
            { id: "paperclip_status", display: "./paperclip status" },
            { id: "paperclip_status", display: "./paperclip status --verbose" }
          ]
        }
      ],
      roles: [{ id: "author", name: "Author", purpose: "Author the doctrine." }],
      surfaces: [
        {
          id: "author_home",
          surfaceClass: "role_home",
          runtimePath: "generated/author/AGENTS.md",
          preamble: [
            {
              kind: "paragraph",
              text: ["Run ", { kind: "ref", refKind: "catalog_entry", catalogKind: "command", entryId: "missing_command" }, "."]
            }
          ]
        }
      ]
    });

    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "check.catalog.duplicate_entry_id",
      "check.inline_ref.missing_catalog_entry"
    ]);
  });
});
