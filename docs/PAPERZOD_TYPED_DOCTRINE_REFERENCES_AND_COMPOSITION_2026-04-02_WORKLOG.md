# Worklog

Plan doc: `docs/PAPERZOD_TYPED_DOCTRINE_REFERENCES_AND_COMPOSITION_2026-04-02.md`

## Initial entry
- Run started.
- Current phase: Phase 1 — Source Contracts And Lookup Substrate.
- Initial artifact repair:
  - marked `deep_dive_pass_2` done in the plan doc
  - marked Phase 1 `Status: IN PROGRESS`

## Phase 1 (Source Contracts And Lookup Substrate) Progress Update
- Work completed:
  - added inline-text and inline-ref source defs
  - added command-backed catalog truth and `command(...)` / `commandRef(...)` authoring helpers
  - added `surface.requiredSectionSlugs`
  - added section lookup by `surfaceId + stableSlug`
  - added source, type, and graph tests for the new substrate
- Tests run + results:
  - `npx vitest run test/source/nodes.test.ts test/source/normalize.test.ts test/types/authoring.test.ts test/graph/indexes.test.ts test/core/defs.test.ts` — passed
  - `npm run typecheck` — passed
- Issues / deviations:
  - none
- Next steps:
  - add fail-loud check diagnostics for broken typed refs and missing required section families

## Phase 2 (Fail-Loud Enforcement) Progress Update
- Work completed:
  - added `check.inline_ref.*` diagnostics for missing, wrong-kind, section, and command-backed refs
  - added duplicate command-catalog diagnostics
  - added `check.surface.missing_required_section`
  - added dedicated check coverage for typed inline refs and extended surface checks
- Tests run + results:
  - `npx vitest run test/checks/surfaces.test.ts test/checks/typed-inline-refs.test.ts test/graph/indexes.test.ts` — passed
  - `npm run typecheck` — passed
- Issues / deviations:
  - none
- Next steps:
  - finish renderer-boundary resolution and prove plain-markdown output from typed refs

## Phase 3 (Render From Truth And Prove The Authored Experience) Progress Update
- Work completed:
  - added renderer-boundary inline-text resolution for graph-backed and command-backed refs
  - kept the doc AST plain while rendering typed refs to plain markdown
  - added `test/fixtures/source/typed-doctrine-refs.ts`
  - proved the authored experience in render and e2e coverage
- Tests run + results:
  - `npx vitest run test/e2e/authored-content.test.ts test/render/role-home-shared.test.ts` — passed
  - `npm run typecheck` — passed
- Issues / deviations:
  - none
- Next steps:
  - lower required template composition into `surface.requiredSectionSlugs` and adopt it in the proving setups

## Phase 4 (Adopt Required Composition In Templates And Proving Setups) Progress Update
- Work completed:
  - added `requiredSections` sugar on template definitions
  - lowered helper-local section keys into slug-based `surface.requiredSectionSlugs`
  - adopted the contract in the editorial and release-ops proving setups
  - extended the same contract to project-home-root and shared-entrypoint templates because the implementation stayed trivial and matched existing renderer assumptions
- Tests run + results:
  - `npx vitest run test/source/templates.test.ts test/render/role-home-shared.test.ts test/e2e/editorial-vertical-slice.test.ts test/e2e/release-ops.test.ts` — passed
  - `npm run typecheck` — passed
- Issues / deviations:
  - expanded adoption slightly beyond the original Phase 4 minimum because the same tiny contract also covered shared-entrypoint and project-home-root without adding new framework surface
- Next steps:
  - finish docs/examples and run the final verification sweep

## Phase 5 (Public Docs, Example Adoption, And Final Verification) Progress Update
- Work completed:
  - updated README, schema, requirements, architecture, testing, and public example docs
  - rewrote the generic typed runtime-law example around typed refs, catalogs, registries, evidence, and required composition
  - made the fragment migration rule explicit in the public story
  - finished the full targeted verification sweep plus `npm run build`
  - ran `npm test` and confirmed repo-wide green
- Tests run + results:
  - `npx vitest run test/source/nodes.test.ts test/source/normalize.test.ts test/types/authoring.test.ts test/graph/indexes.test.ts test/checks/surfaces.test.ts test/checks/typed-inline-refs.test.ts test/source/templates.test.ts test/e2e/authored-content.test.ts test/render/role-home-shared.test.ts test/e2e/editorial-vertical-slice.test.ts test/e2e/release-ops.test.ts` — passed
  - `npm run typecheck` — passed
  - `npm run build` — passed
  - `npm test` — passed
- Issues / deviations:
  - none
- Next steps:
  - implementation complete
