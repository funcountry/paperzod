---
title: "paperzod - Framework-First Drift Proofing - Architecture Plan"
date: 2026-04-02
status: complete
fallback_policy: forbidden
owners: [aelaguiz, codex]
reviewers: [aelaguiz]
doc_type: architectural_change
related:
  - ../paperclip_agents/docs/LESSONS_PAPERZOD_DRIFT_GAPS_AUDIT_2026-04-02.md
  - README.md
  - docs/requirements.md
  - docs/schema.md
  - docs/architecture.md
  - src/core/defs.ts
  - src/source/schemas.ts
  - src/source/templates.ts
  - src/source/projections.ts
  - src/source/overrides.ts
  - src/checks/core-rules.ts
  - src/markdown/renderers/common.ts
---

# TL;DR

- Outcome:
  - Design the next round of `paperzod` as the smallest elegant generic enforcement layer that makes canonical runtime law harder to misstate in authored doctrine, using the Lessons drift audit only as a pressure test and evidence source, not as the API spec.
- Problem:
  - `paperzod` already protects graph truth well, but many important runtime-law details still live as opaque strings inside authored prose. That leaves artifact names, workflow summaries, enum-like vocabulary, proof requirements, tool references, and role-home composition law driftable even when the setup graph is valid.
- Approach:
  - Split the audit into three buckets:
    - patterns already solvable by better local rendering from structured truth
    - patterns that need new generic helper-layer features
    - patterns that justify deeper source-language additions, with setup-level registries and artifact-level evidence as the first slice and inline refs only if that smaller slice proves insufficient
  - Then design the simplest coherent feature set that closes the serious gaps with a small number of reusable primitives instead of a pile of request-shaped features, without turning `paperzod` into a Paperclip- or Lessons-specific builder.
- Plan:
  - Use the sibling Lessons audit plus current repo docs and source as ground truth, research the present boundary, deep-dive the smallest honest architecture for constrained vocab and proof law first, pressure-test that slice against at least one non-Lessons usage story, and only then phase implementation.
- Non-negotiables:
  - No Lessons-only node kinds, path semantics, or public API names.
  - Prefer one small elegant primitive over several narrow convenience features when both would solve the same generic problem.
  - No arbitrary prose parser or "make all markdown semantic" detour.
  - No pretending a downstream local-cleanup problem is framework work just because Lessons hit it first.
  - No widening of the normalized model unless later planning shows helper-layer lowering cannot express the contract honestly.
  - Every shipped feature must land with docs, examples, and targeted tests that explain the generic value plainly.

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
- None.

## Non-blocking follow-ups (manual QA / screenshots / human verification)
- None.
<!-- arch_skill:block:implementation_audit:end -->

<!-- arch_skill:block:planning_passes:start -->
<!--
arch_skill:planning_passes
deep_dive_pass_1: done 2026-04-02
external_research_grounding: not started
deep_dive_pass_2: not started
recommended_flow: review-gate (audit found the shipped slice code-complete; only idiomatic plan review or downstream adoption follow-through remains)
note: This is a warn-first checklist only. It should not hard-block execution. The current honest next move is review-gate or plain status, not more implementation scope inside this plan.
-->
<!-- arch_skill:block:planning_passes:end -->

# 0) Holistic North Star

## 0.1 The claim (falsifiable)
> If we add the smallest elegant generic `paperzod` surface for canonical runtime-law authoring, starting with one generic setup-level registry primitive and one artifact-level evidence contract while leaving ordinary explanatory prose freeform and preserving the current one-way compiler boundary, then the highest-value drift patterns around constrained vocab and proof law exposed by the Lessons audit will become expressible as framework truth instead of Paperclip-local convention. If later work still needs canonical inline mentions of graph truth, that should land as a second primitive rather than being smuggled into the first slice. This claim is false if the proposed features mirror Lessons nouns, proliferate into many request-shaped APIs, require setup-specific branches in `src/**`, or cannot be explained and demonstrated outside the Lessons proving case.

## 0.2 In scope
- UX surfaces (what users will see change):
  - The public `paperzod` authoring surface for setup authors who need canonical runtime law to stay aligned with structured source.
  - Public docs and examples that show how to express constrained vocab and proof law without turning every sentence into DSL syntax.
  - Compiler diagnostics for drift classes that are currently invisible because they live in prose-only constants or undeclared artifact requirements.
- Technical scope (what code and docs will change):
  - A framework-first triage of the Lessons drift audit into:
    - local cleanup
    - helper-layer feature work
    - deeper source-language work
  - Accepted v1 feature families for:
    - setup-level registries or enum-like vocab
    - artifact-level proof/evidence schema modeling
    - helper-side composition assertions and render-from-truth summaries where existing graph truth already carries the fact
  - Explicit follow-up candidates for:
    - typed inline references inside authored content only if the smaller registry/evidence slice proves insufficient
    - optional tool, command, path, and endpoint catalogs if they survive the genericity bar
  - Supporting docs, examples, and test proof for whichever generic feature slice is accepted.

## 0.3 Out of scope
- UX surfaces (what users must NOT see change):
  - No literal replay of whatever the current Paperclip Lessons source asks for.
  - No promise that every drift pattern in the audit becomes first-class framework surface in one round.
  - No new Paperclip-specific product positioning for `paperzod`.
- Technical scope (explicit exclusions):
  - No full Lessons cutover work in this plan.
  - No arbitrary CommonMark or "understand all prose" parser expansion.
  - No collapse of the distinction between semantic graph truth and human explanatory prose.
  - No special-case support for one setup's path families, role names, or workflow vocabulary.
  - No second planning document outside this canonical artifact.

## 0.4 Definition of done (acceptance evidence)
- The plan cleanly separates which audit findings are:
  - already solvable by better downstream modeling in Paperclip
  - worth addressing with new generic `paperzod` helpers
  - worth addressing with new core source-language features
- The accepted feature direction is simpler than the raw request list from the Lessons audit and can be explained as a small set of reusable primitives instead of a bundle of special cases.
- Each accepted feature family is described in framework terms and not with Lessons-specific nouns.
- The target architecture explains where each feature belongs:
  - helper-layer lowering
  - normalized source model
  - check layer
  - render layer
  - plan or emit layer
- The chosen feature families have at least one believable non-Lessons usage story or synthetic proving setup.
- The future implementation can be proven with small, honest signals:
  - source/schema tests for registries and artifact evidence inputs
  - render or compile tests for registry and evidence summaries plus diagnostics
  - docs and example updates that show the public API plainly
- The plan explicitly names what will stay downstream local cleanup so the framework scope does not silently sprawl.

## 0.5 Key invariants (fix immediately if violated)
- `paperzod` remains a generic doctrine compiler, not a Lessons builder.
- Lessons is a pressure test only. It can justify a feature, but it does not define the public shape of the feature.
- Structured source remains the semantic truth; generated markdown remains runtime output.
- Ordinary explanatory prose stays allowed and easy to write.
- Only runtime-law content that is canonical enough to validate should become typed framework surface.
- Simplicity is a hard requirement:
  - prefer a small reusable primitive over a broader API bundle
  - prefer one generic mechanism over several narrowly named surfaces
  - reject features whose only clear explanation is "Paperclip needed this exact thing"
- Markdown fragments remain string-only in v1.
- Inline refs are explicitly deferred in v1. If they are later needed, they should live in TypeScript-authored block arrays or helper-generated summaries instead of a fragment mini-DSL.
- Checked doctrine-composition law stays helper-layer or setup-module-side in v1 unless later work proves the planner or core graph truly needs first-class awareness.
- Helper-layer lowering stays the preferred path unless deeper modeling is required for checks, planning, or rendering to work honestly.
- No new feature may require `src/**` branches that mention one proving setup by name.
- If a drift pattern can already be solved by rendering from existing structured truth, that is downstream adoption work first, not automatic framework scope.
- Fail-loud boundaries stay the default. No fallbacks or runtime shims are allowed just to smooth over missing framework design.
- Docs, examples, and tests are part of feature truth. A feature is not done if users have to reverse-engineer it from implementation.

# 1) Key Design Considerations (what matters most)

## 1.1 Priorities (ranked)
1. Filter the Lessons audit through the generic product boundary instead of answering it literally.
2. Find the simplest elegant enforcement layer that solves the serious generic drift patterns.
3. Preserve the current architecture's strengths:
   - small semantic core
   - helper-layer lowering
   - one-way compile pipeline
4. Keep the authoring surface readable for humans who mostly want to write doctrine, not DSL.
5. Ship any new feature family with examples that make sense beyond Lessons.

## 1.2 Constraints
- `docs/requirements.md` explicitly forbids a product boundary that narrows to one workflow or one pod.
- `docs/schema.md` says helper sugar should lower into plain setup truth where possible.
- `src/source/schemas.ts` currently validates only generic authored blocks with string payloads.
- `src/markdown/renderers/common.ts` renders authored blocks as plain markdown with no semantic resolution of inline values.
- `src/checks/core-rules.ts` validates graph truth, not prose truth.
- The Lessons audit already shows that some drift patterns are really local-cleanup opportunities and should not be rebranded as framework gaps.

## 1.3 Architectural principles (rules we will enforce)
- Example-driven pressure should produce generic contracts, not example-shaped APIs.
- A good answer should look smaller and cleaner than the raw request list that motivated it.
- If a value affects routing, trust, required evidence, or runtime composition, it is a candidate for structured truth.
- If a sentence is explanatory and not canonical, it should stay ordinary prose.
- Prefer generic reference and registry primitives over domain-specific mini-models unless repeated cross-setup evidence justifies more.
- Prefer additive feature slices that can be ignored by setups that do not need them.

## 1.4 Known tradeoffs (explicit)
- Typed inline references could still close more drift later, but they broaden the source-language surface and are not the first v1 move.
- Registries and proof schemas can close real gaps, but they risk overbuilding if every domain noun gets promoted into the model.
- Checked composition law can make runtime surfaces safer, but it must not create a second graph language parallel to ordinary setup truth.
- Tool and endpoint catalogs may be valuable, but they are the easiest place to accidentally encode one proving setup's environment as a framework concept.

# 2) Problem Statement (existing architecture + why change)

## 2.1 What exists today
- `paperzod` already has a clean compiler pipeline:
  - normalize
  - graph
  - checks
  - plan
  - render
  - emit
- The current framework already ships meaningful authoring helpers:
  - reusable document templates
  - shared-section projection
  - keyed overrides
  - explicit fragment loading
  - setup-local checks
  - owned output scopes and prune enforcement
- The current product is already strong at graph truth and structural runtime output planning.
- The sibling Lessons audit is not saying "the graph is broken." It is saying "important runtime law still survives as opaque prose strings."

## 2.2 What's broken / missing (concrete)
- Artifact names, packet summaries, and runtime path facts can still be retyped in prose instead of referenced structurally.
- Workflow routing and next-owner text can drift away from the structured step graph.
- Enum-like vocabulary such as verdict values, publish intent, readiness state, and route labels is still prose-only.
- Proof requirements and support-evidence bundles are not modeled as typed contracts.
- Per-role inclusion of shared support doctrine is still mostly assembly convention rather than checked setup truth.
- Tool paths, commands, env vars, endpoints, and sanctioned labels are often still hard-coded as strings.

## 2.3 Constraints implied by the problem
- We need a strict framework-first filter between "downstream should render from existing truth" and "framework needs new truth surfaces."
- Any new typed surface must keep the line between canonical runtime law and freeform prose clear.
- If a feature matters for validation, rendering, or completeness, it needs inspectable structure somewhere in the pipeline.
- If a proposed feature only helps one proving setup and has no plausible generic story, it should default to downstream local modeling or follow-up.

<!-- arch_skill:block:research_grounding:start -->
# 3) Research Grounding (external + internal “ground truth”)

## 3.1 External anchors (papers, systems, prior art)
- No external research added in this pass.
  - Adopt:
    - repo-first grounding for the research step, because the immediate question is where the current `paperzod` architecture already provides reusable seams and where it genuinely stops.
  - Reject:
    - a broad prior-art sweep at this stage, because it would not settle the key near-term question: whether a simple generic enforcement layer can be built from the current source-language and pipeline boundaries without overbuilding.
  - Later external research may still help if deep-dive gets stuck on:
    - constrained vocab or registry modeling
    - proof/evidence schema design that stays smaller than a second workflow language
    - whether inline refs are still worth a second primitive after the smaller v1 slice is proven

## 3.2 Internal ground truth (code as spec)
- Authoritative behavior anchors (do not reinvent):
  - `docs/requirements.md` — product boundary: generic compiler, multi-setup proof, plain-markdown runtime output, and no second semantic truth system.
  - `docs/schema.md` — source-language doctrine: helper-layer sugar should lower into plain `SetupInput`, fragments stay intentionally narrow, and the normalized model should not widen casually.
  - `docs/architecture.md` — pipeline rule: keep source, graph, checks, plan, render, and emit distinct.
  - `README.md` — public authoring story that exists today; the current promise is graph truth plus helper-backed document composition, not prose-law semantics.
  - `src/core/defs.ts` — the current semantic boundary:
    - graph truth is first-class for roles, workflow steps, packet contracts, artifacts, surfaces, sections, references, and generated targets
    - authored doctrine content is still generic block data with string payloads
  - `src/source/schemas.ts` — confirms that authored content currently validates paragraphs, lists, definition lists, tables, code blocks, and examples, but not typed inline runtime-law references or constrained values.
  - `src/markdown/renderers/common.ts` — current render path lowers authored content into plain paragraphs, lists, tables, and code blocks with no semantic resolution of embedded runtime-law strings.
  - `src/checks/core-rules.ts` and `test/mutations/index.test.ts` — current enforcement is already strong for graph drift:
    - ids
    - routes
    - packet/artifact membership
    - exact-section reads
    - ownership
    - typed link families
    This reinforces the audit’s core claim that the remaining gap is mostly prose-law drift, not graph-law drift.
  - `src/source/fragments.ts` — fragment parsing breadth is a deliberate product choice, not an accidental limitation. The loader intentionally rejects headings, blockquotes, HTML, images, task lists, and other broad markdown features. That means “just parse more prose” is not a neutral change; it would move the product boundary.
  - `src/source/module.ts`, `src/checks/index.ts`, and `src/plan/targets.ts` — the repo already has a clean generic pattern for extension and enforcement:
    - source-envelope opt-ins
    - additive registry-based checks
    - fail-loud planner enforcement at ownership and target boundaries
    This is the style new drift-proofing features should follow.
  - `../paperclip_agents/docs/LESSONS_PAPERZOD_DRIFT_GAPS_AUDIT_2026-04-02.md` — pressure-test artifact that enumerates real drift classes. It is evidence of where downstream pain is real, but not the definition of the public API.
- Existing patterns to reuse:
  - `src/source/templates.ts` — reusable document-shape helpers that lower into ordinary setup arrays and links. This is the clearest precedent for adding authoring ergonomics without changing the core model casually.
  - `src/source/projections.ts` — shared-section projection helper that proves the framework can centralize one source owner and fan it out to many runtime documents while staying helper-only.
  - `src/source/overrides.ts` and `test/e2e/shared-overrides.test.ts` — stable-id keyed customization pattern. This matters because any future drift-proofing surface should prefer explicit stable selectors over anonymous string mutation.
  - `src/source/module.ts` plus `src/checks/index.ts` — source-envelope plus additive check registry. If drift-proofing needs setup-local or optional enforcement, this is the existing idiomatic seam.
  - `src/plan/targets.ts` — fail-loud target validation and owned-scope checks. This is the model for any future checked composition or catalog surface: explicit declarations plus deterministic diagnostics, not heuristic inference.
  - `test/e2e/release-ops.test.ts` — the same pipeline already proves a non-editorial setup. Any new feature family should preserve that genericity bar and ideally gain a similarly non-Lessons example.

## 3.3 Open questions from research
- Should constrained vocab live in one generic registry primitive or in a few dedicated first-class objects?
  - Evidence needed:
    - map the audit’s enum-like cases such as verdicts, readiness states, publish intents, and route labels onto one registry shape
    - check whether the resulting authoring and render behavior stays simple
- Where should proof/evidence modeling attach?
  - Evidence needed:
    - prototype the smallest believable model for required receipts, support files, and required fields
    - test whether artifact-level or packet-contract-level attachment covers most cases without inventing a second workflow language
- Is checked role-home composition a real core need or a thinner helper-layer contract?
  - Evidence needed:
    - trace one or two missing-support-family drift cases and see whether they can be expressed as graph truth plus helper metadata
    - only widen the model if helper-layer composition cannot produce honest diagnostics
- Do tool, endpoint, host, and command catalogs belong in the first feature slice?
  - Evidence needed:
    - determine whether registries plus existing helper or renderer seams already cover them well enough to defer
    - only promote them into a first-class catalog if they need validation semantics beyond id resolution and display rendering
<!-- arch_skill:block:research_grounding:end -->

<!-- arch_skill:block:current_architecture:start -->
# 4) Current Architecture (as-is)

## 4.1 Where meaning stops today
- `src/core/defs.ts` already gives `paperzod` first-class semantic truth for:
  - roles
  - workflow steps
  - review gates
  - packet contracts
  - artifacts
  - surfaces
  - surface sections
  - references
  - generated targets
- Meaning also stops before two important classes of runtime law become typed framework truth:
  - constrained vocab such as verdicts, publish states, and route labels
  - proof and support-evidence requirements attached to artifacts
- Today those facts survive either as opaque prose strings or as helper-local conventions.
- That is the exact boundary the sibling audit is hitting.
  - the graph knows canonical workflow and artifact structure
  - the framework does not know sanctioned vocab or required evidence bundles

## 4.2 The current source and render path
- `src/source/schemas.ts` validates authored block shape and current node families only.
  - It can reject malformed lists and tables.
  - It cannot validate sanctioned vocab or artifact evidence because those surfaces do not exist yet.
- `src/source/normalize.ts` lowers current setup truth into plain defs with no registry or evidence fields.
- `src/markdown/renderers/common.ts` and the surface-specific renderers then turn authored blocks straight into string-based doc nodes, plus a small number of graph-derived summaries.
- `src/doc/ast.ts`, `src/doc/builders.ts`, and `src/doc/markdown.ts` confirm that the markdown AST is still plain text at paragraph, list-item, and table-cell level.
- That matters because the current repo already prefers:
  - typed semantic truth before rendering
  - plain markdown output after rendering

## 4.3 Existing seams the design should reuse
- `src/source/templates.ts` already shows the preferred extension style:
  - add small author-facing sugar
  - lower it into ordinary setup truth
  - do not explode the normalized model unless necessary
- `src/source/projections.ts` proves the framework can centralize one shared source owner and project it into many runtime documents while staying helper-only.
- `src/source/module.ts` plus `src/checks/index.ts` already provide the right seam for helper-side composition assertions and additive setup-local enforcement.
- `src/markdown/renderers/common.ts` plus the role-home and workflow renderers already synthesize some runtime-law summaries from graph truth.
- Some drift classes from the audit are already better solved by generated summaries than by new source-language primitives.
  - packet composition summaries
  - workflow-order summaries
  - repeated section-title recitations
- That means the next framework slice should target the runtime law that is not already capturable through existing helper or renderer seams:
  - constrained vocab
  - proof and evidence law
  - helper-side composition assertions where local assembly is still too implicit

## 4.4 Deliberate boundaries that should stay put
- `src/source/fragments.ts` is intentionally narrow and intentionally plain.
  - It parses limited markdown blocks into authored strings.
  - It explicitly rejects broader markdown features.
- Adding semantic interpolation inside fragment markdown would require a second parser or mini-language.
- That is a different product move from "add a small amount of typed setup truth and render it deterministically."
- `src/doc/**` should stay plain-text oriented for this slice.
- Registries, if added, should stay setup truth plus graph-adjacent lookup data, not new routed node families.
- For the smallest feature slice, fragments should stay ordinary prose and renderers should stay the place where typed law becomes readable markdown.

## 4.5 Failure behavior today
- Structural drift already fails loudly:
  - ids
  - routes
  - ownership
  - generated-target provenance
  - exact-section reads
- Inline doctrine drift does not fail when a sentence manually repeats canonical law.
- There is also no first-class setup surface today for:
  - constrained vocab such as verdicts, publish states, or route labels
  - artifact-level proof and evidence contracts
  - helper-side composition assertions that are generic enough to ship as framework defaults
- The repo is therefore:
  - graph-proof
  - partially summary-capable where renderers already synthesize from truth
  - still prose-fragile at inline mention sites
  - still missing typed framework truth for vocab and proof law
<!-- arch_skill:block:current_architecture:end -->

<!-- arch_skill:block:target_architecture:start -->
# 5) Target Architecture (to-be)

## 5.1 Recommended minimal design
- Add one generic setup-level `registries` primitive to `SetupInput` and `SetupDef`.
  - one registry shape, not one object family per enum
  - each registry carries:
    - `id`
    - `name`
    - optional `description`
    - `entries[]`
  - each entry carries:
    - `id`
    - `label`
    - optional `description`
  - entries are referenced as a pair:
    - `registryId`
    - `entryId`
- Add one optional artifact-level `evidence` contract to `ArtifactInput` and `ArtifactDef`.
  - attach it to `artifact`, not `packet_contract`, in v1
  - keep it shallow:
    - `requiredArtifactIds[]` for support receipts or companion files
    - `requiredClaims[]` for named proof items that must be present
  - each required claim should carry only enough structure to be canonical:
    - `id`
    - `label`
    - optional `description`
    - optional `allowedValue` pointing at one registry entry
- Do not make registries into graph nodes in v1.
  - they are lookup data, not routing or ownership entities
- Do not block this slice on full inline rich-text references.
  - v1 can render registry lists and artifact evidence summaries through helper-generated or dedicated authored blocks
  - later inline refs can reuse the same registry and evidence ids

## 5.2 Why this is the best architectural fit
- It matches the repo’s current product contract:
  - small normalized model
  - additive authoring surface
  - one-way compile
  - plain-markdown output
- One registry primitive covers the audit’s constrained-vocab cases without proliferating node kinds for:
  - verdicts
  - publish intents
  - readiness states
  - route labels
  - support-note states
- Artifact-level evidence contracts cover the strongest proof and support-evidence cases with the least widening.
  - most cited examples attach to one runtime file or one required receipt
  - `artifact` already represents runtime and support files
  - a separate proof-schema node family would duplicate that ownership boundary too early
- This also keeps v1 honest about what `paperzod` is doing.
  - it becomes the source of truth for proof law
  - it does not pretend to parse emitted artifact contents or arbitrary prose

## 5.3 Phase ownership in the pipeline
- Source layer:
  - `registries` become part of plain setup truth
  - `artifact.evidence` becomes part of plain artifact truth
- Graph layer:
  - carry a `registryById` lookup or equivalent graph-adjacent map
  - keep evidence attached to artifact nodes
  - add a derived evidence index only if repeated use proves it necessary
- Check layer:
  - reject duplicate registry ids
  - reject duplicate entry ids within a registry
  - reject unknown registry references from evidence claims
  - reject unknown artifact ids in `requiredArtifactIds`
  - reject obviously incoherent cases such as self-required artifacts
- Render layer:
  - resolve registry-backed value lists and artifact evidence summaries into readable markdown
  - do not leak internal ids unless the chosen display label does so intentionally
- Plan and emit layers:
  - unchanged in v1
  - evidence contracts do not change target planning or output ownership

## 5.4 No-parallel-path rules
- Ordinary explanatory prose stays freeform and untyped.
- Canonical runtime law moves into typed source only when it is important enough to validate or render from one owner.
- Registry and evidence truth must have one canonical owner.
  - no shadow copies in helper-local constants once the framework surface exists
- Helper-layer sugar may generate authored blocks from registries and evidence contracts, but it must lower back into the same source truth.
- Helper-side composition assertions stay helper- or setup-module-side in v1.
  - they should compile into ordinary checks rather than widen the normalized core
- Markdown fragments stay string-only in v1.
- No Lessons-specific nouns belong in the public API.

## 5.5 V1 vs later
- Include in v1:
  - one generic setup-level registry primitive
  - one artifact-level evidence contract
  - minimal validation and diagnostics for both
  - one render-from-truth path for registry values and artifact evidence summaries
  - one non-Lessons example or synthetic proving fixture
- Defer to later:
  - packet-contract-level evidence attachment or aggregation
  - generic inline refs inside authored text
  - tool, command, endpoint, host, path, and env-var catalogs as first-class source families
  - role-home composition law as normalized core truth
  - runtime validation of emitted artifact contents against proof contracts
- Exclude from this direction:
  - one node kind per enum family
  - a broad prose parser
  - setup-specific branches for Lessons vocabulary

## 5.6 Example proof shape
- A non-Lessons setup should be able to declare:
  - a `release_status` registry with values such as `ready_to_merge`
  - an artifact such as `release_authority_note` with an evidence contract requiring:
    - a support artifact such as `pre_publish_audit`
    - a claim such as `policy_id`
    - an allowed result value from a registry
- A surface section should then be able to render that law from structured truth instead of hand-typing the list again.

<!-- arch_skill:block:target_architecture:end -->

<!-- arch_skill:block:call_site_audit:start -->
# 6) Call-Site Audit (exhaustive change inventory)

## 6.1 Change map (table)

| Area | File | Symbol / Call site | Current behavior | Required change | Why | New API / contract | Tests impacted |
| ---- | ---- | ------------------ | ---------------- | --------------- | --- | ------------------ | -------------- |
| Core setup model | `src/core/defs.ts` | `SetupDef` and new registry types | There is no setup-level source of truth for constrained vocab today | Add `registries` to setup truth with one generic registry shape | Put enum-like law into canonical framework truth instead of prose-only constants | `registries?: RegistryDef[]` with `entries[]` | `test/core/defs.test.ts`, `test/types/authoring.test.ts` |
| Core artifact model | `src/core/defs.ts` | `ArtifactDef` and new evidence types | Artifacts know name, class, and runtime path, but not proof or support-bundle law | Add optional `evidence` to artifacts with required artifacts and named claims | Attach proof law to the runtime/support artifact boundary already modeled in the compiler | `artifact.evidence?: ArtifactEvidenceDef` | `test/source/normalize.test.ts`, type tests |
| Public source contract | `src/source/builders.ts` | `SetupInput`, `ArtifactInput` | Builder inputs cannot express registries or artifact evidence | Extend the public source contract additively | Keep the authoring API honest while preserving existing setups | `registries?: RegistryInput[]`; `artifact.evidence?` | `test/source/nodes.test.ts`, `test/types/authoring.test.ts` |
| Source validation | `src/source/schemas.ts` | `artifactSchema`, `setupSchema` | Validates current node families only | Validate registry ids, entry ids, and artifact evidence shape | Broken proof-law declarations should fail before graph and render phases | Registry schema plus artifact evidence schema | `test/source/nodes.test.ts`, targeted schema tests |
| Normalization | `src/source/normalize.ts` | `normalizeArtifacts`, `normalizeSetup` | Copies only current setup and artifact fields into normalized defs | Normalize registries and artifact evidence into plain setup truth | Keep the one-way compiler contract intact | Setup-level registry normalization and artifact evidence normalization | `test/source/normalize.test.ts` |
| Graph lookup surface | `src/core/graph.ts`, `src/graph/index.ts`, `src/graph/linker.ts` | graph build path and graph shape | Graph exposes node and link lookups only | Add a small registry lookup surface and keep evidence attached to artifact nodes | Checks and renderers need canonical registry access without turning registries into graph nodes | `registryById` or equivalent graph-adjacent lookup | `test/graph/linker.test.ts`, `test/graph/indexes.test.ts` if shape changes |
| Graph indexes | `src/graph/indexes.ts` | `DoctrineGraphIndexes` | Indexes are link-topology focused | Leave this layer mostly unchanged in v1; add evidence-derived indexes only if repeated use justifies them | Avoid widening the index layer prematurely | Likely no v1 index change, or one narrow evidence index later | New tests only if an index lands |
| Core checks | `src/checks/core-rules.ts` | registry and artifact rules | Core rules validate graph truth, not constrained vocab or proof-law integrity | Add narrow rules for duplicate registry ids, duplicate entry ids, unknown registry refs from evidence claims, unknown required artifact ids, and self-dependency | Close the real new failure modes without inventing runtime content parsing | Registry and evidence integrity diagnostics | `test/checks/registry.test.ts`, `test/mutations/index.test.ts`, targeted check tests |
| Check wiring | `src/checks/index.ts`, `src/checks/registry.ts` | default rule registration and additive setup checks | Runs existing core rules plus setup-local rules | Register registry/evidence integrity as core rules and keep helper-side composition assertions in the additive setup-check seam | Separate framework truth from optional setup-local composition policy | Additive core rule registration plus setup-local helper assertions | Check tests |
| Markdown rendering | `src/markdown/renderers/common.ts` and relevant surface renderers | authored block rendering and section render hooks | Renderers can only output prose that was hand-authored or already synthesized from graph truth | Add one render-from-truth path for registry values and artifact evidence summaries | Let authors stop hand-typing canonical vocab and proof bundles without widening inline prose semantics | Registry summary blocks or helper-lowered equivalents; artifact evidence summary rendering | `test/e2e/authored-content.test.ts`, `test/render/workflow-packet.test.ts`, relevant e2e tests |
| Existing summary helpers | `src/markdown/renderers/role-home.ts`, `src/markdown/renderers/packet-workflow.ts`, `src/markdown/renderers/workflow-owner.ts`, `src/markdown/renderers/standard.ts` | renderer seams that already synthesize graph facts | Some repeated runtime-law prose is already better generated than hand-written | Expand render-from-truth summaries before adding a new inline reference language | Prevent framework sprawl where helper or renderer work already solves the drift | No new inline-ref contract in v1 | `test/render/role-home-shared.test.ts`, `test/render/workflow-packet.test.ts` |
| Helper-side composition | `src/source/templates.ts`, `src/source/projections.ts`, `src/source/module.ts` | helper lowering and setup-module envelopes | Role-home composition and support-section attachment are still mostly assembly convention | Express missing-support-family enforcement through helper-generated assertions or setup-module checks, not normalized core truth | Keep composition law out of the core model until a stronger generic need is proven | Helper or module assertions flowing into additive checks | `test/source/templates.test.ts`, `test/e2e/shared-overrides.test.ts`, new targeted helper tests |
| Fragment boundary | `src/source/fragments.ts` | fragment parser and loader | Fragments intentionally lower limited markdown into string-only authored blocks | Keep fragments unchanged in v1 | Avoid inventing fragment interpolation or prose semantics too early | Explicit non-change; document the boundary | `test/source/fragments.test.ts` |
| Public docs and examples | `README.md`, `docs/schema.md`, `docs/requirements.md`, `docs/architecture.md`, and one public example doc or synthetic fixture | public authoring examples | Docs currently stop at graph truth and helper surfaces | Document registries, artifact evidence, helper-side composition boundaries, and explicit non-goals | Teach the smallest honest feature set and prevent a Lessons-shaped reading of the API | One constrained-vocab example, one artifact-evidence example, explicit defers for inline refs and catalogs | Docs-only review plus example compile proof when implemented |
| Proof fixtures | `test/fixtures/source/release-ops.ts` or a new synthetic fixture; `test/e2e/release-ops.test.ts` or a new e2e | proving setup coverage | Current proving setups do not exercise registries or artifact evidence | Add one non-Lessons proof case that uses both surfaces | Preserve the repo’s genericity bar | Synthetic or `release_ops`-local registry and evidence example | E2E compile test plus snapshots only if render output changes materially |

## 6.2 Migration notes
- Deprecated APIs:
  - none yet; this should land additively
- Delete list:
  - no delete list in v1
  - Explicit rejects:
    - no fragment interpolation mini-DSL
    - no generic inline ref surface in v1
    - no dedicated tool, command, host, env-var, path, or endpoint catalogs in v1
- Adoption note:
  - Some audit findings should still be handled by downstream local cleanup and stronger generated summaries from existing graph truth.
  - If the feature lands, adopters should move constrained vocab and proof-law facts out of prose-only constants and into registries and artifact evidence declarations.
  - Lessons remains a downstream proving consumer, not the API source.

## Pattern Consolidation Sweep (anti-blinders; scoped by plan)

| Area | File / Symbol | Pattern to adopt | Why (drift prevented) | Proposed scope (include/defer/exclude) |
| ---- | ------------- | ---------------- | ---------------------- | ------------------------------------- |
| Generic vocab | `setups/release_ops/**` or a new synthetic setup | use one registry to prove non-Lessons constrained vocab | prevents a Lessons-shaped API and proves cross-setup value | include |
| Artifact law | `setups/**` artifact declarations | attach proof and evidence law to artifacts, not prose | prevents support-file and required-claim drift | include |
| Generated summaries | `src/markdown/renderers/role-home.ts`, `src/markdown/renderers/packet-workflow.ts`, `src/markdown/renderers/workflow-owner.ts`, `src/markdown/renderers/standard.ts` | keep rendering summaries from existing graph truth before widening the model again | prevents solving local cleanup with new framework concepts | include |
| Composition checks | helper templates and setup modules | enforce role-home composition through helper-generated assertions and additive checks | prevents missing support families without bloating the core model | include |
| Packet law | `src/core/defs.ts` `PacketContractDef` | add packet-level evidence aggregation | useful if artifact-level attachment proves too weak | defer |
| Inline refs | authored-content text model | add generic inline refs inside authored text | may matter later, but v1 should prove registries and evidence first | defer |
| Environment catalogs | tools, commands, hosts, endpoints, env vars | promote sanctioned environment catalogs into first-class source truth | real need, but a likely scope explosion before registries settle | defer |
| Parsing boundary | `src/source/fragments.ts` | broaden markdown parsing to discover canonical law inside prose | violates the current product boundary and invites a second language | exclude |
| Enum families | per-domain node kinds such as `verdict_value` or `publish_intent` | create one node kind per constrained-value family | would mirror Lessons nouns and bloat the normalized model | exclude |
<!-- arch_skill:block:call_site_audit:end -->

<!-- arch_skill:block:phase_plan:start -->
# 7) Depth-First Phased Implementation Plan (authoritative)

> Rule: systematic build, foundational first; every phase has exit criteria + explicit verification plan (tests optional). No fallbacks/runtime shims - the system must work correctly or fail loudly (delete superseded paths). Prefer programmatic checks per phase; defer manual/UI verification to finalization. Avoid negative-value tests (deletion checks, visual constants, doc-driven gates). Also: document new patterns/gotchas in code comments at the canonical boundary (high leverage, not comment spam).

## Phase 1 - Source Surface And Validation Foundations

Status: COMPLETE
Completed work:
- Added setup-level registry types and artifact-evidence types in the core and builder surfaces.
- Extended source validation to accept registry and artifact-evidence declarations.
- Extended normalization to lower registries and artifact evidence into plain setup truth.
- Kept fragments unchanged and explicit as a v1 non-goal.

Goal
- Land the smallest honest v1 source surface for constrained vocab and proof law:
  - setup-level registries
  - artifact-level evidence contracts
- Keep the slice additive and preserve the current fragment and doc-AST boundaries.

Work
- Add registry types to `src/core/defs.ts` and thread them through `src/source/builders.ts`.
- Add artifact-evidence types to `src/core/defs.ts` and `src/source/builders.ts`.
- Extend `src/source/schemas.ts` to validate:
  - registry ids
  - registry entry ids
  - artifact evidence shape
  - evidence references to registry entries at the schema-shape level where possible
- Extend `src/source/normalize.ts` to lower registries and artifact evidence into plain setup truth.
- Keep `src/source/fragments.ts` unchanged and explicit about the v1 non-goal:
  - no inline-ref or interpolation syntax in fragments

Verification (smallest signal)
- `test/core/defs.test.ts`
- `test/types/authoring.test.ts`
- `test/source/nodes.test.ts`
- `test/source/normalize.test.ts`

Docs/comments (propagation; only if needed)
- Add one short boundary comment where the new types or schema rules would otherwise invite overbroad follow-up work.

Exit criteria
- The low-level authoring contract can express registries and artifact evidence additively.
- Existing setups remain valid without migration.
- Malformed registry or evidence inputs fail in source validation before graph or render work begins.

Rollback
- Narrow the evidence contract shape instead of widening the model.
- If one registry shape proves too broad, keep one generic registry primitive and trim optional fields rather than adding dedicated enum node kinds.

## Phase 2 - Graph Lookup And Core Enforcement

Status: COMPLETE
Completed work:
- Added `graph.registries` and `graph.registryById` as graph-adjacent lookup truth without widening registries into graph nodes.
- Added registry query helpers and a boundary comment that makes the graph/check split explicit.
- Added a dedicated `registry_and_evidence_semantics` core rule for duplicate registries, duplicate entry ids, invalid claim value refs, missing required evidence artifacts, and circular evidence dependencies.
- Extended the graph, check, and compile mutation tests to prove the new failures through the real build path.

Goal
- Make the new truth surfaces inspectable and fail-loud without turning them into full graph node families.

Work
- Add a small registry lookup surface to the graph build path in:
  - `src/core/graph.ts`
  - `src/graph/index.ts`
  - `src/graph/linker.ts`
- Keep registries graph-adjacent lookup data rather than routed nodes.
- Keep `src/graph/indexes.ts` minimal; only add evidence-derived indexes if repeated use proves they are necessary.
- Add core rules in `src/checks/core-rules.ts` for:
  - duplicate registry ids
  - duplicate registry entry ids
  - unknown registry references from evidence claims
  - unknown required artifact ids
  - self-referential or obviously incoherent artifact evidence dependencies
- Wire the new rules through `src/checks/index.ts` while preserving the additive setup-local rule seam.

Verification (smallest signal)
- `test/checks/registry.test.ts`
- `test/mutations/index.test.ts`
- `test/graph/linker.test.ts`
- `test/graph/indexes.test.ts` only if the graph/index shape actually changes

Docs/comments (propagation; only if needed)
- Add one short comment at the graph/check boundary clarifying that registries are lookup truth, not routed graph entities.

Exit criteria
- Invalid registry or artifact-evidence truth fails deterministically in the check phase.
- The graph exposes enough canonical lookup data for renderers without widening into dedicated registry node families.

Rollback
- If graph-wide lookup changes start to sprawl, keep registry access adjacent to graph build output and defer speculative index work.

## Phase 3 - Render-From-Truth Surfaces And Proving Fixture

Status: COMPLETE
Completed work:
- Added one render-from-truth path for artifact evidence summaries in the shared common renderer instead of widening the authored content model.
- Rendered registry-backed claim values through artifact evidence summaries so sanctioned vocab now shows up from canonical setup truth.
- Added one non-Lessons synthetic proving fixture in `test/fixtures/source/registry-evidence.ts`.
- Extended render and e2e coverage to prove the new markdown output through both direct rendering and full compile flow.

Goal
- Let setups render constrained vocab and proof-law summaries from structured truth instead of hand-typing them in prose.

Work
- Add one render-from-truth path for registry-backed values and artifact evidence summaries in:
  - `src/markdown/renderers/common.ts`
  - the relevant surface renderers that need the new summaries
- Keep `src/doc/**` unchanged.
- Preserve the existing preference for generated summaries where the graph already knows the answer.
- Add or update one non-Lessons proving fixture in:
  - `test/fixtures/source/release-ops.ts`
  - or a new synthetic setup if `release_ops` would become awkward
- Update the corresponding e2e coverage to exercise both:
  - constrained vocab rendering
  - artifact evidence rendering

Verification (smallest signal)
- `test/e2e/authored-content.test.ts`
- `test/render/workflow-packet.test.ts`
- `test/render/role-home-shared.test.ts` if summary helpers are touched
- the relevant e2e compile proof for the chosen non-Lessons fixture

Docs/comments (propagation; only if needed)
- Add one short comment at the render boundary if the display policy for registry/evidence summaries would otherwise be non-obvious.

Exit criteria
- At least one non-Lessons setup compiles readable markdown that renders registry and artifact-evidence law from structured truth.
- No inline-ref authoring surface is introduced to get this slice working.

Rollback
- If a generic render block becomes awkward, keep the summary helper or helper-lowered equivalent and defer richer rendering ergonomics rather than widening the source model.

## Phase 4 - Helper-Side Composition Assertions And Summary Cleanup

Status: DEFERRED
Reason:
- No helper-side assertion emerged that met the repo bar for small, generic, and framework-first without drifting into setup-shaped policy.
- The shipped v1 slice stays cleaner if this phase remains an explicit defer rather than a speculative helper feature.

Goal
- Close the helper-side drift that belongs in v1 without widening the normalized core beyond the chosen slice.

Work
- Use the existing helper and setup-module seams in:
  - `src/source/templates.ts`
  - `src/source/projections.ts`
  - `src/source/module.ts`
  to express composition-sensitive requirements such as missing support families through additive checks or assertions.
- Expand graph-derived summaries where current truth already exists, especially in:
  - `src/markdown/renderers/role-home.ts`
  - `src/markdown/renderers/packet-workflow.ts`
  - `src/markdown/renderers/workflow-owner.ts`
  - `src/markdown/renderers/standard.ts`
- Keep tool catalogs, endpoint catalogs, and inline refs deferred unless this work proves the chosen slice insufficient.

Verification (smallest signal)
- `test/source/templates.test.ts`
- `test/e2e/shared-overrides.test.ts`
- the smallest relevant render suites for any summary-expansion changes

Docs/comments (propagation; only if needed)
- Add one short comment at the helper assertion seam if the composition contract is non-obvious and easy to regress.

Exit criteria
- Composition-sensitive runtime gaps either fail through helper-side additive checks or are explicitly deferred out of the v1 slice.
- Renderer or helper cleanup reduces duplicated runtime-law prose where structured truth already exists.

Rollback
- If helper-side composition assertions start becoming setup-shaped or brittle, defer them and keep the shipped v1 focused on registries and artifact evidence only.

## Phase 5 - Public Docs, Example Story, And Final Verification

Status: COMPLETE
Completed work:
- Updated `README.md`, `docs/schema.md`, `docs/requirements.md`, and `docs/architecture.md` so the public story includes registries, artifact evidence, and explicit non-goals.
- Added one generic constrained-vocab and artifact-evidence example to the public README instead of a Lessons-shaped walkthrough.
- Added a dedicated public walkthrough in `docs/example_typed_runtime_law.md` and updated `docs/example_editorial.md` so the example story clearly splits the high-fidelity proving setup from the small generic runtime-law slice.
- Updated `docs/testing.md` and `docs/ref/GENERIC_DOCTRINE_SYSTEM_PLAIN_EXAMPLE.md` so the proof standard, plain-English explanation, examples, and compiler behavior all describe the same generic feature.
- Kept inline refs, broader catalogs, and packet-level evidence aggregation explicitly deferred in the public docs.
- Completed the focused verification passes for the source, graph, check, render, and e2e surfaces touched by this slice.

Goal
- Ship the slice as a teachable generic framework feature with one coherent public story.

Work
- Update the public contract and walkthrough docs in:
  - `README.md`
  - `docs/schema.md`
  - `docs/requirements.md`
  - `docs/architecture.md`
  - any example doc that demonstrates the chosen non-Lessons proof surface
- Add one constrained-vocab example and one artifact-evidence example that are clearly generic and not Lessons-shaped.
- Keep inline refs, tool catalogs, packet-level evidence aggregation, and broader parser work explicitly documented as deferred or excluded follow-up work.
- Run the smallest honest verification set for the files touched in implementation.

Verification (smallest signal)
- The source, check, render, and e2e suites touched by the implementation phases above
- `npm run typecheck` and `npm run build` once compiler-layer TypeScript changes land
- Snapshot or golden updates only when the rendered output contract actually changes and the diff has been read

Docs/comments (propagation; only if needed)
- Public docs and examples must land in the same change as the feature.
- Add only high-leverage boundary comments; do not add comment spam.

Exit criteria
- The feature slice is teachable, tested, and clearly generic.
- The public docs, proving fixture, and compiler behavior all tell the same story.
- The repo has one credible non-Lessons proof of the slice.

Rollback
- Ship a narrower feature slice instead of stretching scope to fit every audit item.
- If the public story still reads as Lessons-shaped, cut scope again before implementation starts.
<!-- arch_skill:block:phase_plan:end -->

# 8) Verification Strategy (common-sense; non-blocking)

## 8.1 Unit tests (contracts)
- Prefer schema and normalization tests for any new source inputs.
- Prefer focused tests for registry validation and artifact-evidence normalization over broad golden churn.
- Do not add tests that merely prove a string literal disappeared.

## 8.2 Integration tests (flows)
- Prefer small compile or render tests that show:
  - registry-backed values and artifact evidence summaries render correctly
  - bad registry or evidence declarations fail loudly
  - registry-backed values enforce allowed vocab
  - proof/evidence requirements diagnose missing law when modeled
- Reuse existing setup and mutation-test patterns where possible.

## 8.3 E2E / device tests (realistic)
- No device testing expected.
- At most one or two e2e compile proofs should be needed if the feature slice reaches canonical examples.
- Manual readback of rendered markdown is non-blocking and should stay short.

# 9) Rollout / Ops / Telemetry

## 9.1 Rollout plan
- Keep the new surface additive at first.
- Prove it in docs plus a synthetic or canonical setup before expecting downstream adopters to move.
- Treat Paperclip adoption as downstream follow-through after the framework surface is accepted.

## 9.2 Telemetry changes
- Likely none beyond new diagnostics and maybe richer compile failure modes.
- If new diagnostics are added, they should stay small, deterministic, and source-anchored.

## 9.3 Operational runbook
- Update public docs and examples at the same time as the code.
- If the feature changes authoring expectations meaningfully, add one short example that shows the before/after shape plainly.
- Avoid operational ceremony. The main runbook is still "author setup truth, compile, read markdown."

# 10) Decision Log (append-only)

## 2026-04-02 - Filter the Lessons drift audit through the generic product boundary

Context
- The sibling Lessons audit identifies real drift patterns in the current Paperclip agent source.
- The user explicitly wants framework-first feature design, not a literal replay of one downstream setup's asks.

Options
- Treat the audit as a direct API request list.
- Treat every finding as downstream local cleanup.
- Use the audit as evidence, then classify each finding by where the honest generic fix belongs.

Decision
- Use the audit as pressure-test evidence only.
- Separate local cleanup from framework work.
- Bootstrap this plan around the smallest elegant generic feature families that could make the hard drift patterns easy to express and validate in `paperzod`.

Consequences
- The plan will likely recommend fewer features than the raw audit asks for.
- The plan should converge toward a compact primitive set rather than a long feature menu.
- Some downstream Paperclip cleanup work may be explicitly declared out of framework scope.
- The eventual framework surface should be easier to explain and prove publicly.

Follow-ups
- Confirm the North Star before deeper planning.
- Run `research` and `deep-dive` against the concrete feature families in Sections 3 through 6.

## 2026-04-02 - Choose one generic node-ref primitive as the minimal v1 enforcement layer

Context
- The deep-dive confirmed two facts at the same time:
  - serious drift remains where canonical runtime law is still embedded as opaque strings
  - the current renderers already synthesize some doctrine summaries directly from structured truth, so not every audit finding needs a new source-language feature

Options
- Add many request-shaped block kinds and dedicated catalog node families directly from the audit.
- Keep everything as downstream local cleanup and generated summaries.
- Choose a compact middle path:
  - one generic inline-ref primitive over existing node ids
  - render-from-truth summary helpers where the graph already knows the answer
  - later registry, evidence, and catalog work only if typed refs do not carry enough of the value

Decision
- Choose the compact middle path.
- Keep markdown fragments string-only in v1.
- Defer registries, proof and evidence modeling, composition law, and dedicated environment catalogs until a second primitive is justified.
- Keep the first implementation slice focused on TypeScript-authored inline doctrine that must point at existing graph truth.

Consequences
- The plan now has a concrete target architecture instead of a generic idea list.
- Some audit findings move clearly into downstream local cleanup or stronger generated-summary work.
- The first implementation slice stays closer to the existing architecture:
  - one small authored-content extension
  - no new graph node families
  - no fragment-parser expansion
- If later work shows non-node canonical values really need enforcement, they can land as a second primitive instead of bloating `node_ref`.

Follow-ups
- Rewrite the phase plan around this narrower target architecture.
- Only run external research if phase planning exposes unresolved ambiguity around the generic inline-ref shape or target-kind boundary.

## 2026-04-02 - Resolve the deep-dive split in favor of registries plus artifact evidence

Context
- Parallel deep-dive passes split between two viable directions:
  - typed inline node refs first
  - registries plus artifact-level evidence first
- The user explicitly asked for the most elegant and simple framework-first enforcement layer, with Lessons only as a pressure test.
- The current repo already has helper and renderer seams that can remove a meaningful amount of node-name and workflow-summary duplication without widening authored text yet.

Options
- Keep the inline `node_ref` primitive as the v1 framework move.
- Jump straight to a broader three-primitive surface:
  - inline refs
  - registries
  - evidence contracts
- Choose the smaller framework truth surface:
  - one setup-level registry primitive
  - one artifact-level evidence contract
  - render-from-truth summaries and helper-side composition assertions for the rest

Decision
- Choose the smaller framework truth surface.
- This supersedes the earlier node-ref-first deep-dive conclusion after the parallel-agent reconciliation.
- Treat inline refs as a deliberate later primitive, not part of v1.
- Keep composition law helper-side or setup-module-side in v1 instead of widening the normalized core.

Consequences
- V1 now enforces constrained vocab and proof law without widening every authored text position.
- Some prose drift remains downstream local cleanup or stronger helper and renderer generation from existing graph truth.
- The canonical artifact is now aligned around a smaller, more framework-first enforcement layer.

Follow-ups
- Run `$arch-step phase-plan` next to rewrite the phases around registries and artifact evidence first.
- Only run external research if phase planning exposes unresolved ambiguity around registry shape or artifact-evidence attachment.

## 2026-04-02 - Make Section 7 authoritative around the chosen v1 slice

Context
- Deep-dive resolved the v1 architecture in favor of setup-level registries plus artifact-level evidence.
- Section 7 was still carrying a stale typed-ref-first execution order, which made the artifact internally contradictory even though Sections 5, 6, and the latest decision entry were already aligned.

Options
- Leave Section 7 as a provisional stale note and rely on readers to reconcile it manually.
- Rewrite Section 7 around the chosen v1 slice:
  - source surface and validation first
  - graph lookup and checks second
  - render-from-truth and proving fixture third
  - helper-side composition assertions and summary cleanup fourth
  - docs and final verification last
- Broaden Section 7 to carry both the chosen v1 slice and a speculative inline-ref follow-up in the same execution plan.

Decision
- Rewrite Section 7 around the chosen v1 slice only.
- Keep inline refs, packet-level evidence aggregation, and environment catalogs out of the authoritative execution checklist for now.

Consequences
- Section 7 is again the one authoritative execution checklist.
- `implement` can now execute against the same architecture described in Sections 5 and 6.
- Follow-up ideas remain visible as defer items instead of competing execution tracks.

Follow-ups
- The next core move is `$arch-step implement` once the user wants to start shipping the slice.
- Optional helper commands such as `plan-enhance` or `review-gate` can still run before implementation if desired.

## 2026-04-02 - Finish the v1 slice with render-from-truth evidence summaries and explicit helper-side defers

Context
- The implementation pass completed the source, graph, and check phases successfully.
- Phase 4 still allowed helper-side composition assertions, but only if a small generic pattern emerged.
- The user’s bar remained “most elegant and simple,” with Lessons as pressure test only.

Options
- Keep widening the slice with helper-side assertions and more render surfaces in the same pass.
- Stop after graph/check enforcement and leave the runtime markdown story half-taught.
- Finish the v1 slice with one small render-from-truth path, one non-Lessons proving fixture, public docs, and an explicit defer for helper-side assertions that do not yet clear the genericity bar.

Decision
- Finish the shipped slice with:
  - setup-level registries
  - artifact-level evidence contracts
  - graph-adjacent registry lookup
  - core registry/evidence checks
  - one render-from-truth artifact evidence summary path
  - one non-Lessons synthetic proving fixture
  - public docs that explain the feature and its non-goals
- Defer helper-side composition assertions for now.

Consequences
- The repo now ships one coherent small framework feature instead of a partial implementation plus speculative helper work.
- The public story is cleaner because the docs and tests all describe the same narrow slice.
- Some composition-sensitive drift remains an intentional follow-up rather than a rushed v1 feature.

Follow-ups
- The next honest arch move is `$arch-step audit-implementation` or `$arch-step review-gate`.

## 2026-04-02 - Audit confirms the shipped v1 slice is code-complete

Context
- The implementation pass claimed the v1 slice was shipped, but the plan artifact was still `active`.
- The audit command reran the claimed verification commands and checked the concrete implementation anchors for:
  - setup-level registry and artifact-evidence source truth
  - graph-adjacent registry lookup
  - core registry/evidence enforcement
  - render-from-truth artifact evidence summaries
  - non-Lessons proof fixture and public docs

Options
- Reopen any false-complete phase with evidence-anchored code gaps.
- Leave the doc `active` even if the shipped slice is already complete.
- Mark the artifact complete, keep Phase 4 deferred, and move the workflow to optional review or downstream adoption follow-through.

Decision
- Audit verdict is `COMPLETE`.
- Keep Phase 4 explicitly deferred rather than reopening it, because it was intentionally de-scoped and no missing code work was found against the shipped v1 slice.
- Mark the plan artifact `complete` and move the recommended next step to `review-gate`.

Consequences
- The plan doc now matches repo reality instead of implying unfinished implementation work.
- The remaining work is optional plan review or separate downstream adoption, not more framework implementation inside this plan.

Follow-ups
- Run `$arch-step review-gate` if you want a final idiomatic plan review.
- Treat Paperclip consumption of the new surface as separate follow-through work, not unfinished framework code.
