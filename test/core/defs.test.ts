import { describe, expect, expectTypeOf, it } from "vitest";

import type { ArtifactClass, LinkKind, SetupDef, SurfaceClass } from "../../src/core/defs.js";

describe("core defs", () => {
  it("exports the expected type families", () => {
    expectTypeOf<ArtifactClass>().toEqualTypeOf<"required" | "conditional" | "support" | "reference" | "legacy">();
    expectTypeOf<SurfaceClass>().toEqualTypeOf<
      | "role_home"
      | "shared_entrypoint"
      | "workflow_owner"
      | "packet_workflow"
      | "standard"
      | "gate"
      | "technical_reference"
      | "how_to"
      | "coordination"
    >();
    expectTypeOf<LinkKind>().toEqualTypeOf<
      | "owns"
      | "reads"
      | "produces"
      | "consumes"
      | "supports"
      | "checks"
      | "routes_to"
      | "documents"
      | "grounds"
      | "references"
      | "maps_to_runtime"
      | "generated_from"
    >();
  });

  it("supports snapshot-friendly plain setup defs", () => {
    const setupDef: SetupDef = {
      setup: {
        kind: "setup",
        id: "demo_minimal",
        name: "Demo Minimal"
      },
      roles: [
        {
          kind: "role",
          id: "author",
          setupId: "demo_minimal",
          name: "Author",
          purpose: "Create the artifact."
        }
      ],
      workflowSteps: [],
      reviewGates: [],
      packetContracts: [],
      artifacts: [],
      surfaces: [],
      surfaceSections: [],
      references: [],
      generatedTargets: [],
      links: []
    };

    expect(setupDef).toMatchInlineSnapshot(`
      {
        "artifacts": [],
        "generatedTargets": [],
        "links": [],
        "packetContracts": [],
        "references": [],
        "reviewGates": [],
        "roles": [
          {
            "id": "author",
            "kind": "role",
            "name": "Author",
            "purpose": "Create the artifact.",
            "setupId": "demo_minimal",
          },
        ],
        "setup": {
          "id": "demo_minimal",
          "kind": "setup",
          "name": "Demo Minimal",
        },
        "surfaceSections": [],
        "surfaces": [],
        "workflowSteps": [],
      }
    `);
  });
});
