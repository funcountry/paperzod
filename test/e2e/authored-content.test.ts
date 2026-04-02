import { describe, expect, it } from "vitest";

import { compileSetup, createPaperclipMarkdownTarget } from "../../src/index.js";
import { loadFragments } from "../../src/source/index.js";

function compile(input: unknown) {
  return compileSetup(
    input,
    createPaperclipMarkdownTarget({
      repoRoot: "/repo",
      outputRoot: "."
    })
  );
}

describe("authored doctrine content flow", () => {
  it("renders authored preambles, authored section bodies, and conditional read guidance end to end", () => {
    const fragments = loadFragments(new URL("../fixtures/fragments/authored-content/", import.meta.url), {
      ownerMap: "owner_map.md"
    });

    const result = compile({
      id: "authored_content_flow",
      name: "Authored Content Flow",
      roles: [{ id: "author", name: "Author", purpose: "Produce the runtime doctrine honestly." }],
      surfaces: [
        {
          id: "author_home",
          surfaceClass: "role_home",
          runtimePath: "paperclip_home/agents/author/AGENTS.md",
          preamble: [
            { kind: "paragraph", text: "Start here before opening any packet-specific doctrine." },
            {
              kind: "rule_list",
              items: [
                "Open the shared README first.",
                { text: "Do not skip owner routing.", children: ["Escalate to the workflow owner when routing is unclear."] }
              ]
            },
            {
              kind: "definition_list",
              items: [
                {
                  term: "packet",
                  definitions: ["The current handoff bundle.", "Only trust what the current owner proved."]
                }
              ]
            },
            ...fragments.ownerMap
          ]
        },
        {
          id: "shared_readme",
          surfaceClass: "shared_entrypoint",
          runtimePath: "paperclip_home/project_homes/editorial/shared/README.md"
        }
      ],
      surfaceSections: [
        {
          id: "read_first",
          surfaceId: "author_home",
          stableSlug: "read-first",
          title: "Read First",
          body: [
            { kind: "paragraph", text: "Read the shared owner map before lane-specific packets." },
            {
              kind: "ordered_steps",
              items: ["Open the shared README.", { text: "Then open the named owner.", children: ["Only then open packet doctrine."] }]
            },
            { kind: "code_block", code: "paperzod doctor setups/editorial/index.ts", language: "sh" }
          ]
        },
        {
          id: "role_contract",
          surfaceId: "author_home",
          stableSlug: "role-contract",
          title: "Role Contract"
        }
      ],
      generatedTargets: [
        { id: "author_read_first_target", path: "paperclip_home/agents/author/AGENTS.md", sourceIds: ["author"], sectionId: "read_first" },
        { id: "author_role_contract_target", path: "paperclip_home/agents/author/AGENTS.md", sourceIds: ["author"], sectionId: "role_contract" },
        { id: "shared_target", path: "paperclip_home/project_homes/editorial/shared/README.md", sourceIds: ["author"] }
      ],
      links: [
        { id: "documents_author_surface", kind: "documents", from: "author_home", to: "author" },
        { id: "documents_author_contract", kind: "documents", from: "role_contract", to: "author" },
        { id: "author_owns_read_first", kind: "owns", from: "author", to: "read_first" },
        {
          id: "author_reads_shared_readme",
          kind: "reads",
          from: "author",
          to: "shared_readme",
          condition: "When you are deciding which shared owner governs the issue.",
          context: "Read the whole shared map before opening packet-specific doctrine."
        }
      ]
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.documents.find((document) => document.id === "author_home")?.markdown).toMatchInlineSnapshot(`
      "# Author

      You are the Author.

      Your repo-owned role home is \`paperclip_home/agents/author/AGENTS.md\`.

      Start here before opening any packet-specific doctrine.

      - Open the shared README first.
      - Do not skip owner routing.
        - Escalate to the workflow owner when routing is unclear.

      - packet
        - The current handoff bundle.
        - Only trust what the current owner proved.

      | Owner | Primary doc |
      | --- | --- |
      | Editorial Project Lead | AUTHORITATIVE_EDITORIAL_WORKFLOW.md |

      <a id="read-first"></a>
      ## Read First

      Read the shared owner map before lane-specific packets.

      1. Open the shared README.
      2. Then open the named owner.
        1. Only then open packet doctrine.

      \`\`\`sh
      paperzod doctor setups/editorial/index.ts
      \`\`\`

      <a id="role-contract"></a>
      ## Role Contract

      Produce the runtime doctrine honestly.

      - No additional role boundaries are declared yet.
      - Read \`Shared Entrypoint\`. When: When you are deciding which shared owner governs the issue.. Context: Read the whole shared map before opening packet-specific doctrine..
      "
    `);
  });
});
