import { describe, expect, it } from "vitest";

import {
  blockquote,
  codeBlock,
  doc,
  listItem,
  paragraph,
  renderMarkdown,
  section,
  table,
  unorderedList
} from "../../src/doc/index.js";

describe("markdown stringifier", () => {
  it("renders deterministic markdown", () => {
    const ast = doc("Demo Document", [
      paragraph("Intro text."),
      section("read-first", "Read First", [
        paragraph("Start here."),
        unorderedList(["One thing", listItem("Another thing", [listItem("Nested thing")])]),
        table(["Owner", "Reads"], [["Project Lead", "README.md"]]),
        blockquote([paragraph("Grounding note.")]),
        codeBlock("ts", "export const demo = true;"),
        section("workflow-items", "Workflow Items", [paragraph("This subsection narrows the owner map.")], 3)
      ])
    ]);

    expect(renderMarkdown(ast)).toMatchInlineSnapshot(`
      "# Demo Document

      Intro text.

      <a id="read-first"></a>
      ## Read First

      Start here.

      - One thing
      - Another thing
        - Nested thing

      | Owner | Reads |
      | --- | --- |
      | Project Lead | README.md |

      > Grounding note.

      \`\`\`ts
      export const demo = true;
      \`\`\`

      <a id="workflow-items"></a>
      ### Workflow Items

      This subsection narrows the owner map.
      "
    `);
  });

  it("renders stable section anchors from stable slugs", () => {
    const ast = doc("Anchors", [section("role-contract", "Role Contract", [paragraph("Contract text.")])]);
    expect(renderMarkdown(ast)).toContain('<a id="role-contract"></a>');
  });
});
