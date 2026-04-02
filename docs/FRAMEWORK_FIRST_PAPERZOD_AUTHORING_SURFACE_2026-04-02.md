---
title: "paperzod - Framework-First Authoring Surface - Architecture Plan"
date: 2026-04-02
status: complete
fallback_policy: forbidden
owners: [aelaguiz, codex]
reviewers: [aelaguiz]
doc_type: architectural_change
related:
  - ../paperclip_agents/docs/PAPERZOD_FEATURE_REQUESTS_EXAMPLE_DRIVEN_2026-04-02.md
  - ../paperclip_agents/docs/LESSONS_FULL_DOCTRINE_PAPERZOD_CUTOVER_2026-04-02.md
  - docs/requirements.md
  - docs/schema.md
  - docs/architecture.md
  - src/source/templates.ts
  - src/source/compose.ts
  - src/source/fragments.ts
  - src/plan/targets.ts
  - src/checks/index.ts
---

# TL;DR

- Outcome:
  - Add framework-first authoring and compile features that let real setups express shared-section projection, compiler-owned prune boundaries, richer human-authored fragments, setup-local rule checks, and keyed overrides without turning `paperzod` into a Lessons-specific builder, and demonstrate each new capability in repo docs, examples, and tests as part of the shipped scope.
- Problem:
  - The current `paperzod` surface is already strong enough to prove the Lessons cutover, but it currently pushes several real generic jobs into setup-local glue, shell delete lists, split prose formats, or human memory. If we answer those pressures literally from one proving case, we risk baking Lessons-shaped APIs into a framework that is supposed to stay generic.
- Approach:
  - Keep the product boundary from `docs/requirements.md` and the three-layer model from `docs/schema.md` intact, then add a small set of reusable framework primitives around projection, ownership, fragment richness, extensible checks, and stable-id override composition. The framework should solve the generic problem that the Lessons port exposes, not mirror the example code in the request note.
- Plan:
  - Implement in six phases: source-envelope plus check plumbing first, ownership/prune manifest and emit lifecycle second, shared projection third, keyed overrides fourth, scoped fragment widening fifth, and docs/examples/canonical setup adoption with final repo proof last. Keep each phase additive, fail-loud, and paired with the smallest honest verification signal.
- Non-negotiables:
  - No Lessons-only node kinds, target semantics, or path-magic features.
  - No dual sources of truth or shell-managed delete boundaries once ownership is declared in framework source.
  - No runtime fallbacks or compatibility shims as the default answer to framework gaps.
  - No widening of the normalized model unless repo evidence shows the current helper-layer lowering cannot express the feature honestly.
  - Every new feature must remain usable by at least one non-Lessons setup, whether that setup adopts it now or later.
  - Every new feature must land with a small, honest demonstration in docs, example usage, and targeted tests.

<!-- arch_skill:block:implementation_audit:start -->
# Implementation Audit (authoritative)
Date: 2026-04-02
Verdict (code): COMPLETE
Manual QA: n/a (non-blocking)

## Code blockers (why code is not done)
- None. The implemented source-envelope, ownership/prune, projection, keyed-override, fragment, docs/example, and canonical-setup surfaces match the plan closely enough to keep the architecture status at code-complete.

## Reopened phases (false-complete fixes)
- None.

## Missing items (code gaps; evidence-anchored; no tables)
- None. Evidence anchors reviewed:
  `src/source/module.ts`,
  `src/source/projections.ts`,
  `src/source/overrides.ts`,
  `src/source/fragments.ts`,
  `src/source/index.ts`,
  `src/checks/index.ts`,
  `src/index.ts`,
  `src/plan/targets.ts`,
  `src/emit/index.ts`,
  `src/cli/compile.ts`,
  `src/cli/shared.ts`,
  `setups/lessons/index.ts`,
  `setups/core_dev/index.ts`,
  `README.md`,
  `docs/schema.md`,
  `docs/architecture.md`,
  `docs/testing.md`,
  `docs/example_lessons.md`,
  `test/checks/registry.test.ts`,
  `test/plan/targets.test.ts`,
  `test/emit/index.test.ts`,
  `test/source/templates.test.ts`,
  `test/source/compose.test.ts`,
  `test/source/fragments.test.ts`,
  `test/cli/doctor.test.ts`,
  `test/cli/validate-compile.test.ts`,
  `test/e2e/authored-content.test.ts`,
  `test/e2e/shared-overrides.test.ts`,
  `test/e2e/lessons-full.test.ts`,
  `test/e2e/second-setup.test.ts`,
  and `docs/FRAMEWORK_FIRST_PAPERZOD_AUTHORING_SURFACE_2026-04-02_WORKLOG.md`.

## Non-blocking follow-ups (manual QA / screenshots / human verification)
- None. This change series is compiler-facing and the required verification surface is already automated and recorded in the worklog.
<!-- arch_skill:block:implementation_audit:end -->

<!-- arch_skill:block:planning_passes:start -->
<!--
arch_skill:planning_passes
deep_dive_pass_1: done 2026-04-02
external_research_grounding: not started
deep_dive_pass_2: not started
recommended_flow: research -> deep dive -> external research grounding -> deep dive again -> phase plan -> implement
note: This is a warn-first checklist only. It should not hard-block execution.
-->
<!-- arch_skill:block:planning_passes:end -->

# 0) Holistic North Star

## 0.1 The claim (falsifiable)
> If we add a small, generic framework surface for shared projection, owned output pruning, richer fragment ingestion, setup-local rule registration, and stable-id overrides without introducing Lessons-specific node kinds or path semantics, then the Lessons cutover and future Paperclip setups will be able to express these patterns with materially less setup-local glue while `paperzod` remains a general doctrine compiler rather than a "Lessons agent builder." This will be considered true only if the new surface can be explained in framework terms, lowers cleanly into the existing architecture or a clearly justified extension of it, removes current setup-local workaround pressure, and still makes sense when applied to a non-Lessons setup.

## 0.2 In scope
- UX surfaces (what users will see change):
  - The public `paperzod` authoring surface for setup authors who currently need custom TypeScript glue to express shared projection, deletion ownership, or targeted reuse overrides.
  - The CLI/runtime compile experience where a setup should be able to say what it owns and let the compiler report create, update, and delete work honestly.
  - The source-authoring experience for prose-heavy doctrine that today gets awkwardly split between `.md` and `.ts`.
  - The repo documentation and example surfaces that should show setup authors how to use the new framework contracts without reading implementation code to infer them.
- Technical scope (what code and docs will change):
  - Framework design for shared projection of authored doctrine into many runtime documents.
  - Framework design for declared output ownership and compiler-owned prune/delete behavior.
  - Framework design for richer markdown fragment parsing where the authored-block model already supports the target structures.
  - Framework design for setup-local rule registration inside `doctor` and related validation flows.
  - Framework design for keyed override composition by stable ids instead of append-only rebuilds.
  - Supporting updates to docs, tests, and canonical setups needed to prove these remain framework-first features.
  - Demonstration updates in public docs, canonical setup examples, and the targeted test suites that prove the feature contracts end to end.

## 0.3 Out of scope
- UX surfaces (what users must NOT see change):
  - No attempt to ship the full Lessons live cutover in this plan. That is a consumer of the framework, not the framework change itself.
  - No promise that every example sketch from the request note becomes the final public API literally as written.
  - No new user-facing product around "build me a Lessons pod" or "generate a role system from Lessons examples."
- Technical scope (explicit exclusions):
  - No Lessons-only public names, bundled assumptions, or hard-coded role-home semantics.
  - No path-collision merge behavior that tries to combine multiple compiled documents into one output file.
  - No full CommonMark parser mandate. Richer fragments should stay intentionally narrow and deterministic.
  - No second planning source of truth outside this doc.
  - No default fallback or shell-script side channel for compiler-owned delete semantics once the framework declares ownership.

## 0.4 Definition of done (acceptance evidence)
- The agreed design can describe each requested improvement in generic framework terms rather than Lessons-specific language.
- The chosen abstractions explain how they fit the existing `paperzod` architecture and where they extend it, with clear boundaries between helper-layer sugar and core-model changes.
- The plan makes it explicit which features can remain helper-layer lowering and which, if any, need deeper planner, emit, or checker support.
- The future implementation can be proven with the smallest credible signals:
  - docs and README-level examples that show the public authoring contract plainly
  - canonical setup examples inside this repo that use the new surface honestly
  - canonical setup coverage inside this repo
  - CLI/emit proof for ownership and prune behavior
  - fragment-loader proof for newly supported markdown structures
  - diagnostic proof for setup-local checks
  - override proof by stable id
- At least one non-Lessons setup remains legible under the new architecture and does not require Lessons-shaped special cases to coexist with the new features.
- The plan explicitly rejects or narrows any feature direction that would turn `paperzod` into a bespoke Lessons-builder layer.

## 0.5 Key invariants (fix immediately if violated)
- `paperzod` remains a standalone doctrine compiler, not a Lessons-specific builder.
- The core product boundary from `docs/requirements.md` remains authoritative over example-driven requests.
- Shared example pressure may shape helper APIs, but it does not license special-purpose normalized node kinds without clear cross-setup value.
- The three-layer model from `docs/schema.md` remains the default mental model:
  - semantic nodes
  - runtime surfaces
  - addressable surface sections
- Generated markdown remains runtime output, not semantic source.
- Output deletion must be explicit, bounded, compiler-owned, and fail-loud when enabled.
- Override behavior must be keyed by stable ids and remain inspectable; it must not become magical mutation of anonymous generated content.
- Richer fragment support must stay deterministic and intentionally scoped; "support more markdown" is not permission to accept arbitrary syntax.
- Setup-local checks must compose with generic checks without making the framework's diagnosis surface opaque or non-deterministic.
- Demonstrations in docs, examples, and tests are part of feature truth; a capability is not complete if users have to reverse-engineer it from implementation alone.
- Fallback policy (strict):
  - Default: **NO fallbacks or runtime shims**.
  - If a real exception is later approved, it must be explicitly recorded in Section 10 with a removal plan.

# 1) Key Design Considerations (what matters most)

## 1.1 Priorities (ranked)
1. Remove the highest-value setup-local glue without narrowing the product to Lessons.
2. Preserve the clarity of the existing architecture: small stable core, thin helper layer, explicit pipeline stages.
3. Keep the authoring surface lightweight and human-readable for setup authors.
4. Make destructive cutovers safer by moving ownership into the framework instead of shell convention.
5. Expand prose ergonomics only where the rest of the compiler can already support the meaning honestly.
6. Make every new feature legible through docs, examples, and tests at the same time it ships.

## 1.2 Constraints
- `docs/requirements.md` explicitly forbids a Lessons-only product boundary and requires support for multiple setups.
- `docs/schema.md` says the current helper layer lowers into plain `SetupInput` and should not widen the normalized node model casually.
- `src/plan/targets.ts` currently treats one output path as one compiled document and rejects path collisions.
- `src/source/fragments.ts` intentionally accepts a narrow fragment grammar even though the broader authored-block model and renderers can express more structures.
- `composeSetup(...)` is intentionally append-only today, which makes override ergonomics a current gap but also reflects a simplicity bias we should preserve where possible.
- Generic checks already exist, but setup-level executable checks are explicitly deferred in the current docs, so new check extensibility must stay honest about lifecycle and determinism.

## 1.3 Architectural principles (rules we will enforce)
- Example-driven pressure should produce generic contracts, not example-shaped APIs.
- Prefer extension seams that preserve the current pipeline over inventions that skip it.
- Helper-layer conveniences should lower into explicit truth the rest of the compiler can inspect.
- Ownership boundaries must live in source and diagnostics, not in shell scripts or operator memory.
- Stable ids are the only acceptable basis for override semantics.
- Every feature should have a clean "not using this" story for setups that do not need it.

## 1.4 Known tradeoffs (explicit)
- A richer helper surface may make the authoring layer broader, but that is acceptable if the core model stays legible and minimal.
- Compiler-owned prune adds real destructive power, so the framework has to trade convenience for explicitness and honest dry-run reporting.
- Richer fragment parsing reduces `.md`/`.ts` splitting but increases parser complexity; the answer should be scoped support, not unrestricted markdown.
- Keyed overrides reduce rebuild glue but introduce precedence and replacement semantics that must be made transparent.
- Alternatives rejected + why:
  - Build a Lessons-specific helper package first:
    - rejected because it would hide the real generic framework gaps behind one proving case.
  - Keep shell delete lists and setup-local custom builders indefinitely:
    - rejected because the request pressure is real and belongs in framework truth if the pattern is generic.
  - Widen the normalized node model immediately for every requested convenience:
    - rejected because the current architecture explicitly prefers early lowering and a small stable core.

# 2) Problem Statement (existing architecture + why change)

## 2.1 What exists today
- `paperzod` already has a coherent pipeline:
  - normalize
  - graph
  - checks
  - plan
  - render
  - emit
- The shipped helper layer already covers reusable document shapes and explicit-base fragment loading.
- The canonical `setups/lessons/**` and `setups/core_dev/**` packages already prove that the framework is not single-setup.
- The feature-request note in `../paperclip_agents/docs/PAPERZOD_FEATURE_REQUESTS_EXAMPLE_DRIVEN_2026-04-02.md` explicitly says the full Lessons cutover is possible on the current surface, but awkward in several places.
- The related cutover plan in `../paperclip_agents/docs/LESSONS_FULL_DOCTRINE_PAPERZOD_CUTOVER_2026-04-02.md` already names the current highest-pressure framework gaps:
  - shared projection
  - compiler-owned prune
  - richer fragments
  - setup-local checks
  - keyed overrides

## 2.2 What’s broken / missing (concrete)
- Shared authored sections can be defined once, but projecting them into many role homes still wants setup-local assembly code.
- The compiler can create and update files, but setup-owned deletion is still a shell convention instead of framework truth.
- Real doctrine prose often wants simple tables or similar structure that the fragment loader rejects today, forcing one authored document across multiple source formats.
- Important setup-specific correctness rules still live outside the framework diagnosis surface.
- Append-only composition keeps the model simple, but it makes "mostly shared, one part differs" ergonomics awkward.
- The biggest strategic risk is not missing functionality; it is adding those capabilities in a way that encodes the Lessons example directly into the framework.

## 2.3 Constraints implied by the problem
- New capabilities should bias toward helper-layer and boundary-layer extensions first, not automatic core widening.
- Ownership, projection, and overrides must remain inspectable enough for diagnostics and later planning to trust.
- If a feature changes emitted file lifecycle, that change must be represented in plan/emit/CLI behavior explicitly.
- If a feature changes authoring ergonomics only, it should avoid contaminating the normalized model unless that is the only honest representation.
- The chosen architecture must have a coherent story for why the same feature is generic even if Lessons is the first proving case.
- If a feature is real enough to ship, it is real enough to demonstrate in docs, examples, and tests within the same change series.

<!-- arch_skill:block:research_grounding:start -->
# 3) Research Grounding (external + internal “ground truth”)

## 3.1 External anchors (papers, systems, prior art)
- No external research added in this pass.
- Adopt:
  - repo-first grounding for the first design pass, because the current question is mainly about where the existing architecture already exposes clean extension seams.
- Reject:
  - pulling in external prior art just because it looks superficially similar to the Lessons proving case. That would increase the risk of cargo-culting an example-shaped API instead of solving the concrete framework seams visible in this repo.
- If external research becomes necessary later, it should be narrow:
  - structured authoring systems that preserve a small core plus helper-layer lowering
  - destructive compile ownership models with explicit dry-run reporting
  - markdown-to-structured-block loaders with intentionally narrow syntax support

## 3.2 Internal ground truth (code as spec)
- Authoritative behavior anchors (do not reinvent):
  - `docs/requirements.md`
    - This remains the product boundary. It explicitly requires multi-setup generality, typed graph truth, runtime markdown output, section-level addressability, and setup-local overrides without making Lessons the product.
  - `docs/schema.md`
    - This is the strongest current statement of authoring constraints: helper-layer sugar should lower back into plain `SetupInput`, fragment loading is intentionally narrow today, `composeSetup(...)` is intentionally append-only, and setup-level executable checks are still deferred.
  - `src/source/templates.ts`
    - This is the strongest current evidence that shared projection should start as helper-layer lowering if possible. `createDocumentPart(...)` already expands template definitions into ordinary `surfaces`, `surfaceSections`, `generatedTargets`, and `documents` links with explicit `sourceIds` provenance.
  - `src/source/compose.ts`
    - This makes the keyed-override gap concrete. Composition clones collections and appends later parts, but it has no keyed merge or replacement semantics, which means any override feature should explain exactly how it changes this append-only contract.
  - `src/source/fragments.ts`
    - This shows fragment limitations are deliberate, not accidental. The loader currently rejects headings, tables, blockquotes, frontmatter, HTML, images, task lists, and multiline list items, so richer markdown support is a loader-surface question with explicit sharp edges.
  - `src/core/defs.ts`
    - This proves the authored content model is already richer than the fragment loader. The core model supports `table`, `definition_list`, `ordered_steps`, `rule_list`, `example`, and `good_bad_examples`.
  - `src/markdown/renderers/common.ts`
    - This proves those richer authored blocks already render through the normal markdown pipeline. That is strong evidence that richer fragment support can likely land without inventing a new renderer model.
  - `src/checks/registry.ts`
    - This is the narrowest existing extension seam for checks. The registry already accepts arbitrary rule lists and returns sorted diagnostics, which suggests setup-local checks should compose here rather than inventing a second diagnostics path.
  - `src/checks/index.ts`
    - This shows the current limitation precisely: `runChecks(...)` always runs only `defaultCheckRules`, which means setup-local check support likely needs rule-list composition above or around this function.
  - `src/cli/doctor.ts`
    - This proves `doctor` is not a separate analysis engine. It just loads setup input and runs the normal render pipeline. So setup-local checks must integrate into normal pipeline behavior if `doctor` is supposed to see them.
  - `src/cli/shared.ts`
    - This reinforces that point. `analyzeSetupInput(...)` is just `renderSetup(...)`, so setup-local check hooks should flow through the same compile-validation path that `validate`, `doctor`, and `compile` already share.
  - `src/plan/targets.ts`
    - This is the key ownership and prune boundary. Path scope and path uniqueness are enforced at manifest planning time, and one output path still maps to one planned document. Any owned-prune model has to respect that boundary instead of smuggling in merge semantics.
  - `src/emit/index.ts`
    - This is the current write behavior boundary. Emit reports only `create`, `update`, and `unchanged`, and it computes diffs only for updates. That means compiler-owned delete support is not just a CLI flag; it needs a new emitted lifecycle concept and reporting surface.
  - `../paperclip_agents/docs/PAPERZOD_FEATURE_REQUESTS_EXAMPLE_DRIVEN_2026-04-02.md`
    - This is the clearest expression of the pressure. It explicitly frames the requests as generic jobs under pressure from the Lessons port, not as a request for Lessons-specific magic.
  - `../paperclip_agents/docs/LESSONS_FULL_DOCTRINE_PAPERZOD_CUTOVER_2026-04-02.md`
    - This is the strongest repo-local framing of why these five capabilities matter and also why we should be careful about where they land architecturally. It repeatedly prefers helper-layer solutions first and names the likely implementation surfaces.

- Existing patterns to reuse:
  - `setups/lessons/surfaces.ts`
    - This is the best current proof that many surface families can already be authored from reusable templates and lowered into plain setup arrays. It is the strongest existing pattern for multi-surface helper-layer composition.
  - `setups/core_dev/surfaces.ts`
    - This is the best current proof that the helper-layer pattern is not Lessons-only. Any new authoring feature should still make sense in a second non-Lessons setup package.
  - `test/source/templates.test.ts`
    - This is the clearest contract-level example of how templates lower into ordinary setup truth today. It is the right style of test to extend for projection or helper-surface changes.
  - `test/source/compose.test.ts`
    - This is the clearest contract-level proof that composition is append-only today. It should anchor any override design so we do not accidentally change existing semantics silently.
  - `test/source/fragments.test.ts`
    - This is the clearest contract-level proof that fragment restrictions fail loudly with file context. It is the right proof style to preserve if richer fragment support lands.
  - `test/cli/doctor.test.ts`
    - This is the clearest proof that `doctor` is supposed to emit actionable human-readable diagnostics, not just pass/fail noise. Setup-local checks should fit that same diagnostic contract.
  - `test/fixtures/source/editorial-example.ts`
    - This is the clearest existing demonstration-style example of the public helper layer. It already combines `composeSetup(...)`, multiple templates, and `loadFragments(...)`, so it is a natural public-example surface to extend when new generic features land.
  - `test/cli/validate-compile.test.ts`
    - This is the strongest current proof that public helper APIs, fragment loading, and CLI behavior are already treated as one contract. It is the likely proof surface for any new docs/examples/CLI-aligned feature.

- Likely implementation surfaces implied by current code:
  - Shared projection:
    - likely starts in `src/source/templates.ts` and `src/source/index.ts`, with canonical proof in `setups/**` and `test/source/templates.test.ts`
  - Owned-output prune and replace:
    - likely spans `src/plan/targets.ts`, `src/emit/index.ts`, `src/cli/compile.ts`, and CLI/emit tests, because delete ownership needs planning, reporting, and write-path integration together
  - Richer fragments:
    - likely starts in `src/source/fragments.ts`, with proof in `test/source/fragments.test.ts`, while reusing existing authored-block and renderer support from `src/core/defs.ts` and `src/markdown/renderers/common.ts`
  - Setup-local checks:
    - likely spans `src/checks/index.ts`, `src/checks/registry.ts`, and whichever setup-loading surface carries extra rule declarations, with proof in `test/checks/**` and `test/cli/doctor.test.ts`
  - Keyed overrides:
    - likely starts in `src/source/compose.ts` or an adjacent helper-layer module, with contract proof in `test/source/compose.test.ts`

## 3.3 Open questions from research
- Shared projection:
  - Can a generic projection surface lower entirely into repeated `surface_section` and `generated_target` truth while preserving single-source ownership semantics clearly enough for diagnostics and later planning to trust it?
  - Evidence needed:
    - a concrete lowering sketch against `src/source/templates.ts`
    - proof that provenance and ownership remain inspectable without a new normalized node family
- Owned-output prune:
  - Should ownership be declared in setup source, at compile invocation, or in both places with one as the final authority?
  - Deep-dive resolution:
    - source declares ownership
    - CLI only authorizes destructive delete application for declared ownership via `--prune`
  - Evidence needed:
    - a clear lifecycle design that fits `resolveTargetManifest(...)` plus `emitDocuments(...)`
    - honest dry-run reporting for delete operations
- Setup-local checks:
  - Should extra rules be declared as setup-owned truth, passed at compile time, or both?
  - Deep-dive resolution:
    - setup-local rules are declared in source via the source envelope and consumed by the same pipeline as default rules
  - Evidence needed:
    - a design that preserves deterministic diagnostics and makes `doctor`, `validate`, and `compile` agree about which rules ran
- Richer fragments:
  - Which markdown structures are worth adding first without colliding with section-title ownership or turning the loader into a general markdown parser?
  - Current bias from repo evidence:
    - tables are the strongest candidate because the block model and renderer already support them
    - headings and frontmatter are higher-risk because section ownership and document metadata are intentionally TypeScript-owned today
- Keyed overrides:
  - What is the smallest keyed-override contract that stays transparent about precedence and does not silently change append-only composition for existing callers?
  - Evidence needed:
    - a concrete compatibility story anchored in `test/source/compose.test.ts`
    - proof that overrides target stable ids rather than positional or generation-order behavior
<!-- arch_skill:block:research_grounding:end -->

<!-- arch_skill:block:current_architecture:start -->
# 4) Current Architecture (as-is)

## 4.1 On-disk structure
- `src/source/**`
  - `builders.ts` defines the plain serializable `SetupInput` contract.
  - `templates.ts` is the current helper-authoring layer and always emits ordinary `SetupPart` arrays for one document at a time.
  - `compose.ts` clones base collections and appends later parts; it has no keyed merge or replacement semantics.
  - `fragments.ts` owns a small synchronous markdown loader that runs during module evaluation.
- `src/index.ts`
  - The public pipeline entrypoints live here and currently accept only plain setup input.
- `src/checks/**`
  - `index.ts` hard-wires `defaultCheckRules`.
  - `registry.ts` is already generic, but no public setup-owned rule surface feeds into it.
- `src/plan/**`
  - `index.ts` turns graph truth into planned documents and sections.
  - `targets.ts` resolves one planned document to one output path and rejects path collisions or output-root escape.
- `src/emit/**`
  - `index.ts` compares rendered markdown with on-disk files and only knows `create`, `update`, and `unchanged`.
- `src/cli/**`
  - `shared.ts` loads a setup module, selects an adapter, and routes `validate`, `doctor`, and `compile` through the same render pipeline.
  - `compile.ts` exposes dry-run versus `--write`, but not delete authority.
- `setups/**` and `test/fixtures/source/**`
  - These are the main proof surfaces for helper authoring, shared doctrine examples, and non-Lessons generality.

## 4.2 Control paths (runtime)
- Current authoring-time lowering path:
  - setup authors call helper functions such as `define*Template(...).document(...)`, `composeSetup(...)`, and `loadFragments(...)`
  - those helpers eagerly lower back into plain setup arrays before the compiler sees anything
- Current render path in `src/index.ts`:
  - `normalizeSetup(...)`
  - `buildGraph(...)`
  - `runChecks(...)`
  - `buildCompilePlan(...)`
  - `renderDocuments(...)`
- Current compile path:
  - `renderSetup(...)`
  - `resolveTargetManifest(...)`
- Current compile-and-emit path:
  - `compileSetup(...)`
  - `emitDocuments(...)`
- Current CLI behavior:
  - `validate` and `doctor` both use `analyzeSetupInput(...)`, which is just `renderSetup(...)`
  - `doctor` only changes formatting, not what rules or pipeline stages run
  - `compile` adds adapter selection and write/dry-run behavior after the render pipeline succeeds

## 4.3 Object model + key abstractions
- Semantic source of truth today:
  - plain `SetupInput`
  - normalized `SetupDef`
  - graph nodes for setup metadata, roles, workflow steps, gates, packet contracts, artifacts, surfaces, surface sections, references, generated targets, and links
- Helper abstractions today:
  - single-document templates
  - append-only setup composition
  - fragment-backed authored block loading
- Provenance and ownership signals already present:
  - `generatedTargets` carry `path`, `sourceIds`, and optional `sectionId`
  - graph indexes already track `documentedByNodeId`, `generatedSourceIdsByTargetId`, `generatedTargetIdsBySourceId`, and `ownerIdsByNodeId`
  - the plan builder already insists that each planned section has generated-target backing and at most one owner
- Current pressure points in that model:
  - shared projection is expressed by repeating template calls per destination document
  - local differences are handled by manual restatement or local object spread, not a first-class override helper
  - setup-local checks do not exist as a source-level contract even though the registry seam exists
  - output ownership and stale-file deletion are not part of compiler truth at all

## 4.4 Observability + failure behavior today
- Source failures are already fail-loud:
  - schema validation reports `source` diagnostics
  - fragment parsing throws file-and-line-specific errors
- Graph, check, and plan failures are already deterministic:
  - diagnostics are sorted
  - `doctor` maps them to human-readable fix surfaces
- Planning already protects important boundaries:
  - generated targets may not reference missing sources
  - section runtime paths must match their surface runtime paths
  - target paths may not escape the configured output root
  - two documents may not resolve to the same target path
- Emit observability is still partial:
  - update diffs are available
  - create/update/unchanged statuses are visible in CLI output
  - there is no compiler-owned delete reporting, no owned-scope scan, and no emit-phase diagnostic for stale generated files

## 4.5 UI surfaces (ASCII mockups, if UI work)
- No product UI is in scope.
- The real operator surfaces are:
  - TypeScript authoring helpers
  - fragment markdown files
  - CLI flags and output
  - diagnostics
  - rendered markdown and emitted file lifecycle
<!-- arch_skill:block:current_architecture:end -->

<!-- arch_skill:block:target_architecture:start -->
# 5) Target Architecture (to-be)

## 5.1 On-disk structure (future)
- Keep `src/core/**`, `src/graph/**`, and `src/markdown/**` structurally unchanged as the semantic and rendering core.
- Add a thin source-envelope boundary in `src/source/**`:
  - keep plain `SetupInput` as the semantic truth format
  - add `new src/source/module.ts` as the source-only module boundary
  - define and export:
    - `SetupModuleInput = SetupInput | SetupModuleDef`
    - `interface SetupModuleDef { setup: SetupInput; checks?: readonly CheckRule[]; outputOwnership?: readonly OwnedOutputScopeInput[] }`
    - `type OwnedOutputScopeInput = { kind: "root"; path: string } | { kind: "file"; path: string }`
    - `defineSetupModule(...)`
    - `resolveSetupModuleInput(...)`
  - keep `src/source/builders.ts` limited to plain semantic setup/node inputs rather than mixing source-envelope configuration into `SetupInput`
  - keep single-document helpers in `templates.ts`
  - add `new src/source/projections.ts` for shared-section projection helpers
  - add `new src/source/overrides.ts` for explicit keyed replacement helpers
- Extend the plan/emit boundary, not the semantic node family:
  - `TargetManifest` gains resolved ownership scopes
  - `emitDocuments(...)` becomes an emit-phase diagnostic boundary instead of a write-only helper that cannot fail loudly on stale owned files
- Update public docs, examples, and proving setups in the same series so the public surface stays legible.

## 5.2 Control paths (future)
- Future authoring path:
  - setup authors may still export plain `SetupInput`
  - or they may export a thin source envelope carrying setup-local checks and owned-output declarations
  - projection helpers, override helpers, and fragment loading still lower before normalization
- Future compile path:
  - `resolveSetupModuleInput(...)`
  - `normalizeSetup(resolved.setup)`
  - `buildGraph(...)`
  - `runChecks(graph, default rules + resolved setup rules)`
  - `buildCompilePlan(...)`
  - `renderDocuments(...)`
  - `resolveTargetManifest(plan, adapter, resolved.outputOwnership)`
  - `emitDocuments(rendered, manifest, { write, prune })`
- Future CLI behavior:
  - `validate`, `doctor`, and `compile` all see the same merged rule set
  - dry-run compile reports `create`, `update`, `unchanged`, and `delete` when ownership is declared
  - write mode without `--prune` fails with an emit-phase diagnostic if stale owned files would remain inside declared ownership scope
  - CLI does not invent ownership; it only authorizes destructive apply for source-declared ownership
- Future helper behavior:
  - projection remains helper-layer only and lowers into ordinary surfaces, sections, generated targets, and links
  - overrides remain helper-layer only and apply before normalization
  - fragment widening only happens for syntax families that lower one-to-one into existing authored blocks

## 5.3 Object model + abstractions (future)
- Semantic truth remains plain:
  - the normalized node model stays unchanged for these five capabilities
  - no new Lessons-shaped node kinds, merge nodes, or special surface classes are introduced
- New source-envelope contract:
  - plain `SetupInput` remains valid and is equivalent to `{ setup: <input> }`
  - `checks` accepts synchronous graph-only `CheckRule[]`
  - setup-local checks are declared in source, not via CLI flags or a second runtime rule-registration path
  - `outputOwnership` accepts explicit owned scopes relative to the target output root
  - ownership source of truth is:
    - source declares what this setup owns
    - CLI only decides whether destructive delete application is allowed for the current run
  - exact ownership scope shape to implement against:
    - `{ kind: "root"; path: string }`
    - `{ kind: "file"; path: string }`
  - no globbing, no path escape, and no target-specific path magic
  - resolved manifest shape is:
    - `type ResolvedOwnedOutputScope = { kind: "root"; absolutePath: string } | { kind: "file"; absolutePath: string }`
- New projection helper contract:
  - one shared section catalog can project into many destination documents
  - each destination still declares its own `surfaceId`, `runtimePath`, owner/document targets, and any local body or `documentsTo` overrides
  - lowering emits ordinary `surface`, `surface_section`, `generated_target`, and `documents` truth with stable ids per destination
  - the planner and renderer stay ignorant of the helper abstraction because they only see lowered truth
- New keyed override contract:
  - `composeSetup(...)` stays append-only
  - a separate keyed override helper applies replace-by-id semantics explicitly
  - overrides target stable ids only
  - missing targets, duplicate targets, or ambiguous replace rules fail loudly
  - no positional merge and no silent change to existing compose behavior
- New fragment contract:
  - `loadFragments(...)` becomes a block-family parser rather than a one-off set of ad hoc checks
  - first new supported family is pipe tables lowering to the existing `table` authored block
  - headings, frontmatter, HTML, task lists, images, and multiline list items remain forbidden
  - later syntax widening is allowed only when the authored block model and renderer already support it honestly
- New ownership/prune contract:
  - ownership is declared in source, resolved in the manifest, and enforced in emit
  - emit status expands to `create | update | unchanged | delete`
  - write-mode deletion requires explicit CLI authorization via `--prune`
  - dry-run may report delete candidates, but write mode without `--prune` returns `emit.prune_required` diagnostics instead of silently leaving stale owned files behind
  - stale owned files are not tolerated silently once ownership is declared
- New setup-local checks contract:
  - setup-local rules compose into the existing registry, not a second diagnostics path
  - rule ids must be unique across default and local rules
  - diagnostics remain sorted and deterministic regardless of rule declaration order

## 5.4 Invariants and boundaries
- `SetupInput` remains the one semantic source of truth.
- The new source envelope is compiler configuration around semantic truth, not a second semantic graph.
- `composeSetup(...)` remains append-only and backwards compatible.
- One planned document still maps to exactly one target path.
- Shared projection duplicates authored intent across documents; it does not merge multiple planned documents into one output file.
- Output ownership is always explicit, bounded, relative to `outputRoot`, and validated before emit acts on it.
- Delete authority requires both:
  - declared ownership in source
  - explicit destructive authorization at compile time
- Missing destructive authorization is an error in write mode, not a best-effort warning.
- `doctor`, `validate`, and `compile` must agree on which rule set ran.
- Fragment widening stays intentionally narrow and deterministic.
- Stable ids remain the only allowed selector surface for override behavior.
- No fallbacks, compatibility shims, or shell-managed delete side channels are part of the target design.

## 5.5 UI surfaces (ASCII mockups, if UI work)
- No UI mockups are required.
- The operator-facing surfaces that must become better are:
  - setup-module authoring
  - helper usage in canonical examples
  - fragment markdown ergonomics
  - `doctor`/`compile` diagnostics and delete reporting
  - docs that show the framework contract without requiring source-diving
<!-- arch_skill:block:target_architecture:end -->

<!-- arch_skill:block:call_site_audit:start -->
# 6) Call-Site Audit (exhaustive change inventory)

## 6.1 Change map (table)

| Area | File | Symbol / Call site | Current behavior | Required change | Why | New API / contract | Tests impacted |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Source-envelope resolution | `new src/source/module.ts`, `src/source/index.ts` | `SetupModuleInput`, `SetupModuleDef`, `OwnedOutputScopeInput`, `defineSetupModule(...)`, `resolveSetupModuleInput(...)` | The compiler only accepts plain setup input and module default export values | Add a thin source-envelope resolver and public export surface that accepts plain `SetupInput` or `{ setup, checks, outputOwnership }` | Setup-local checks and ownership need real compiler entry surfaces without polluting semantic nodes | Plain setup remains supported; envelope is additive and source-only | `test/types/authoring.test.ts`, `test/api/index.test.ts`, `test/cli/validate-compile.test.ts` |
| Public pipeline threading | `src/index.ts`, `src/cli/shared.ts` | `validateSetup`, `renderSetup`, `compileSetup`, `compileAndEmitSetup`, `analyzeSetupInput` | `runChecks(...)` always sees only default rules and compile knows nothing about ownership declarations | Resolve the source envelope before normalization and thread local rules plus ownership through render/compile/emit | `doctor`, `validate`, and `compile` must agree on behavior and stay one pipeline | Public pipeline entrypoints operate on resolved module input, not raw plain setup only | `test/api/index.test.ts`, `test/cli/doctor.test.ts`, `test/cli/validate-compile.test.ts` |
| Shared projection helper | `src/source/templates.ts`, `new src/source/projections.ts` | template lowering helpers, `projectDocumentSections(...)` | One helper call builds one document part; shared projection means repeated hand-authored calls | Add a cross-document projection helper that lowers one shared section catalog into many ordinary document parts | Remove high-value setup-local glue without widening the normalized model | Projection helper returns plain `SetupPart` values with stable destination ids and explicit per-destination overrides | `test/source/templates.test.ts`, `test/fixtures/source/editorial-example.ts`, `setups/lessons/**`, `setups/core_dev/**` |
| Keyed overrides | `src/source/compose.ts`, `new src/source/overrides.ts` | `composeSetup(...)`, `applyKeyedOverrides(...)` | Composition is append-only and override-like behavior is manual restatement | Keep `composeSetup(...)` unchanged and add an explicit replace-by-id helper | Preserve backwards compatibility while giving setup authors an honest override tool | Separate keyed override surface; no positional merge; fail-loud on missing or duplicate ids | `test/source/compose.test.ts`, `test/e2e/shared-overrides.test.ts`, `test/fixtures/source/shared-overrides.ts` |
| Fragment widening | `src/source/fragments.ts` | `loadFragments(...)` parser | Supports paragraphs, lists, and fenced code blocks; rejects tables even though the block model supports them | Refactor into explicit block recognizers and add pipe-table support first | Keep prose in markdown where the rest of the compiler can already render it honestly | Narrow widening only for block families with existing authored-block + renderer support | `test/source/fragments.test.ts`, fragment fixtures under `test/fixtures/fragments/**`, docs/examples that use fragment-backed tables |
| Setup-local checks | `src/checks/index.ts`, `src/checks/registry.ts` | `defaultCheckRules`, `runChecks(...)`, `runCheckRegistry(...)` | Registry is generic but `runChecks(...)` is hard-wired to core rules only | Merge default and setup-local rules, validate unique rule ids, and keep deterministic sorting | Important setup-specific correctness rules should live in framework diagnostics | Source envelope may declare local `CheckRule[]`; registry stays the single executor | `test/checks/registry.test.ts`, `test/checks/**`, `test/cli/doctor.test.ts` |
| Ownership manifest | `src/plan/targets.ts` | `TargetManifest`, `resolveTargetManifest(...)` | Manifest carries only `documentPaths`; no owned-scope resolution exists | Resolve owned roots/files relative to `outputRoot`, validate overlap and escape, and carry them in the manifest | Delete behavior belongs at the manifest/emit boundary, not in shell conventions | `TargetManifest` gains `ownedScopes: ResolvedOwnedOutputScope[]` alongside document paths | `test/plan/targets.test.ts`, `test/targets/paperclip-markdown.test.ts` |
| Emit lifecycle | `src/emit/index.ts` | `EmitStatus`, `EmitOptions`, `emitDocuments(...)` | Emit only classifies create/update/unchanged and never scans for stale generated files | Add delete classification, owned-scope scanning, and emit-phase prune-required diagnostics when write mode lacks `prune` | Compiler-owned prune must be visible in dry-run and explicit in write mode | Emit lifecycle becomes `create | update | unchanged | delete`; write mode without `prune` fails with `emit.prune_required` when stale owned files exist | `test/emit/index.test.ts`, `test/stability/index.test.ts` |
| CLI destructive control | `src/cli/compile.ts`, `src/cli/shared.ts` | compile command flags, usage text, exit behavior | CLI only exposes `--write`; delete behavior cannot be requested or reported | Add explicit destructive flag `--prune` and surface emit-phase prune diagnostics in stderr | Hard-cutover delete behavior must be operator-visible and explicit | `paperzod compile ... --write --prune` becomes the only delete-executing path; dry-run remains the preview surface for deletes | `test/cli/validate-compile.test.ts` |
| Public docs and examples | `README.md`, `docs/schema.md`, `docs/architecture.md`, `docs/testing.md`, `docs/example_lessons.md` | public authoring guidance | Public docs explain the current helper layer but not the future framework features | Add small honest demonstrations of projection, ownership, fragment widening, checks, and overrides | Users should not have to reverse-engineer the public contract from source | Docs become first-class proof surfaces for the new framework features | docs-only, plus any tests that compile embedded example fixtures |
| Canonical proving surfaces | `test/fixtures/source/editorial-example.ts`, `test/fixtures/source/shared-overrides.ts`, `setups/lessons/**`, `setups/core_dev/**` | proving setups and fixtures | The repo proves current helpers and manual override patterns, but not the future framework surface | Adopt the new features in the canonical examples that best prove them generically | The architecture must remain framework-first and non-Lessons-only in practice | Non-Lessons proof stays mandatory even if Lessons is the highest-pressure adopter | `test/e2e/editorial-example.test.ts`, `test/e2e/shared-overrides.test.ts`, `test/e2e/lessons-*.test.ts`, `test/cli/validate-compile.test.ts` |

## 6.2 Migration notes
- Deprecated APIs (if any):
  - No public API removals are planned in the first implementation pass.
  - Plain `SetupInput` remains valid.
  - `composeSetup(...)` remains append-only.
- Migration posture:
  - land the new source envelope additively
  - land projection and keyed overrides as additive helper surfaces
  - adopt the new helper surfaces in repo examples and canonical setups after the contracts are proven
  - move external consumers only after the repo-local contract and demonstrations are stable
- Delete list (what must be removed; include superseded shims/parallel paths if any):
  - remove setup-local shell delete lists once compiler-owned ownership/prune is adopted
  - do not add path-collision merge experiments or compatibility wrappers for stale generated files
  - do not silently convert existing append-only compose behavior into merge semantics

## Pattern Consolidation Sweep (anti-blinders; scoped by plan)

| Area | File / Symbol | Pattern to adopt | Why (drift prevented) | Proposed scope (include/defer/exclude) |
| --- | --- | --- | --- | --- |
| Public authoring docs | `README.md`, `docs/schema.md`, `docs/architecture.md` | Show the new source-envelope and helper contracts plainly | Prevents the API from becoming implementation-only knowledge | include |
| Example fixtures | `test/fixtures/source/editorial-example.ts` | Adopt projection plus richer fragment usage where it stays generic | Keeps the public proving example aligned with the real helper surface | include |
| Override proof | `test/fixtures/source/shared-overrides.ts`, `test/e2e/shared-overrides.test.ts` | Replace manual local restatement with explicit keyed overrides | Prevents drift between the helper contract and the override proving case | include |
| Canonical Lessons setup | `setups/lessons/**` | Adopt projection and ownership where the pressure is real | This is the highest-value proving setup for the requested framework gaps | include |
| Canonical non-Lessons setup | `setups/core_dev/**` | Adopt at least one non-Lessons example of the new surface | Prevents the framework from reading as Lessons-only even if Lessons adopts more features first | include |
| CLI diagnostics | `src/cli/shared.ts`, `src/cli/compile.ts`, `test/cli/**` | Keep rule and delete reporting aligned across `doctor`, `validate`, and `compile` | Prevents a second operator truth surface from emerging | include |
| Render layer | `src/markdown/**` | Do not add projection- or ownership-specific render behavior | Projection and ownership are not renderer concerns | exclude |
| Path planning | `src/plan/targets.ts` | Keep one-document-per-path and reject merge semantics | Prevents path-collision handling from turning into hidden document merge | exclude |
| Fragment widening | `src/source/fragments.ts` | Keep widening block-family scoped and evidence-driven | Prevents accidental slide into unrestricted markdown parsing | include |
| Lessons live goldens | `test/goldens/lessons-live/**` | Only update if output contracts truly change after implementation | Prevents snapshot churn from masquerading as proof | defer |
<!-- arch_skill:block:call_site_audit:end -->

<!-- arch_skill:block:phase_plan:start -->
# 7) Depth-First Phased Implementation Plan (authoritative)

> Rule: systematic build, foundational first; every phase has exit criteria + explicit verification plan (tests optional). No fallbacks/runtime shims - the system must work correctly or fail loudly (delete superseded paths). Prefer programmatic checks per phase; defer manual/UI verification to finalization. Avoid negative-value tests (deletion checks, visual constants, doc-driven gates). Also: document new patterns/gotchas in code comments at the canonical boundary (high leverage, not comment spam).

## Phase 1 - Add the source-envelope boundary and setup-local check plumbing
- Status: COMPLETE
- Completed work:
  - Added `src/source/module.ts` with `defineSetupModule(...)`, `resolveSetupModuleInput(...)`, and the additive source-envelope types.
  - Threaded resolved module input through the public pipeline and CLI analysis path.
  - Extended `runChecks(...)` to merge setup-local rules and fail loudly on duplicate rule ids.
  - Added public API, type, registry, validate, compile, and doctor proof for setup-module and local-check behavior.
- Goal:
  - Introduce the additive source-envelope contract without changing plain `SetupInput` semantics, and make `doctor`, `validate`, and `compile` consume the same merged rule set.
- Work:
  - Add `src/source/module.ts` with `SetupModuleInput`, `SetupModuleDef`, `OwnedOutputScopeInput`, `defineSetupModule(...)`, and `resolveSetupModuleInput(...)`.
  - Export the new module boundary from `src/source/index.ts` while keeping `src/source/builders.ts` limited to plain semantic setup inputs.
  - Thread resolved module input through `validateSetup`, `renderSetup`, `compileSetup`, `compileAndEmitSetup`, and `analyzeSetupInput`.
  - Extend `runChecks(...)` to accept setup-local rules, reject duplicate rule ids, and preserve deterministic sorted diagnostics.
  - Prove that plain `SetupInput` exports still work unchanged.
- Verification (smallest signal):
  - `npm run typecheck`
  - `npm run build`
  - `npx vitest run test/checks/registry.test.ts test/cli/doctor.test.ts test/cli/validate-compile.test.ts test/api/index.test.ts test/types/authoring.test.ts`
- Docs/comments (propagation; only if needed):
  - Add one short code comment at the source-envelope boundary explaining that source-envelope fields are compiler configuration around semantic setup truth, not a second semantic model.
- Exit criteria:
  - A setup module may export either plain `SetupInput` or `defineSetupModule(...)`, and all three CLI paths agree on which rules ran.
- Rollback:
  - Remove the source-envelope surface and revert to plain setup input only if compatibility or rule determinism breaks.

## Phase 2 - Add owned-output manifest resolution and fail-loud prune lifecycle
- Status: COMPLETE
- Completed work:
  - Extended `TargetManifest` with resolved owned scopes and fail-loud overlap / out-of-scope validation.
  - Turned `emitDocuments(...)` into a real emit-phase diagnostic boundary that previews deletes, blocks write mode without `prune`, and only mutates files after preflight passes.
  - Threaded `--prune` through compile CLI output and added targeted proof for dry-run preview, blocked write mode, and explicit delete application.
  - Updated emit and stability tests to use the new success-or-diagnostics boundary instead of the old write-only helper shape.
- Goal:
  - Make output ownership compiler truth and make delete behavior explicit, bounded, previewable in dry-run, and blocked in write mode without `--prune`.
- Work:
  - Extend `resolveTargetManifest(...)` to resolve owned roots/files under `outputRoot`, reject escape or overlap mistakes, and carry `ownedScopes` in the manifest.
  - Extend `emitDocuments(...)` so it scans declared owned scopes for stale generated files, reports `delete` candidates in dry-run, and returns `emit.prune_required` diagnostics in write mode when `prune` is missing.
  - Add actual delete execution only for files inside resolved owned scopes when `--write --prune` is present.
  - Thread emit diagnostics and delete reporting through compile command output and exit behavior.
  - Keep path-collision rejection and one-document-per-path behavior unchanged.
- Verification (smallest signal):
  - `npm run typecheck`
  - `npm run build`
  - `npx vitest run test/plan/targets.test.ts test/emit/index.test.ts test/stability/index.test.ts test/cli/validate-compile.test.ts`
- Docs/comments (propagation; only if needed):
  - Add one short code comment at the manifest/emit boundary explaining that source declares ownership and CLI only authorizes destructive apply.
- Exit criteria:
  - Dry-run compile can preview deletes, write mode without `--prune` fails loudly, and delete execution never escapes declared ownership.
- Rollback:
  - Remove delete execution and keep ownership disabled if scope validation or fail-loud behavior cannot be enforced exactly.

## Phase 3 - Add shared projection helpers without widening the normalized model
- Status: COMPLETE
- Completed work:
  - Added `src/source/projections.ts` with generic `projectDocumentSections(...)` helper-layer lowering around existing template definitions.
  - Kept projection fully helper-only by lowering back into ordinary `SetupPart` values and validating section keys against the template surface.
  - Added targeted template-level proof for shared section defaults plus per-destination overrides of body, `documentsTo`, and additive source provenance.
  - Adopted the helper in the public editorial proving fixture without changing planner or renderer behavior or its rendered output contract.
- Goal:
  - Remove the highest-value repeated shared-section glue while keeping projection fully in the helper layer.
- Work:
  - Add `src/source/projections.ts` with the shared-section projection helper named in Section 6.
  - Reuse or extract the stable lowering pieces from `templates.ts` so projected sections still lower into ordinary surfaces, sections, generated targets, and links.
  - Support per-destination overrides for body, `documentsTo`, and source provenance without changing planner or renderer behavior.
  - Adopt the projection helper in the smallest public proving surface first, then in one canonical setup surface that benefits clearly.
- Verification (smallest signal):
  - `npm run typecheck`
  - `npm run build`
  - `npx vitest run test/source/templates.test.ts test/e2e/editorial-example.test.ts`
- Docs/comments (propagation; only if needed):
  - Add one short code comment near the projection helper boundary explaining that projection is helper-only lowering, not a new semantic document family.
- Exit criteria:
  - Shared sections can project into multiple destination documents through plain lowered setup parts, with planner and renderer unchanged.
- Rollback:
  - Revert helper adoption if projection requires new semantic node kinds, merge semantics, or renderer awareness.

## Phase 4 - Add explicit keyed overrides while keeping `composeSetup(...)` append-only
- Status: COMPLETE
- Completed work:
  - Added `src/source/overrides.ts` with `applyKeyedOverrides(...)` as a separate replace-by-id helper that leaves `composeSetup(...)` unchanged.
  - Kept override targeting strictly stable-id-based and fail-loud on missing ids, duplicate ids, or attempts to change the selected id.
  - Converted the shared-overrides proving fixture to shared stable ids plus explicit local override functions instead of manual local restatement.
  - Updated compose and e2e proof so the override surface stays transparent and the resulting rendered output remains setup-local.
- Goal:
  - Provide honest stable-id replacement for reuse cases without silently changing existing composition semantics.
- Work:
  - Add `src/source/overrides.ts` with `applyKeyedOverrides(...)`.
  - Keep `composeSetup(...)` unchanged and make override helpers fail loudly on missing ids, duplicate ids, or ambiguous replacement intent.
  - Convert the shared-overrides proving fixture and e2e coverage to the explicit override helper instead of manual local restatement.
  - Keep override targeting strictly id-based, never positional.
- Verification (smallest signal):
  - `npm run typecheck`
  - `npm run build`
  - `npx vitest run test/source/compose.test.ts test/e2e/shared-overrides.test.ts`
- Docs/comments (propagation; only if needed):
  - Add one short code comment at the override boundary explaining that stable ids are the only legal selector surface.
- Exit criteria:
  - Stable-id replacement works, `composeSetup(...)` remains append-only, and override failures are explicit and deterministic.
- Rollback:
  - Remove the override helper and revert proving-surface adoption if replacement semantics become positional or opaque.

## Phase 5 - Widen fragment loading narrowly for table-backed authored blocks
- Status: COMPLETE
- Completed work:
  - Added narrow pipe-table support in `loadFragments(...)` that lowers directly to the existing authored `table` block.
  - Kept fragment widening intentionally bounded by requiring explicit pipe-table syntax plus a real separator row, while leaving headings, frontmatter, HTML, task lists, and multiline list items forbidden.
  - Added focused parser proof for successful table loading and malformed table failure with file context.
  - Switched the authored-content e2e proof to load a fragment-backed table end to end without changing the rendered markdown contract.
- Goal:
  - Improve prose ergonomics only where the compiler already has an honest authored-block and renderer story.
- Work:
  - Refactor `loadFragments(...)` into explicit block recognizers instead of ad hoc special cases.
  - Add pipe-table support that lowers directly to the existing `table` authored block.
  - Keep headings, frontmatter, HTML, task lists, images, and multiline list items forbidden with the same fail-loud file-context behavior.
  - Adopt at least one fragment-backed table in a public proving example or focused fixture.
- Verification (smallest signal):
  - `npm run typecheck`
  - `npm run build`
  - `npx vitest run test/source/fragments.test.ts test/e2e/authored-content.test.ts`
- Docs/comments (propagation; only if needed):
  - Add one short parser comment explaining why tables are supported while headings remain TypeScript-owned.
- Exit criteria:
  - Fragment tables lower deterministically into existing authored blocks, and previously rejected higher-risk constructs still fail loudly.
- Rollback:
  - Remove table support if parser widening threatens deterministic ownership or pushes the loader toward general markdown parsing.

## Phase 6 - Update docs, examples, and canonical setups; run final repo proof
- Status: COMPLETE
- Completed work:
  - Updated `README.md`, `docs/schema.md`, `docs/architecture.md`, and `docs/example_lessons.md` so the new framework surfaces are explained with small honest demonstrations instead of source-diving.
  - Switched the canonical Lessons and Core Dev entrypoints to `defineSetupModule(...)` with explicit owned output scopes that match what each setup actually owns.
  - Reconciled the proving fixtures and snapshots that now surface manifest ownership, stable shared ids, and setup-module boundaries through the public API.
  - Ran the planned broad verification gate plus full `npm test`, and the repo finished green.
- Goal:
  - Make the shipped feature set legible and prove it generically across repo docs, examples, CLI surfaces, and canonical setups.
- Work:
  - Update `README.md`, `docs/schema.md`, `docs/architecture.md`, `docs/testing.md`, and `docs/example_lessons.md` with small honest demonstrations of the new public contracts.
  - Adopt the new surfaces in `test/fixtures/source/editorial-example.ts`, `test/fixtures/source/shared-overrides.ts`, `setups/lessons/**`, and `setups/core_dev/**` where they are the right proving surfaces.
  - Keep Lessons as a proving case, not the product story, and make sure at least one non-Lessons setup demonstrates the new framework surface.
  - Review any output or golden changes before updating them; do not use snapshot churn to force green tests.
  - Remove any repo-local demonstration or docs references that still imply shell-managed delete truth once compiler-owned ownership exists.
- Verification (smallest signal):
  - `npm run typecheck`
  - `npm run test:types`
  - `npm run build`
  - `npx vitest run test/source/templates.test.ts test/source/compose.test.ts test/source/fragments.test.ts test/checks/registry.test.ts test/plan/targets.test.ts test/emit/index.test.ts test/cli/doctor.test.ts test/cli/validate-compile.test.ts test/e2e/editorial-example.test.ts test/e2e/shared-overrides.test.ts test/e2e/lessons-full.test.ts test/e2e/second-setup.test.ts`
  - `npm test`
- Docs/comments (propagation; only if needed):
  - Public docs are mandatory in this phase.
  - Add only the remaining high-leverage boundary comments discovered during implementation; do not add prose-only cleanup comments.
- Exit criteria:
  - Docs, examples, tests, and canonical setups all demonstrate the feature contracts plainly, broad repo verification passes, and the result still reads as framework-first rather than Lessons-specific.
- Rollback:
  - Revert canonical setup or docs adoption for any feature that proves misleading, overfit, or not yet generically defensible, while keeping lower-level framework work isolated for follow-up.
<!-- arch_skill:block:phase_plan:end -->

# 8) Verification Strategy (common-sense; non-blocking)

## 8.1 Unit tests (contracts)
- Prefer existing unit-style tests around:
  - source/template lowering
  - composition semantics
  - fragment parsing
  - check registration
  - target/emit ownership behavior
- Treat example-level tests as contract proof where they are the clearest public demonstration of the new surface.
- Avoid proof tests that only celebrate deletions or restate documentation.

## 8.2 Integration tests (flows)
- Prefer existing compile and CLI flows over new harnesses.
- Expected high-value integration signals:
  - compile dry-run with explicit ownership and delete reporting
  - `doctor` behavior with setup-local checks
  - canonical setup adoption of new helper surfaces
  - docs/example snippets that stay aligned with the real public API surface
  - final broad proof through `npm run typecheck`, `npm run test:types`, `npm run build`, and `npm test` after canonical setup adoption

## 8.3 E2E / device tests (realistic)
- No device or UI testing is relevant.
- Realistic end-to-end proof is:
  - read the docs/example surface and confirm it matches the implemented feature contract
  - compile canonical setups
  - inspect emitted file manifests and diagnostics
  - confirm non-Lessons coexistence remains honest
  - only then claim repo-wide green

# 9) Rollout / Ops / Telemetry

## 9.1 Rollout plan
- Land the architecture and implementation in `paperzod` first.
- Prove the new surfaces in repo docs/examples and canonical repo-local setups second.
- Adopt them in consumer repos such as `paperclip_agents` only after the framework contract is stable.

## 9.2 Telemetry changes
- No product telemetry is expected.
- Operational visibility should come from existing diagnostics plus any new create/update/delete reporting if ownership/prune lands.

## 9.3 Operational runbook
- For ownership/prune behavior, the future default runbook should be:
  - declare ownership in source
  - dry-run compile
  - inspect create/update/delete output
  - run write mode
- The framework should remove the need for parallel shell delete lists when the setup declares ownership explicitly.

# 10) Decision Log (append-only)

## 2026-04-02 - Treat demonstrations as in-scope feature work

Context
- The user clarified that docs, examples, and tests demonstrating the new features should be part of scope, not optional follow-through.

Options
- Keep demonstrations as implied proof only and let implementation carry the meaning.
- Make demonstrations an explicit requirement in the architecture plan and future phase plan.

Decision
- Treat demonstrations in docs, examples, and tests as part of the feature outcome and definition of done.

Consequences
- Future phases need to budget demonstration work directly into scope.
- A feature will not be considered complete if its public usage remains inferential.

Follow-ups
- Carry this requirement into research, phase ordering, and verification design.

## 2026-04-02 - Treat the feature-request note as pressure, not API spec

Context
- The feature-request note in `../paperclip_agents/docs/PAPERZOD_FEATURE_REQUESTS_EXAMPLE_DRIVEN_2026-04-02.md` describes real friction points using Lessons-shaped example code.
- The user explicitly wants the framework response to ignore the literal implementation sketches and design the better framework-first outcomes instead.

Options
- Turn the example sketches directly into public `paperzod` APIs.
- Treat the examples as evidence of generic missing capabilities and design those capabilities against the existing framework boundary.
- Refuse the request entirely because the current surface can already support the cutover with local glue.

Decision
- Treat the request note as example-driven pressure only.
- Design generic framework capabilities that solve the underlying jobs without turning `paperzod` into a Lessons-specific builder.

Consequences
- The next commands have to stay disciplined about product boundary and architecture fit.
- Some requested convenience may end up as helper-layer lowering rather than new core concepts.
- The plan will explicitly reject feature directions that only make sense for the Lessons proving case.

Follow-ups
- Confirm this North Star before deeper planning.
- Run `research` and `deep-dive` against the current extension seams and canonical setups.

## 2026-04-02 - Keep semantic setup truth plain and place new features around it

Context
- The deep-dive pass confirmed that the five pressure areas do not all belong in the same layer.
- Shared projection and keyed overrides are authoring ergonomics problems.
- Setup-local checks and owned-output prune need real compiler surfaces, but they still do not justify new semantic node kinds.
- The repo already has a clean small-core bias that treats helpers as lowering into plain setup truth.

Options
- Add new normalized node kinds for projection, override intent, ownership, and setup-local checks.
- Keep semantic setup truth plain, add a thin source-envelope contract for checks and ownership, and keep projection plus overrides as helper-layer lowering.
- Leave the current framework unchanged and keep solving the pressure with setup-local glue and shell conventions.

Decision
- Keep `SetupInput` and the normalized graph as the semantic source of truth.
- Add a thin source-envelope contract for setup-local checks and output ownership.
- Keep shared projection and keyed overrides as explicit helper-layer features that lower into ordinary setup arrays.
- Limit fragment widening to syntax that already lowers cleanly into the existing authored-block model, starting with tables.

Consequences
- The main implementation work belongs in `src/source/**`, `src/index.ts`, `src/checks/**`, `src/plan/targets.ts`, `src/emit/index.ts`, and CLI surfaces rather than the normalized node model.
- `composeSetup(...)` stays append-only and backwards compatible.
- Compiler-owned prune becomes an explicit manifest/emit lifecycle with dry-run visibility and `--prune` authorization instead of shell-managed deletes.

Follow-ups
- Turn this architecture into the authoritative phase plan next.
- Keep docs, examples, and tests in the same execution phases as the feature work.

## 2026-04-02 - Source declares ownership, CLI only authorizes destructive apply

Context
- The first deep-dive pass still left one important behavior choice too soft: whether ownership/prune should partly live in source and partly in CLI, or whether CLI should be allowed to invent ownership for a run.
- The same ambiguity existed for setup-local checks: source declaration versus runtime registration.

Options
- Let CLI flags supply ownership scopes and extra checks at compile time.
- Declare checks and ownership in source, and let CLI only authorize destructive execution via `--prune`.
- Keep ownership outside the compiler and preserve shell-managed delete lists.

Decision
- Setup-local checks and output ownership are declared in source via the source-envelope contract.
- CLI does not invent ownership or extra rules.
- CLI only authorizes destructive delete application for already-declared ownership scopes, using `--prune`.
- Write mode without `--prune` fails with emit diagnostics when stale owned files would remain.

Consequences
- `validate`, `doctor`, and `compile` stay aligned because they all consume the same resolved source envelope.
- Ownership becomes inspectable compiler truth instead of operator convention.
- Delete preview remains a dry-run concern, while delete execution remains an explicit destructive action.

Follow-ups
- Carry this through the phase plan and implementation sequencing.
- Test dry-run delete preview and write-mode prune-required failure separately.

## 2026-04-02 - Sequence implementation by boundary risk, not by feature popularity

Context
- After deep-dive, the highest-pressure user-facing features were clear, but the safe execution order was not identical to the most visible authoring wins.
- Shared projection and keyed overrides are attractive first moves, but both are safer after the new source-envelope and prune boundaries exist.

Options
- Start with projection and override helpers because they are the most obvious authoring pain.
- Start with the source-envelope plus check plumbing, then land ownership/prune, then add helper-layer ergonomics on top.
- Try to implement all five capability areas in one broad pass.

Decision
- Sequence implementation by boundary risk:
  - source-envelope and check plumbing first
  - ownership/prune manifest plus emit lifecycle second
  - projection third
  - keyed overrides fourth
  - fragment widening fifth
  - docs/examples/canonical proof last

Consequences
- The most destructive lifecycle boundary lands before helper adoption starts depending on it.
- Public authoring ergonomics still land early enough to matter, but on a stable compiler boundary.
- Section 7 can now act as the one authoritative implementation checklist instead of a bag of parallel feature threads.

Follow-ups
- Execute `implement` directly from the new phase order.
- Reopen sequencing only if implementation evidence shows a hidden dependency the phase plan missed.
