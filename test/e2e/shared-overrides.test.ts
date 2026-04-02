import { describe, expect, it } from "vitest";

import { compileSetup, createTargetAdapter } from "../../src/index.js";
import sharedOverridesSeed from "../fixtures/source/shared-overrides.js";

function compile(input: unknown) {
  return compileSetup(
    input,
    createTargetAdapter({
      name: "test",
      repoRoot: "/repo",
      outputRoot: "out"
    })
  );
}

describe("shared_overrides e2e", () => {
  it("compiles both consuming setups with stable local wording and paths", () => {
    const alpha = compile(sharedOverridesSeed.alpha);
    const beta = compile(sharedOverridesSeed.beta);

    expect(alpha.success).toBe(true);
    expect(beta.success).toBe(true);
    if (!alpha.success || !beta.success) {
      return;
    }

    expect({
      alpha: {
        manifest: alpha.data.manifest,
        rendered: alpha.data.documents.map((document) => ({ id: document.id, markdown: document.markdown }))
      },
      beta: {
        manifest: beta.data.manifest,
        rendered: beta.data.documents.map((document) => ({ id: document.id, markdown: document.markdown }))
      }
    }).toMatchInlineSnapshot(`
      {
        "alpha": {
          "manifest": {
            "adapterName": "test",
            "documentPaths": {
              "gate_surface": "/repo/out/generated/alpha/gates/shared_gate.md",
              "home": "/repo/out/generated/alpha/roles/shared_role/AGENTS.md",
              "packet_surface": "/repo/out/generated/alpha/packets/contract.md",
            },
            "outputRoot": "out",
            "ownedScopes": [],
            "repoRoot": "/repo",
          },
          "rendered": [
            {
              "id": "home",
              "markdown": "# Shared Role

      You are the Shared Role.

      Your repo-owned role home is \`generated/alpha/roles/shared_role/AGENTS.md\`.

      <a id="role-contract"></a>
      ## Role Contract

      Reusable role.

      - No additional role boundaries are declared yet.
      - No additional shared doctrine reads are declared yet.
      ",
            },
            {
              "id": "gate_surface",
              "markdown": "# Shared Gate

      This file owns what Shared Gate checks before work moves on.

      Use it with the governing workflow and any supporting standards for this gate.

      <a id="criteria"></a>
      ## Criteria

      Shared gate with alpha wording.

      - Checks that must pass: ALPHA_PACKET.md
      - Read before acting: none
      ",
            },
            {
              "id": "packet_surface",
              "markdown": "# Alpha Contract Workflow

      This packet workflow document describes the trusted packet contract.

      <a id="packet-shape"></a>
      ## Packet Shape

      Use Alpha Contract as the packet this surface expects readers to trust.

      - Read before acting: none
      - Conceptual artifacts: ALPHA_PACKET.md
      - Runtime artifacts: none
      ",
            },
          ],
        },
        "beta": {
          "manifest": {
            "adapterName": "test",
            "documentPaths": {
              "gate_surface": "/repo/out/generated/beta/gates/shared_gate.md",
              "home": "/repo/out/generated/beta/roles/shared_role/AGENTS.md",
              "packet_surface": "/repo/out/generated/beta/packets/contract.md",
            },
            "outputRoot": "out",
            "ownedScopes": [],
            "repoRoot": "/repo",
          },
          "rendered": [
            {
              "id": "home",
              "markdown": "# Shared Role

      You are the Shared Role.

      Your repo-owned role home is \`generated/beta/roles/shared_role/AGENTS.md\`.

      <a id="role-contract"></a>
      ## Role Contract

      Reusable role with beta-local wording.

      - No additional role boundaries are declared yet.
      - No additional shared doctrine reads are declared yet.
      ",
            },
            {
              "id": "gate_surface",
              "markdown": "# Shared Gate

      This file owns what Shared Gate checks before work moves on.

      Use it with the governing workflow and any supporting standards for this gate.

      <a id="criteria"></a>
      ## Criteria

      Shared gate with beta wording.

      - Checks that must pass: BETA_PACKET.md
      - Read before acting: none
      ",
            },
            {
              "id": "packet_surface",
              "markdown": "# Beta Contract Workflow

      This packet workflow document describes the trusted packet contract.

      <a id="packet-shape"></a>
      ## Packet Shape

      Use Beta Contract as the packet this surface expects readers to trust.

      - Read before acting: none
      - Conceptual artifacts: BETA_PACKET.md
      - Runtime artifacts: BETA_PACKET_RUNTIME.md
      ",
            },
          ],
        },
      }
    `);
  });

  it("preserves local differences without collapsing the setups together", () => {
    const alpha = compile(sharedOverridesSeed.alpha);
    const beta = compile(sharedOverridesSeed.beta);

    expect(alpha.success).toBe(true);
    expect(beta.success).toBe(true);
    if (!alpha.success || !beta.success) {
      return;
    }

    const alphaHome = alpha.data.documents.find((document) => document.id === "home")?.markdown;
    const betaHome = beta.data.documents.find((document) => document.id === "home")?.markdown;
    const betaPacket = beta.data.documents.find((document) => document.id === "packet_surface")?.markdown;

    expect(alphaHome).toContain("Reusable role.");
    expect(betaHome).toContain("Reusable role with beta-local wording.");
    expect(betaPacket).toContain("Runtime artifacts: BETA_PACKET_RUNTIME.md");
  });
});
