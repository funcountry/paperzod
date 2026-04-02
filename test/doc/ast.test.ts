import { describe, expect, it } from "vitest";

import {
  blockquote,
  codeBlock,
  doc,
  paragraph,
  section,
  unorderedList
} from "../../src/doc/index.js";

describe("doc ast", () => {
  it("builds a small deterministic document tree", () => {
    const ast = doc("Demo Document", [
      section("read-first", "Read First", [
        paragraph("Start here."),
        unorderedList(["One thing", "Another thing"]),
        blockquote([paragraph("Grounding note.")]),
        codeBlock("ts", "export const demo = true;")
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
                    "kind": "list_item",
                    "text": "Another thing",
                  },
                ],
                "kind": "list",
                "ordered": false,
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
