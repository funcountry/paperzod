import { describe, expect, it } from "vitest";

import {
  blockquote,
  codeBlock,
  doc,
  paragraph,
  renderMarkdown,
  section,
  unorderedList
} from "../../src/doc/index.js";

describe("markdown stringifier", () => {
  it("renders deterministic markdown", () => {
    const ast = doc("Demo Document", [
      paragraph("Intro text."),
      section("read-first", "Read First", [
        paragraph("Start here."),
        unorderedList(["One thing", "Another thing"]),
        blockquote([paragraph("Grounding note.")]),
        codeBlock("ts", "export const demo = true;")
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

      > Grounding note.

      \`\`\`ts
      export const demo = true;
      \`\`\`
      "
    `);
  });

  it("renders stable section anchors from stable slugs", () => {
    const ast = doc("Anchors", [section("role-contract", "Role Contract", [paragraph("Contract text.")])]);
    expect(renderMarkdown(ast)).toContain('<a id="role-contract"></a>');
  });
});
