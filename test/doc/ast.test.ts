import { describe, expect, it } from "vitest";

import {
  blockquote,
  codeBlock,
  doc,
  listItem,
  paragraph,
  section,
  table,
  unorderedList
} from "../../src/doc/index.js";

describe("doc ast", () => {
  it("builds a small deterministic document tree", () => {
    const ast = doc("Demo Document", [
      section("read-first", "Read First", [
        paragraph("Start here."),
        unorderedList(["One thing", listItem("Another thing", [listItem("Nested thing")])]),
        table(["Owner", "Reads"], [["Project Lead", "README.md"]]),
        blockquote([paragraph("Grounding note.")]),
        codeBlock("ts", "export const demo = true;"),
        section("workflow-items", "Workflow Items", [paragraph("This subsection narrows the owner map.")], 3)
      ])
    ]);

    expect(ast).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "children": [
              {
                "kind": "paragraph",
                "text": "Start here.",
              },
              {
                "items": [
                  {
                    "kind": "list_item",
                    "text": "One thing",
                  },
                  {
                    "children": [
                      {
                        "kind": "list_item",
                        "text": "Nested thing",
                      },
                    ],
                    "kind": "list_item",
                    "text": "Another thing",
                  },
                ],
                "kind": "list",
                "ordered": false,
              },
              {
                "headers": [
                  "Owner",
                  "Reads",
                ],
                "kind": "table",
                "rows": [
                  [
                    "Project Lead",
                    "README.md",
                  ],
                ],
              },
              {
                "children": [
                  {
                    "kind": "paragraph",
                    "text": "Grounding note.",
                  },
                ],
                "kind": "blockquote",
              },
              {
                "code": "export const demo = true;",
                "kind": "code_block",
                "language": "ts",
              },
              {
                "children": [
                  {
                    "kind": "paragraph",
                    "text": "This subsection narrows the owner map.",
                  },
                ],
                "kind": "section",
                "level": 3,
                "stableSlug": "workflow-items",
                "title": "Workflow Items",
              },
            ],
            "kind": "section",
            "level": 2,
            "stableSlug": "read-first",
            "title": "Read First",
          },
        ],
        "kind": "document",
        "title": "Demo Document",
      }
    `);
  });

  it("rejects invalid section levels", () => {
    expect(() => section("bad", "Bad", [], 0)).toThrow("Section level must be at least 1.");
  });
});
