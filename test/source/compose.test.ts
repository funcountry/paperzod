import { describe, expect, it } from "vitest";

import { applyKeyedOverrides, composeSetup, type SetupInput, type SetupPart } from "../../src/source/index.js";

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

  it("includes catalogs and registries when setup parts contribute lookup truth", () => {
    const baseSetup: SetupInput = {
      id: "lookup_base",
      name: "Lookup Base",
      catalogs: [{ kind: "command", entries: [{ id: "status", display: "./paperclip status" }] }]
    };

    const lookupPart: SetupPart = {
      catalogs: [{ kind: "command", entries: [{ id: "refresh", display: "./paperclip refresh" }] }],
      registries: [{ id: "publish_result", name: "Publish Result", entries: [{ id: "pass", label: "PASS" }] }]
    };

    const composed = composeSetup(baseSetup, lookupPart);

    expect(composed.catalogs).toEqual([
      { kind: "command", entries: [{ id: "status", display: "./paperclip status" }] },
      { kind: "command", entries: [{ id: "refresh", display: "./paperclip refresh" }] }
    ]);
    expect(composed.registries).toEqual([{ id: "publish_result", name: "Publish Result", entries: [{ id: "pass", label: "PASS" }] }]);
    expect(composed.catalogs).not.toBe(baseSetup.catalogs);
  });

  it("applies explicit keyed overrides without mutating the base setup", () => {
    const baseSetup: SetupInput = {
      id: "shared",
      name: "Shared",
      catalogs: [{ kind: "command", entries: [{ id: "paperclip_api_url", display: "./paperclip api-url" }] }],
      registries: [{ id: "publish_result", name: "Publish Result", entries: [{ id: "pass", label: "PASS" }] }],
      roles: [{ id: "writer", name: "Writer", purpose: "Write the draft." }],
      surfaces: [{ id: "writer_home", surfaceClass: "role_home", runtimePath: "generated/writer/AGENTS.md" }]
    };

    const overridden = applyKeyedOverrides(baseSetup, {
      catalogs: [
        {
          kind: "command",
          replace: (current) => ({
            ...current,
            entries: [...current.entries, { id: "paperclip_token", display: "./paperclip token" }]
          })
        }
      ],
      registries: [
        {
          id: "publish_result",
          replace: (current) => ({ ...current, entries: [...current.entries, { id: "fail", label: "FAIL" }] })
        }
      ],
      roles: [
        {
          id: "writer",
          replace: (current) => ({ ...current, purpose: "Write the draft with local constraints." })
        }
      ],
      surfaces: [
        {
          id: "writer_home",
          replace: (current) => ({ ...current, runtimePath: "generated/local/writer/AGENTS.md" })
        }
      ]
    });

    expect(overridden).toEqual({
      id: "shared",
      name: "Shared",
      catalogs: [
        {
          kind: "command",
          entries: [
            { id: "paperclip_api_url", display: "./paperclip api-url" },
            { id: "paperclip_token", display: "./paperclip token" }
          ]
        }
      ],
      registries: [
        {
          id: "publish_result",
          name: "Publish Result",
          entries: [
            { id: "pass", label: "PASS" },
            { id: "fail", label: "FAIL" }
          ]
        }
      ],
      roles: [{ id: "writer", name: "Writer", purpose: "Write the draft with local constraints." }],
      surfaces: [{ id: "writer_home", surfaceClass: "role_home", runtimePath: "generated/local/writer/AGENTS.md" }]
    });
    expect(baseSetup).toEqual({
      id: "shared",
      name: "Shared",
      catalogs: [{ kind: "command", entries: [{ id: "paperclip_api_url", display: "./paperclip api-url" }] }],
      registries: [{ id: "publish_result", name: "Publish Result", entries: [{ id: "pass", label: "PASS" }] }],
      roles: [{ id: "writer", name: "Writer", purpose: "Write the draft." }],
      surfaces: [{ id: "writer_home", surfaceClass: "role_home", runtimePath: "generated/writer/AGENTS.md" }]
    });
  });

  it("fails loudly on missing, duplicate, or id-changing overrides", () => {
    const baseSetup: SetupInput = {
      id: "shared",
      name: "Shared",
      catalogs: [{ kind: "command", entries: [{ id: "paperclip_api_url", display: "./paperclip api-url" }] }],
      registries: [{ id: "publish_result", name: "Publish Result", entries: [{ id: "pass", label: "PASS" }] }],
      roles: [{ id: "writer", name: "Writer", purpose: "Write the draft." }]
    };

    expect(() =>
      applyKeyedOverrides(baseSetup, {
        roles: [{ id: "critic", replace: { id: "critic", name: "Critic", purpose: "Review the draft." } }]
      })
    ).toThrow('Override collection "roles" references missing id "critic".');

    expect(() =>
      applyKeyedOverrides(baseSetup, {
        roles: [
          { id: "writer", replace: { id: "writer", name: "Writer", purpose: "One." } },
          { id: "writer", replace: { id: "writer", name: "Writer", purpose: "Two." } }
        ]
      })
    ).toThrow('Override collection "roles" reuses override ids: writer.');

    expect(() =>
      applyKeyedOverrides(baseSetup, {
        roles: [{ id: "writer", replace: { id: "critic", name: "Writer", purpose: "Wrong id." } }]
      })
    ).toThrow('Override collection "roles" may not change stable id "writer".');

    expect(() =>
      applyKeyedOverrides(baseSetup, {
        registries: [{ id: "missing_registry", replace: { id: "missing_registry", name: "Missing", entries: [] } }]
      })
    ).toThrow('Override collection "registries" references missing id "missing_registry".');

    expect(() =>
      applyKeyedOverrides(baseSetup, {
        catalogs: [
          { kind: "command", replace: { kind: "command", entries: [] } },
          { kind: "command", replace: { kind: "command", entries: [{ id: "refresh", display: "./paperclip refresh" }] } }
        ]
      })
    ).toThrow('Override collection "catalogs" reuses override kinds: command.');

    expect(() =>
      applyKeyedOverrides(baseSetup, {
        catalogs: [{ kind: "command", replace: { kind: "env_var", entries: [] } as never }]
      })
    ).toThrow('Override collection "catalogs" may not change stable kind "command".');
  });
});
