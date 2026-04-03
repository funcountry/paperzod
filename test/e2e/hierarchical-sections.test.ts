import { describe, expect, it } from "vitest";

import { compileSetup, createPaperclipMarkdownTarget } from "../../src/index.js";

function compile(input: unknown) {
  return compileSetup(
    input,
    createPaperclipMarkdownTarget({
      repoRoot: "/repo",
      outputRoot: "."
    })
  );
}

describe("hierarchical section authoring", () => {
  it("preserves authored subsection hierarchy through plan and markdown emission", () => {
    const result = compile({
      id: "hierarchical_section_flow",
      name: "Hierarchical Section Flow",
      roles: [{ id: "owner", name: "Owner", purpose: "Route readers through the doctrine map honestly." }],
      surfaces: [
        {
          id: "shared_readme",
          surfaceClass: "shared_entrypoint",
          runtimePath: "paperclip_home/project_homes/editorial/shared/README.md",
          preamble: [{ kind: "paragraph", text: "Start here, then open the one file that owns the question." }]
        }
      ],
      surfaceSections: [
        {
          id: "terms",
          surfaceId: "shared_readme",
          stableSlug: "terms",
          title: "Terms",
          body: [{ kind: "paragraph", text: "These definitions are here so readers do not have to guess what a word means." }]
        },
        {
          id: "workflow_items",
          surfaceId: "shared_readme",
          stableSlug: "workflow-items",
          title: "Workflow Items",
          parentSectionId: "terms",
          body: [
            {
              kind: "unordered_list",
              items: ["handoff", "packet", "proof"]
            }
          ]
        },
        {
          id: "poker_items",
          surfaceId: "shared_readme",
          stableSlug: "story-items",
          title: "Editorial Story Items",
          parentSectionId: "terms",
          body: [{ kind: "paragraph", text: "These are the shared editorial units the workflow operates on." }]
        },
        {
          id: "lesson_root",
          surfaceId: "shared_readme",
          stableSlug: "lesson-root",
          title: "Lesson Root",
          parentSectionId: "poker_items",
          body: [{ kind: "paragraph", text: "The lesson root holds the current lesson packet and runtime outputs." }]
        },
        {
          id: "read_order",
          surfaceId: "shared_readme",
          stableSlug: "read-order",
          title: "Read Order",
          body: [
            {
              kind: "ordered_steps",
              items: ["Open the workflow owner.", "Then open only the named owner."]
            }
          ]
        }
      ],
      generatedTargets: [
        { id: "terms_target", path: "paperclip_home/project_homes/editorial/shared/README.md", sourceIds: ["owner"], sectionId: "terms" },
        { id: "workflow_items_target", path: "paperclip_home/project_homes/editorial/shared/README.md", sourceIds: ["owner"], sectionId: "workflow_items" },
        { id: "poker_items_target", path: "paperclip_home/project_homes/editorial/shared/README.md", sourceIds: ["owner"], sectionId: "poker_items" },
        { id: "lesson_root_target", path: "paperclip_home/project_homes/editorial/shared/README.md", sourceIds: ["owner"], sectionId: "lesson_root" },
        { id: "read_order_target", path: "paperclip_home/project_homes/editorial/shared/README.md", sourceIds: ["owner"], sectionId: "read_order" }
      ],
      links: [
        { id: "terms_documents_owner", kind: "documents", from: "terms", to: "owner" },
        { id: "workflow_items_documents_owner", kind: "documents", from: "workflow_items", to: "owner" },
        { id: "poker_items_documents_owner", kind: "documents", from: "poker_items", to: "owner" },
        { id: "lesson_root_documents_owner", kind: "documents", from: "lesson_root", to: "owner" },
        { id: "read_order_documents_owner", kind: "documents", from: "read_order", to: "owner" }
      ]
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(
      result.data.plan.sections.map((section) => ({
        id: section.id,
        parentSectionId: section.parentSectionId ?? null
      }))
    ).toEqual([
      { id: "terms", parentSectionId: null },
      { id: "workflow_items", parentSectionId: "terms" },
      { id: "poker_items", parentSectionId: "terms" },
      { id: "lesson_root", parentSectionId: "poker_items" },
      { id: "read_order", parentSectionId: null }
    ]);

    expect(result.data.documents[0]?.markdown).toMatchInlineSnapshot(`
      "# Shared Entrypoint

      This shared entrypoint introduces the setup-wide doctrine surface.

      Start here, then open the one file that owns the question.

      <a id="terms"></a>
      ## Terms

      These definitions are here so readers do not have to guess what a word means.

      <a id="workflow-items"></a>
      ### Workflow Items

      - handoff
      - packet
      - proof

      <a id="story-items"></a>
      ### Editorial Story Items

      These are the shared editorial units the workflow operates on.

      <a id="lesson-root"></a>
      #### Lesson Root

      The lesson root holds the current lesson packet and runtime outputs.

      <a id="read-order"></a>
      ## Read Order

      1. Open the workflow owner.
      2. Then open only the named owner.
      "
    `);
  });

  it("renders bodyless wrapper parents with children and no fallback filler", () => {
    const result = compile({
      id: "hierarchical_wrapper_parent_flow",
      name: "Hierarchical Wrapper Parent Flow",
      roles: [{ id: "owner", name: "Owner", purpose: "Route readers through the doctrine map honestly." }],
      surfaces: [
        {
          id: "shared_readme",
          surfaceClass: "shared_entrypoint",
          runtimePath: "paperclip_home/project_homes/editorial/shared/README.md"
        }
      ],
      surfaceSections: [
        {
          id: "standards",
          surfaceId: "shared_readme",
          stableSlug: "standards-and-support",
          title: "Standards And Support"
        },
        {
          id: "copy_standards",
          surfaceId: "shared_readme",
          stableSlug: "copy-standards",
          title: "Copy Standards",
          parentSectionId: "standards",
          body: [{ kind: "paragraph", text: "Use the approved copy checklist before publishing." }]
        }
      ],
      generatedTargets: [
        {
          id: "standards_target",
          path: "paperclip_home/project_homes/editorial/shared/README.md",
          sourceIds: ["owner"],
          sectionId: "standards"
        },
        {
          id: "copy_standards_target",
          path: "paperclip_home/project_homes/editorial/shared/README.md",
          sourceIds: ["owner"],
          sectionId: "copy_standards"
        }
      ],
      links: [
        { id: "standards_documents_owner", kind: "documents", from: "standards", to: "owner" },
        { id: "copy_standards_documents_owner", kind: "documents", from: "copy_standards", to: "owner" }
      ]
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.documents[0]?.markdown).toMatchInlineSnapshot(`
      "# Shared Entrypoint

      This shared entrypoint introduces the setup-wide doctrine surface.

      <a id="standards-and-support"></a>
      ## Standards And Support

      <a id="copy-standards"></a>
      ### Copy Standards

      Use the approved copy checklist before publishing.
      "
    `);
  });
});
