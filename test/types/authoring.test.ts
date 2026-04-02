import { expectTypeOf, test } from "vitest";

import { defineRole, defineSetup, defineSurface, defineWorkflowStep, type SetupInput } from "../../src/source/index.js";

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
