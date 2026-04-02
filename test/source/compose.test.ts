import { describe, expect, it } from "vitest";

import { composeSetup, type SetupInput, type SetupPart } from "../../src/source/index.js";

describe("composeSetup", () => {
  it("merges setup parts into one plain SetupInput without mutating the base", () => {
    const baseSetup = {
      id: "editorial",
      name: "Editorial",
      roles: [{ id: "writer", name: "Writer", purpose: "Write the draft." }]
    };

    const docsPart: SetupPart = {
      surfaces: [{ id: "writer_home", surfaceClass: "role_home", runtimePath: "generated/writer/AGENTS.md" }],
      surfaceSections: [{ id: "writer_contract", surfaceId: "writer_home", stableSlug: "role-contract", title: "Role Contract" }]
    };

    const provenancePart: SetupPart = {
      generatedTargets: [
        {
          id: "writer_contract_target",
          path: "generated/writer/AGENTS.md",
          sourceIds: ["writer", "writer_contract"],
          sectionId: "writer_contract"
        }
      ],
      links: [
        { id: "writer_home_documents_writer", kind: "documents", from: "writer_home", to: "writer" },
        { id: "writer_contract_documents_writer", kind: "documents", from: "writer_contract", to: "writer" }
      ]
    };

    const composed = composeSetup(baseSetup, docsPart, provenancePart);

    expect(composed).toEqual({
      id: "editorial",
      name: "Editorial",
      roles: [{ id: "writer", name: "Writer", purpose: "Write the draft." }],
      surfaces: [{ id: "writer_home", surfaceClass: "role_home", runtimePath: "generated/writer/AGENTS.md" }],
      surfaceSections: [{ id: "writer_contract", surfaceId: "writer_home", stableSlug: "role-contract", title: "Role Contract" }],
      generatedTargets: [
        {
          id: "writer_contract_target",
          path: "generated/writer/AGENTS.md",
          sourceIds: ["writer", "writer_contract"],
          sectionId: "writer_contract"
        }
      ],
      links: [
        { id: "writer_home_documents_writer", kind: "documents", from: "writer_home", to: "writer" },
        { id: "writer_contract_documents_writer", kind: "documents", from: "writer_contract", to: "writer" }
      ]
    });

    expect(baseSetup).toEqual({
      id: "editorial",
      name: "Editorial",
      roles: [{ id: "writer", name: "Writer", purpose: "Write the draft." }]
    });
    expect(composed.roles).not.toBe(baseSetup.roles);
  });

  it("stays append-only instead of treating later parts as overrides", () => {
    const baseSetup: SetupInput = {
      id: "append_only",
      name: "Append Only",
      surfaces: [{ id: "shared_readme", surfaceClass: "shared_entrypoint", runtimePath: "generated/README.md" }]
    };

    const additionalPart: SetupPart = {
      surfaces: [{ id: "workflow_doc", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }]
    };

    const composed = composeSetup(baseSetup, additionalPart);

    expect(composed.surfaces).toEqual([
      { id: "shared_readme", surfaceClass: "shared_entrypoint", runtimePath: "generated/README.md" },
      { id: "workflow_doc", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }
    ]);
  });
});
