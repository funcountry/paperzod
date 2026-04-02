import { expectTypeOf, test } from "vitest";

import type { SetupInput, SetupPart } from "../../src/source/index.js";
import { surfaceDocumentParts as coreDevSurfaceDocumentParts } from "../../setups/core_dev/surfaces.ts";
import { surfaceDocumentParts as lessonsSurfaceDocumentParts } from "../../setups/lessons/surfaces.ts";
import coreDevSetup from "../../setups/core_dev/index.ts";
import lessonsSetup from "../../setups/lessons/index.ts";

test("canonical setup modules stay plain SetupInput values", () => {
  expectTypeOf(lessonsSetup).toMatchTypeOf<SetupInput>();
  expectTypeOf(coreDevSetup).toMatchTypeOf<SetupInput>();
});

test("canonical setup packages expose modular helper-backed surface parts", () => {
  expectTypeOf(lessonsSurfaceDocumentParts).toMatchTypeOf<readonly SetupPart[]>();
  expectTypeOf(coreDevSurfaceDocumentParts).toMatchTypeOf<readonly SetupPart[]>();
});
