import { expectTypeOf, test } from "vitest";

import type { SetupInput, SetupModuleDef, SetupPart } from "../../src/source/index.js";
import { surfaceDocumentParts as releaseOpsSurfaceDocumentParts } from "../../setups/release_ops/surfaces.ts";
import { surfaceDocumentParts as editorialSurfaceDocumentParts } from "../../setups/editorial/surfaces.ts";
import releaseOpsSetup from "../../setups/release_ops/index.ts";
import editorialSetup from "../../setups/editorial/index.ts";

test("canonical setup modules keep plain semantic setup truth inside the source envelope", () => {
  expectTypeOf(editorialSetup).toMatchTypeOf<SetupModuleDef>();
  expectTypeOf(releaseOpsSetup).toMatchTypeOf<SetupModuleDef>();
  expectTypeOf(editorialSetup.setup).toMatchTypeOf<SetupInput>();
  expectTypeOf(releaseOpsSetup.setup).toMatchTypeOf<SetupInput>();
});

test("canonical setup packages expose modular helper-backed surface parts", () => {
  expectTypeOf(editorialSurfaceDocumentParts).toMatchTypeOf<readonly SetupPart[]>();
  expectTypeOf(releaseOpsSurfaceDocumentParts).toMatchTypeOf<readonly SetupPart[]>();
});
