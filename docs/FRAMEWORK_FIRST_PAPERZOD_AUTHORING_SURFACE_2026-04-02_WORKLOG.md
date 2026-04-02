# Worklog

Plan doc: `/Users/aelaguiz/workspace/paperzod/docs/FRAMEWORK_FIRST_PAPERZOD_AUTHORING_SURFACE_2026-04-02.md`

## Initial entry
- Run started.
- Current phase: Phase 1 - Add the source-envelope boundary and setup-local check plumbing.

## Phase 1 (Add the source-envelope boundary and setup-local check plumbing) Progress Update
- Work completed:
  - Added the new source-envelope module and public exports.
  - Threaded resolved setup-module input through the public pipeline and CLI analysis path.
  - Added deterministic setup-local rule merging with duplicate-id failure.
  - Added proof across type, API, registry, validate, compile, and doctor surfaces.
- Tests run + results:
  - `npm run typecheck` — passed
  - `npm run build` — passed
  - `npx vitest run test/checks/registry.test.ts test/cli/doctor.test.ts test/cli/validate-compile.test.ts test/api/index.test.ts test/types/authoring.test.ts` — passed
- Issues / deviations:
  - One doctor setup-id fallback and one type assertion were corrected during the phase; no design drift was needed.
- Next steps:
  - Implement manifest-owned scopes and fail-loud prune behavior in plan, emit, and compile CLI surfaces.

## Phase 2 (Add owned-output manifest resolution and fail-loud prune lifecycle) Progress Update
- Work completed:
  - Extended the target manifest with resolved owned scopes plus overlap and out-of-scope validation.
  - Changed emit into a preflighted lifecycle that previews deletes in dry-run and fails loudly with `emit.prune_required` before any writes when `--prune` is missing.
  - Wired compile CLI through the new delete lifecycle and added proof for dry-run preview, blocked write mode, and successful pruned apply.
  - Updated emit and stability tests to the new success-or-diagnostics emit contract.
- Tests run + results:
  - `npm run build` — passed
  - `npx vitest run test/plan/targets.test.ts test/emit/index.test.ts test/stability/index.test.ts test/cli/validate-compile.test.ts` — passed
  - `npm run typecheck` — passed
- Issues / deviations:
  - The initial partial implementation still wrote files before deciding prune was required; that was corrected so write mode now preflights stale owned files before any mutation.
- Next steps:
  - Start Phase 3 by locating the highest-value shared projection repetition in the helper layer and lowering it without widening the semantic model.

## Phase 3 (Add shared projection helpers without widening the normalized model) Progress Update
- Work completed:
  - Added `projectDocumentSections(...)` in `src/source/projections.ts` as a helper-only lowering surface around existing templates.
  - Added template-level proof for shared section defaults, destination-local body and `documentsTo` overrides, and additive source provenance.
  - Switched the public editorial proving fixture to the projection helper while keeping the compiled output contract stable.
- Tests run + results:
  - `npm run typecheck` — passed
  - `npm run build` — passed
  - `npx vitest run test/source/templates.test.ts test/e2e/editorial-example.test.ts` — passed
- Issues / deviations:
  - The first pass needed a tighter generic bound to match the existing template document contract; no architecture change was required.
- Next steps:
  - Start Phase 4 at the composition seam and add explicit stable-id override helpers without changing `composeSetup(...)`.

## Phase 4 (Add explicit keyed overrides while keeping `composeSetup(...)` append-only) Progress Update
- Work completed:
  - Added `applyKeyedOverrides(...)` in `src/source/overrides.ts` with explicit replace-by-id semantics and loud failure on missing, duplicate, or id-changing overrides.
  - Kept `composeSetup(...)` append-only and unchanged.
  - Rebuilt the shared-overrides proving fixture around one shared setup plus local override functions instead of manual local restatement.
  - Updated compose and shared-overrides e2e proof to match the new stable shared ids and manifest shape.
- Tests run + results:
  - `npm run typecheck` — passed
  - `npm run build` — passed
  - `npx vitest run test/source/compose.test.ts test/e2e/shared-overrides.test.ts` — passed
- Issues / deviations:
  - The first pass needed a generic helper to keep override arrays keyed to the correct collection item type; no product or architecture drift was required.
- Next steps:
  - Start Phase 5 in the fragment loader and add narrow table support without widening toward general markdown parsing.

## Phase 5 (Widen fragment loading narrowly for table-backed authored blocks) Progress Update
- Work completed:
  - Added narrow pipe-table parsing in `src/source/fragments.ts` and lowered it directly to the existing authored `table` block.
  - Added focused fragment tests for successful table parsing and malformed separator failure with file context.
  - Switched the authored-content e2e proof to load its owner-map table from a real fragment fixture instead of an inline authored block.
- Tests run + results:
  - `npm run typecheck` — passed
  - `npm run build` — passed
  - `npx vitest run test/source/fragments.test.ts test/e2e/authored-content.test.ts` — passed
- Issues / deviations:
  - None beyond routine parser wiring.
- Next steps:
  - Start Phase 6, update the public docs and canonical proving surfaces, then run the final broad verification gate.

## Phase 6 (Update docs, examples, and canonical setups; run final repo proof) Progress Update
- Work completed:
  - Updated the public docs to show `defineSetupModule(...)`, projection helpers, keyed overrides, table fragments, and explicit prune ownership as real shipped surfaces.
  - Switched the canonical Lessons and Core Dev setup entrypoints to `defineSetupModule(...)` with explicit owned output scopes.
  - Reconciled the remaining proof surfaces and snapshots to the new ownership and setup-module contracts.
  - Finished the broad repo proof with the repo green.
- Tests run + results:
  - `npm run typecheck` — passed
  - `npm run test:types` — passed
  - `npm run build` — passed
  - `npx vitest run test/source/templates.test.ts test/source/compose.test.ts test/source/fragments.test.ts test/checks/registry.test.ts test/plan/targets.test.ts test/emit/index.test.ts test/cli/doctor.test.ts test/cli/validate-compile.test.ts test/e2e/editorial-example.test.ts test/e2e/shared-overrides.test.ts test/e2e/lessons-full.test.ts test/e2e/second-setup.test.ts` — passed
  - `npm test` — passed (`49` test files, `182` tests)
- Issues / deviations:
  - Final proof needed a small sweep across older tests and snapshots that still assumed canonical setups exported plain `SetupInput` or manifests without `ownedScopes`.
- Next steps:
  - None. The implementation run is complete.
