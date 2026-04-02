import { expectTypeOf, test } from "vitest";

import type { AuthoredContentBlock } from "../../src/core/defs.js";
import {
  composeSetup,
  defineRole,
  defineRoleHomeTemplate,
  defineSetup,
  defineSurface,
  defineWorkflowStep,
  loadFragments,
  type SetupInput
} from "../../src/source/index.js";

test("authoring dsl is type-safe", () => {
  const setup = defineSetup({
    id: "typed_setup",
    name: "Typed Setup",
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
      artifacts: [{ id: "draft_packet", name: "DRAFT.md", artifactClass: "required" }]
    }),
    roleHome.document({
      surfaceId: "writer_home",
      runtimePath: "generated/writer/AGENTS.md",
      roleId: "writer",
      sections: {
        readFirst: { body: fragments.goal }
      }
    })
  );

  expectTypeOf(setup).toMatchTypeOf<SetupInput>();
  expectTypeOf(fragments.goal).toEqualTypeOf<AuthoredContentBlock[]>();
});
