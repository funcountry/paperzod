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
              "alpha_gate_surface": "/repo/out/generated/alpha/gates/shared_gate.md",
              "alpha_home": "/repo/out/generated/alpha/roles/shared_role/AGENTS.md",
              "alpha_packet_surface": "/repo/out/generated/alpha/packets/contract.md",
            },
            "outputRoot": "out",
            "repoRoot": "/repo",
          },
          "rendered": [
            {
              "id": "alpha_gate_surface",
              "markdown": "# Gate: Shared Gate

      This gate document records review and acceptance checks.

      <a id="criteria"></a>
      ## Criteria

      Shared gate with alpha wording.

      - Checks: alpha_packet
      - Reads: none
      ",
            },
            {
              "id": "alpha_packet_surface",
              "markdown": "# Packet Workflow: Alpha Contract

      This packet workflow document describes the trusted packet contract.

      <a id="packet-shape"></a>
      ## Packet Shape

      Packet contract for Alpha Contract.

      - Reads: none
      - Conceptual artifacts: alpha_packet
      - Runtime artifacts: none
      ",
            },
            {
              "id": "alpha_home",
              "markdown": "# Role Home: Shared Role

      This role-home document states the contract for one runtime role.

      <a id="role-contract"></a>
      ## Role Contract

      Reusable role.

      - Reads: none
      ",
            },
          ],
        },
        "beta": {
          "manifest": {
            "adapterName": "test",
            "documentPaths": {
              "beta_gate_surface": "/repo/out/generated/beta/gates/shared_gate.md",
              "beta_home": "/repo/out/generated/beta/roles/shared_role/AGENTS.md",
              "beta_packet_surface": "/repo/out/generated/beta/packets/contract.md",
            },
            "outputRoot": "out",
            "repoRoot": "/repo",
          },
          "rendered": [
            {
              "id": "beta_gate_surface",
              "markdown": "# Gate: Shared Gate

      This gate document records review and acceptance checks.

      <a id="criteria"></a>
      ## Criteria

      Shared gate with beta wording.

      - Checks: beta_packet
      - Reads: none
      ",
            },
            {
              "id": "beta_packet_surface",
              "markdown": "# Packet Workflow: Beta Contract

      This packet workflow document describes the trusted packet contract.

      <a id="packet-shape"></a>
      ## Packet Shape

      Packet contract for Beta Contract.

      - Reads: none
      - Conceptual artifacts: beta_packet
      - Runtime artifacts: beta_packet_runtime
      ",
            },
            {
              "id": "beta_home",
              "markdown": "# Role Home: Shared Role

      This role-home document states the contract for one runtime role.

      <a id="role-contract"></a>
      ## Role Contract

      Reusable role with beta-local wording.

      - Reads: none
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

    const alphaHome = alpha.data.documents.find((document) => document.id === "alpha_home")?.markdown;
    const betaHome = beta.data.documents.find((document) => document.id === "beta_home")?.markdown;
    const betaPacket = beta.data.documents.find((document) => document.id === "beta_packet_surface")?.markdown;

    expect(alphaHome).toContain("Reusable role.");
    expect(betaHome).toContain("Reusable role with beta-local wording.");
    expect(betaPacket).toContain("Runtime artifacts: beta_packet_runtime");
  });
});
