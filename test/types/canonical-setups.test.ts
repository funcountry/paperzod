import { expectTypeOf, test } from "vitest";

import type { SetupInput } from "../../src/source/index.js";
import coreDevSetup from "../../setups/core_dev/index.ts";
import lessonsSetup from "../../setups/lessons/index.ts";

test("canonical setup modules stay plain SetupInput values", () => {
  expectTypeOf(lessonsSetup).toMatchTypeOf<SetupInput>();
  expectTypeOf(coreDevSetup).toMatchTypeOf<SetupInput>();
});
