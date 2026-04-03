---
title: "paperzod - Role-Home Section Emission Fix - Architecture Plan"
date: 2026-04-03
status: complete
fallback_policy: forbidden
owners: [aelaguiz, codex]
reviewers: [aelaguiz]
doc_type: architectural_change
related:
  - ../paperclip_agents/docs/PAPERZOD_ROLE_HOME_SECTION_EMISSION_REQUEST_2026-04-03.md
  - docs/requirements.md
  - docs/schema.md
  - docs/architecture.md
  - src/source/templates.ts
  - src/source/projections.ts
  - src/checks/core-rules.ts
  - src/plan/index.ts
  - src/markdown/renderers/common.ts
  - src/markdown/renderers/role-home.ts
  - test/source/templates.test.ts
  - test/render/role-home-shared.test.ts
  - test/e2e/authored-content.test.ts
---

# TL;DR

- Outcome:
  - Add a framework-level sparse section-emission model for role-home template usage so optional child sections only appear when a destination actually opts in or owns real section content, and so empty emitted role-home sections never render misleading generic fallback text.
- Problem:
  - Today `paperzod` lowers every declared template section into every destination document, keeps those sections in the compile plan, and then lets shared documented-node fallback plus `role_home`-specific fallback fill some empty sections with generic role text. That produces authoritative-looking headings that do not actually own the doctrine they display.
- Approach:
  - Introduce explicit section-emission policy in the source/template layer, keep required canonical role-home sections fail-loud, and harden the check/render path so an empty emitted role-home section can only be omitted, diagnosed, or satisfied by explicit content, never by accidental generic fallback.
- Plan:
  - Completed the repo-grounded research, deep dive, phase-plan, and implementation passes. The shipped fix spans source-layer sparse emission, render and check hardening, compile-plan proof, and public docs plus test updates.
- Non-negotiables:
  - No Lessons-specific branches in `src/**`.
  - No misleading heading-plus-generic-body output for empty role-home sections.
  - Required canonical sections must remain explicit and fail loudly when omitted.
  - Optional sparse sections must preserve stable slug and section identity for the sections that do emit.
  - No runtime shims, fake placeholder bodies, or second source of truth for section presence.

<!-- arch_skill:block:implementation_audit:start -->
# Implementation Audit (authoritative)
Date: 2026-04-03
Verdict (code): COMPLETE
Manual QA: n/a (non-blocking)

## Code blockers (why code is not done)
- None. The audit confirmed the planned code-verifiable obligations landed at the intended framework boundaries:
  - Source-layer section-emission contract in `src/source/templates.ts` (`DocumentTemplateSection.emissionPolicy`, emitted-section resolution before lowering, and ancestor auto-emission).
  - Shared render and role-home fallback hardening in `src/markdown/renderers/common.ts` and `src/markdown/renderers/role-home.ts`.
  - Fail-loud empty role-home section enforcement in `src/checks/core-rules.ts`.
  - Proof coverage across source, checks, plan, e2e, emit, and CLI suites.

## Reopened phases (false-complete fixes)
- None.

## Missing items (code gaps; evidence-anchored; no tables)
- None.
- Audit notes:
  - `src/source/projections.ts` did not require a code change because merged destination section options still flow through `template.document(...)`, and sparse emission now resolves before lowering in `src/source/templates.ts`.
  - `src/plan/index.ts` did not require a code change because omitted optional sections no longer reach graph or plan construction after the source-layer cutover.
  - Direct lowered role-home fixtures that rely on canonical fallback now declare `requiredSectionSlugs` explicitly in the relevant fixtures and CLI proof cases.

## Non-blocking follow-ups (manual QA / screenshots / human verification)
- None.
<!-- arch_skill:block:implementation_audit:end -->

<!-- arch_skill:block:planning_passes:start -->
<!--
arch_skill:planning_passes
deep_dive_pass_1: done 2026-04-03
external_research_grounding: not started
deep_dive_pass_2: not started
recommended_flow: complete (audited 2026-04-03)
note: Repo evidence was sufficient for research and deep dive. Implementation and audit are complete and verified locally.
-->
<!-- arch_skill:block:planning_passes:end -->

# 0) Holistic North Star

## 0.1 The claim (falsifiable)
> If `paperzod` adds explicit sparse section-emission semantics in the template/projection layer and makes `role_home` rendering plus checks treat empty emitted sections as omission-or-diagnostic states rather than as generic role fallback opportunities, then role-home headings such as `Copy Standards` or `Publish And Followthrough` will only appear when that destination actually owns content or emitted child content for them. This claim is false if empty optional sections still reach markdown with generic role text, if required canonical sections become silently droppable, or if the design requires Lessons-specific branches or fake empty bodies to suppress fallback behavior.

## 0.2 In scope
- UX surfaces (what users will see change):
  - setup-author behavior for role-home templates and projected role-home documents when some child sections are shared concepts but not universal
  - compile diagnostics or deterministic omission behavior when a role-home section would otherwise render as an empty heading with misleading generic content
  - public docs and examples that explain how required sections, optional sparse child sections, and role-home fallback behavior now work
- Technical scope (what code and docs will change):
  - template and projection contracts in `src/source/templates.ts` and `src/source/projections.ts`
  - the role-home render path in `src/markdown/renderers/role-home.ts`
  - any shared render or section-tree logic in `src/markdown/renderers/common.ts` or plan plumbing that must distinguish emitted versus non-emitted sections honestly
  - check-layer diagnostics in `src/checks/core-rules.ts` for misleading empty role-home sections
  - proving tests and docs that show one shared role-home template projecting sparse child sections across multiple destinations

## 0.3 Out of scope
- UX surfaces (what users must NOT see change):
  - no local Lessons cleanup, wording cleanup, or doctrine pruning under `../paperclip_agents/doctrine_src/lessons/**`
  - no promise that every surface family in `paperzod` gains the exact same sparse-section behavior in the first slice
  - no new placeholder-text workflow unless the plan later proves it is necessary
- Technical scope (explicit exclusions):
  - no fragment-parser expansion
  - no markdown-AST rewrite
  - no setup-specific branches in `src/**`
  - no silent compatibility shim that keeps emitting empty role-home sections and merely changes the prose under them
  - no second planning surface outside this canonical doc

## 0.4 Definition of done (acceptance evidence)
- The framework has one explicit rule for when a template-declared role-home section emits versus stays absent.
- The framework has one explicit rule for what happens when a role-home section is emitted but has no authored body and no emitted child sections.
- A shared role-home template can declare reusable child sections once and project them to multiple destinations without forcing empty child sections into every destination.
- Required canonical role-home sections such as `read-first` and `role-contract` still fail loudly when omitted.
- An optional sparse section that does emit still has stable `id`, `stableSlug`, and expected plan/render provenance.
- The framework surfaces a clear diagnostic for misleading empty emitted role-home sections, or the architecture makes such sections impossible to reach render at all.
- The proving signals stay small and honest:
  - source/template tests for sparse emission behavior
  - check tests for misleading empty-section diagnostics
  - render or e2e tests showing that a destination without optional section content does not render the misleading heading

## 0.5 Key invariants (fix immediately if violated)
- A role-home heading may not imply doctrine ownership that the destination did not actually configure.
- Empty role-home sections with no authored body and no emitted children may not fall back to generic role prose.
- Required canonical sections remain compiler-owned truth, not local convention.
- Optional sparse sections must be explicit in source semantics, not inferred by ad hoc renderer heuristics alone.
- Template lowering remains plain setup truth after source-layer sugar resolves.
- Stable section ids and slugs for emitted sections remain deterministic.
- The same source configuration must not produce different section presence depending on render-time guesswork.
- Fail-loud boundaries stay the default. No runtime shims and no fake filler bodies just to preserve old behavior.

# 1) Key Design Considerations (what matters most)

## 1.1 Priorities (ranked)
1. Remove misleading role-home output before adding new authoring convenience.
2. Make sparse optional child-section emission explicit and predictable.
3. Keep required canonical sections strict and generic.
4. Preserve the existing "helpers lower into plain setup truth" architecture.
5. Keep the first slice small enough to explain and prove with a few targeted tests.

## 1.2 Constraints
- `src/source/templates.ts` currently lowers every declared template section into every destination document.
- `src/source/projections.ts` merges shared and local section options, but it still calls the template document factory that emits all declared sections.
- `src/plan/index.ts` expects every realized `surface_section` to be backed by generated-target provenance.
- `src/markdown/renderers/common.ts` renders every planned section in the tree.
- `src/markdown/renderers/common.ts` and `src/markdown/renderers/role-home.ts` both currently participate in body-less role-home fallback behavior.

## 1.3 Architectural principles (rules we will enforce)
- Section presence must be decided by source-layer truth, not by accidental render fallback.
- Omission and diagnosis are both safer than misleading fallback output.
- Requiredness and optionality must be explicit and composable.
- Renderer hardening may prevent false output, but it should not become the only source of truth for section-emission semantics.
- The public API must stay framework-generic and not encode Lessons names or doctrine families.

## 1.4 Known tradeoffs (explicit)
- A role-home-only hardening pass is the fastest trust fix, but by itself it does not solve sparse projected child-section reuse.
- A generic optional-section model is cleaner long-term, but it widens template authoring surface and needs careful required-section interaction.
- Diagnosing misleading empty sections is valuable even if sparse emission lands, because authors can still accidentally configure a section shell without real content.
- Omitting empty optional sections is cleaner for runtime output, but it makes source-layer intent and plan provenance rules more important.
- Renderer-only hardening and projection-only sparse mode are both smaller moves, but each leaves a second place where section truth can still drift.

# 2) Problem Statement (existing architecture + why change)

## 2.1 What exists today
- Role-home templates and projections lower all declared sections into ordinary `surfaceSections`, `generatedTargets`, and `documents` links.
- `defineRoleHomeTemplate(...)` also gives every emitted role-home section a default section-level `documentsTo -> roleId` path.
- The compile plan includes every realized section that lowering produced.
- Shared render logic renders every planned section in the document tree.
- Shared fallback rendering can already fill any body-less role-documented section with generic role-derived text, and the role-home renderer adds extra family-specific fallback for `read-first` and `role-contract`.

## 2.2 What's broken / missing (concrete)
- A destination can inherit a template-declared section that has no authored body and no emitted child content for that specific role home.
- That empty section can still survive into the document and display a heading that looks authoritative.
- In the current render path, an empty emitted role-home section can then display generic role purpose, boundaries, or read guidance under the wrong heading.
- The source layer has no explicit sparse child-section emission contract for shared role-home template projections.

## 2.3 Constraints implied by the problem
- The fix must separate required canonical section families from optional reusable child sections.
- The architecture must make section presence observable before output is trusted.
- Any renderer fallback that remains must be limited to sections whose fallback content is semantically correct for that exact family.
- The source, check, plan, and render layers must agree on whether a section exists.

# 3) Research Grounding (external + internal “ground truth”)

<!-- arch_skill:block:research_grounding:start -->
## 3.1 External anchors (papers, systems, prior art)
- None needed yet.
- The repo evidence is already strong enough to ground the first design pass.
- External research should reopen only if `phase-plan` still finds ambiguity in the generic sparse-section API shape after this repo-grounded deep dive.

## 3.2 Internal ground truth (code as spec)
- Authoritative behavior anchors:
  - `src/source/templates.ts` — `createDocumentPart(...)` unconditionally lowers every normalized template section into `surfaceSections`, `generatedTargets`, and section-level `documents` links. There is no sparse-emission filter in that loop.
  - `src/source/templates.ts` — `defineRoleHomeTemplate(...)` sets `surfaceDocumentsTo: [options.roleId]` and `sectionDocumentsTo: () => [options.roleId]`, so every emitted role-home section defaults to documenting the role.
  - `src/source/projections.ts` — `projectDocumentSections(...)` only merges shared and local section options, then still calls `template.document(...)`. Projection therefore cannot suppress template-declared sections today.
  - `src/plan/index.ts` — `buildCompilePlan(...)` treats every lowered `surface_section` as real output truth and requires generated-target provenance for each one. Render-only omission is not enough.
  - `src/markdown/renderers/common.ts` — `getSectionBlocks(...)` renders authored section bodies when present, otherwise falls back to documented-node descriptions. For role-documented sections, that means generic role purpose, boundaries, or read guidance can appear under any empty emitted heading.
  - `src/markdown/renderers/role-home.ts` — `renderRoleHomeDocument(...)` adds extra fallback only for `read-first` and `role-contract`, but empty role-home sections are already unsafe before those cases because shared rendering still uses documented-node fallback.
  - `src/checks/core-rules.ts` — surface semantics already validate parent-child shape, duplicate slugs, parent order, and `surface.requiredSectionSlugs`, but there is no current diagnostic for a misleading empty emitted role-home section.
  - `src/graph/indexes.ts` and `src/core/graph.ts` — `childSectionIdsBySectionId`, `surfaceSectionIdsBySurfaceId`, and `sectionIdBySurfaceIdAndStableSlug` already exist, so checks can reason about child presence and required section families without new graph infrastructure.
  - `test/source/templates.test.ts` — current projection proof explicitly locks in universal role-home emission even when only one section is configured locally.
  - `test/render/role-home-shared.test.ts` and `test/e2e/authored-content.test.ts` — current render and compile proofs lock in body-less role-home fallback behavior.
  - `test/e2e/hierarchical-sections.test.ts` — hierarchical section rendering already works and the doc AST can render parent sections plus children without inventing new markdown primitives.
- Existing patterns to reuse:
  - `src/source/templates.ts` — `requiredSections` already lowers to `surface.requiredSectionSlugs` through `resolveRequiredSectionSlugs(...)`. That is the right pattern to preserve for canonical required section families.
  - `src/checks/core-rules.ts` — `check.surface.missing_required_section` is already the generic fail-loud enforcement for required section families.
  - `src/source/projections.ts` — `mergeSections(...)` is already the helper-layer seam where “shared config plus destination config” is computed. If sparse emission depends on “configured vs unconfigured,” this seam already exists.
  - `src/markdown/renderers/role-home.ts` — `renderSectionBlocks(...)` is the local hardening hook for role-home-specific behavior, but it should refine trusted fallback semantics rather than become the only source of section truth.
  - `src/graph/indexes.ts` plus `src/checks/core-rules.ts` — child-section indexes and existing surface checks can support a fail-loud “empty emitted optional role-home section” diagnostic once emitted-section truth is explicit.

## 3.3 Open questions from research
- Where should sparse emission truth live after lowering?
  - Evidence needed: `createDocumentPart(...)` currently erases template provenance. If later stages need to know whether a section was optional or `whenConfigured`, that truth must either survive lowering or be resolved completely before lowering.
- Should the new contract be per-template-section metadata, projection-mode behavior, or both?
  - Evidence needed: `projectDocumentSections(...)` already knows which section keys were configured, while `defineRoleHomeTemplate(...)` owns section declarations and required-section sugar.
- What exactly should happen for empty required sections?
  - Evidence needed: required-section enforcement today checks presence, not authored body content, and `read-first` / `role-contract` currently rely on fallback for usability.
- Should the misleading-empty-section guard be omission-only, diagnostic-only, or layered?
  - Evidence needed: checks can detect missing body and child absence, but they cannot express “this section exists only because the template declared it” unless the source-layer contract makes that truth explicit.
- Should the first implementation slice ship a generic contract with role homes as the first proving case, or widen sparse optionality across all template families immediately?
  - Evidence needed: the helper architecture is generic, but the concrete trust bug is demonstrated in role-home behavior.
<!-- arch_skill:block:research_grounding:end -->

# 4) Current Architecture (as-is)

<!-- arch_skill:block:current_architecture:start -->
## 4.1 On-disk structure
- `docs/architecture.md` and `docs/schema.md` already describe the governing rule correctly: helpers lower into plain setup truth, then graph, checks, plan, and render operate on that lowered truth.
- `src/source/templates.ts` and `src/source/projections.ts` are the only helper-layer seams that currently decide section declarations and projection merges.
- `src/plan/index.ts` is where lowered sections become authoritative planned sections with provenance requirements.
- `src/markdown/renderers/common.ts` is the shared section render seam for all surfaces.
- `src/markdown/renderers/role-home.ts` is a family-specific render override layered on top of shared section rendering.
- `src/checks/core-rules.ts` is the current fail-loud surface-law enforcement point.

## 4.2 Control paths (runtime)
- Template definition creates a document factory.
- Projection merges shared and local section options, then calls the document factory for each destination.
- Lowering emits `surfaceSections`, `generatedTargets`, and `documents` links for every declared section, with no current notion of “configured-only” emission.
- Planning turns every lowered section into a planned section.
- Shared rendering walks the planned section tree and supplies either authored section bodies or documented-node fallback content.
- Role-home rendering then adds custom fallback only for `read-first` and `role-contract`, which means the current misleading output comes from both shared and role-home-specific fallback paths.

## 4.3 Object model + key abstractions
- `DocumentTemplateSection` is the template-side section declaration.
- `DocumentSectionOptions` carries per-destination body, `documentsTo`, and extra source ids.
- `SurfaceInput` and `SurfaceSectionInput` are the durable normalized source truth after helper lowering.
- `PlannedSection` is the concrete output-side section unit.
- `surface.requiredSectionSlugs` is already the durable compiler-owned truth for required section families.
- `childSectionIdsBySectionId` and `surfaceSectionIdsBySurfaceId` already make parent-child composition and section presence queryable after lowering.

## 4.4 Observability + failure behavior today
- Current tests intentionally prove universal role-home section emission and body-less role-home fallback behavior.
- The compiler does not currently diagnose misleading empty emitted role-home sections as a trust bug.
- The current failure mode is therefore false-positive runtime doctrine, not a fail-loud compiler boundary.
- Because planning only sees lowered sections, a render-only fix would leave plan noise and false provenance intact.
<!-- arch_skill:block:current_architecture:end -->

## 4.5 UI surfaces (ASCII mockups, if UI work)
- Not applicable. This is markdown compiler behavior, not UI work.

# 5) Target Architecture (to-be)

<!-- arch_skill:block:target_architecture:start -->
## 5.1 On-disk structure (future)
- Keep source, check, plan, and render layering intact.
- Extend the source/template contract with explicit per-section emission semantics for optional sparse sections.
- Add check-layer guardrails for misleading empty emitted role-home sections.
- Narrow both shared section rendering and role-home-specific fallback so empty optional role-home sections can never become generic fallback doctrine.
- Keep `surface.requiredSectionSlugs` as the durable required-family contract. No new normalized requiredness model is needed for this slice.

## 5.2 Control paths (future)
- Template/projection lowering decides whether a section exists for a destination before normalized setup truth is finalized.
- `createDocumentPart(...)` computes an emitted section set first:
  - emit `always` sections unconditionally
  - emit `whenConfigured` sections only when merged section options exist or an emitted descendant requires the ancestor wrapper
  - auto-emit ancestors of emitted children so wrapper parents can exist without fake bodies
- Only emitted sections receive `surfaceSections`, `generatedTargets`, and section-level links.
- Planning only sees sections that truly emitted.
- Checks validate that any remaining emitted non-required role-home section with no authored body and no emitted children is invalid.
- Shared rendering supports body-less wrapper parents with emitted children by rendering the heading and child sections only, with no fallback text.
- Role-home rendering keeps family-specific fallback only for canonical required sections, keyed off required-section truth instead of broad slug-only convention.

## 5.3 Object model + abstractions (future)
- Add one explicit helper-layer section emission policy on `DocumentTemplateSection`, with `always` as the default and `whenConfigured` as the sparse option for reusable optional sections in this slice.
- Keep required canonical section truth explicit and separate from optional sparse reuse.
- Preserve deterministic id and slug derivation for sections that do emit.
- Do not widen the normalized node model just to carry optional-section metadata if omitted sections can lower away cleanly.

## 5.4 Invariants and boundaries
- Source decides section existence.
- Checks decide whether an emitted role-home section is trustworthy.
- Render decides presentation only for trustworthy emitted sections.
- Generic fallback text may remain only where it is semantically correct for that exact required section family.
- Direct `.document()` calls and projected `.document()` calls must follow the same section-emission semantics.
- Optional sections may not require fake empty bodies just to suppress runtime fallback behavior.
<!-- arch_skill:block:target_architecture:end -->

## 5.5 UI surfaces (ASCII mockups, if UI work)
- Not applicable.

# 6) Call-Site Audit (exhaustive change inventory)

<!-- arch_skill:block:call_site_audit:start -->
## 6.1 Change map (table)

| Area | File | Symbol / Call site | Current behavior | Required change | Why | New API / contract | Tests impacted |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Template section contract | `src/source/templates.ts` | `DocumentTemplateSection`, `createTemplateDefinition()` | Section definitions have key, title, slug, and parent only | Add explicit per-section emission policy: `always` vs `whenConfigured` | Sparse child emission must be explicit at authoring time | helper-layer section emission contract | `test/source/templates.test.ts` |
| Lowering engine | `src/source/templates.ts` | `createDocumentPart()` | Emits every declared section; always generates target and section links | Compute emitted set first, then only lower emitted sections; auto-include ancestors of emitted children | Root cause of universal empty-section emission and plan noise | source-layer emitted-section set | `test/source/templates.test.ts`, new compile or plan coverage |
| Role-home defaults | `src/source/templates.ts` | `defineRoleHomeTemplate()` | Every emitted role-home section defaults to `documentsTo -> roleId` | Keep defaults compatible with required sections, but align them with sparse emission and non-misleading optional-section behavior | Today even empty optional sections look role-backed once emitted | refined role-home default-link contract | new template and render coverage |
| Projection merge | `src/source/projections.ts` | `mergeSections()`, `projectDocumentSections()` | Merges shared and local section options, but section presence remains universal | Feed merged options into emitted-section calculation and keep projection semantics aligned with direct `.document()` calls | User request is specifically about projecting one shared role-home template to many destinations | shared-plus-local configured-section truth | `test/source/templates.test.ts` |
| Shared section fallback | `src/markdown/renderers/common.ts` | `getSectionBlocks()` | Body-less sections fall back to documented nodes or “No documented source units...” | Add wrapper-parent behavior: if no body and emitted children exist, render no fallback blocks; for invalid empty optional role-home shells, do not render generic documented-node fallback | Parent sections such as `Standards And Support` need truthful wrappers without fake prose | no new public API expected | extend `test/e2e/hierarchical-sections.test.ts`, render coverage |
| Planned section render | `src/markdown/renderers/common.ts` | `renderPlannedSection()` | Always prepends fallback or custom blocks before child sections | Allow zero-block container sections when child sections exist | Needed for truthful wrapper parents | no new public API expected | hierarchical render coverage |
| Role-home custom fallback | `src/markdown/renderers/role-home.ts` | `renderRoleHomeDocument()` | Adds fallback for `read-first` and `role-contract` whenever section has no body | Keep only safe canonical fallback and key it off required-section truth | Preserve required-section ergonomics without leaking them to optional sections | required-family fallback boundary | `test/render/role-home-shared.test.ts`, `test/e2e/authored-content.test.ts` |
| Plan provenance | `src/plan/index.ts` | planned section construction and provenance checks | Assumes every lowered section is a real planned section with provenance | No fundamental redesign needed, but omitted sections must never reach plan construction | Prevent plan noise and false provenance | no new public API expected | new plan or e2e coverage, likely `test/plan/primitives.test.ts` |
| Surface checks | `src/checks/core-rules.ts` | `surfaceAndReferenceSemanticsRule` | Enforces required sections, orphaning, cycles, and duplicate slugs; no misleading-empty-section diagnostic | Add role-home empty-section diagnostic keyed off surface class, required slugs, authored body presence, and emitted-child presence | Trust bug should fail before output is trusted | new diagnostic code and message contract | `test/checks/surfaces.test.ts` |
| Public docs and proof | `README.md`, `docs/schema.md`, `docs/architecture.md`, `docs/testing.md`, proving fixtures | Public story teaches required role-home sections only | Teach required vs optional template sections plainly and keep current proving setups strict | Public API change needs proof and explanation | docs/examples update | README/docs plus targeted fixture and e2e coverage |

## 6.2 Migration notes
- Delete-list candidate:
  - any tests or assumptions that codify "every declared role-home template section emits for every destination" once the new sparse contract is accepted
- Migration guidance to capture later:
  - how existing setups keep `read-first` and `role-contract` strict
  - how optional child sections are declared and opted into
  - how authors interpret the new empty-section diagnostic

## Pattern Consolidation Sweep (anti-blinders; scoped by plan)

| Area | File / Symbol | Pattern to adopt | Why (drift prevented) | Proposed scope (include/defer/exclude) |
| --- | --- | --- | --- | --- |
| Role-home proving setups | `setups/editorial/surfaces.ts`, `setups/release_ops/surfaces.ts` | Keep required role-home sections explicit and prove they still render correctly after sparse optionality lands | Prevent regressions to the current proving contract | include |
| Shared projection proof | `test/source/templates.test.ts` | Replace “emit everything” expectation with sparse-emission proof across destinations | This is the exact drift class the plan addresses | include |
| Generic hierarchical render proof | `test/e2e/hierarchical-sections.test.ts` | Add or expand wrapper-parent coverage for body-less sections with emitted children | Container-section rendering is a generic consequence of the preferred design | include |
| Role-home render proof | `test/render/role-home-shared.test.ts`, `test/e2e/authored-content.test.ts` | Distinguish required canonical fallback from optional sparse omission or diagnostics | Prevent accidental reintroduction of misleading fallback | include |
| Other template families | non-role-home template helpers in `src/source/templates.ts` | Reuse the generic section-emission contract only if the first slice stays low-cost and coherent | Avoid scope sprawl while proving the pattern | defer |
| Public docs | `README.md`, `docs/schema.md`, `docs/architecture.md`, `docs/testing.md` | Teach required vs optional template sections plainly | Public doctrine surface changes need docs parity | include |
<!-- arch_skill:block:call_site_audit:end -->

# 7) Depth-First Phased Implementation Plan (authoritative)

<!-- arch_skill:block:phase_plan:start -->
> Rule: systematic build, foundational first; every phase has exit criteria + explicit verification plan (tests optional). No fallbacks/runtime shims - the system must work correctly or fail loudly (delete superseded paths). Prefer programmatic checks per phase; defer manual/UI verification to finalization. Avoid negative-value tests (deletion checks, visual constants, doc-driven gates). Also: document new patterns/gotchas in code comments at the canonical boundary (high leverage, not comment spam).

## Phase 1 — Add the source-layer section-emission contract

Status: COMPLETE

Completed work:
- Added `DocumentTemplateSection.emissionPolicy` with `always` and `whenConfigured` in [src/source/templates.ts](/Users/aelaguiz/workspace/paperzod/src/source/templates.ts).
- Resolved emitted section sets before lowering, including auto-emission of wrapper ancestors for configured child sections.
- Kept projected and direct template documents on the same lowering path by driving sparse emission from merged section options instead of projection-only logic.

* Goal:
  - Make section presence a helper-layer truth before normalized setup and planning ever see the section.
* Work:
  - Extend `DocumentTemplateSection` in `src/source/templates.ts` with explicit per-section emission policy, using `always` as the default and `whenConfigured` for reusable optional sections.
  - Update `createDocumentPart()` in `src/source/templates.ts` to compute the emitted section set before lowering:
    - emit `always` sections unconditionally
    - emit `whenConfigured` sections only when merged section options exist
    - auto-emit ancestors of emitted children so wrapper parents can exist without fake bodies
  - Keep `requiredSections` lowering unchanged so required canonical families still compile to `surface.requiredSectionSlugs`.
  - Update `projectDocumentSections()` in `src/source/projections.ts` so merged shared-plus-local section options drive the same emitted-section calculation as direct `.document()` calls.
  - Keep direct template `.document()` and projected `.document()` semantics aligned. Do not create a projection-only sparse mode.
* Verification (smallest signal):
  - Update `test/source/templates.test.ts` to prove that optional sparse child sections do not emit for an unconfigured destination, while required sections still emit and preserve stable ids/slugs.
* Docs/comments (propagation; only if needed):
  - Add one short comment near the emitted-section calculation explaining that section existence must be decided before lowering so plan/render cannot drift.
* Exit criteria:
  - Optional sparse sections lower away cleanly when unconfigured.
  - Required sections still lower and still populate `requiredSectionSlugs`.
  - Direct and projected template usage follow the same emission contract.
* Rollback:
  - Revert to the universal-emission contract if the new helper-layer policy cannot preserve deterministic ids/slugs and required-section strictness together.

## Phase 2 — Harden render and checks against misleading empty sections

Status: COMPLETE

Completed work:
- Hardened shared section rendering so bodyless wrapper parents render as headings plus child sections, not generic fallback prose.
- Restricted role-home fallback prose to canonical required sections and added a fail-loud diagnostic for empty unsafe role-home sections.
- Updated direct lowered test fixtures to declare canonical role-home required sections explicitly where they rely on fallback.

* Goal:
  - Ensure no emitted optional role-home section can survive to markdown as a misleading heading with generic body text.
* Work:
  - Update `getSectionBlocks()` and `renderPlannedSection()` in `src/markdown/renderers/common.ts` so wrapper parents with emitted children can render heading plus children only, with no fallback prose.
  - Update `renderRoleHomeDocument()` in `src/markdown/renderers/role-home.ts` so family-specific fallback remains only for canonical required sections and keys off required-section truth rather than broad slug-only convention.
  - Add a new diagnostic in `surfaceAndReferenceSemanticsRule` in `src/checks/core-rules.ts` for emitted non-required `role_home` sections that have no authored body and no emitted children.
  - Ensure the new check does not punish required canonical role-home sections that still rely on safe family-specific fallback.
* Verification (smallest signal):
  - Extend `test/render/role-home-shared.test.ts` so an optional child section absent from one destination no longer renders misleading fallback content.
  - Extend `test/checks/surfaces.test.ts` with the new misleading-empty-role-home-section diagnostic.
* Docs/comments (propagation; only if needed):
  - Add one short comment near the role-home fallback gate explaining that fallback is allowed only for canonical required families, not for optional sparse sections.
* Exit criteria:
  - Empty optional role-home sections are omitted or fail loudly before output is trusted.
  - Shared renderer no longer invents body text for wrapper parents with real children.
  - Required `read-first` / `role-contract` behavior remains intentional and bounded.
* Rollback:
  - Reopen the phase if the new check flags required canonical sections incorrectly or if renderer hardening depends on heuristics that disagree with emitted-section truth.

## Phase 3 — Reconcile provenance, hierarchy, and proving coverage

Status: COMPLETE

Completed work:
- Proved omitted sparse sections never survive into compile-plan section ids for unconfigured destinations.
- Added compile-level coverage for wrapper parents with children and no filler prose.
- Confirmed no planner redesign was needed because omitted sections now lower away before graph and plan construction.

* Goal:
  - Keep plan truth, hierarchy rendering, and emitted-section provenance coherent after sparse omission lands.
* Work:
  - Audit `buildCompilePlan()` in `src/plan/index.ts` to confirm omitted sections never reach plan construction and emitted sections still satisfy provenance requirements.
  - Add targeted coverage for wrapper parents with emitted children and no body so the shared hierarchy story stays generic, not role-home-only.
  - Add one compile-level or plan-level proof that omitted optional sections do not appear in planned sections, path manifests, or rendered markdown.
* Verification (smallest signal):
  - Extend `test/e2e/hierarchical-sections.test.ts` or an adjacent render/e2e test for body-less wrapper parents with emitted children.
  - Add one plan or compile test, likely near `test/plan/primitives.test.ts` or a small e2e fixture, proving omitted optional sections do not survive into plan output.
* Docs/comments (propagation; only if needed):
  - None by default.
* Exit criteria:
  - Emitted sections keep deterministic provenance.
  - Omitted sections do not appear in plan output or markdown.
  - Wrapper-parent rendering remains truthful and generic.
* Rollback:
  - Reopen Phase 1 if plan/provenance integrity requires a different emitted-section contract than the chosen helper-layer policy.

## Phase 4 — Update public proof and docs

Status: COMPLETE

Completed work:
- Updated [README.md](/Users/aelaguiz/workspace/paperzod/README.md), [docs/schema.md](/Users/aelaguiz/workspace/paperzod/docs/schema.md), [docs/architecture.md](/Users/aelaguiz/workspace/paperzod/docs/architecture.md), and [docs/testing.md](/Users/aelaguiz/workspace/paperzod/docs/testing.md) to explain sparse template sections and the narrower role-home fallback contract.
- Extended the proof surface across source, check, render, plan, e2e, emit, and CLI suites so the public contract is backed by repo evidence.

* Goal:
  - Make the shipped contract teachable and prove it publicly.
* Work:
  - Update `README.md`, `docs/schema.md`, `docs/architecture.md`, and `docs/testing.md` to explain required sections versus optional sparse sections plainly.
  - Update proving fixtures and expectations so the repo demonstrates:
    - required canonical role-home sections still work
    - optional sparse child sections emit only when configured
    - misleading empty optional role-home sections no longer become runtime doctrine
  - Review whether `setups/editorial/**` and `setups/release_ops/**` need changes only for proof clarity, not to force the feature into canonical setups unnecessarily.
* Verification (smallest signal):
  - Run the smallest honest targeted suites for the changed source/check/render/doc surfaces.
  - Before broad claims, run `npm run typecheck`, `npm run build`, and then `npm test`.
* Docs/comments (propagation; only if needed):
  - Public docs are part of the phase output, not follow-up polish.
* Exit criteria:
  - A setup author can tell how to declare required sections, optional sparse sections, wrapper parents, and why an empty optional role-home section now fails or disappears.
  - Repo docs, tests, and examples all tell the same public story.
* Rollback:
  - Keep the implementation dark or reopen earlier phases if the public contract cannot be explained cleanly without caveats or hidden conventions.
<!-- arch_skill:block:phase_plan:end -->

# 8) Verification Strategy (common-sense; non-blocking)

Avoid verification bureaucracy. Prefer the smallest existing signal. Default to 1-3 checks total. Do not invent new harnesses, frameworks, or scripts unless they already exist and are the cheapest guardrail. Keep UI/manual verification as finalization by default. Do not create proof tests for deletions, visual constants, or doc inventories. Document tricky invariants and gotchas at the SSOT or contract boundary.

## 8.1 Unit tests (contracts)
- Extend `test/source/templates.test.ts` for sparse optional section-emission behavior.
- Add targeted `test/checks/surfaces.test.ts` or adjacent check coverage for the misleading empty role-home section diagnostic.

## 8.2 Integration tests (flows)
- Extend `test/render/role-home-shared.test.ts` to prove that an optional child section absent from one destination does not render misleading fallback content.
- Add one plan or compile-level test to prove omitted sections do not survive as planned sections.

## 8.3 E2E / device tests (realistic)
- Use one small compile fixture spanning at least two role homes with shared parent section and sparse child opt-in.
- Keep the final command set proportionate:
  - `npm run typecheck`
  - `npm run build`
  - smallest honest `npx vitest run ...` set for changed files
  - `npm test` before claiming broad verification

# 9) Rollout / Ops / Telemetry

## 9.1 Rollout plan
- This is a framework authoring-surface change with repo-local proving fixtures, not an ops migration.
- Roll out by updating source contracts, proving tests, and public docs together.
- Existing setups should either remain valid unchanged for required top-level sections or fail loudly where they depended on misleading empty-section fallback.

## 9.2 Telemetry changes
- No product telemetry is expected.
- Diagnostics and targeted tests are the main trust surface.

## 9.3 Operational runbook
- When adopting the new behavior, authors should:
  - remove fake empty bodies used only to suppress current fallback
  - opt optional child sections in explicitly where needed
  - rerun targeted compile and render tests to confirm the emitted role homes match actual doctrine ownership

# 10) Decision Log (append-only)

## 2026-04-03 - Treat misleading empty role-home sections as a framework bug
Context
- Real-world usage in `../paperclip_agents/docs/PAPERZOD_ROLE_HOME_SECTION_EMISSION_REQUEST_2026-04-03.md` surfaced a trust bug: a role-home heading can render even when the destination does not own real section content, and current fallback behavior can place generic role prose under that heading.
Options
- Keep the current universal template emission model and only tweak wording.
- Fix only the role-home renderer and leave source-layer section emission unchanged.
- Plan a framework-level fix that combines explicit sparse section-emission semantics with fail-loud role-home empty-section handling.
Decision
- Plan the framework-level fix. The trust bug is architectural, not just local wording drift, and the source, check, and render layers need one consistent story for optional role-home sections.
Consequences
- The first implementation slice must harden runtime trust before it optimizes author convenience.
- Required-section and optional-section semantics need to be separated explicitly.
Follow-ups
- Confirm the North Star before deeper research and phase planning.

## 2026-04-03 - Prefer source-layer sparse emission with render and check hardening
Context
- Repo-grounded research and deep dive showed the bug is broader than `role-home.ts` alone. Universal section lowering in `src/source/templates.ts`, universal role-home section defaults in `defineRoleHomeTemplate(...)`, shared documented-node fallback in `src/markdown/renderers/common.ts`, and family-specific fallback in `src/markdown/renderers/role-home.ts` all contribute.
Options
- Renderer-only hardening.
- Projection-only sparse mode.
- Source-layer section-emission policy plus render and check hardening.
Decision
- Prefer source-layer section-emission policy as the primary fix, with shared-render and role-home-render hardening plus fail-loud checks as the supporting enforcement layers.
Consequences
- Section existence stays a source-layer truth and planning only sees truthful emitted sections.
- Required section families can stay strict through existing `requiredSectionSlugs` enforcement.
- The first proving case remains role homes, but the chosen contract stays generic enough to reuse later if warranted.
Follow-ups
- Use `phase-plan` to lock the implementation order around source contract first, then checks and render hardening, then public proof updates.

## 2026-04-03 - Lock the first-slice emission policy names and phase order
Context
- The architecture and audit passes converged on one generic sparse-emission contract, but earlier sections still described the helper-layer names with tentative wording. Leaving that ambiguity in place would weaken Section 7 as the single execution checklist.
Options
- Keep the policy names tentative until implementation.
- Lock the first-slice names and implementation order in the plan artifact now.
Decision
- Lock the helper-layer section emission policy to `always` and `whenConfigured` for this slice, and keep the execution order as source contract first, then render and checks, then provenance proof, then public docs and proving updates.
Consequences
- Implementation does not need to reopen naming unless code evidence proves the chosen names misleading.
- The phase plan now reads as an execution checklist rather than a brainstorming document.
Follow-ups
- Start `implement` against this doc and only reopen the naming decision if the code forces a materially different public contract.

## 2026-04-03 - Sparse role-home section emission landed at the framework boundary
Context
- The implementation run applied the planned source, render, check, proof, and docs changes on branch `codex/role-home-section-emission-fix`.
Decision
- Ship sparse template section emission through `DocumentTemplateSection.emissionPolicy`, keep canonical role-home fallback limited to required `read-first` and `role-contract`, and fail loudly on other empty emitted role-home sections.
Consequences
- Unconfigured optional sections no longer survive into graph, plan, or markdown output.
- Wrapper parents now render as headings plus child sections without generic filler prose.
- Direct lowered role-home fixtures that rely on canonical fallback must declare `requiredSectionSlugs` explicitly.
Follow-ups
- Run `audit-implementation` only if a separate post-ship completeness pass is desired.
