---
title: "paperzod - Typed Ref Coverage And Helper Parity - Architecture Plan"
date: 2026-04-02
status: complete
fallback_policy: forbidden
owners: [aelaguiz, codex]
reviewers: [aelaguiz]
doc_type: architectural_change
related:
  - docs/PAPERZOD_TYPED_DOCTRINE_REFERENCES_AND_COMPOSITION_2026-04-02.md
  - docs/LESSONS_PAPERZOD_DRIFT_GAPS_AUDIT_2026-04-02.md
  - README.md
  - docs/requirements.md
  - docs/schema.md
  - docs/architecture.md
  - src/source/compose.ts
  - src/source/overrides.ts
  - src/source/builders.ts
  - src/core/defs.ts
  - src/checks/core-rules.ts
  - src/markdown/renderers/common.ts
---

# TL;DR

- Outcome:
  - Design the next round of `paperzod` as a small additive follow-on that closes setup-helper parity for setup-level lookup truth and expands typed ref coverage to a few already-modeled runtime-law targets, without reopening fragments, path projections, or richer section-contract semantics.
- Problem:
  - The finished typed-ref slice solved the main authored-prose drift problem, but three real gaps remain:
    - `composeSetup(...)` and `applyKeyedOverrides(...)` do not carry `catalogs` or `registries`
    - typed refs still stop at `artifact`, `surface`, `section`, `role`, and `command`
    - required composition is still intentionally presence-only
- Approach:
  - Treat this as one small framework-first follow-on:
    - make helper composition cover the full setup-level lookup surface
    - broaden graph-backed refs to existing compiler truth with good display semantics
    - add exactly one more operational catalog family through the same catalog seam
  - Keep the slice narrow:
    - no fragment-safe ref syntax
    - no clickable markdown links
    - no path-projection refs
    - no richer section contracts in this round
- Plan:
  - Implement in four depth-first phases:
    - helper-path parity for `catalogs` and `registries`
    - typed-ref coverage expansion for `review_gate`, `packet_contract`, `reference`, and `env_var`
    - proving fixtures, helper adoption, and docs
    - final verification and close-out
- Non-negotiables:
  - No fake catalog ids just to reuse an id-only override model.
  - The override API must stay boring and collection-obvious, not clever.
  - `env_var` must stay a narrow operational display seam, not a back door for path semantics, interpolation, shell policy, or environment validation philosophy.
  - No fragment parsing or markdown interpolation language.
  - No path-rendering overload hidden inside ordinary graph refs.
  - No clickable-link renderer policy in this slice.
  - No widening composition law beyond required-slug presence in this plan.

<!-- arch_skill:block:implementation_audit:start -->
# Implementation Audit (authoritative)
Date: 2026-04-02
Verdict (code): COMPLETE
Manual QA: n/a (non-blocking)

## Code blockers (why code is not done)
- none

## Reopened phases (false-complete fixes)
- none

## Missing items (code gaps; evidence-anchored; no tables)
- none

## Non-blocking follow-ups (manual QA / screenshots / human verification)
- none
<!-- arch_skill:block:implementation_audit:end -->

<!-- arch_skill:block:planning_passes:start -->
<!--
arch_skill:planning_passes
deep_dive_pass_1: done 2026-04-02
external_research_grounding: deferred 2026-04-02
deep_dive_pass_2: done 2026-04-02
recommended_flow: audit-implementation
note: Repo evidence and two parallel-agent deep-dive passes were sufficient to implement the slice. External research stayed deferred because implementation did not reopen the override-selector or operational-family choices.
-->
<!-- arch_skill:block:planning_passes:end -->

# 0) Holistic North Star

## 0.1 The claim (falsifiable)
> If `paperzod` extends helper composition to cover the full setup-level lookup surface and expands typed refs to a few already-modeled graph-backed targets plus one additional operational catalog family, while keeping fragments plain and composition law presence-only, then the next highest-value runtime-law drift gaps become framework truth without turning the source language into a second writing system. This claim is false if the design requires fake catalog identities, a clever override abstraction that hides collection identity, `env_var` widening into operational policy, path-projection semantics hidden inside ordinary refs, fragment parsing, or a mixed renderer policy for clickable links.

## 0.2 In scope
- UX surfaces (what users will see change):
  - setup authors can compose reusable setup parts that carry `catalogs` and `registries`
  - setup authors can override `registries` and `catalogs` through the normal helper path using stable selectors
  - authored TypeScript doctrine can reference `review_gate`, `packet_contract`, and `reference` targets without raw strings
  - authored TypeScript doctrine can use one additional operational ref family beyond commands, starting with environment variables
- Technical scope (what code and docs will change):
  - `src/source/compose.ts` helper composition parity
  - `src/source/overrides.ts` selector model for `registries` and `catalogs`
  - authored ref unions, helper sugar, checks, and renderer resolution for new graph-backed kinds
  - `CatalogKind` expansion from `command` to `command | env_var`
  - typed-ref fixtures, helper tests, schema docs, and example docs

## 0.3 Out of scope
- UX surfaces (what users must NOT see change):
  - no fragment-safe ref syntax in `.md` fragments
  - no auto-generated clickable markdown links from typed refs
  - no promise that every operational noun becomes typed in this round
  - no richer section contract semantics than required section presence
  - no claim that this slice solves all remaining doctrine drift
- Technical scope (explicit exclusions):
  - no new graph node kind just to represent catalogs
  - no fake `id` added to catalogs to satisfy override helpers
  - no `artifactPathRef(...)`, `surfacePathRef(...)`, or generic path-projection surface
  - no `workflow_step` typed ref in this round
  - no `sectionContracts` layer in this round
  - no path semantics, interpolation semantics, shell policy, or environment validation layer attached to `env_var`

Remaining unsolved drift after this slice should still be named plainly:
- workflow-step mentions
- exact path mentions
- fragment-resident drift-sensitive lines
- richer section-law assertions

## 0.4 Definition of done (acceptance evidence)
- `composeSetup(...)` can append `catalogs` and `registries` from setup parts without mutation or silent loss.
- `applyKeyedOverrides(...)` can target:
  - `registries` by stable `id`
  - `catalogs` by stable `kind`
- Typed refs can express at least:
  - `reviewGateRef(id)`
  - `packetContractRef(id)`
  - `referenceRef(id)`
  - `envVarRef(id)`
- Checks fail loudly for:
  - missing or wrong-kind new graph-backed refs
  - missing `env_var` catalog families or entries
  - broken helper override selectors
- Render output stays plain markdown and derives display text from canonical truth.
- The override surface reads plainly enough that a setup author can tell:
  - registries are selected by `id`
  - catalogs are selected by `kind`
- `env_var` behaves like a boring catalog-backed display ref and does not imply path, interpolation, shell, or validation semantics.
- Docs and examples explain the boundary clearly:
  - helper-path parity is now real
  - fragments still stay plain
  - richer section contracts remain follow-on work

## 0.5 Key invariants (fix immediately if violated)
- One source of truth per concept:
  - registries stay keyed by `id`
  - catalogs stay keyed by `kind`
- The override API must expose those identities plainly instead of hiding them behind a generalized abstraction.
- Helper composition must lower back into plain `SetupInput`, not a parallel helper-only shape.
- Inline refs continue to resolve before doc-node creation and render to plain markdown text.
- Graph-backed target identity and render projection stay separate concerns.
- `env_var` remains display-only operational truth, not a policy system.
- Required composition remains a presence contract only in this slice.
- No fallbacks, no silent drops, and no compatibility shims.

# 1) Key Design Considerations (what matters most)

## 1.1 Priorities (ranked)
1. Preserve a small, coherent framework surface instead of turning the follow-on work into a backlog-shaped feature pile.
2. Fix the helper-path parity gap because it is a real framework inconsistency, not just deferred capability.
3. Expand typed refs only where compiler truth and display semantics are already clean.
4. Keep composition-law strengthening explicitly out of this plan unless repo evidence proves it belongs here.

## 1.2 Constraints
- Existing public docs already teach `catalogs`, `registries`, and typed refs, so helper composition drift is now user-visible.
- `catalogs` are keyed by `kind`, not `id`, so override design cannot blindly reuse the registry shape.
- The current renderer resolves refs to plain text before doc-node creation, and this plan must preserve that boundary.
- The previous plan is already complete, so this must be framed as additive follow-on work, not a false-complete rewrite.
- The implementation only stays elegant if the override surface remains obvious to a setup author reading plain TypeScript.

## 1.3 Architectural principles (rules we will enforce)
- Stable selector by collection, not one override shape forced onto unlike identities.
- Favor obvious API shape over abstract API symmetry.
- Reuse existing graph and catalog lookup seams; do not add shadow lookup structures.
- Prefer one new operational family that proves the seam over many thin families.
- Keep render display truthful and boring:
  - names for graph-backed refs
  - backticked display strings for operational refs where appropriate
- Keep `env_var` narrow:
  - reference sanctioned environment-variable names
  - do not smuggle in operational policy

## 1.4 Known tradeoffs (explicit)
- Deferring `workflow_step` refs leaves some routing prose still string-backed, but avoids shipping a bad display contract based on raw step ids.
- Deferring path projections means some exact-path doctrine still stays string-backed, but keeps “refer to this artifact” distinct from “render this artifact’s runtime path.”
- Deferring richer section contracts means required composition stays presence-only for now, but avoids smuggling a new validation language into this slice.

# 2) Problem Statement (existing architecture + why change)

## 2.1 What exists today
- `paperzod` already supports:
  - setup-level `catalogs`
  - setup-level `registries`
  - typed refs for `artifact`, `surface`, `section`, `role`, and `command`
  - required section presence via `surface.requiredSectionSlugs[]`
- The completed slice proves those surfaces in authored TypeScript doctrine, checks, renderers, and docs.

## 2.2 What’s broken / missing (concrete)
- Helper composition is incomplete:
  - `composeSetup(...)` ignores part-level `catalogs` and `registries`
  - `applyKeyedOverrides(...)` cannot target either collection
- Typed refs still miss the next obvious graph-backed targets:
  - `review_gate`
  - `packet_contract`
  - `reference`
- Operational refs still stop at `command`, leaving sanctioned env vars as raw strings.
- Required composition still only means “this slug is present,” not richer section law.
- After this plan, the remaining expected unsolved drift should still be:
  - workflow-step mentions
  - exact path mentions
  - fragment-resident drift-sensitive lines
  - richer section-law assertions

## 2.3 Constraints implied by the problem
- The next slice should favor missing parity and low-entropy extension over broad capability ambition.
- Catalog identity must stay `kind`-based even if overrides broaden.
- The fragment boundary should remain explicit rather than eroded by convenience syntax.
- Richer section law deserves its own plan if it becomes important enough.

<!-- arch_skill:block:research_grounding:start -->
# 3) Research Grounding (external + internal “ground truth”)

## 3.1 External anchors (papers, systems, prior art)
- No external anchor is required for the first pass.
  - Adopt: repo-first design grounded in existing `paperzod` identity and renderer boundaries.
  - Reject: inventing a generic config or override framework detached from current compiler truth.

## 3.2 Internal ground truth (code as spec)
- Authoritative behavior anchors (do not reinvent):
  - `src/source/compose.ts` — the helper-layer append-only composition contract today; it still enumerates only legacy setup collections.
  - `src/source/overrides.ts` — the stable-selector override contract today; it is `id`-based and therefore incomplete for `catalogs`.
  - `src/source/builders.ts` — the authoring SSOT for `SetupInput`, `CatalogInput`, `RegistryInput`, and the current typed-ref helpers.
  - `src/core/defs.ts` — the authored inline-ref union and `CatalogKind` SSOT.
  - `src/graph/linker.ts` and `src/graph/queries.ts` — graph-adjacent lookup truth for catalogs and registries.
  - `src/markdown/renderers/common.ts` — the render boundary where refs resolve to plain markdown text.
  - `src/checks/core-rules.ts` — fail-loud check surface for typed refs and required-section presence.
- Existing patterns to reuse:
  - `test/source/compose.test.ts` — the existing helper-composition and keyed-override proof style.
  - `test/checks/typed-inline-refs.test.ts` — the current failure-surface test pattern for missing refs and missing catalog entries.
  - `test/fixtures/source/typed-doctrine-refs.ts` — the proving-fixture style for authored TS doctrine with inline refs.

## 3.3 Open questions from research
- Which single additional operational family best proves the existing catalog seam?
  - Settled for this plan: `env_var`, because it is operational, canonical, and does not collide with graph-owned runtime paths.
- Should the public override entry point be renamed?
  - Settled for this plan: keep `applyKeyedOverrides(...)`; broaden selector shape by collection instead of renaming first.
- Should richer section contracts be folded into this follow-on?
  - Settled for this plan: no; defer to a later dedicated contract layer.
- How broad should `env_var` become?
  - Settled for this plan: keep it boring and display-only; no attached path, interpolation, shell, or validation semantics.
<!-- arch_skill:block:research_grounding:end -->

<!-- arch_skill:block:current_architecture:start -->
# 4) Current Architecture (as-is)

## 4.1 On-disk structure
- Helper composition and overrides live in:
  - `src/source/compose.ts`
  - `src/source/overrides.ts`
- Source truth and helper sugar live in:
  - `src/source/builders.ts`
  - `src/source/schemas.ts`
  - `src/source/normalize.ts`
- Typed ref checks and render resolution live in:
  - `src/checks/core-rules.ts`
  - `src/markdown/renderers/common.ts`

## 4.2 Control paths (runtime)
- Helper composition path:
  - authored setup parts
  - `composeSetup(...)`
  - normalized setup
  - graph linker
  - checks
  - renderer
- Current gap:
  - `catalogs` and `registries` exist in `SetupInput`
  - helper composition and keyed overrides do not fully carry them

## 4.3 Object model + key abstractions
- `SetupInput` already includes `catalogs[]` and `registries[]`.
- `CatalogInput` is keyed by `kind`.
- `RegistryInput` is keyed by `id`.
- `AuthoredInlineRefDef` currently supports:
  - graph-backed refs for `artifact`, `surface`, and `role`
  - section refs by `{ surfaceId, stableSlug }`
  - catalog-backed refs through `catalogKind + entryId`
- `surface.requiredSectionSlugs[]` is the current composition law surface.

## 4.4 Observability + failure behavior today
- Missing typed refs fail in the check phase before render.
- Missing required section slugs fail in the check phase before render.
- Missing helper-path support does not fail loudly today:
  - setup parts with `catalogs` or `registries` are silently ignored by `composeSetup(...)`
  - override attempts for those collections are unavailable at the type and behavior layer

## 4.5 UI surfaces (ASCII mockups, if UI work)
- No UI work.
<!-- arch_skill:block:current_architecture:end -->

<!-- arch_skill:block:target_architecture:start -->
# 5) Target Architecture (to-be)

## 5.1 On-disk structure (future)
- Keep the same file families.
- Additive changes only:
  - helper-path parity in `src/source/compose.ts` and `src/source/overrides.ts`
  - typed-ref expansion in existing defs, builders, schemas, checks, graph queries, and renderers
  - one extra operational family in the existing catalog seam

## 5.2 Control paths (future)
- Setup helper path:
  - setup parts may contribute `catalogs` and `registries`
  - `composeSetup(...)` clones and appends them like the other top-level collections
  - `applyKeyedOverrides(...)` can target them with collection-appropriate stable selectors that remain obvious in plain TypeScript
- Authored ref path:
  - new graph-backed ref helpers lower into the same inline-ref union
  - `env_var` entries lower into the same catalog-backed ref path as `command`
  - checks validate existence and kind
  - renderers resolve display text from canonical truth to plain markdown text

## 5.3 Object model + abstractions (future)
- Helper parity model:
  - `SetupPart` covers the full additive setup surface, including `catalogs` and `registries`
  - `SetupOverrides` becomes collection-aware:
    - `registries`: `{ id, replace }`
    - `catalogs`: `{ kind, replace }`
  - the public surface should stay direct and readable, for example:
    - `registries: [{ id: "publish_result", replace: ... }]`
    - `catalogs: [{ kind: "env_var", replace: ... }]`
- Typed-ref model:
  - extend graph-backed ref kinds to include:
    - `review_gate`
    - `packet_contract`
    - `reference`
  - extend `CatalogKind` to:
    - `command`
    - `env_var`
  - add sugar helpers:
    - `reviewGateRef(id)`
    - `packetContractRef(id)`
    - `referenceRef(id)`
    - `envVarRef(id)`
    - `envVar(id, display, description?)`
  - `env_var` means “sanctioned environment-variable reference” only, not a broader runtime-policy abstraction
- Render policy:
  - graph-backed refs render from canonical node names or titles
  - `command` renders backticked command display
  - `env_var` renders backticked environment-variable display
  - no clickable links
  - no path projections

## 5.4 Invariants and boundaries
- `catalogs` remain graph-adjacent lookup truth, not routed graph nodes.
- Catalog override identity is `kind`, not a fake synthetic `id`.
- `applyKeyedOverrides(...)` remains a stable-selector API, not an array-position API or a clever abstraction layer.
- `workflow_step` refs stay out until display semantics improve.
- `env_var` stays narrow and does not imply path, interpolation, shell, or environment-validation behavior.
- `surface.requiredSectionSlugs[]` remains the only composition contract in this plan.
- Fragments stay plain and typed refs stay TypeScript-authored only.

## 5.5 UI surfaces (ASCII mockups, if UI work)
- No UI work.
<!-- arch_skill:block:target_architecture:end -->

<!-- arch_skill:block:call_site_audit:start -->
# 6) Call-Site Audit (exhaustive change inventory)

## 6.1 Change map (table)
| Area | File | Symbol / Call site | Current behavior | Required change | Why | New API / contract | Tests impacted |
| ---- | ---- | ------------------ | ---------------- | --------------- | --- | ------------------ | -------------- |
| Helper composition parity | `src/source/compose.ts` | `setupCollectionKeys`, `SetupPart`, `composeSetup(...)` | Only legacy node/link arrays are cloned and appended. | Include `catalogs` and `registries` in helper composition parity. | Reusable setup parts should not silently lose setup-level lookup truth. | Full additive `SetupPart` parity for lookup surfaces | `test/source/compose.test.ts`, `test/types/authoring.test.ts` |
| Stable-selector overrides | `src/source/overrides.ts` | `KeyedOverride`, `SetupOverrides`, `applyKeyedOverrides(...)` | Only `id`-keyed collections can be overridden. | Add collection-aware selectors so registries stay `id`-based and catalogs use `kind`. | Catalog identity is not `id`-based and should not be forced into one. | One override entry point with selector by collection | `test/source/compose.test.ts`, `test/types/authoring.test.ts` |
| Graph-backed ref union | `src/core/defs.ts` | `AuthoredNodeInlineRefDef`, `AuthoredInlineRefDef`, `CatalogKind` | Graph-backed refs stop at `artifact`, `surface`, and `role`. Catalogs stop at `command`. | Add `review_gate`, `packet_contract`, `reference`, and `env_var`. | These are the next clean doctrine targets already modeled by the compiler. | Expanded inline-ref union and catalog kind union | `test/source/nodes.test.ts`, `test/types/authoring.test.ts` |
| Authoring helpers | `src/source/builders.ts` | typed-ref helpers and catalog helpers | No helper sugar for the next graph-backed targets or env vars. | Add `reviewGateRef`, `packetContractRef`, `referenceRef`, `envVarRef`, and `envVar(...)`. | Readable authored doctrine is part of the feature contract. | Thin sugar over one existing inline-ref and catalog model | `test/types/authoring.test.ts`, typed-ref fixture updates |
| Source validation and normalization | `src/source/schemas.ts`, `src/source/normalize.ts` | inline-ref schemas, catalog schema, setup normalization | Validates only current ref kinds and command catalogs. | Validate and preserve the new ref kinds and `env_var` catalogs. | Missing or malformed source should fail before graph and checks. | Additive schema and normalization support | `test/source/nodes.test.ts`, `test/source/normalize.test.ts` |
| Graph-adjacent lookup | `src/graph/linker.ts`, `src/graph/queries.ts` | catalog lookup and node lookup helpers | Catalog lookup works for `command` only by type union; graph-backed display is broader than helper sugar. | Extend catalog lookup generically to `env_var` and reuse existing node lookups for the new graph-backed kinds. | Avoid new lookup systems. | Same graph-adjacent catalog seam, broader kind union | `test/graph/indexes.test.ts`, `test/checks/typed-inline-refs.test.ts` |
| Checks and renderers | `src/checks/core-rules.ts`, `src/markdown/renderers/common.ts` | typed-ref diagnostics and render resolution | Missing support for the new graph-backed kinds and `env_var`; no helper-path parity diagnostics. | Extend missing/wrong-kind checks and plain-text render resolution. | New refs must fail loudly and render from canonical truth. | Additive `check.inline_ref.*` coverage and render resolution | `test/checks/typed-inline-refs.test.ts`, `test/render/role-home-shared.test.ts`, `test/e2e/authored-content.test.ts` |
| Public docs and proving examples | `README.md`, `docs/schema.md`, `docs/example_typed_runtime_law.md`, `test/fixtures/source/typed-doctrine-refs.ts` | public story and proving examples | Docs teach commands only and do not mention helper-path parity limits. | Update examples and docs to show env-var refs, broader graph-backed refs, and helper parity. | The public story should match the actual framework surface. | Additive docs/example refresh | doc examples and existing targeted suites |

## 6.2 Migration notes
* Deprecated APIs (if any):
  - none planned; keep `applyKeyedOverrides(...)` and broaden its selector model instead of renaming first
* Delete list (what must be removed; include superseded shims/parallel paths if any):
  - no delete list expected
  - do not add fake catalog ids
  - do not add one-off path ref helpers in this slice

## 6.3 Pattern Consolidation Sweep (anti-blinders; scoped by plan)
| Area | File / Symbol | Pattern to adopt | Why (drift prevented) | Proposed scope |
| ---- | ------------- | ---------------- | ---------------------- | -------------- |
| Shared setup parts | `src/source/compose.ts`, `test/fixtures/source/shared-overrides.ts` | Full helper-path parity for setup-level lookup truth | Prevent silent drops when reuse moves catalogs or registries into shared parts | include |
| Shared override fixtures | `src/source/overrides.ts`, `test/source/compose.test.ts`, `test/fixtures/source/shared-overrides.ts` | Collection-aware stable selectors | Prevent fake ids and override drift for catalogs | include |
| Typed ref proving fixture | `test/fixtures/source/typed-doctrine-refs.ts` | Add one example each for `review_gate`, `packet_contract`, `reference`, and `env_var` | Keep the proving story aligned with the new public surface | include |
| Generic runtime-law example | `docs/example_typed_runtime_law.md` | Show env-var refs and shared setup-part composition | This is the clearest public proving surface for the follow-on work | include |
| Workflow-step refs | current typed-ref helpers and renderers | Add step refs only after a better display contract exists | Prevent raw-id prose from becoming a typed but still ugly surface | defer |
| Path projections | render helpers and public ref helpers | Separate display projection from target identity | Avoid muddling “this artifact” with “this artifact path” | defer |
| Richer section contracts | `surface.requiredSectionSlugs`, checks | Add a dedicated section-contract layer later if needed | Prevent hidden expansion of composition law in a ref-focused slice | defer |
| Fragment refs | `src/source/fragments.ts` | Keep fragments plain | Preserve the product boundary and migration rule | exclude |
| Clickable links | `src/markdown/renderers/**`, `src/doc/**` | Keep refs plain-text only | Avoid widening renderer and AST policy in this round | exclude |
<!-- arch_skill:block:call_site_audit:end -->

<!-- arch_skill:block:phase_plan:start -->
# 7) Depth-First Phased Implementation Plan (authoritative)

> Rule: systematic build, foundational first; every phase has exit criteria + explicit verification plan (tests optional). No fallbacks/runtime shims - the system must work correctly or fail loudly (delete superseded paths). Prefer programmatic checks per phase; defer manual/UI verification to finalization. Avoid negative-value tests (deletion checks, visual constants, doc-driven gates). Also: document new patterns/gotchas in code comments at the canonical boundary (high leverage, not comment spam).

## Phase 1 — Helper-Path Parity For Setup-Level Lookup Truth

Status: COMPLETE

Completed work:
- Extended `composeSetup(...)` so setup parts can contribute `catalogs` and `registries` through the normal append-only helper path.
- Broadened `applyKeyedOverrides(...)` to stay selector-based while matching real setup identity:
  - `registries` by `id`
  - `catalogs` by `kind`
- Added helper-path parity coverage and fail-loud override coverage in source and type tests.

* Goal:
  - Make `composeSetup(...)` and `applyKeyedOverrides(...)` cover the real setup-level lookup surface without inventing parallel identity models.
* Work:
  - Extend `src/source/compose.ts` so `SetupPart` and `composeSetup(...)` include `catalogs` and `registries`.
  - Extend `src/source/overrides.ts` so:
    - `registries` are overridden by stable `id`
    - `catalogs` are overridden by stable `kind`
  - Preserve the existing append-only semantics and fail-loud selector validation.
* Verification (smallest signal):
  - `npx vitest run test/source/compose.test.ts test/types/authoring.test.ts`
  - `npm run typecheck`
* Docs/comments (propagation; only if needed):
  - Add one short comment in `src/source/overrides.ts` explaining why catalogs use `kind` selectors instead of fake ids.
* Exit criteria:
  - Setup parts can contribute `catalogs` and `registries`.
  - Overrides can target them without array-position dependence or fake ids.
  - The public override surface still reads plainly and collection-appropriately in author code.
* Rollback:
  - Revert helper-path parity changes as one slice if selector ergonomics prove wrong.

## Phase 2 — Expand Typed Ref Coverage Through Existing Truth

Status: COMPLETE

Completed work:
- Extended graph-backed typed refs to cover `review_gate`, `packet_contract`, and `reference`.
- Extended the catalog seam from `command` to `command | env_var` without widening render or policy behavior.
- Added helper sugar for `reviewGateRef(...)`, `packetContractRef(...)`, `referenceRef(...)`, `envVarRef(...)`, and `envVar(...)`.
- Extended schemas, normalization, checks, renderer resolution, graph lookup coverage, and authoring tests through the existing seams.

* Goal:
  - Broaden typed refs only where the compiler already has clean identity and display truth.
* Work:
  - Extend the graph-backed inline-ref union for `review_gate`, `packet_contract`, and `reference`.
  - Extend `CatalogKind` to add `env_var`.
  - Add helper sugar for the new graph-backed targets and `envVar(...)` / `envVarRef(...)`.
  - Extend schemas, normalization, graph lookup, checks, and renderer resolution through the existing seams.
* Verification (smallest signal):
  - `npx vitest run test/source/nodes.test.ts test/source/normalize.test.ts test/checks/typed-inline-refs.test.ts test/graph/indexes.test.ts`
  - `npm run typecheck`
* Docs/comments (propagation; only if needed):
  - Add one short comment near the renderer switch clarifying that graph-backed identity and render projection remain separate concerns.
* Exit criteria:
  - New graph-backed refs and env-var refs validate, fail loudly, and render from canonical truth.
  - `env_var` remains a narrow catalog-backed display seam and does not pull in path or policy semantics.
  - No path ref helpers, fragment parsing, or clickable-link policy slipped in.
* Rollback:
  - Revert the additive ref-kind and env-var support without disturbing helper-path parity.

## Phase 3 — Prove The Authoring Story And Public Surface

Status: COMPLETE

Completed work:
- Extended the typed-doctrine proving fixture and its render/e2e expectations to cover `review_gate`, `packet_contract`, `reference`, and `env_var`.
- Added lookup-surface realism to the shared-overrides fixture so reusable setup parts now carry `catalogs` and `registries` through the normal helper path.
- Updated `README.md`, `docs/schema.md`, `docs/example_typed_runtime_law.md`, `docs/testing.md`, `docs/requirements.md`, `docs/architecture.md`, and `docs/example_editorial.md` so the public story matches the shipped surface and its boundaries.

* Goal:
  - Make the new helper and ref coverage visible in proving fixtures, examples, and docs.
* Work:
  - Extend `test/fixtures/source/typed-doctrine-refs.ts` with examples for the new graph-backed refs and `env_var`.
  - Add helper-path parity coverage to shared override fixtures where it improves realism.
  - Update:
    - `README.md`
    - `docs/schema.md`
    - `docs/example_typed_runtime_law.md`
  - Explicitly document that richer section contracts, path projections, fragments, and clickable links remain follow-on work.
* Verification (smallest signal):
  - `npx vitest run test/render/role-home-shared.test.ts test/e2e/authored-content.test.ts test/source/compose.test.ts`
  - `npm run typecheck`
* Docs/comments (propagation; only if needed):
  - no code comments expected beyond the canonical boundary notes from earlier phases
* Exit criteria:
  - The public story teaches the real new surface and the real boundaries.
  - Example authors can see the difference between graph-backed refs, operational refs, and deferred path/link features.
* Rollback:
  - Revert docs and proving-fixture adoption separately if teaching needs refinement while core code remains sound.

## Phase 4 — Final Verification And Honest Close-Out

Status: COMPLETE

Completed work:
- Ran the targeted verification sweep across helper composition, shared overrides, source normalization, graph lookup, typed-ref checks, render output, and end-to-end compile flow.
- Ran `npm run typecheck`, `npm run test:types`, `npm run build`, and `npm test`.
- Closed the plan with repo-wide green verification and docs that now match the shipped helper-parity and typed-ref surface.

* Goal:
  - Finish with the smallest honest proof that the follow-on slice shipped cleanly.
* Work:
  - Run the targeted verification sweep for helper parity, ref expansion, render behavior, and docs/example drift.
  - Run repo-wide verification only if the close-out needs a repo-green claim.
* Verification (smallest signal):
  - `npx vitest run test/source/compose.test.ts test/source/nodes.test.ts test/source/normalize.test.ts test/types/authoring.test.ts test/graph/indexes.test.ts test/checks/typed-inline-refs.test.ts test/render/role-home-shared.test.ts test/e2e/authored-content.test.ts`
  - `npm run typecheck`
  - `npm run build`
  - Run `npm test` only if the close-out needs a repo-wide green claim
* Docs/comments (propagation; only if needed):
  - Ensure final docs explicitly say richer section contracts stayed deferred.
* Exit criteria:
  - Helper parity and expanded typed refs are shipped, documented, and proven.
  - No contradictions remain between TL;DR, Section 0, Sections 5 through 7, and the public docs.
* Rollback:
  - Revert public-surface additions separately from core code if the code is right but the teaching story needs another pass.
<!-- arch_skill:block:phase_plan:end -->

# 8) Verification Strategy (common-sense; non-blocking)

## 8.1 Unit tests (contracts)
- Prefer source, helper, and check tests over wide snapshot churn.
- Verify helper-path parity directly in `test/source/compose.test.ts`.
- Verify new typed-ref kinds and `env_var` catalog behavior directly in source and check suites.

## 8.2 Integration tests (flows)
- Reuse authored-content and role-home render tests to prove plain markdown output still holds.
- Do not add fragment-parser or link-render tests because those are not in scope.

## 8.3 E2E / device tests (realistic)
- No device testing expected.

# 9) Rollout / Ops / Telemetry

## 9.1 Rollout plan
- Keep the surface additive.
- Existing typed refs and command catalogs continue unchanged.
- Setup authors can adopt helper-path parity and broader ref coverage incrementally.

## 9.2 Telemetry changes
- None expected beyond deterministic diagnostics.

## 9.3 Operational runbook
- Docs and proving examples must land with the feature.
- If implementation pressure tries to add path refs, fragment refs, or link rendering, stop and reopen scope instead of smuggling them in.
- After this slice lands, the remaining expected unsolved drift should still be:
  - workflow-step mentions
  - exact path mentions
  - fragment-resident drift-sensitive lines
  - richer section-law assertions

# 10) Decision Log (append-only)

## 2026-04-02 - Open a follow-on plan for typed ref coverage and helper parity

Context
- The finished typed-doctrine-refs slice is complete and audited.
- Follow-on feedback surfaced three real remaining gaps:
  - helper-path parity for `catalogs` and `registries`
  - broader ref coverage for already-modeled truth
  - richer section law still being presence-only

Decision
- Start a new follow-on plan instead of reopening the completed one.
- Center this plan on helper-path parity plus the next small typed-ref expansion.
- Treat richer section contracts as a deferred follow-on, not the main next slice.

Consequences
- The previous plan remains complete and truthful.
- This plan owns the next additive framework move.

Follow-ups
- Ground the slice in repo evidence and parallel-agent deep-dive before implementation.

## 2026-04-02 - Deep-dive resolves the scope to helper parity plus small ref expansion

Context
- Repo evidence and parallel-agent review pressure-tested several candidate follow-ons:
  - helper-path parity
  - broader graph-backed refs
  - more operational families
  - path rendering
  - richer section contracts
  - fragment-safe refs
  - clickable links

Decision
- Include:
  - helper-path parity for `catalogs` and `registries`
  - graph-backed refs for `review_gate`, `packet_contract`, and `reference`
  - `env_var` as the first additional operational family
- Defer:
  - `workflow_step` refs
  - path projections
  - richer section contracts
- Exclude:
  - fragment-safe refs
  - clickable rendered links

Consequences
- The slice stays small enough to phase and implement without redesigning the renderer or source-language boundary.
- `applyKeyedOverrides(...)` stays in place, but its selector model becomes collection-aware.

Follow-ups
- Phase the work depth-first around helper parity first, then ref expansion, then docs and close-out.

## 2026-04-02 - Scope lock tightened before implementation

Context
- Review feedback agreed the follow-on plan is strong, but warned about two implementation drift risks:
  - the override API could become too clever
  - `env_var` could become a Trojan horse for broader operational semantics

Decision
- Tighten the plan so the override surface must stay boring and collection-obvious.
- Tighten the plan so `env_var` stays a narrow display-oriented operational ref family.
- Name the expected remaining unsolved drift classes explicitly so implementation does not silently broaden.

Consequences
- Phase 1 now has a usability bar, not just a type-soundness bar.
- Phase 2 now has a scope bar, not just a feature bar.
- The artifact now says plainly what still remains unsolved after this slice.

Follow-ups
- Keep implementation inside these tightened boundaries unless the plan is explicitly reopened.
