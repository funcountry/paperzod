---
title: "paperzod - Generic Framework Lessons Separation And Completion - Architecture Plan"
date: 2026-04-02
status: complete
fallback_policy: forbidden
owners: [aelaguiz]
reviewers: []
doc_type: phased_refactor
related:
  - docs/requirements.md
  - docs/architecture.md
  - docs/schema.md
  - docs/testing.md
  - docs/ref/LESSONS_STRUCTURED_DOCTRINE_REQUIREMENTS_2026-04-01.md
  - docs/ref/LESSONS_WORKFLOW_SIMPLE_CLEAR.md
  - ../paperclip_agents/AGENTS.md
  - ../paperclip_agents/paperclip_home/project_homes/lessons/shared/README.md
  - ../paperclip_agents/paperclip_home/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md
---

# TL;DR

Outcome

`paperzod` becomes a complete generic doctrine compiler whose core architecture, checks, planning, rendering, docs, and tests are framework-level only, while Lessons moves into a first-class example and proving package that exercises the full feature set without being baked into the core implementation.

Problem

The repo is currently split-brained: the docs say `paperzod` is a multi-setup framework, but the implementation still carries Lessons-specific naming, render behavior, target assumptions, fixtures-as-canonical-source, and missing generic architecture needed to support the real Lessons requirements honestly.

Approach

Refactor the repo around an explicit boundary: generic core contracts and renderer primitives in `src/**`, target-family adapters that are still setup-agnostic, and plain TypeScript setup/example modules under `setups/**` that own Lessons-specific authored data and parity expectations. Update repo instructions so future work cannot reintroduce Lessons-specific behavior into the core by accident.

Plan

1. Re-establish the product boundary in docs, AGENTS guidance, and repo authoring config so the setup contract is explicit before behavior changes.
2. Finish the missing generic framework architecture so the core can express the full requirements named by the Lessons reference docs without setup-specific renderer or target behavior.
3. Make plain TypeScript setup modules first-class authoring inputs, then move Lessons and `core_dev` into canonical setup packages instead of keeping them half inside `src/**` and half inside fixtures.
4. Finish structural-first parity and the end-to-end verification story so the framework and the Lessons proving case are both fully covered.

Non-negotiables

- No Lessons-specific behavior in core compiler, planner, or renderer code.
- No competing sources of truth between fixtures, examples, and canonical setup packages.
- No runtime shims or compatibility branches that keep the confusion alive.
- AGENTS guidance must explicitly protect the framework/example boundary.
- The final test story must prove both genericity and full Lessons support end to end.

<!-- arch_skill:block:implementation_audit:start -->
# Implementation Audit (authoritative)
Date: 2026-04-02
Verdict (code): COMPLETE
Manual QA: n/a (non-blocking)

## Code blockers (why code is not done)
- None.

## Reopened phases (false-complete fixes)
- None.

## Missing items (code gaps; evidence-anchored; no tables)
- None. Spot-check audit against the shipped repo matched the plan's code-complete claims:
  - canonical setup modules now exist at `setups/lessons/index.ts` and `setups/core_dev/index.ts`
  - CLI setup loading now accepts `.ts`, `.mts`, and `.cts` in `src/cli/shared.ts`
  - Paperclip target validation is family-only in `src/plan/targets.ts`
  - the empty pseudo-extension layer is gone and `src/checks/index.ts` composes `coreCheckRules` directly
  - canonical fixture modules are thin re-exports in `test/fixtures/source/lessons-full.ts` and `test/fixtures/source/second-setup.ts`
  - canonical setup SSOT reaches parity, perf, and stability proof in `test/goldens/lessons-live/manifest-alignment.test.ts`, `test/perf/index.test.ts`, and `test/stability/index.test.ts`

## Non-blocking follow-ups (manual QA / screenshots / human verification)
- `docs/impl2.md` still contains old `setups/lessons/setup.ts` commands and pre-cutover wording at `docs/impl2.md:27`, `docs/impl2.md:28`, `docs/impl2.md:174`, `docs/impl2.md:267`, `docs/impl2.md:268`, `docs/impl2.md:938`, `docs/impl2.md:939`, `docs/impl2.md:966`, and `docs/impl2.md:1114`. The main plan explicitly deferred non-normative planning refs, so this does not reopen code phases, but it is still worth cleaning up if that doc remains contributor-facing.
<!-- arch_skill:block:implementation_audit:end -->

<!-- arch_skill:block:planning_passes:start -->
<!--
arch_skill:planning_passes
deep_dive_pass_1: done 2026-04-02
external_research_grounding: done 2026-04-02
deep_dive_pass_2: done 2026-04-02
phase_plan: done 2026-04-02
recommended_flow: deep dive -> external research grounding -> deep dive again -> phase plan -> implement
note: This is a warn-first checklist only. It should not hard-block execution.
-->
<!-- arch_skill:block:planning_passes:end -->

# 0) Holistic North Star

## 0.1 The claim (falsifiable)

This change is successful when the `paperzod` core can express and compile the full Lessons doctrine requirement set through generic node types, links, planners, render primitives, and target adapters, while all Lessons-specific authored content, parity expectations, and setup-local rules live outside the core implementation.

That claim is false if any required Lessons capability still needs hard-coded Lessons names, Lessons-only slugs, Lessons-only prose branches, Lessons-only path assumptions in the core, or if the only honest canonical source for Lessons still lives in test fixtures rather than a setup/example package.

## 0.2 In scope

- Refactoring repo architecture so `src/**` is framework-only.
- Completing generic framework support for the requirements in `docs/ref/LESSONS_STRUCTURED_DOCTRINE_REQUIREMENTS_2026-04-01.md`.
- Defining canonical setup/example package locations for Lessons and at least one non-Lessons proving setup.
- Updating root repo doctrine, including `AGENTS.md`, so future work preserves the framework versus example boundary.
- Finishing automated proof so the framework and the Lessons proving case are both tested end to end.
- Removing current structural confusion where fixtures, examples, docs, and implementation each imply a different source of truth.

## 0.3 Out of scope

- Rewriting the live `paperclip_agents` Lessons doctrine corpus for its own sake.
- Generating or owning `paperclip_home/project_homes/lessons/tools/**` or `plans/**` as framework runtime output.
- Building a generic whole-repo knowledge graph beyond doctrine compilation.
- Preserving current Lessons-specific implementation shortcuts in the core for convenience.
- Shipping partial framework decoupling without the matching test and doctrine guardrails.

## 0.4 Definition of done (acceptance evidence)

- `src/**` contains no Lessons-specific rendering branches, title checks, slug checks, or path conventions beyond explicitly generic target-family rules.
- A canonical Lessons setup/example package exists outside `test/fixtures/source/**` and is the primary authored source for the Lessons proving case.
- A second canonical non-Lessons setup/example package exists and proves the same framework without Lessons-shaped path leaks.
- The framework supports the missing Lessons requirements called out in `docs/ref/LESSONS_STRUCTURED_DOCTRINE_REQUIREMENTS_2026-04-01.md`, including section-level addressability, ownership, typed linkage, turn contracts, packet classification, validation, drift detection, and one-way markdown runtime generation.
- Root `AGENTS.md` and any relevant local instruction files explicitly prevent setup-specific requirements from being baked back into framework code.
- The final release gate runs the agreed end-to-end test matrix and passes.

## 0.5 Key invariants (fix immediately if violated)

- The core framework is setup-agnostic.
- Lessons is a proving case, not a hidden product boundary.
- Canonical authored setup sources do not live only in tests.
- One requirement, one owner, one canonical surface.
- Generated markdown is runtime output only; structured source remains the only semantic truth.
- Hard cutover beats dual-path drift.
- No fallbacks or runtime shims that preserve the current confusion.

# 1) Key Design Considerations (what matters most)

## 1.1 Priorities (ranked)

1. Restore a truthful framework versus setup boundary.
2. Finish the generic architecture needed to support the real Lessons requirements.
3. Keep the runtime markdown readable and close to the real Lessons corpus shape.
4. Make completeness auditable through tests and clear setup-package ownership.
5. Improve ergonomics so future setup work does not require touching framework internals.

## 1.2 Constraints

- The repo already advertises a generic product boundary in its public docs, so the code and tests need to converge toward that instead of redefining the product.
- Lessons is still the main proving case, so decoupling cannot mean weakening Lessons support.
- The live `paperclip_agents` Lessons tree is a real external truth surface and must remain an input to parity planning.
- The current codebase already has meaningful core layers; this is a correction and completion plan, not a greenfield rewrite.
- The verification bar must stay behavior-focused and avoid negative-value gates.

## 1.3 Architectural principles (rules we will enforce)

- Framework code owns generic semantics, not setup-local policy.
- Setup packages own authored doctrine content, setup-local naming, and parity intent.
- Target adapters may encode target-family filesystem law, but not one setup's doctrine semantics.
- Renderers should be driven by generic surface contracts plus authored source, not setup-name conditionals.
- Fixtures prove behavior; they do not masquerade as the only canonical authored setup source.
- Instruction files must state boundary rules in plain English and fail loudly when future work crosses them.

## 1.4 Known tradeoffs (explicit)

- Moving Lessons out of the core will increase setup-package surface area, but that is honest complexity rather than hidden framework coupling.
- Some current snapshots and fixture assumptions will need deliberate replacement rather than incremental patching.
- A stricter framework/example split may force new extension points in the renderer and checker layers, but that is preferable to continuing with title- and slug-based branches.
- Prefer richer authored document metadata over a renderer-plugin system in the first cut. That keeps the framework smaller, but it means truly exotic setup-local rendering behavior stays out of scope until a real second adopter justifies it.
- Prefer plain TypeScript setup modules over a setup-module wrapper or per-setup rule bundle in the first cut. That keeps the authoring path close to the current repo pattern, but it means any future need for setup-local code hooks should be justified by real evidence rather than anticipation.

# 2) Problem Statement (existing architecture + why change)

## 2.1 What exists today

`paperzod` already has a real compiler path: source validation, graph construction, core checks, compile planning, rendering, target resolution, and emit. It also has a meaningful semantic model for roles, workflow steps, gates, packet contracts, artifacts, surfaces, sections, references, and generated targets.

At the same time, the executable Lessons proving story currently lives mostly in `test/fixtures/source/**`, the Paperclip-specific semantic rule layer is empty, and multiple renderer and target behaviors still depend on Lessons-shaped names, paths, or prose.

## 2.2 What’s broken / missing (concrete)

- The repo says the framework is generic, but `src/markdown/renderers/**` still contains Lessons-aware title and slug branches.
- The repo says human-authored wording matters, but the source model has no document-level title or intro fields, so renderers currently infer those from runtime paths, documented node kinds, or Lessons-specific names.
- The repo says the framework should enforce project-local law, but `src/checks/paperclip-rules.ts` is empty.
- The repo says canonical setup source should be separate from tests, but the real authored Lessons examples still live in test fixtures.
- The repo says a non-Lessons setup is proven, but the current `second-setup` fixture still leaks a Lessons path family.
- The repo says the CLI should support the real authoring flow, but it still rejects `.ts` setup input.
- The repo says the framework should satisfy the latest Lessons requirements, but the current implementation does not yet prove all of those requirements end to end.

## 2.3 Constraints implied by the problem

- We need an architectural split that preserves the existing useful compiler layers instead of discarding them.
- We need doctrine updates that stop future contributors from reintroducing setup-local logic into the core.
- We need the final test matrix to prove both genericity and the full Lessons case, not one at the expense of the other.

<!-- arch_skill:block:research_grounding:start -->
# 3) Research Grounding (external + internal “ground truth”)

## 3.1 External anchors (papers, systems, prior art)

- `docs/requirements.md:5-24` and `docs/requirements.md:26-57` are the product-boundary anchor. Adopt the rule that `paperzod` is a standalone compiler for more than one Paperclip setup, and reject any attempt to treat exact Lessons path parity as the core product boundary.
- `docs/ref/LESSONS_STRUCTURED_DOCTRINE_REQUIREMENTS_2026-04-01.md:38-50`, `docs/ref/LESSONS_STRUCTURED_DOCTRINE_REQUIREMENTS_2026-04-01.md:137-227`, and `docs/ref/LESSONS_STRUCTURED_DOCTRINE_REQUIREMENTS_2026-04-01.md:246-260` are the best current capability matrix for the proving case. Adopt the required abilities named there: stable section links, ownership, read and trust edges, packet and artifact classification, conceptual-versus-runtime mapping, and drift detection. Reject its pod-local scope notes as the framework boundary for `paperzod` itself.
- `../paperclip_agents/AGENTS.md:90-119` is the strongest live doctrine ergonomics anchor outside this repo. Adopt the patterns "one rule, one owner" and "write doctrine in the order agents resolve it." Reject the idea that the current `paperclip_home/**` directory names or subtrees should become framework semantics.
- `../paperclip_agents/paperclip_home/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md:5-20`, `../paperclip_agents/paperclip_home/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md:34-65`, `../paperclip_agents/paperclip_home/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md:67-123`, and `../paperclip_agents/paperclip_home/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md:144-189` are the live Lessons runtime-shape anchor. Adopt the real lane order, owner map, comment contract, specialist turn contract, critic placement, and legacy-versus-live file distinctions as proving inputs. Reject copying those exact filenames, slugs, or prose branches into core renderer logic.

## 3.2 Internal ground truth (code as spec)

- Authoritative behavior anchors (do not reinvent):
  - `src/index.ts:41-120` defines the real public pipeline: normalize, graph, checks, compile plan, render, target manifest, then optional emit. Later phases should preserve that spine.
  - `src/source/normalize.ts:31-187` shows that the authoring layer is intentionally thin. It mostly stamps `kind` and `setupId` onto authored objects. That means missing behavior should be added as explicit source-model fields, links, or checks, not as renderer guesswork.
  - `src/graph/linker.ts:11-164` and `src/graph/indexes.ts:36-208` are the graph substrate. They already give us stable node and link identity, preserved-order read indexes, preserved-order section trees, and generated-source indexes. Those are the right raw materials for section-level ownership and drift checks.
  - `src/checks/core-rules.ts:169-360` is already doing real generic semantic enforcement for workflow routing and artifact or packet consistency. `src/checks/paperclip-rules.ts:1-3` is the empty setup-specific rule seam, which confirms that setup-local law is not architecturally finished yet.
  - `src/plan/index.ts:77-283` is the current provenance engine. It already enforces generated-target backing, section path matching, single-owner checks for sections, section generation provenance, and authored declaration order. That makes it the right place for any stronger section-level truth guarantees.
  - `src/plan/targets.ts:69-103` is the target-family adapter seam. It is generic in shape, but the Paperclip validators still allow Lessons-era directory names such as `lessons_content_standards`, which is concrete evidence of setup leakage inside the target layer.
  - `src/markdown/renderers/workflow-owner.ts:28-84`, `src/markdown/renderers/standard.ts:5-59`, `src/markdown/renderers/reference.ts:5-50`, `src/markdown/renderers/gate.ts:32-123`, and `src/markdown/renderers/shared-entrypoint.ts:12-117` are the clearest current coupling points. They branch on Lessons-only titles, stable slugs, and `project_homes` path parsing to decide semantic prose.
  - `src/cli/shared.ts:22-35` rejects `.ts` setup inputs. That is a real authoring-flow gap if canonical setup packages are going to live outside tests and stay TypeScript-first.
  - `test/fixtures/source/second-setup.ts:71-125` proves the current non-Lessons example is not actually clean. Its gate still lives under `shared/lessons_content_standards/`, so the repo does not yet have an honest second proving setup.
  - `test/goldens/lessons-live/manifest-alignment.test.ts:40-80` proves only that the represented Lessons subset stays inside the frozen inventory with matching surface classes and excluded-subtree discipline. It does not yet prove full end-to-end parity or full requirements coverage.

- Existing patterns to reuse:
  - `src/markdown/renderers/common.ts:153-180` already supports rich authored content blocks. Reuse this by moving setup-local prose into authored section bodies instead of growing title- and slug-based renderer branches.
  - `src/markdown/renderers/common.ts:202-214` already knows how to derive generic workflow facts from the graph. Reuse this when we need boilerplate runtime summaries that should stay framework-level.
  - `src/graph/indexes.ts:124-133` preserves surface-section order and parent-child hierarchy explicitly. Reuse that instead of inferring read order or ownership maps from filenames.
  - `src/plan/index.ts:213-255` already computes section-level provenance from documented nodes and generated targets. Reuse that mechanism for stronger drift and ownership guarantees instead of inventing another parallel provenance system.
  - `src/plan/targets.ts:40-52` cleanly separates generic target resolution from family-specific validation. Reuse that seam, but make the Paperclip adapter family-level only.
  - `src/emit/index.ts:40-76` already enforces one-way generation and refuses generated-markdown parsing. Reuse that as a hard invariant while completing the rest of the framework.

## 3.3 Open questions (evidence-based)

- Which Lessons requirements are true model gaps versus proof gaps? Evidence needed: a requirement-by-requirement audit against `src/source/**`, `src/graph/**`, `src/checks/**`, and `src/plan/**` that marks each requirement as already representable, only partially enforced, or missing entirely.
- Which current renderer leaks can become plain authored content, and which ones need a real extension seam? Evidence needed: a file-by-file classification of every branch in `src/markdown/renderers/**` into authored-source move, target-family concern, or explicit setup-local plugin point.
- What exact Lessons requirements are worth proving in the first canonical parity pass beyond path and surface-class alignment? Current default: structural parity first, wording-fidelity checks later if the structural pass exposes a real gap.
<!-- arch_skill:block:research_grounding:end -->

<!-- arch_skill:block:external_research:start -->
# External Research (best-in-class references; plan-adjacent)

> Goal: anchor the plan in idiomatic, broadly accepted practices where applicable. This section intentionally avoids project-specific internals.

## Topics researched (and why)

- Stable core layering for schema-driven tooling libraries — this plan already uses Zod-style layering as an architecture anchor and needs the exact rule, not just the slogan.
- Node-native TypeScript module loading for repo-local authored inputs — the plan wants `.ts`, `.mts`, and `.cts` canonical setup modules, and the repo currently has no runtime TypeScript loader dependency.

## Findings + how we apply them

### Stable core layering for schema-driven tooling

- Best practices (synthesized):
  - Build tooling against a narrow, stable core or permalink surface instead of a flagship root import or convenience layer.
  - Keep inspectable internals plain and serializable so generators, adapters, and other tooling can traverse definitions without depending on helper methods.
  - Keep optional metadata, registry, and schema-generation surfaces adjacent to the core rather than smuggling them through the ergonomic layer.
- Recommended default for this plan:
  - Keep `paperzod/core` plus the normalized `SetupDef`, graph, and compile-plan substrate as the stable contract that renderers, targets, tests, and future tooling build against.
  - Keep repo-local `setups/**` out of the public package surface.
  - Do not add a setup-local plugin API or mutable global metadata registry in the first cut. Authored setup objects and compile-plan provenance remain the only semantic source of truth.
- Pitfalls / footguns:
  - Building extensions against the flagship or root surface instead of the stable core.
  - Letting authored document metadata live in out-of-band registries instead of explicit source fields.
  - Reintroducing setup-specific behavior through convenience helpers that bypass the normalized source model.
- Sources:
  - For library authors — https://zod.dev/library-authors — official guidance for tooling built on top of Zod, including the `zod/v4/core` permalink rule.
  - Zod Core — https://zod.dev/packages/core — official description of the minimal core surface and its inspectable `_zod.def` internals.
  - Metadata and registries — https://zod.dev/metadata?id=registries — official explanation of when registries are useful and why they are a distinct metadata layer.
- Local corroboration:
  - `vendor/zod/packages/zod/src/v4/index.ts`, `vendor/zod/packages/zod/src/v4/classic/external.ts`, `vendor/zod/packages/zod/src/v4/core/index.ts`, `vendor/zod/packages/zod/src/v4/core/registries.ts`, and `vendor/zod/packages/zod/src/v4/core/schemas.ts` show the same separation in the vendored checkout: a thin classic surface layered over `core`, plus explicit registries instead of hidden schema mutations.

### Node-native TypeScript module loading for repo-local authored inputs

- Best practices (synthesized):
  - Use Node's built-in type stripping only for lightweight, erasable-TypeScript execution. Use a third-party runner only when full TypeScript semantics or `tsconfig`-driven behavior are actually required.
  - If you choose Node-native loading, make the runtime contract explicit: `NodeNext`, explicit relative file extensions, `type` imports, no path aliases, no decorators, and no syntax that requires JavaScript code generation unless you intentionally opt into transform mode.
  - Do not treat raw TypeScript under `node_modules` as a supported package contract.
- Recommended default for this plan:
  - Support `.ts`, `.mts`, and `.cts` canonical setup modules as a repo-local authoring convenience under the built-in Node type-stripping model, not via a bundled runtime loader dependency.
  - Document and enforce one Node runtime floor for this feature before shipping it.
  - Keep canonical setup modules as simple plain-object modules that only use erasable TypeScript syntax and explicit local import extensions.
  - Keep published package output JS-only. `.ts` setup loading is a repo-local authoring path, not a promise that consumers can feed arbitrary TypeScript into the distributed package.
- Pitfalls / footguns:
  - Assuming Node reads `tsconfig.json` at runtime.
  - Relying on `paths` aliases or extensionless relative imports.
  - Using value-style type imports, decorators, enums, parameter properties, or other non-erasable syntax in canonical setup modules.
  - Quietly adding a second transpiler or loader path later and ending up with two authoring contracts.
- Sources:
  - Modules: TypeScript — https://nodejs.org/api/typescript.html — official runtime rules for built-in type stripping, supported syntax, explicit extensions, and dependency boundaries.
  - Modules: Packages — https://nodejs.org/api/packages.html — official module-resolution and file-extension behavior for `.ts`, `.mts`, and `.cts`.
  - TypeScript 5.8 Release Notes — https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html — official `erasableSyntaxOnly` guidance that aligns TypeScript checking with Node's type-stripping runtime model.

## Adopt / Reject summary

- Adopt:
  - Stable-core-first architecture: keep framework contracts in `src/core`, normalized defs, graph, and plan types; keep setup examples repo-local; keep render and target behavior data-driven.
  - Explicit source metadata over out-of-band registries: authored document title and intro belong on `surface`, not in a side channel.
  - Node-native erasable-TypeScript setup loading for repo-local canonical modules, with one documented Node runtime contract.
- Reject:
  - Building future extensions against convenience or root imports, setup-local wrappers, or setup-local executable plugin bundles.
  - A first-cut renderer plugin API or global registry for setup-local document shaping.
  - A bundled `tsx`- or `ts-node`-style runtime dependency unless a later requirement truly needs full `tsconfig`-aware execution.

## Open questions (ONLY if truly not answerable)

- No external-research blocker remains. Current plan default: declare the Node floor in `package.json` `engines`, enforce the repo-local `.ts` authoring contract through no-emit typecheck surfaces, and align CI only if CI is later added.
<!-- arch_skill:block:external_research:end -->

<!-- arch_skill:block:current_architecture:start -->
# 4) Current Architecture (as-is)

Note: this section captures the pre-change baseline the implementation replaced. The shipped state is reflected by Section 5, the completed phase notes in Section 7, and the worklog.

## 4.1 On-disk structure

- `package.json` exports one framework package with `.` plus `./core`, `./markdown`, and `./testing`. There is no canonical repo-local setup module surface outside tests today.
- `package.json` currently declares no `engines` floor, and the repo has no `.nvmrc`, `.node-version`, or CI pin. The runtime contract for any future `.ts` setup loading is therefore not encoded anywhere yet.
- `src/**` already contains real framework layers: source authoring and normalization, graph construction, checks, planning, markdown rendering, target resolution, emit, and CLI.
- `src/markdown/renderers/**` currently mixes framework work with setup-local prose shaping. That is the main location where the repo violates its own stated product boundary.
- `test/fixtures/source/**` currently holds the executable proving setups: `demo_minimal`, `shared_overrides`, `lessons_vertical_slice`, `lessons_full`, and `second_setup`. In practice, the Lessons and second-setup fixtures act as canonical setup source.
- `test/fixtures/*.test.ts`, `test/e2e/*.test.ts`, `test/render/*.test.ts`, and `test/perf/index.test.ts` all import those fixture modules directly, so the proof surface is coupled to test-owned setup source.
- `tsconfig.json` and `test/types/tsconfig.json` include `src/**` and `test/**`, but not `setups/**`. If canonical setup packages were added today, the repo-wide typecheck would not cover them.
- `test/goldens/lessons-live/**` is the frozen parity corpus for one external proving case. It is not semantic source, but it is the only repo-local mirror of the live Lessons runtime tree.
- `docs/requirements.md`, `docs/architecture.md`, `docs/schema.md`, `docs/testing.md`, and `docs/example_lessons.md` already describe a generic product with Lessons as a proving case. The repo shape has not caught up to that doctrine.
- `README.md` already advertises a `setups/**` repo shape, direct `.ts` setup compilation, and a contributor workflow that still tells people to begin in `test/fixtures/source/**`. That public doctrine is ahead of the shipped implementation and split on source-of-truth ownership.
- `../paperclip_agents/paperclip_home/project_homes/lessons/**` remains the live external runtime corpus the framework is trying to model. It is an input to parity planning, not a code-generation target owned by this repo.

## 4.2 Control paths (runtime)

1. Library path:
   `validateSetup` calls `normalizeSetup`; `renderSetup` runs normalize, graph build, checks, plan, and render; `compileSetup` adds target resolution; `compileAndEmitSetup` adds filesystem diff and write behavior.
2. CLI path:
   `src/cli/shared.ts` loads a setup module by file extension, but only for `.json`, `.js`, `.mjs`, and `.cjs`. The three CLI commands then route that plain object through the same public pipeline, and `doctor` still infers the setup id from the raw loaded value instead of a normalized result.
3. Render path:
   `src/markdown/index.ts` dispatches by `surfaceClass`. `renderSurfaceDocumentAst` in `src/markdown/renderers/common.ts` already handles generic section trees, authored `preamble`, and rich section-body content blocks. Several specialized renderers then add title, intro, and section fallback prose, including setup-aware branches.
4. Target path:
   `src/plan/targets.ts` validates Paperclip-style runtime paths after compile planning. It already separates adapter mechanics from family-specific validation, but some family rules still embed Lessons-era directory names.
5. Proof path:
   Source-model tests snapshot normalized fixtures, render tests snapshot output strings, e2e tests compile full fixture modules, CLI tests write temp `.mjs` modules, parity tests compare compiled Lessons output to the frozen inventory, and perf tests compile `lessons_full` repeatedly. The repo has no proof surface yet for repo-local canonical `setups/**` modules or for a Node-native `.ts` setup-loading contract.

## 4.3 Object model + key abstractions

- Generic semantic nodes already exist for `role`, `workflow_step`, `review_gate`, `packet_contract`, `artifact`, `surface`, `surface_section`, `reference`, and `generated_target`.
- Generic typed links already exist for ownership, reads, production, support, checks, routing, documentation, grounding, runtime mapping, and generation provenance.
- Authored rich prose already has a generic home: `surface.preamble` and `surface_section.body` accept structured paragraph, list, table, example, and code-block content.
- The graph layer already preserves the important order semantics needed by doctrine: authored workflow order, read order, section tree order, and generated-source provenance.
- The current abstraction gap is at the document level. `surface` has no authored document title or authored intro field, so renderers infer those from runtime paths, documented node kinds, or setup-specific slug and title branches.
- The current authoring-contract gap is at the repo-config level. The codebase has no place yet where canonical setup packages can use explicit `.ts` local imports while staying inside repo typecheck and outside the emitted package build.
- Requirement-fit readback:
  - already generically present: section-level addressability, typed links, workflow turn contracts, packet and artifact classification, conceptual-versus-runtime mapping, generated-target provenance, one-way generation
  - only partially enforced or proven: whole-doctrine single ownership beyond sections, drift coverage across the full Lessons case, CLI authoring ergonomics, family-only target validation, repo-local TypeScript setup authoring
  - genuinely missing in the model: authored document-level title and intro metadata
- The current repo has no canonical setup-module location outside tests, but the runtime pattern is already simple: fixtures and CLI temp modules default-export plain setup objects. There is no evidence yet that a setup-module wrapper is necessary.
- The current check system has a registry and rule bundles, but the default path only knows `coreCheckRules` plus an empty `paperclipCheckRules` array. In practice, the rule model is generic-only today.

## 4.4 Observability + failure behavior today

- Source validation, graph linking, semantic checks, compile planning, and target resolution all fail loudly with structured diagnostics.
- Emit is honest about filesystem impact. It reports `create`, `update`, or `unchanged`, includes a simple diff on updates, and refuses any parse-back flow through `parseGeneratedMarkdown()`.
- CLI `doctor` exposes diagnostic summaries, but it still assumes the loaded module is a plain setup object when reporting the setup id.
- Tests provide useful evidence across source normalization, graph indexes, checks, planning, rendering, CLI, emit, targets, e2e, parity, stability, and perf.
- The biggest silent-failure risk is in renderer fallback behavior. Today the framework can synthesize plausible prose for Lessons-shaped files from path names, surface titles, or section slugs even when that prose is really setup-local policy.
- The biggest proof gap is not raw test count. It is that the repo has no canonical setup package surface outside tests, and the live Lessons parity harness only proves subset alignment rather than the full finished proving case.
- The biggest toolchain ambiguity is around TypeScript authoring inputs. The repo currently has no enforced Node floor and no typecheck surface for `setups/**`, so a naive `.ts` loading change would leave the authoring contract implied rather than machine-checked.

## 4.5 UI surfaces (ASCII mockups, if UI work)

No UI redesign is in scope. The user-facing surfaces are:

- generated markdown runtime files
- CLI validate, compile, and doctor output
- rendered diffs and parity evidence
<!-- arch_skill:block:current_architecture:end -->

<!-- arch_skill:block:target_architecture:start -->
# 5) Target Architecture (to-be)

## 5.1 On-disk structure (future)

- `src/**`
  - framework-only code
  - generic source model, graph, checks, planning, renderer primitives, target adapters, emit, and CLI
  - no setup-local authored content, no setup-local prose branches, and no setup-local directory-name law
- `setups/lessons/index.ts`
  - canonical Lessons setup module
  - default export is a plain `SetupInput`
  - primary authored source for the Lessons proving case
- `setups/core_dev/index.ts`
  - canonical non-Lessons setup module
  - default export is a plain `SetupInput`
  - proves the same framework without Lessons-shaped leaks
  - starts as one file, not a split package tree
- `tsconfig.json`
  - no-emit repo typecheck surface
  - includes `setups/**` once canonical setup packages exist
  - carries the TypeScript options needed to type-check explicit `.ts` local imports and Node-native type-stripping constraints
- `tsconfig.build.json`
  - emitted package build remains `src/**`-only
  - explicitly avoids treating `setups/**` as distributable package code
- `package.json`
  - public package exports stay framework-only
  - declares the Node floor required for repo-local `.ts` setup loading through `engines`
  - current default floor: `node >=24.12.0`, because that gives stable built-in type stripping instead of an experimental contract
- `test/fixtures/source/**`
  - either thin re-exports of canonical setups or intentionally smaller synthetic fixtures and mutation inputs
  - no longer the only honest home of canonical setup truth
- `test/goldens/lessons-live/**`
  - frozen parity corpus and inventory for one external proving case
  - remains external parity evidence, not semantic source
- `docs/**`
  - framework doctrine, example explanation, architecture plans, and release-gate truth

Public package exports stay framework-only. `setups/**` is a repo-local proving surface, not a public npm API unless a later use case justifies exporting it.

## 5.2 Control paths (future)

1. Public framework path:
   `validateSetup`, `renderSetup`, `compileSetup`, and `compileAndEmitSetup` continue to accept plain setup input and remain the public framework API.
2. Repo-local canonical setup path:
   the repo gains canonical setup locations under `setups/**`, but not a wrapper format. Canonical setup modules default-export plain `SetupInput` values so they remain directly usable with the public API. The first cut uses one file per canonical setup, `setups/<setup>/index.ts`, and only splits into `roles.ts`, `workflow.ts`, and similar files if a setup becomes too large to review sanely.
3. CLI path:
   CLI setup loading becomes TypeScript-first and accepts `.ts`, `.mts`, and `.cts` in addition to current module formats. The default path is Node-native type stripping, not a bundled runtime loader, so canonical setup modules must stay erasable-TypeScript-only, use explicit relative file extensions, avoid `tsconfig`-only path aliases, and remain repo-local rather than living under published `node_modules` dependency paths. That contract is encoded in `package.json` `engines`, the repo no-emit typecheck config, and contributor docs, not left as tribal knowledge. The CLI still resolves the default export as a plain setup object before invoking the public pipeline.
4. Check path:
   core compilation runs generic framework rules only in the first cut. `src/**` may contain framework rules and target-family rules, but not Lessons-only rules. If a future requirement truly needs setup-local executable rules, that should reopen architecture rather than arriving as a quiet side channel.
5. Render path:
   document title and document intro become authored data, not path-derived setup inference. Generic renderers may emit fallback summaries only when the content is derivable from node kind and graph links. All setup-local wording moves into authored `surface` or `surface_section` content.
6. Target path:
   the Paperclip target adapter enforces family boundaries and path safety only. Exact subfolder naming under `shared/**` becomes authored setup choice, not framework semantics.
7. Proof path:
   canonical setup modules compile through the same public API and CLI as any other input. Tests, fixtures, perf checks, and parity harnesses import those canonical setups instead of maintaining parallel setup declarations. The first parity pass is structural: prove the right documents, paths, surface classes, and key section coverage before adding wording-fidelity checks.

## 5.3 Object model + abstractions (future)

- Keep the current node families and link families as the generic baseline. Do not add Lessons-only node kinds.
- Extend `surface` with authored document-level metadata:
  - `title?: string`
  - `intro?: AuthoredContentBlock[]`
- Keep `surface.preamble` and `surface_section.body` as authored content surfaces. The rendering rule becomes:
  - `surface.title` owns document title when present
  - `surface.intro` owns document-leading prose when present
  - `surface.preamble` adds further authored document content
  - `surface_section.body` owns exact section wording
  - generic fallback prose is allowed only when it is derivable from graph semantics rather than setup names
- Prefer richer source data over a renderer plugin system or global metadata registry in the first cut. The first implementation should not introduce a generic renderer-plugin API or out-of-band setup metadata channel unless a real second adopter exposes a capability gap that explicit authored content cannot cover.
- Keep the repo-local `.ts` setup authoring contract in config and docs rather than in runtime schema. `SetupInput` remains plain data; the extra rules apply only to how repo-local setup modules are authored and loaded.
- Keep target adapters as the explicit family-level extension seam.
- Keep compile planning as the only provenance authority. No second provenance system is introduced for canonical setups or parity harnesses.
- Keep `PlannedDocument` and `PlannedSection` provenance-focused. Do not widen compile-plan types just to cache authored `surface.title` or `surface.intro`; renderers can read that from the source graph through `surfaceId`.

## 5.4 Invariants and boundaries

- `src/**` may not branch on setup ids, Lessons-only titles, Lessons-only slugs, or exact setup-local folder names for semantic behavior.
- If a requirement is generic enough to matter for two setups, it belongs in the core source model, graph, checks, planner, or generic renderer path.
- If a rule is truly setup-local and cannot honestly be derived from generic source data, it lives beside that setup under `setups/**`, not under `src/**`.
- Exact folder names inside `paperclip_home/project_homes/<setup>/shared/**` belong to authored runtime paths. The Paperclip target adapter validates the shared subtree boundary, not one setup's naming folklore.
- `setups/**` becomes the canonical source of truth for example and proving setups. Tests may import canonical setups, mutate them, or snapshot their compiled output, but they may not silently fork them into competing copies.
- `setups/**` stays within one documented Node-native TypeScript contract. Do not add a second runtime TypeScript loader path without reopening architecture explicitly.
- Any TypeScript options needed only for repo-local setup authoring, such as explicit `.ts` local imports, stay on the no-emit typecheck surface and must not silently leak into the emitted `src/**` package build.
- `test/goldens/lessons-live/**` stays a frozen parity surface only. It does not become a second semantic source.
- Public exports remain framework-only until there is a concrete consumer for exported example packages.
- No setup-module wrapper or setup-local executable rule bundle is introduced in the first cut. If later evidence demands either one, reopen architecture explicitly.
- No compatibility shims or dual-path fixture ownership are allowed. Old fixture-owned canonical setups become thin imports or are deleted.

## 5.5 UI surfaces (ASCII mockups, if UI work)

No UI work is planned. The target user-facing improvements are:

- generated markdown whose setup-local wording comes from authored source rather than hard-coded renderer branches
- CLI flows that can load canonical TypeScript setup modules directly
- parity and proof output that cleanly distinguishes framework behavior from one setup's authored doctrine
<!-- arch_skill:block:target_architecture:end -->

<!-- arch_skill:block:call_site_audit:start -->
# 6) Call-Site Audit (exhaustive change inventory)

## 6.1 Change map (table)

| Area | File | Symbol / Call site | Current behavior | Required change | Why | New API / contract | Tests impacted |
| ---- | ---- | ------------------ | ---------------- | --------------- | --- | ------------------ | -------------- |
| Repo doctrine | `AGENTS.md` | root repo instructions | Says Lessons is a proving case but does not explicitly lock the framework/setup-package boundary or require the agent skill for future AGENTS edits | Add explicit framework-only `src/**` rule, canonical `setups/**` rule, and anti-regression wording | Prevent the repo from drifting back into Lessons-first architecture | Plain-English SSOT rule for framework vs setup packages | docs-only smoke and later review |
| Normative docs | `docs/requirements.md`, `docs/architecture.md`, `docs/schema.md`, `docs/testing.md`, `docs/example_lessons.md` | product, schema, architecture, testing, example doctrine | Docs describe a generic framework, but they still reference fixtures as the executable proving surface | Rewrite docs to point at canonical setup modules and the new renderer/source boundary | Prevent doc/code SSOT drift | Canonical setup-package doctrine and renderer-data-model doctrine | docs review plus release-gate docs pass |
| Public repo docs and runtime contract | `README.md`, `package.json`, `tsconfig.json`, `tsconfig.build.json`, `test/types/tsconfig.json` | README examples, `engines`, typecheck includes, TypeScript authoring options | README already advertises `setups/**` and direct `.ts` setup compilation, but the repo has no encoded Node floor, no `setups/**` typecheck surface, and no explicit separation between repo-only TypeScript authoring rules and the emitted package build | Declare the Node floor in `package.json` with `node >=24.12.0`, include `setups/**` in the no-emit typecheck surface, add the TypeScript options needed for explicit `.ts` local imports and Node-native constraints there, keep the emitted build `src/**`-only, and align README contributor guidance with canonical one-file setup modules | The Node-native `.ts` authoring path must be enforceable in config and docs, not implied | One explicit repo-local canonical setup authoring contract | `npm run typecheck`, `npm run test:types`, CLI tests, docs review |
| Public package surface | `package.json` | `exports` | Exports framework subpaths only | Keep framework-only exports explicit and decide whether any repo-local helpers need export changes | Avoid accidentally exporting proving packages as product API | Framework-only public export contract | CLI and self-import tests |
| Source model | `src/core/defs.ts`, `src/source/builders.ts`, `src/source/schemas.ts`, `src/source/normalize.ts` | `SurfaceDef`, `SurfaceInput`, schema and normalization for surfaces | `surface` has `runtimePath` and optional `preamble`, but no authored document title or intro | Add authored document-level metadata and normalize it | Remove the need for title and intro inference in renderers | `surface.title?` and `surface.intro?` authored contract | type tests, source tests, normalization tests, fixture snapshots |
| Compile types | `src/core/compile-types.ts` | `PlannedDocument`, `PlannedSection` | Compile plan is currently provenance-only | Keep compile-plan types minimal and avoid caching authored title or intro there | Prevent unnecessary widening of planning contracts | Provenance-only compile-plan contract | plan tests, render tests |
| Public pipeline | `src/index.ts` | `renderSetup`, `compileSetup`, `compileAndEmitSetup` | Public API only consumes raw setup input plus adapter | Preserve raw-input public API with no setup wrapper layer | Keep product API generic while enabling canonical setup modules by plain import | Public framework API stays plain `unknown -> SetupInput` | API tests, e2e, CLI |
| Check composition | `src/checks/index.ts`, `src/checks/paperclip-rules.ts`, `src/checks/registry.ts` | `defaultCheckRules`, `paperclipCheckRules`, registry execution | Default rules are `coreCheckRules` plus an empty Paperclip bundle | Collapse the misleading pseudo-layer or repurpose it only for truly generic family-level rules | The current empty file advertises an architecture that does not exist | One explicit generic rule composition path | checks, registry, e2e |
| Target-family validation | `src/plan/targets.ts` | `validatePaperclipSurfacePath`, `createPaperclipMarkdownTarget` | Enforces some Paperclip family rules but also encodes Lessons-era directory names | Narrow validation to family boundaries and path safety, not setup-local folder naming | Core should not know `lessons_content_standards` | Family-only Paperclip target contract | target tests, e2e, second setup |
| Common renderer contract | `src/markdown/renderers/common.ts` | `getDocumentTitle`, `renderSurfaceDocumentAst`, section tree rendering | Supports authored section bodies and `preamble`, but document title and intro fallback are still heavily inferred | Rework the common document render contract around authored document metadata plus graph-derived fallback only | Centralize the generic rendering rule once | Generic document render contract driven by authored title, intro, preamble, and section body | render tests, e2e |
| Renderer dispatch | `src/markdown/index.ts` | `renderDocumentAst` switch | Dispatches to specialized renderers whose contracts are not consistently generic | Keep dispatch by `surfaceClass`, but reduce specialized renderers to generic graph-derived behavior only | Preserve current idiomatic dispatch while removing setup-local semantic branches | Renderer responsibilities by surface family only | render tests, API tests |
| Role-home renderer | `src/markdown/renderers/role-home.ts` | `renderRoleHomeDocument` | Already mostly graph-driven, but still assumes fixed fallback sections such as `read-first` and `role-contract` | Keep generic fallback because it is graph-derived, but ensure authored section bodies always override cleanly | This is a good generic pattern worth preserving | Graph-derived role-home fallback contract | role-home render tests, e2e |
| Packet-workflow renderer | `src/markdown/renderers/packet-workflow.ts` | `renderPacketWorkflowDocument` | Mostly generic, but still treats `release-shape` as a semantic fallback trigger | Keep only truly generic lane-contract fallbacks and drop setup-shaped slug handling | Avoid setup-specific slug law inside core | Graph-derived packet-workflow fallback contract | workflow render tests, e2e |
| Lessons-coupled renderers | `src/markdown/renderers/workflow-owner.ts`, `src/markdown/renderers/standard.ts`, `src/markdown/renderers/reference.ts`, `src/markdown/renderers/gate.ts`, `src/markdown/renderers/shared-entrypoint.ts` | title, intro, slug, and path-derived branches | Branch on project path parsing, Lessons-only titles, and setup-specific slugs like `owner-map`, `comment-shape`, `specialist-turn-shape`, `Poker KB`, `GitHub`, and `Bootstrap` | Remove setup-local branches and move setup-local wording into authored setup source | This is the core architectural confusion the refactor is fixing | Renderer fallback only from generic graph facts; all other wording authored in setup modules | extended surface render tests, lessons e2e, second setup e2e, snapshots |
| CLI setup loading | `src/cli/shared.ts` | `loadSetupInput`, `analyzeSetupInput` | Loads only JSON and JS-family modules and assumes the loaded value is the setup object itself | Add TypeScript module support but keep the plain default-export contract and the repo-local Node-native `.ts` loading boundary | Canonical setups must be first-class authoring inputs without a wrapper format or second loader path | CLI plain-setup loading contract under the Node-native TypeScript authoring rules | CLI validate/compile tests, doctor tests |
| CLI commands | `src/cli/compile.ts`, `src/cli/validate.ts`, `src/cli/doctor.ts` | command entrypoints | Commands compile or analyze raw setup input directly and doctor guesses the setup id from the raw object | Keep plain setup input, but make setup-id reporting robust for TypeScript canonical modules too | Keep CLI truthful once canonical modules exist | CLI command contract for plain module inputs | CLI tests |
| Canonical setup modules | `setups/lessons/index.ts`, `setups/core_dev/index.ts` | new repo-local setup roots | Do not exist | Create canonical setup roots whose default export is a plain `SetupInput`, starting with one file per setup | Move canonical truth out of tests and out of core without inventing a wrapper format or premature package split | Canonical plain-module setup contract | all fixture, e2e, perf, CLI, parity suites |
| Fixture source modules | `test/fixtures/source/demo-minimal.ts`, `test/fixtures/source/lessons-vertical-slice.ts`, `test/fixtures/source/lessons-full.ts`, `test/fixtures/source/second-setup.ts`, `test/fixtures/source/shared-overrides.ts` | current fixture exports | Some fixtures are canonical source in disguise | Convert canonical ones into thin imports from `setups/**`; keep only intentionally synthetic fixtures as standalone | Remove duplicate truth surfaces | Canonical import rule for test fixtures | fixture source tests, e2e, perf |
| Fixture source snapshots | `test/fixtures/lessons-full-source.test.ts`, `test/fixtures/second-setup-source.test.ts`, `test/fixtures/lessons-vertical-slice-source.test.ts` | normalized setup snapshots | Snapshot fixture-owned canonical source | Re-point snapshots at canonical setup modules and make the second setup prove a real non-Lessons path mix | Proof should follow canonical source | Canonical source snapshot contract | fixture snapshot tests |
| API and type proof | `test/api/index.test.ts`, `test/types/authoring.test.ts` | public API and DSL proof | Prove plain setup authoring and compile path, but not canonical setup imports from `setups/**` | Preserve framework API proof and add repo-local type or usage proof for plain TypeScript canonical setup modules | Keep public API generic while proving the repo-local authoring path | Framework API stays plain; canonical setups are still plain setup modules | API tests, type tests |
| Render proof | `test/render/extended-surfaces.test.ts`, `test/render/role-home-shared.test.ts`, `test/render/workflow-packet.test.ts` | render snapshots and inline snapshots | Some render tests intentionally encode Lessons-specific core prose | Rewrite render tests around generic fallback behavior and authored setup prose coming from canonical source | Prevent tests from locking the wrong architecture in place | Generic renderer contract plus authored-source proof | render suites and snapshots |
| End-to-end proof | `test/e2e/lessons-full.test.ts`, `test/e2e/lessons-vertical-slice.test.ts`, `test/e2e/second-setup.test.ts`, `test/e2e/demo-minimal.test.ts`, `test/e2e/shared-overrides.test.ts` | end-to-end compile tests | Compile test-owned setup modules directly | Compile canonical setup modules and preserve narrow synthetic mutations separately | E2E proof must follow canonical source | Canonical setup compile contract | e2e suites and snapshots |
| CLI proof | `test/cli/validate-compile.test.ts` | temp-module CLI tests | Proves `.mjs` happy path only | Extend to canonical TypeScript setup-module files and plain raw-module compatibility | CLI authoring path is part of the architecture | Plain setup-module file loading contract | CLI suite |
| Target proof | `test/targets/paperclip-markdown.test.ts` | target adapter assertions | Uses Lessons-shaped path examples and current family regex assumptions | Rebase on family-boundary validation and add a true non-Lessons path-shape proof | Prevent target tests from hard-coding setup-local naming | Family-only Paperclip target proof | target suite |
| Parity proof | `test/goldens/lessons-live/inventory.test.ts`, `test/goldens/lessons-live/manifest-alignment.test.ts` | frozen inventory and alignment | Proves inventory shape and represented-subset alignment | Keep inventory as frozen external evidence, but make the first canonical parity pass structural-first: align canonical Lessons output on represented documents, paths, surface classes, and key sections before adding wording-level checks | Parity must stay honest and scoped | External parity input contract with a structural-first first pass | goldens suites |
| Performance proof | `test/perf/index.test.ts` | compile and heap guardrails | Compiles `lessons_full` fixture directly | Compile canonical setups instead of fixture-owned canonical source | Keep perf proof aligned with SSOT | Canonical setup perf contract | perf suite |

## 6.2 Migration notes

- Deprecated APIs (if any):
  - direct reliance on `test/fixtures/source/*.ts` as the canonical authored home of Lessons or the second proving setup
  - any assumption that the CLI only needs to resolve JavaScript modules rather than plain TypeScript setup modules
- Delete list (what must be removed; include superseded shims or parallel paths if any):
  - Lessons-specific title, slug, and project-path branches in `src/markdown/renderers/workflow-owner.ts`
  - Lessons-specific title branches in `src/markdown/renderers/standard.ts`
  - Lessons-specific reference branches in `src/markdown/renderers/reference.ts`
  - Lessons-specific `GitHub` and `Bootstrap` wording branches in `src/markdown/renderers/gate.ts`
  - project-name and project-home path parsing as semantic behavior in `src/markdown/renderers/shared-entrypoint.ts`
  - `release-shape` as a setup-shaped fallback trigger in `src/markdown/renderers/packet-workflow.ts`
  - the second-setup Lessons-path leak under `test/fixtures/source/second-setup.ts`
  - any empty or misleading pseudo-extension layer that implies setup-local rules live in `src/**` when they actually do not
- Cleanup and migration notes:
  - keep public package exports framework-only unless a later consumer justifies example exports
  - promote canonical plain setup modules first, then convert tests and fixtures to import them, then delete duplicate setup declarations
  - if repo-local setup authoring needs TypeScript options such as explicit `.ts` local imports, keep those on the no-emit typecheck surface and override them out of the emitted package build explicitly rather than relying on inheritance luck
  - update snapshots and parity artifacts only after reading the rendered contract change and confirming it is the intended architectural result

## Pattern Consolidation Sweep (anti-blinders; scoped by plan)

| Area | File / Symbol | Pattern to adopt | Why (drift prevented) | Proposed scope (include/defer/exclude) |
| ---- | ------------- | ---------------- | ---------------------- | ------------------------------------- |
| Canonical setup SSOT | `test/e2e/*.test.ts`, `test/perf/index.test.ts`, `test/fixtures/*.test.ts` | Import canonical setups from `setups/**` | Prevent tests from re-owning setup truth | include |
| Authoring-path SSOT | `src/cli/shared.ts`, `src/cli/compile.ts`, `src/cli/validate.ts`, `src/cli/doctor.ts`, `test/helpers/fixtures.ts` | Resolve plain TypeScript setup modules the same way everywhere | Keep CLI, helpers, and tests aligned on one authoring contract | include |
| Repo-local TS contract SSOT | `package.json`, `tsconfig.json`, `tsconfig.build.json`, `test/types/tsconfig.json`, `README.md` | Encode one Node-native `.ts` setup authoring contract in config and docs | Prevent version drift, accidental second loader paths, and build/typecheck contradictions | include |
| Renderer boundary | `src/markdown/renderers/common.ts`, `src/markdown/index.ts`, specialized renderers | Prefer authored `surface.title`, `surface.intro`, `preamble`, and section bodies over setup-local branches | Prevent future renderer drift back into Lessons-only logic | include |
| Family-only target law | `src/plan/targets.ts`, `test/targets/paperclip-markdown.test.ts` | Validate family boundaries, not setup folder names | Prevent setup-local naming from becoming framework law | include |
| Public API scope | `package.json` exports, `src/index.ts` | Keep public exports framework-only and avoid adding setup-wrapper helpers without evidence | Prevent example packages or speculative wrappers from becoming accidental product API | exclude for public exports, include for local helper boundaries |
| Non-normative planning references | `docs/impl2.md`, `docs/implementation_plan.md` | Update only if they materially confuse current work | Avoid scope creep into obsolete planning notes | defer |
<!-- arch_skill:block:call_site_audit:end -->

<!-- arch_skill:block:phase_plan:start -->
# 7) Depth-First Phased Implementation Plan (authoritative)

> Rule: systematic build, foundational first; every phase has exit criteria + explicit verification plan (tests optional). No fallbacks/runtime shims - the system must work correctly or fail loudly (delete superseded paths). Prefer programmatic checks per phase; defer manual/UI verification to finalization. Avoid negative-value tests (deletion checks, visual constants, doc-driven gates). Also: document new patterns/gotchas in code comments at the canonical boundary (high leverage, not comment spam).

## Phase 1: Lock doctrine and the repo-local authoring contract

Status: COMPLETE

Completed work:

- Updated `AGENTS.md`, `README.md`, `package.json`, `tsconfig.json`, `tsconfig.build.json`, and `test/types/tsconfig.json` so the framework/setup boundary and the Node `>=24.12.0` repo-local `.ts` contract are explicit.
- Added canonical setup roots under `setups/lessons/index.ts` and `setups/core_dev/index.ts`.
- Aligned the main doctrine docs on canonical setups and `index.ts` authoring paths.

Goal

Make the framework/setup boundary and the repo-local TypeScript setup contract explicit before touching framework behavior.

Work

- Update root `AGENTS.md` so it says plainly that generic framework behavior belongs in `src/**`, setup-local doctrine belongs in `setups/**`, and Lessons must never be treated as an implicit product boundary.
- Align `README.md`, `docs/requirements.md`, `docs/architecture.md`, `docs/schema.md`, `docs/testing.md`, and `docs/example_lessons.md` on the same source-of-truth rule where they are currently stale or ambiguous.
- Create the repo contract for canonical setup modules: add `package.json` `engines` with `node >=24.12.0`, include `setups/**` in the no-emit typecheck surface, keep `tsconfig.build.json` `src/**`-only, and make `test/types/tsconfig.json` prove the same authoring rules.
- Name the first canonical setup roots explicitly as `setups/lessons/index.ts` and `setups/core_dev/index.ts`, and demote fixture-owned canonical source to a migration target rather than current truth.

Verification (smallest signal)

- Docs review plus `npm run typecheck` and `npm run test:types` once the config surface changes land.

Docs/comments (propagation; only if needed)

- Update only the docs that define framework boundaries or contributor workflow; do not create a second execution checklist elsewhere.

Exit criteria

- A contributor can tell from repo docs and config where framework code lives, where setup code lives, and what Node and TypeScript contract applies to repo-local `.ts` setups.
- The repo typecheck surface covers canonical setups without pulling them into the emitted package build.

Rollback

- Revert docs and config together if the declared Node-native contract proves wrong or too restrictive.

## Phase 2: Complete the generic source, renderer, and target architecture

Status: COMPLETE

Completed work:

- Added authored `surface.title` and `surface.intro` support through the source schema and normalization path.
- Reworked renderers to prefer authored setup content and removed Lessons-specific title, intro, slug, and project-path branches from core behavior.
- Narrowed Paperclip target validation to family boundaries under the shared subtree and removed the empty pseudo-extension check layer.

Goal

Remove Lessons-specific semantic behavior from core and finish the generic source-model gaps that made those branches look necessary.

Work

- Add authored document metadata on `surface` (`title`, `intro`) and normalize it through the source layer.
- Rework the common renderer contract so document title, intro, preamble, and section bodies come from authored source first, with fallback prose allowed only when derivable from graph semantics.
- Delete Lessons-shaped renderer branches and any setup-name, setup-path, or setup-slug semantic behavior in `standard`, `reference`, `gate`, `workflow-owner`, `shared-entrypoint`, and `packet-workflow` renderers.
- Narrow `src/plan/targets.ts` to family-boundary and path-safety validation only, and collapse or repurpose any misleading pseudo-extension layer in checks.

Verification (smallest signal)

- Focused `npx vitest run ...` suites for source normalization, renderers, target validation, and check composition, plus `npm run typecheck` and `npm run build` for the framework layers touched.

Docs/comments (propagation; only if needed)

- Add short comments only at the canonical authored-metadata renderer seam or family-only target seam if the resulting code would otherwise be easy to misread.

Exit criteria

- Core behavior no longer depends on Lessons-only names, slugs, path folklore, or wording.
- The source model can represent the missing document-title and intro requirements without out-of-band setup metadata.

Rollback

- Revert incomplete core refactors instead of preserving mixed old and new renderer or target paths.

## Phase 3: Make plain TypeScript setup modules first-class authoring inputs

Status: COMPLETE

Completed work:

- Extended CLI setup loading to accept `.ts`, `.mts`, and `.cts` modules with the same plain default-export contract.
- Proved the repo-local `.ts` authoring path with type tests and CLI validation of a canonical setup under `setups/**`.
- Kept the runtime contract fail-loud and avoided a second TypeScript loader path.

Goal

Teach the CLI and repo tooling to load canonical plain setup modules directly, under one explicit Node-native TypeScript contract.

Work

- Extend `src/cli/shared.ts` and command entrypoints to accept `.ts`, `.mts`, and `.cts` setup modules while still resolving a plain default-exported `SetupInput`.
- Keep the runtime contract narrow: erasable syntax only, explicit local import extensions, no `tsconfig`-only runtime features, and no second TypeScript loader path.
- Add focused type and CLI proof for the repo-local `.ts` authoring contract, including fail-loud behavior when a module violates the supported path.
- Remove stale assumptions in helpers or tests that treat `.mjs` as the only honest module path.

Verification (smallest signal)

- `npx vitest run test/cli/validate-compile.test.ts` and the smallest honest type or authoring suite, plus `npm run typecheck` when the contract surface changes.

Docs/comments (propagation; only if needed)

- Document the supported `.ts` setup rules once in contributor docs and avoid duplicating them across fixtures or tests.

Exit criteria

- The repo has one working way to author canonical setup modules in TypeScript and the CLI and API both accept that plain-module shape.
- No fallback runtime loader or shadow authoring path remains.

Rollback

- Revert CLI and loading changes if they require a second loader path or make the authoring contract ambiguous.

## Phase 4: Promote canonical setups and rebase proofs on them

Status: COMPLETE

Completed work:

- Promoted canonical Lessons and `core_dev` setups under `setups/**` as plain typed object modules.
- Turned `test/fixtures/source/lessons-full.ts` and `test/fixtures/source/second-setup.ts` into thin re-exports.
- Rebased e2e, perf, parity, stability, mutation, source-model, and CLI proof on canonical setup modules or their thin fixture adapters.

Goal

Move Lessons and `core_dev` into canonical setup modules and make tests follow that single source of truth.

Work

- Create `setups/lessons/index.ts` and `setups/core_dev/index.ts` as plain default-exported `SetupInput` modules.
- Move setup-local wording, titles, and intros out of core renderers and into those authored setup modules.
- Convert fixture-owned canonical sources into thin imports from `setups/**`; keep only intentionally synthetic fixtures and mutation inputs as standalone.
- Rebase API, render, e2e, perf, and snapshot proof on canonical setups so the second setup proves a real non-Lessons path mix.

Verification (smallest signal)

- Smallest honest compile and render suites for canonical Lessons and `core_dev`, plus relevant API, e2e, perf, and snapshot tests touched by the migration.

Docs/comments (propagation; only if needed)

- Document canonical setup-package ownership and the rule that fixtures may mutate canonical setups but may not quietly fork them.

Exit criteria

- Lessons and `core_dev` have one canonical authored home under `setups/**`.
- Tests prove canonical setup behavior instead of re-owning setup truth in fixtures.

Rollback

- Revert setup promotion if it creates dual ownership between `setups/**` and fixture copies.

## Phase 5: Finish structural-first parity and the release gate

Status: COMPLETE

Completed work:

- Updated render, e2e, and source snapshots to reflect the new authored-versus-generic renderer boundary after reading each diff.
- Kept live Lessons parity structural-first and verified that the represented subset still aligns with the frozen inventory.
- Ran the full release gate: `npm run typecheck`, `npm run test:types`, `npm run build`, targeted `npx vitest run ...` suites, and `npm test`.

Goal

Make the final proof story honest: generic core coverage, canonical setup coverage, and a scoped external Lessons parity contract.

Work

- Rework render and parity tests so they prove generic fallback behavior plus authored setup prose, not Lessons-specific core wording.
- Keep `test/goldens/lessons-live/**` as external evidence and make the first canonical parity pass structural-first: represented documents, paths, surface classes, and key sections before wording-level claims.
- Delete superseded fixture-owned canonical sources, stale renderer assumptions, and any low-value tests that only encode the former architecture.
- Update release-gate docs and runbook so the final gate matches the real contract.

Verification (smallest signal)

- Full release gate: `npm run typecheck`, `npm run test:types`, `npm run build`, targeted `npx vitest run ...` suites for changed surfaces, and `npm test` before claiming repo-wide readiness.

Docs/comments (propagation; only if needed)

- Update `docs/testing.md` and any top-level contributor guidance that would otherwise understate the canonical setup and parity contract.

Exit criteria

- The repo can honestly claim a framework-generic core, first-class canonical setup modules, and scoped structural-first Lessons parity proof.
- Future work that reintroduces Lessons-specific core behavior or fixture-owned setup truth would fail the documented proof surfaces.

Rollback

- Revert proof and gate tightening if it depends on snapshot churn, low-value checks, or parity claims wider than the implemented contract.
<!-- arch_skill:block:phase_plan:end -->

# 8) Verification Strategy (common-sense; non-blocking)

## 8.1 Unit tests (contracts)

- Keep unit-level focus on generic semantic contracts, path-family contracts, authored-content conversion, and setup-loading behavior.
- For CLI setup loading, prove the supported Node-native TypeScript contract directly rather than adding a second transpiler path just for tests.
- Prefer extending existing checks, planning, and renderer tests rather than inventing new harnesses.

## 8.2 Integration tests (flows)

- Compile canonical setup packages through the public API and CLI.
- Assert structured diagnostics, compile plans, manifests, and rendered markdown where they prove boundary correctness.
- Use mutation-style tests to prove drift detection and fail-loud behavior.
- Final release-gate execution should run `npm run typecheck`, `npm run test:types`, `npm run build`, and `npm test`; use narrower honest suites in earlier phases.

## 8.3 E2E / device tests (realistic)

- End-to-end proof should center on:
  - canonical Lessons package compile
  - canonical second-setup compile
  - live Lessons inventory/parity alignment
  - final CLI flows
- Avoid doc-inventory bureaucracy outside the real live-parity contract.

# 9) Rollout / Ops / Telemetry

## 9.1 Rollout plan

- Land the refactor in architecture-first phases.
- Keep the live `paperclip_agents` Lessons tree as an external proving input until the canonical Lessons package and parity harness are complete.
- Do not claim the repo is fully decoupled until framework code, setup packages, docs, and tests all agree.

## 9.2 Telemetry changes

- No product telemetry is expected.
- Operational readback is the test and diagnostics surface: compile diagnostics, CLI doctor output, manifests, parity alignment, and end-to-end snapshots where they carry real signal.

## 9.3 Operational runbook

- Use the canonical setup packages as the primary authoring entrypoint.
- Use the live Lessons corpus only as parity/reference input, not as an excuse to reintroduce setup-specific behavior into the framework.
- Treat AGENTS guidance as part of the architectural control surface, not as optional prose.

# 10) Decision Log (append-only)

## 2026-04-02 - Treat framework decoupling and architecture completion as one change

Context

The repo is not just missing some framework features. It is also architecturally confused about whether Lessons is a proving case or the actual product boundary.

Options

- Decouple first, then do framework completion later.
- Complete framework features first, then clean up the architectural boundary later.
- Plan one refactor that restores the boundary, completes the framework, promotes canonical setup packages, and closes the test gap together.

Decision

Plan this as one phased refactor with one source of truth.

Consequences

- The work is larger, but it avoids solving the wrong architecture twice.
- Testing and doctrine updates become part of the definition of done instead of deferred cleanup.

Follow-ups

- Confirm the North Star before deeper planning.
- Then run `research` against the current repo, the latest Lessons requirements, and the live `paperclip_agents` Lessons corpus.

## 2026-04-02 - Prefer authored surface metadata and plain canonical setup modules over plugins or wrappers

Context

The current renderer layer is carrying setup-local titles, intros, and section semantics because the source model does not have a clean document-level home for that authored content, and the repo has no canonical setup location outside tests.

Options

- Add a generic renderer-plugin API now and let setups override document shaping through code.
- Extend the generic source model with authored document metadata, keep generic renderers graph-driven, and use plain TypeScript setup modules for canonical examples.
- Keep the current path- and slug-derived renderer branches and only move fixtures.
- Introduce a setup-module wrapper or per-setup executable rule bundle now so canonical setups can carry extra behavior.

Decision

Choose richer authored surface data plus plain canonical TypeScript setup modules. Do not add a renderer-plugin API, setup-module wrapper, or per-setup executable rule bundle in the first cut. Keep public package exports framework-only.

Consequences

- Setup-local wording moves into authored source instead of core renderer branches.
- The framework stays smaller and easier to reason about, but any truly exotic setup-local render behavior must wait for a proven second adopter.
- The canonical authoring path stays close to the current default-export fixture pattern, which lowers migration cost for tests and CLI flows.
- If future work truly needs setup-local executable hooks, that should return as a new explicit architecture decision instead of arriving pre-baked.

Follow-ups

- Add document-level authored metadata to `surface`.
- Convert CLI and tests to resolve canonical plain TypeScript setup modules.
- Rework render and target tests so they stop locking Lessons-shaped behavior into the core.

## 2026-04-02 - Prefer Node-native erasable TypeScript loading over bundling a runtime TS executor

Context

The plan already wants canonical setup modules under `setups/**` and CLI support for `.ts` inputs, but the repo currently has no `tsx`, `ts-node`, or similar runtime dependency. That means the authoring-flow claim needs a real runtime model, not just a file-extension wish.

Options

- Add a bundled runtime TypeScript executor so the CLI can evaluate arbitrary TypeScript using `tsconfig` semantics.
- Use Node's built-in type-stripping support for repo-local canonical setup modules and constrain those modules to erasable TypeScript.
- Keep JavaScript-only CLI loading and give up on plain TypeScript canonical setup modules.

Decision

Choose Node-native type stripping for repo-local canonical setup modules. Do not add a bundled runtime TypeScript executor in the first cut. Treat `.ts`, `.mts`, and `.cts` setup loading as a repo-local authoring contract that requires erasable syntax, explicit local import extensions, and one documented Node runtime floor.

Consequences

- The CLI loading path stays dependency-light and close to the current plain-module model.
- Canonical setup modules must avoid `tsconfig`-only runtime features such as path aliases and syntax that requires JavaScript generation.
- The repo will need one explicit Node contract for this feature before it is considered done.
- If future requirements truly need full `tsconfig`-aware runtime execution, that should reopen architecture instead of arriving as a silent second loader path.

Follow-ups

- Update the target architecture and phase plan so the TypeScript-loading story names its runtime constraints explicitly.
- Add CLI verification that proves the supported Node-native TypeScript contract directly.

## 2026-04-02 - Make `package.json` `engines` the authoritative Node floor for repo-local `.ts` setup loading

Context

The second deep-dive pass surfaced a real gap: the plan now depends on Node-native `.ts` setup loading, but the repo still has no encoded Node floor, no `setups/**` typecheck surface, and no CI or version-manager file to lean on.

Options

- Keep the Node floor implicit in docs and local habit.
- Add a repo version file first and treat that as the primary contract.
- Use `package.json` `engines` as the authoritative floor, then align repo typecheck and docs to that contract.

Decision

Use `package.json` `engines` as the primary Node floor for this feature. Then align `tsconfig.json`, `test/types/tsconfig.json`, and contributor docs to the same contract. Do not introduce a separate version-manager file or CI pin in the first cut just to restate the same rule.

Consequences

- The CLI and repo-local setup authoring path get one machine-readable runtime contract instead of tribal knowledge.
- The repo can keep CI and version-manager policy out of scope until those surfaces actually exist.
- Any no-emit-only TypeScript authoring options needed for `setups/**` must be handled explicitly so they do not bleed into the emitted package build.

Follow-ups

- Add `engines` to `package.json` when the implementation lands.
- Include `setups/**` in the repo-local typecheck surfaces.
- Keep the emitted build config `src/**`-only and explicitly override any repo-only typecheck options as needed.

## 2026-04-02 - Use simple canonical setup packages first and make `core_dev` the second proving setup

Context

The plan needed a few product-shape defaults that were not worth turning into user decisions: what the second proving setup is, whether canonical setups should start split across many files, what the entry filename should be, and how strict the first parity pass should be.

Options

- Start with a more elaborate multi-file package layout for each setup.
- Start with one canonical file per setup, then split only if scale forces it.
- Pick a more different second proving setup than the current `core_dev` concept.
- Make the first parity pass wording-strict from day one.

Decision

Use `core_dev` as the second proving setup. Start each canonical setup as one file, `setups/<setup>/index.ts`. Keep the first Lessons parity pass structural-first, not wording-strict.

Consequences

- Migration stays smaller and easier to review.
- The plan still proves multi-setup genericity without multiplying files before the architecture settles.
- The parity harness stays honest about what it proves first, instead of pretending wording-level fidelity is cheap.
- If a canonical setup grows too large, splitting it later is a refactor, not a blocker to beginning the cutover.

Follow-ups

- Create `setups/lessons/index.ts` and `setups/core_dev/index.ts` first.
- Repoint fixtures, e2e suites, and perf tests at those modules before considering a file split.
- Keep wording-fidelity parity checks as a later ratchet, not as the first migration gate.

## 2026-04-02 - Treat the repo-local TypeScript authoring contract as foundation work, not tail cleanup

Context

The plan now depends on canonical `setups/**` modules that the CLI can load directly. Without a declared Node floor and separate no-emit versus build TypeScript surfaces, later framework and setup migration work would still be built on an implied contract.

Options

- Leave the Node and TypeScript authoring contract cleanup until after framework and setup migration.
- Land framework refactors and canonical setup promotion while the repo-local `.ts` authoring contract remains implicit.
- Declare the repo-local authoring contract first, then build CLI and setup migration on top of it.

Decision

Pull `package.json` `engines`, `tsconfig.json`, `tsconfig.build.json`, `test/types/tsconfig.json`, and README alignment into the first execution phase.

Consequences

- Early execution touches repo config, docs, and type surfaces before the feature refactor.
- Later CLI and setup migration work can rely on one enforced contract instead of inventing fallback behavior.
- The emitted package build stays `src/**`-only even though the repo-local typecheck surface grows.

Follow-ups

- Prove the contract directly in type and CLI tests rather than adding a second runtime loader.
- Keep repo-only TypeScript authoring rules out of the emitted package build config.

## 2026-04-02 - Keep canonical setup modules as plain typed objects, not runtime builder imports

Context

The Node-native `.ts` setup-loading contract exposed a concrete implementation constraint: canonical setup modules need to run directly from repo source, but the `src/**` build-oriented entrypoints use `.js` specifiers that are correct for emitted package code, not for direct source-mode runtime imports.

Options

- Add a second source-mode framework entrypoint just for canonical setup imports.
- Keep canonical setups on runtime builder imports from `src/**` and add more loader complexity to make them work.
- Export canonical setups as plain object literals typed with `satisfies SetupInput`, using type-only imports where helpful.

Decision

Keep canonical setup modules as plain typed objects. Do not add a second source-mode framework entrypoint or a loader workaround.

Consequences

- Canonical setup modules stay true to the architecture goal: plain default-exported setup data with no wrapper semantics.
- The repo-local Node-native TypeScript contract remains simple and fail-loud.
- Builder helpers stay available for ordinary authoring, but canonical repo-local setup truth does not depend on runtime value imports from `src/**`.

Follow-ups

- Keep canonical setup modules under `setups/**` and continue using explicit `.ts` type imports only where needed.
- If a future use case truly needs a repo-local value-import entrypoint, reopen architecture explicitly instead of sneaking one in.
