# Worklog

Plan doc: /Users/aelaguiz/workspace/paperzod/docs/GENERIC_FRAMEWORK_LESSONS_SEPARATION_AND_COMPLETION_2026-04-02.md

## Initial entry
- Run started.
- Current phase: Phase 1 - Lock doctrine and the repo-local authoring contract.

## Phase 1 (Doctrine And Repo Contract) Progress Update
- Work completed:
  - Updated `AGENTS.md`, `README.md`, `package.json`, `tsconfig.json`, `tsconfig.build.json`, and `test/types/tsconfig.json`.
  - Declared the repo-local Node `>=24.12.0` and `setups/**` typecheck contract.
- Tests run + results:
  - `npm run typecheck` - passed.
  - `npm run test:types` - passed.
- Next steps:
  - Finish the generic renderer, target, and source-model cut.

## Phase 2-4 (Framework, CLI, Canonical Setups) Progress Update
- Work completed:
  - Added authored `surface.title` and `surface.intro`.
  - Removed Lessons-specific renderer logic from core fallback behavior.
  - Narrowed Paperclip path validation to family boundaries.
  - Added CLI `.ts/.mts/.cts` setup loading.
  - Promoted canonical setups under `setups/lessons/index.ts` and `setups/core_dev/index.ts`.
  - Rebased the main proof suites onto canonical setups or thin fixture re-exports.
- Tests run + results:
  - `npm run typecheck` - passed.
  - `npm run test:types` - passed.
  - `npm run build` - passed.
  - Focused `npx vitest run ...` suites for renderers, targets, CLI, e2e, parity, mutation, stability, perf, API, and source-model coverage - passed.
- Issues / deviations:
  - Canonical setup modules needed to become plain typed object exports instead of runtime builder imports so the Node-native source-mode contract stayed honest.
- Next steps:
  - Finish snapshot reconciliation and run the full release gate.

## Phase 5 (Release Gate) Progress Update
- Work completed:
  - Updated the affected inline snapshots and snapshot files after reading the renderer and canonical-path diffs.
  - Aligned docs and test-facing example command strings on `setups/**/index.ts`.
- Tests run + results:
  - `npm test` - passed.
- Next steps:
  - Close out the implementation run as complete.
