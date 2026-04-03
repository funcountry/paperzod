import { expectTypeOf, test } from "vitest";

import type { AuthoredContentBlock } from "../../src/core/defs.js";
import {
  artifactRef,
  command,
  commandRef,
  composeSetup,
  defineSetupModule,
  defineGateTemplate,
  defineRole,
  defineRoleHomeTemplate,
  defineSetup,
  defineSharedEntrypointTemplate,
  defineSurface,
  defineWorkflowStep,
  loadFragments,
  roleRef,
  sectionRef,
  surfaceRef,
  type SetupInput
} from "../../src/source/index.js";

test("authoring dsl is type-safe", () => {
  const setup = defineSetup({
    id: "typed_setup",
    name: "Typed Setup",
    registries: [
      {
        id: "publish_result",
        name: "Publish Result",
        entries: [{ id: "pass", label: "PASS" }]
      }
    ],
    roles: [defineRole({ id: "role_1", name: "Role 1", purpose: "Do the work." })],
    workflowSteps: [
      defineWorkflowStep({
        id: "step_1",
        roleId: "role_1",
        purpose: "Produce output.",
        requiredInputIds: [],
        requiredOutputIds: ["artifact_1"],
        stopLine: "Stop after the output is ready.",
        nextGateId: "gate_1"
      })
    ],
    surfaces: [defineSurface({ id: "surface_1", surfaceClass: "role_home", runtimePath: "generated/AGENTS.md" })]
  });

  expectTypeOf(setup).toMatchTypeOf<SetupInput>();
  expectTypeOf(setup).toExtend<SetupInput>();
});

test("helper-based authoring stays type-safe and lowers to SetupInput", () => {
  const roleHome = defineRoleHomeTemplate({
    id: "role_home",
    sections: [
      { key: "readFirst", title: "Read First" },
      { key: "roleContract", title: "Role Contract", stableSlug: "role-contract" }
    ] as const
  });
  const fragments = loadFragments(new URL("../fixtures/fragments/editorial/workflow/", import.meta.url), {
    goal: "goal.md"
  });
  const sharedEntrypoint = defineSharedEntrypointTemplate({
    id: "shared_entrypoint",
    sections: [{ key: "readOrder", title: "Read Order" }] as const
  });
  const gate = defineGateTemplate({
    id: "gate",
    sections: [{ key: "criteria", title: "Criteria" }] as const
  });

  const setup = composeSetup(
    defineSetup({
      id: "typed_editorial",
      name: "Typed Editorial",
      roles: [defineRole({ id: "writer", name: "Writer", purpose: "Write the draft." })],
      workflowSteps: [
        defineWorkflowStep({
          id: "draft_issue",
          roleId: "writer",
          purpose: "Draft the issue.",
          requiredInputIds: [],
          requiredOutputIds: ["draft_packet"],
          stopLine: "Stop when the draft is ready.",
          nextGateId: "review_gate"
        })
      ],
      reviewGates: [{ id: "review_gate", name: "Review Gate", purpose: "Check the draft.", checkIds: ["draft_packet"] }],
      registries: [
        {
          id: "publish_result",
          name: "Publish Result",
          entries: [{ id: "pass", label: "PASS" }]
        }
      ],
      artifacts: [
        {
          id: "draft_packet",
          name: "DRAFT.md",
          artifactClass: "required",
          evidence: {
            requiredArtifactIds: ["review_receipt"],
            requiredClaims: [{ id: "result", label: "Result", allowedValue: { registryId: "publish_result", entryId: "pass" } }]
          }
        },
        { id: "review_receipt", name: "REVIEW_RECEIPT.md", artifactClass: "support" }
      ]
    }),
    roleHome.document({
      surfaceId: "writer_home",
      runtimePath: "generated/writer/AGENTS.md",
      roleId: "writer",
      sections: {
        readFirst: { body: fragments.goal }
      }
    }),
    sharedEntrypoint.document({
      surfaceId: "shared_readme",
      runtimePath: "generated/README.md",
      sections: {
        readOrder: { documentsTo: "step_1" }
      }
    }),
    gate.document({
      surfaceId: "review_gate_surface",
      runtimePath: "generated/gates/REVIEW.md",
      reviewGateId: "review_gate"
    })
  );

  expectTypeOf(setup).toMatchTypeOf<SetupInput>();
  expectTypeOf(fragments.goal).toEqualTypeOf<AuthoredContentBlock[]>();
});

test("typed doctrine ref helpers stay type-safe inside authored TS blocks", () => {
  const setup = defineSetup({
    id: "typed_refs",
    name: "Typed Refs",
    catalogs: [{ kind: "command", entries: [command("paperclip_status", "./paperclip status")] }],
    roles: [defineRole({ id: "author", name: "Author", purpose: "Author the doctrine." })],
    artifacts: [{ id: "action_authority", name: "ACTION_AUTHORITY.md", artifactClass: "required" }],
    surfaces: [
      defineSurface({
        id: "author_home",
        surfaceClass: "role_home",
        runtimePath: "generated/author/AGENTS.md",
        requiredSectionSlugs: ["read-first", "role-contract"],
        preamble: [
          {
            kind: "paragraph",
            text: ["Read ", artifactRef("action_authority"), " before asking ", roleRef("author"), " to act."]
          },
          {
            kind: "paragraph",
            text: ["Then open ", sectionRef({ surfaceId: "workflow_surface", stableSlug: "owner-map" }), " in ", surfaceRef("workflow_surface"), "."]
          },
          {
            kind: "paragraph",
            text: ["Run ", commandRef("paperclip_status"), " before changing runtime docs."]
          }
        ]
      })
    ]
  });

  expectTypeOf(setup).toMatchTypeOf<SetupInput>();
});

test("setup module authoring stays type-safe", () => {
  const module = defineSetupModule({
    setup: defineSetup({
      id: "typed_module_setup",
      name: "Typed Module Setup",
      roles: [defineRole({ id: "role_1", name: "Role 1", purpose: "Do the work." })]
    }),
    checks: [
      {
        id: "typed_local_rule",
        run: () => []
      }
    ],
    outputOwnership: [{ kind: "root", path: "generated/typed_module" }]
  });

  expectTypeOf(module.setup).toMatchTypeOf<SetupInput>();
  expectTypeOf(module.outputOwnership).toMatchTypeOf<readonly { kind: "root"; path: string }[]>();
});
