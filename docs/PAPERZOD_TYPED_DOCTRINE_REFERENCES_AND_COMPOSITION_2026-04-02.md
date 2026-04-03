---
title: "paperzod - Typed Doctrine References And Composition - Architecture Plan"
date: 2026-04-02
status: complete
fallback_policy: forbidden
owners: [aelaguiz, codex]
reviewers: [aelaguiz]
doc_type: architectural_change
related:
  - docs/PAPERZOD_FRAMEWORK_FIRST_DRIFT_PROOFING_2026-04-02.md
  - README.md
  - docs/requirements.md
  - docs/schema.md
  - docs/architecture.md
  - src/core/defs.ts
  - src/source/builders.ts
  - src/source/templates.ts
  - src/source/fragments.ts
  - src/doc/ast.ts
  - src/doc/builders.ts
  - src/markdown/renderers/common.ts
---

# TL;DR

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

- Outcome:
  - Design the next round of `paperzod` as a small generic enforcement layer for typed doctrine references and required document composition, so important facts inside human-written doctrine stop being raw strings and missing canonical sections fail loudly.
- Problem:
  - `paperzod` still treats most authored doctrine text as plain strings and most document composition law as convention. That means artifact names, section mentions, commands, env vars, paths, endpoints, and required support sections can drift silently even when the setup graph itself is valid.
- Approach:
  - Add small typed islands inside normal authored TypeScript doctrine blocks, starting with generic reference atoms that can point at graph-backed or catalog-backed runtime law.
  - Add declarative document-composition contracts so templates and generated surfaces can say which canonical sections must exist and fail compile when they do not.
  - Keep the public ref surface small:
    - one internal ref model
    - thin sugar for common graph-backed refs
    - `command` as the first non-graph proving family
  - Keep markdown fragments plain, keep generated markdown plain, and make the first-cut adoption rule explicit:
    - drift-sensitive statements move into TypeScript-authored doctrine blocks first
    - any later fragment-safe ref syntax is a narrow follow-up, not part of the initial framework move
  - Broaden registries, trust bundles, and optional operational catalogs only as consumers of the same capability rather than as separate feature piles.
- Plan:
  - Implement in five depth-first phases:
    - source contracts plus lookup substrate
    - fail-loud enforcement
    - render-from-truth plus typed-ref proving fixture
    - template and proving-setup adoption
    - public docs/examples plus final verification
- Non-negotiables:
  - No Lessons-specific node kinds or API names.
  - No arbitrary markdown parser or prose interpretation layer.
  - No giant second schema for all writing.
  - Typed refs must verify existence, render from canonical truth, and fail on rename or delete.
  - One unified ref model must cover both graph-backed refs and catalog-backed refs.
  - Required document composition must be declarative, generic, and compiler-enforced.
  - Human prose must stay easy to write; the framework should add small typed islands, not replace ordinary writing.
  - The fragment boundary and migration story must be explicit. No fuzzy "maybe later" adoption plan for drift-sensitive prose.

<!-- arch_skill:block:planning_passes:start -->
<!--
arch_skill:planning_passes
deep_dive_pass_1: done 2026-04-02
external_research_grounding: not started
deep_dive_pass_2: done 2026-04-02
recommended_flow: complete
note: All planned implementation phases are complete. External research stayed deferred because repo evidence was sufficient and implementation did not reopen the design.
-->
<!-- arch_skill:block:planning_passes:end -->

# 0) Holistic North Star

## 0.1 The claim (falsifiable)
> If `paperzod` adds one small typed authored-content mechanism for inline references plus one declarative document-composition contract for required sections, while keeping fragments plain and preserving one-way markdown compilation, then the highest-value doctrine drift classes around "read this thing," "use this sanctioned command or env var," and "this surface must include these canonical sections" become compiler-visible framework truth instead of raw strings and setup-local convention. The first implementation cut should work in TypeScript-authored doctrine blocks and adopt drift-sensitive prose by moving those statements out of raw fragments where needed. This claim is false if the design requires broad markdown parsing, grows into a second writing language, cannot support both graph-backed refs and sanctioned operational refs through one coherent mechanism, or leaves the fragment migration story ambiguous.

## 0.2 In scope
- UX surfaces (what users will see change):
  - setup-author ergonomics for typed mentions inside authored TypeScript doctrine blocks
  - compile diagnostics when a referenced artifact, section, role, command, env var, path, or endpoint is missing or renamed
  - compile diagnostics when a role home, workflow owner, or other generated doctrine surface omits required canonical sections
  - public examples that show normal prose with small typed reference islands instead of raw repeated strings
- Technical scope (what code and docs will change):
  - the authored-content source model where inline prose is currently string-only
  - the authored-content render boundary where typed inline references resolve into plain markdown text
  - graph-backed and catalog-backed reference resolution semantics
  - document-template or surface-level required-section contracts
  - an explicit first-cut adoption rule for drift-sensitive prose that currently lives in markdown fragments
  - public docs, examples, and tests for the new authoring surface
  - pressure-testing how existing registries and artifact evidence should reuse the same new capability rather than remain isolated special cases

## 0.3 Out of scope
- UX surfaces (what users must NOT see change):
  - no promise that every operational noun becomes a first-class catalog in v1
  - no requirement that authors stop writing ordinary prose
  - no Lessons-shaped public API or Lessons-specific authoring examples
- Technical scope (explicit exclusions):
  - no arbitrary CommonMark parsing or semantic interpolation inside markdown fragments
  - no AI-style prose interpretation
  - no one-node-kind-per-reference-target-family explosion
  - no giant general schema for all human writing
  - no forced migration of every existing string to a typed ref in one round
  - no broad fragment-safe ref syntax in the first implementation slice

## 0.4 Definition of done (acceptance evidence)
- The plan names one coherent typed-inline-ref surface that can express at least:
  - artifact refs
  - section refs
  - role refs
  - one non-graph operational ref family, starting with commands
- The plan names one coherent composition-contract surface that can express required canonical sections for generated doctrine surfaces.
- The plan keeps fragments plain and explains exactly where typed refs are allowed first.
- The plan makes the first adoption rule explicit for fragment-authored drift-sensitive prose:
  - move those statements into TypeScript-authored doctrine blocks in v1
  - or explicitly defer one tiny fragment-safe follow-up instead of hand-waving the gap
- The target architecture explains how:
  - existence validation works
  - display text resolution works
  - rename or delete failures surface
  - composition checks run
- The plan explains how registries, structured trust/support bundles, and optional operational catalogs fit as follow-on consumers or adjacent capabilities without bloating v1.
- The future implementation can be proven with small honest signals:
  - source and type tests for the new authored-content shape
  - check tests for missing refs and missing required sections
  - render and e2e tests that show plain markdown generated from typed inline refs
  - docs and examples that teach the surface plainly

## 0.5 Key invariants (fix immediately if violated)
- The framework goal is small typed islands inside normal human writing.
- Fragments stay plain and string-only in v1 unless a later plan explicitly reopens that boundary.
- Drift-sensitive statements in fragments may not sit in a fuzzy middle state:
  - they move into TypeScript-authored doctrine blocks in the first adoption story
  - or a later tiny fragment-safe syntax must be proposed explicitly as follow-up work
- Typed refs must point at canonical truth owned somewhere inspectable by the compiler.
- Display text for typed refs comes from canonical framework truth, not repeated prose-only strings.
- Typed refs may not accept author-provided display overrides in v1.
- Missing referenced targets or missing required sections must fail loudly.
- Document composition law must be generic and declarative, not helper-specific magic.
- Registries, evidence contracts, and optional operational catalogs should reuse the same reference and contract model where possible.
- No second writing language, no hidden fallback strings, and no setup-specific branches in `src/**`.

# 1) Key Design Considerations (what matters most)

## 1.1 Priorities (ranked)
1. Make important doctrine mentions stop being raw strings.
2. Make required canonical document structure fail loudly instead of relying on convention.
3. Keep the authoring surface small and readable for humans.
4. Reuse one coherent mechanism across graph-backed refs and sanctioned operational refs where possible.
5. Avoid feature sprawl by treating registries, trust bundles, and catalogs as consumers of the same capability instead of separate mini-systems.

## 1.2 Constraints
- `src/core/defs.ts` currently models paragraphs, list items, table cells, and other authored content as string-bearing blocks.
- `src/doc/ast.ts` and `src/doc/builders.ts` currently render paragraph and list text as plain strings.
- `src/markdown/renderers/common.ts` lowers authored blocks directly into plain paragraph and list nodes with no semantic resolution of inline mentions.
- `src/source/templates.ts` currently lowers template sections into ordinary setup arrays but does not persist a first-class required-composition contract.
- `src/source/fragments.ts` is intentionally narrow and should not be widened casually into a semantic parser.

## 1.3 Architectural principles (rules we will enforce)
- Prefer one generic inline-ref model over many ad hoc node-specific paragraph helpers.
- Keep typed semantics at authored TypeScript boundaries first, not inside broad fragment parsing.
- Prefer canonical ids plus renderer-owned display resolution over author-owned duplicated labels.
- Treat required surface composition as explicit contract data, not a side effect of helper usage.
- If a thing can be rendered from existing truth, do not create a new special-purpose surface for it.

## 1.4 Known tradeoffs (explicit)
- Inline refs solve the core drift problem cleanly, but they still widen the authored-content source model and render boundary even if the doc AST stays plain in v1.
- Composition contracts are cleaner as first-class surface truth, but that is a deeper move than helper-only assertions.
- Optional typed catalogs for commands, env vars, paths, and endpoints are useful, but they should not bloat the first implementation slice if one generic catalog pattern suffices.
- Reusable value sets and trust bundles likely belong in the same family, but they should not distract from the primary v1 goal of typed references plus required composition.
- Keeping fragments plain is the right product boundary, but it creates a real adoption constraint that the plan must address explicitly rather than gloss over.

# 2) Problem Statement (existing architecture + why change)

## 2.1 What exists today
- Authored doctrine bodies are still mostly string-only:
  - `src/core/defs.ts` uses `text: string` for paragraphs and string-bearing list and definition shapes.
  - `src/markdown/renderers/common.ts` turns authored blocks straight into plain paragraph and list nodes with no inline semantic resolution.
- Document templates already exist and are useful:
  - `src/source/templates.ts` defines reusable role-home, workflow-owner, packet-workflow, standard, gate, and reference templates.
  - those templates lower into ordinary `surfaceSections` and `documents` links.
- The current registry and artifact-evidence slice proves the repo is willing to model canonical runtime law when it matters.

## 2.2 What's broken / missing (concrete)
- A sentence like "Read ACTION_AUTHORITY.md before taking final action" is still just a raw string.
- A section mention like "read Final Action Rules" is still just a raw string.
- A sanctioned operational command, env var, path, or endpoint can still drift in prose even when the framework knows it should be canonical.
- A role home or workflow owner can still rely on convention for required canonical sections instead of explicit compiler-enforced composition law.
- Registries currently help only where a specific feature already consumes them; they are not yet part of a broader typed inline reference capability.

## 2.3 Constraints implied by the problem
- The solution must distinguish between prose that should stay freeform and facts that are important enough to reference structurally.
- The first implementation should probably start where authored TypeScript already owns structure instead of reopening fragment parsing.
- Document composition enforcement needs a stable contract that survives helper lowering and can be checked after normalization.
- The migration story for drift-sensitive fragment prose must be explicit enough that adopters know what moves into TypeScript-authored blocks first.

# 3) Research Grounding (external + internal “ground truth”)

<!-- arch_skill:block:research_grounding:start -->
## 3.1 External anchors (papers, systems, prior art)
- Deliberately deferred in this pass.
- The repo evidence is already strong enough to choose a direction without importing outside system shape too early.
- External research should reopen only if `phase-plan` exposes real ambiguity around:
  - public inline-ref API shape
  - catalog scope beyond the first proving family
  - whether a later fragment-safe syntax is worth the complexity

## 3.2 Internal ground truth (code as spec)
- Authored doctrine is still string-terminal today.
  - `src/core/defs.ts` uses `text: string` for paragraphs, string-bearing list items, and string-bearing definition-list shapes.
  - `src/source/schemas.ts` validates authored blocks structurally, but it does not model inline semantic references.
  - `src/source/normalize.ts` preserves authored text as-is.
- The authored-content render seam already exists and is the cleanest place to resolve typed refs in v1.
  - `src/markdown/renderers/common.ts` lowers authored blocks through `authoredBlocksToDocBlocks(...)`.
  - That lowering step currently turns paragraph and list content straight into plain doc nodes.
  - `src/doc/ast.ts`, `src/doc/builders.ts`, and `src/doc/markdown.ts` are still plain string-oriented, which makes them good explicit non-change targets for the first implementation cut.
- Template identity is helper-local today; durable composition truth lives on surfaces and sections after lowering.
  - `src/source/templates.ts` and `src/source/projections.ts` lower helper templates into ordinary `surface`, `surface_section`, and link truth.
  - Once lowering completes, the durable section identity is the generated `surface_section` plus its `stableSlug`, not the helper-local template key.
- The checks layer already owns generic semantic enforcement for surface law.
  - `src/checks/core-rules.ts` and the existing surface tests already enforce cross-node and surface-structure invariants after normalization and graph assembly.
  - That makes `check` the right phase for missing required sections and broken typed refs.
- Some renderer behavior already assumes canonical section families even though the compiler does not enforce them yet.
  - `src/markdown/renderers/role-home.ts` assumes `read-first` and `role-contract`.
  - `src/markdown/renderers/shared-entrypoint.ts` assumes `project-home-map` and `read-order`.
- The repo already has a precedent for graph-adjacent canonical lookup state that is not itself a graph node.
  - Registries and artifact evidence prove that `paperzod` is willing to carry canonical runtime-law lookup truth outside the core node list when the feature warrants it.
  - `src/core/graph.ts`, `src/graph/indexes.ts`, and `src/graph/queries.ts` are the natural seam for a catalog-backed ref lookup path and for section-family lookup by `surfaceId + stableSlug`.
- Markdown fragments are intentionally narrow.
  - `src/source/fragments.ts` is a deliberate product boundary, not an unfinished parser.
  - The first adoption story therefore has to move drift-sensitive fragment prose into TypeScript-authored blocks instead of pretending fragments are already semantic.

## 3.3 Open questions from research
- The smallest coherent v1 is an additive inline-text model in authored TypeScript doctrine, not a markdown parser and not a doc-AST rewrite.
- Typed inline refs should resolve to canonical display text before doc-node creation.
  - That keeps markdown output plain.
  - It also avoids opening relative-link policy, anchor generation, and markdown escaping complexity in the first slice.
- Required composition should be durable surface truth, not template-only glue.
  - Templates may expose helper sugar like `requiredSections`, but the compiler-owned contract should live on the surface and be checked against realized `surface_section.stableSlug` values.
- A unified ref model can cover both graph-backed and catalog-backed targets without making every operational family first-class in v1.
  - Graph-backed refs should handle the doctrine entities the compiler already knows how to display.
  - Catalog-backed refs should prove the non-graph seam with one operational family first, then widen only if it remains elegant.
- Registries, trust bundles, and later support-package features should be framed as follow-on consumers of this same capability, not as the architecture center of this plan.
- The research questions that mattered for implementation are now closed in this pass:
  - public authoring should lead with a very small sugar layer, not a generic object-literal ref API
  - v1 helpers should be `artifactRef(...)`, `surfaceRef(...)`, `sectionRef(...)`, `roleRef(...)`, and `commandRef(...)`
  - all of them should lower to one internal inline-ref union
  - the first non-graph catalog-backed family should be `command`
  - existing renderer ergonomics already backtick command-like runtime strings cleanly
  - `env_var` is still a good later adopter, but it adds naming and environment-scope questions that the first proving slice does not need
  - section refs should identify a section by `{ surfaceId, stableSlug }`, not by helper keys and not by generated section ids
  - `stableSlug` is the meaningful family identity that survives helper lowering
  - `surfaceId` scopes that family to one concrete document surface
  - this avoids making authors depend on derived section ids that exist only because a helper lowered them that way
<!-- arch_skill:block:research_grounding:end -->

# 4) Current Architecture (as-is)

<!-- arch_skill:block:current_architecture:start -->
## 4.1 On-disk structure
- `src/core/defs.ts`
  - defines the canonical setup node families and the current authored-content block model
  - currently treats inline authored text as plain strings
  - does not define non-graph operational catalogs or required surface composition contracts
- `src/source/builders.ts`, `src/source/schemas.ts`, `src/source/normalize.ts`
  - define the public authoring surface, structural validation, and normalized setup truth
- `src/source/templates.ts`, `src/source/projections.ts`
  - provide helper-layer composition and lower it into ordinary setup arrays
- `src/core/graph.ts`, `src/graph/indexes.ts`, `src/graph/linker.ts`, `src/graph/queries.ts`
  - assemble graph truth and graph-adjacent lookup state
- `src/checks/core-rules.ts`, `src/checks/index.ts`
  - enforce fail-loud semantic rules after setup truth exists
- `src/markdown/renderers/common.ts`
  - converts authored content and graph truth into plain doc blocks before markdown emission
- `src/markdown/renderers/role-home.ts`, `src/markdown/renderers/shared-entrypoint.ts`
  - already encode implicit canonical section families via stable-slug-specific fallback rendering
- `src/source/fragments.ts`
  - keeps fragment composition intentionally plain and narrow

## 4.2 Control paths (runtime)
- Authored setup input enters through builders and source schemas, then normalizes into `SetupDef`-style truth.
- Graph assembly and linking make node relationships and lookup state available for planning and checks.
- Graph indexes preserve surface-local section order and parent-child relationships, but they do not yet provide direct lookup by `surfaceId + stableSlug`.
- Core checks run after normalized truth and linked graph truth exist.
- Planned surfaces then flow through markdown renderers, where `authoredBlocksToDocBlocks(...)` lowers authored doctrine into plain paragraph, list, table, and code-block nodes.
- There is currently no semantic inline resolution step between authored prose and doc-node creation.

## 4.3 Object model + key abstractions
- Graph-backed doctrine truth already exists for:
  - roles
  - workflow steps
  - review gates
  - packet contracts
  - artifacts
  - surfaces
  - surface sections
  - references
  - generated targets
- Surface sections already carry durable composition identity through `stableSlug`.
- Registries are canonical lookup truth, but not graph nodes.
- Template-level section keys and helper conventions do not survive as first-class compiler truth after lowering.
- Some renderers already behave as if section families are canonical:
  - role homes assume `read-first` and `role-contract`
  - shared entrypoints assume `project-home-map` and `read-order`

## 4.4 Observability + failure behavior today
- The compiler is already good at failing on graph or setup-shape problems that it can see structurally.
- The compiler is not good at failing on prose drift inside authored doctrine strings.
  - rename or delete an artifact mentioned in prose and the raw text still compiles
  - change a sanctioned command or env var mentioned only in prose and the raw text still compiles
- Required surface composition is only partially visible today.
  - helper conventions can strongly suggest what belongs in a role home or workflow document
  - but there is no durable first-class compiler contract saying a realized surface must contain specific canonical section slugs
- There is also no sanctioned non-graph operational lookup surface yet.
  - a command mentioned in doctrine is just prose unless a setup-local convention happens to keep it aligned
<!-- arch_skill:block:current_architecture:end -->

## 4.5 UI surfaces (ASCII mockups, if UI work)
- Not applicable.

# 5) Target Architecture (to-be)

<!-- arch_skill:block:target_architecture:start -->
## 5.1 On-disk structure (future)
- `src/core/defs.ts`
  - add `AuthoredInlineTextDef = string | AuthoredInlineSegmentDef[]`
  - add `AuthoredInlineSegmentDef = string | AuthoredInlineRefDef`
  - add one internal inline-ref union:
    - node-backed refs for graph truth
    - section refs keyed by `surfaceId + stableSlug`
    - catalog-backed refs for sanctioned operational truth
  - widen only the authored text fields that matter for doctrine prose in v1:
    - `paragraph.text`
    - `AuthoredListItem.text`
    - definition-list `term`
    - definition-list `definitions` via `AuthoredListEntry`
  - leave table cells, code blocks, example titles, and fragment markdown strings untouched in v1
  - add one setup-level catalog surface for sanctioned non-graph targets
  - add one surface-level required-composition contract as `requiredSectionSlugs?: string[]`
- `src/source/builders.ts`
  - keep raw strings as shorthand
  - add helper inputs for inline refs, command catalogs, and `requiredSectionSlugs`
  - expose a small readable sugar layer:
    - `artifactRef(id)`
    - `surfaceRef(id)`
    - `sectionRef({ surfaceId, stableSlug })`
    - `roleRef(id)`
    - `commandRef(id)`
  - those helpers must lower to one internal ref shape rather than creating five different runtime contracts
  - do not allow author-provided display overrides in the public helper layer
- `src/source/schemas.ts` and `src/source/normalize.ts`
  - validate and preserve the new inline-ref, catalog, and required-section truth
- `src/source/templates.ts` and `src/source/projections.ts`
  - may expose helper sugar like `requiredSections`
  - must lower helper intent into durable surface truth rather than becoming the source of truth themselves
- `src/core/graph.ts`, `src/graph/indexes.ts`, `src/graph/queries.ts`
  - add lookup helpers for:
    - section resolution by `surfaceId + stableSlug`
    - command catalog resolution by kind and entry id
- `src/checks/core-rules.ts`
  - owns fail-loud semantic diagnostics for broken refs and missing required section slugs
- `src/markdown/renderers/common.ts`
  - resolves inline refs to canonical display text before doc-node creation
- `src/doc/**`
  - explicit non-change in v1

## 5.2 Control paths (future)
- Authors write normal doctrine blocks with strings and occasional typed inline refs in TypeScript-authored setup code.
- Source validation and normalization preserve:
  - inline-ref segments in supported authored text fields
  - command catalog definitions
  - `surface.requiredSectionSlugs`
- Graph assembly exposes two lookup paths:
  - graph-backed doctrine nodes
  - catalog-backed sanctioned commands
- Core checks validate:
  - referenced targets exist
  - referenced targets are of the expected family
  - section refs resolve to real `surface_section` nodes by `surfaceId + stableSlug`
  - required surface section slugs are present on realized surfaces
- Markdown rendering resolves inline refs into canonical display text before creating paragraph or list doc nodes.
  - node-backed refs display via canonical node truth
  - section refs display via canonical section title
  - command refs display via the command catalog entry's canonical display value
- Markdown emission remains plain; no semantic markdown nodes or automatic relative links are required in the first slice.

## 5.3 Object model + abstractions (future)
- Authored inline text becomes additive rather than replacement-only.
  - plain strings stay valid
  - typed refs become small semantic islands inside otherwise normal prose
- The compiler should own one unified ref model, even if author-facing sugar varies.
  - node refs should use canonical node ids and an expected node kind
  - section refs are their own ref branch because their stable public identity is `surfaceId + stableSlug`, not a generated section id
  - graph-backed refs can therefore point at canonical doctrine entities already in the graph, including artifacts, surfaces, roles, workflow steps, review gates, packet contracts, references, and generated targets
  - catalog refs should use catalog kind plus entry id, with one command catalog kind in v1
  - author-provided display overrides stay out of scope so rendered text always comes from canonical truth
- The first sanctioned catalog shape should be explicit and narrow.
  - `CatalogDef` should stay distinct from `RegistryDef`
  - v1 should prove `catalogKind: "command"` only
  - catalog entries should carry:
    - `id`
    - `display`
    - optional `description`
- Section refs should stay canonical and boring in v1.
  - `sectionRef(...)` should target `{ surfaceId, stableSlug }`
  - examples should prefer explicit surface ids plus stable slugs when a section is intended to be referenced inline
  - do not make authors depend on generated section ids in the first slice
- Surface composition law becomes first-class surface data.
  - the durable contract should be keyed by `stableSlug`, because that is the compiler-visible family identity that survives helper lowering
  - the v1 contract should be presence-only:
    - `requiredSectionSlugs?: string[]`
  - do not add order or parent-shape assertions until a later plan proves they are needed
  - template helper keys may remain ergonomic sugar, but they cannot be the canonical enforcement target
- Registries and evidence remain adjacent consumers.
  - registries should continue to serve constrained value sets
  - trust or support bundles can later reuse the same typed-ref and contract model rather than growing a disconnected schema family

## 5.4 Invariants and boundaries
- Keep fragments plain and string-only in v1.
- Keep markdown output plain in v1.
- Resolve inline refs to canonical display text in the renderer boundary before doc-node creation.
- Defer automatic markdown links and relative-link policy until a later plan proves they are worth the complexity.
- Prove only one non-graph catalog-backed family in v1, and make it `command`.
- Fail loudly on:
  - missing graph-backed refs
  - missing catalog-backed refs
  - node-kind mismatches on refs
  - missing section refs by `surfaceId + stableSlug`
  - missing required section slugs on realized surfaces
- Do not overload `setup.registries[]` into operational catalogs.
- Do not make helper-only composition assertions the compiler source of truth.
- Do not let phase planning reopen the public doctrine surface:
  - graph refs use canonical node ids
  - section refs use `surfaceId + stableSlug`
  - command refs use catalog entries
  - required composition uses section slugs on surfaces
<!-- arch_skill:block:target_architecture:end -->

## 5.5 UI surfaces (ASCII mockups, if UI work)
- Not applicable.

# 6) Call-Site Audit (exhaustive change inventory)

<!-- arch_skill:block:call_site_audit:start -->
## 6.1 Change map (table)

| Area | File | Symbol / Call site | Current behavior | Required change | Why | New API / contract | Tests impacted |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Authored inline-text source model | `src/core/defs.ts` | `AuthoredListItem`, `AuthoredListEntry`, `AuthoredDefinitionListItem`, `AuthoredSimpleContentBlock`, `SurfaceDef` | Inline prose is string-only. Surfaces do not carry required section contracts. | Add additive inline-text and inline-ref defs, add command catalog defs, and add `SurfaceDef.requiredSectionSlugs`. | This is the compiler SSOT for drift-sensitive doctrine facts. | `AuthoredInlineTextDef`, `AuthoredInlineRefDef`, `CatalogDef`, `CatalogEntryDef`, `SurfaceDef.requiredSectionSlugs` | `test/source/nodes.test.ts`, `test/source/normalize.test.ts`, `test/types/authoring.test.ts` |
| Public authoring helpers | `src/source/builders.ts` | `SurfaceInput`, `SetupInput`, helper exports | No inline-ref helpers, no command catalogs, no required-section input on surfaces. | Add `CatalogInput`, `SurfaceInput.requiredSectionSlugs`, and sugar helpers `artifactRef`, `surfaceRef`, `sectionRef`, `roleRef`, `commandRef`. | Readable authored TS is part of the North Star; raw object literals are too easy to avoid using. | Small sugar layer over one internal inline-ref union; `sectionRef({ surfaceId, stableSlug })` is the public section shape | `test/types/authoring.test.ts`, new `test/fixtures/source/typed-doctrine-refs.ts` |
| Source validation | `src/source/schemas.ts` | `listEntrySchema`, `definitionListItemSchema`, `simpleContentBlockSchema`, `surfaceSchema`, `setupSchema` | Validates string-only authored text and current surface/setup shape. | Validate inline-text unions, command catalogs, and `requiredSectionSlugs` shape. | Shape failures should fail before graph and check phases. | Inline-ref schemas plus command-catalog schema | `test/source/nodes.test.ts` |
| Normalization | `src/source/normalize.ts` | surface and surface-section normalization flow | Passes authored prose through unchanged and has no catalog or required-section preservation. | Preserve inline refs, command catalogs, and `requiredSectionSlugs` into normalized defs without rendering them early. | The normalized setup is the one planning and checking truth. | No rendering logic here; preserve only | `test/source/normalize.test.ts` |
| Graph-adjacent catalog and section lookup | `src/core/graph.ts`, `src/graph/indexes.ts`, `src/graph/queries.ts` | Graph has node lookups plus registry lookup state. No operational catalog lookup and no direct lookup for section family identity by `surfaceId + stableSlug`. | Add command-catalog lookup maps and section-family lookup helpers adjacent to existing registry and node lookup state. | Command refs need compiler-visible canonical truth without pretending commands are graph nodes, and section refs need compiler-owned identity that does not leak generated ids. | Distinct catalog lookup path plus section lookup by `surfaceId + stableSlug`; registries stay separate | `test/graph/indexes.test.ts`, new query coverage, new `test/checks/typed-inline-refs.test.ts` |
| Surface composition truth | `src/core/defs.ts`, `src/source/builders.ts` | Required section families are only implicit in helpers and renderer assumptions. | Add `requiredSectionSlugs?: string[]` on surfaces. | Composition law must survive helper lowering and be checkable generically. | Presence-only slug contract on realized surfaces | `test/source/nodes.test.ts`, `test/source/normalize.test.ts` |
| Template sugar and lowering | `src/source/templates.ts`, `src/source/projections.ts` | Template keys and section arrays lower into ordinary setup truth, but required families are not preserved. | Add helper sugar like `requiredSections` keyed by template section keys and lower it into `surface.requiredSectionSlugs` via stable slugs. | Helpers should stay ergonomic without becoming the compiler SSOT. | Helper-local key to stable-slug lowering only | `test/source/templates.test.ts` |
| Core ref checks | `src/checks/core-rules.ts`, `src/checks/index.ts` | Checks do not inspect inline prose or command catalogs. | Add diagnostics for missing node refs, wrong-kind node refs, missing section refs by `surfaceId + stableSlug`, missing command catalogs, and missing command entries. | This is the main North Star enforcement layer. | Fail-loud `check.inline_ref.*` diagnostics | new `test/checks/typed-inline-refs.test.ts` |
| Core composition checks | `src/checks/core-rules.ts`, `src/checks/index.ts` | Surface checks enforce section integrity but not required section families. | Add diagnostics when a realized surface omits a slug declared in `requiredSectionSlugs`. | Role-home and workflow-owner structure should fail loudly when canonical sections are missing. | Fail-loud `check.surface.missing_required_section` diagnostics | `test/checks/surfaces.test.ts` |
| Render boundary | `src/markdown/renderers/common.ts` | `authoredBlocksToDocBlocks(...)` and list helpers stringify only raw strings. | Add inline-text resolution helpers that turn refs into canonical display text before doc-node creation. | This keeps the doc AST plain while still making doctrine text compiler-visible. | `resolveInlineText(...)`-style helper; section refs render via canonical section title, no auto-links | `test/e2e/authored-content.test.ts`, `test/render/role-home-shared.test.ts` |
| Doc AST explicit non-change | `src/doc/ast.ts`, `src/doc/builders.ts`, `src/doc/markdown.ts` | Plain string AST and markdown emission. | Keep unchanged in v1. | Avoid a larger AST rewrite that the North Star does not need. | Explicit non-change | no dedicated change unless implementation drifts |
| Fragment boundary explicit non-change | `src/source/fragments.ts` | Plain fragment loader and markdown fragment composition. | Keep unchanged in v1. | Fragment parsing is explicitly out of scope for the first cut. | Explicit non-change | no dedicated change unless implementation drifts |
| Public docs and examples | `README.md`, `docs/schema.md`, `docs/requirements.md`, `docs/architecture.md`, `docs/testing.md`, `docs/example_editorial.md`, `docs/example_typed_runtime_law.md` | Docs explain editorial and registry/evidence, but not typed refs plus required composition as a first-class public story. | Update core docs and examples, and add one new typed-ref plus composition walkthrough. | Public doctrine surface changes must be teachable without reading the plan doc. | New public example centered on typed refs and required composition | doc-only verification |
| Proof fixtures and end-to-end examples | `test/fixtures/source/registry-evidence.ts`, new `test/fixtures/source/typed-doctrine-refs.ts` | Registry/evidence fixture proves a different slice; authored-content e2e uses only raw strings today. | Keep registry/evidence as adjacent proof and add one dedicated typed-ref plus composition fixture. | The new feature needs its own generic proving case. | Synthetic typed-ref proving fixture | `test/e2e/authored-content.test.ts`, new `test/checks/typed-inline-refs.test.ts` |

## 6.2 Migration notes
- Deprecated APIs:
  - none in the first slice
  - raw strings remain valid authored prose where drift-proofing is not needed
- Adoption rule:
  - drift-sensitive prose in markdown fragments moves into TypeScript-authored doctrine blocks first
  - fragment-safe ref syntax is explicitly deferred unless a later plan reopens that boundary
- Expected early migration pressure:
  - authored-content type definitions and schemas
  - common renderer text-lowering helpers
  - template helpers that currently imply required composition only by convention
  - public examples that need to move drift-sensitive lines out of fragments and into TS-authored blocks
- Delete list:
  - no broad fragment-safe ref syntax in the first implementation slice
  - no doc-AST inline rewrite in v1
  - no automatic relative-link rendering in v1
  - no overloading of `setup.registries[]` into a generic operational catalog system
  - no template-only required-section enforcement without durable surface truth
  - no Lessons-shaped public examples or target families in `src/**`

## 6.3 Pattern Consolidation Sweep (anti-blinders; scoped by plan)

| Area | File / Symbol | Pattern to adopt | Why (drift prevented) | Proposed scope |
| --- | --- | --- | --- | --- |
| Role-home canonical families | `src/markdown/renderers/role-home.ts`, `setups/editorial/surfaces.ts`, `setups/release_ops/surfaces.ts` | Treat `read-first` and `role-contract` as required-section consumers once the surface contract exists. | Role homes already encode these families as meaningful fallback sections; they should not remain convention-only. | include |
| Shared-entrypoint canonical families | `src/markdown/renderers/shared-entrypoint.ts`, `setups/editorial/surfaces.ts`, `setups/release_ops/surfaces.ts` | Treat `project-home-map` and `read-order` as required-section consumers where the proving templates own them. | These renderers already assume those slugs are canonical. | include |
| Workflow-owner proving families | `src/source/templates.ts`, `setups/editorial/surfaces.ts`, `setups/release_ops/surfaces.ts` | Add `requiredSections` sugar on workflow-owner templates and prove it against canonical workflow-owner section families in setups. | The user-facing North Star explicitly includes workflow-owner structure, and the current proving setups already name these families even though the renderer does not auto-fill them. | include |
| Template helpers | `src/source/templates.ts` | Add `requiredSections` sugar on role-home and workflow-owner templates first, then extend to other document families only if it stays clean. | This is where current conventions are authored, but the lowered truth still needs to stay surface-local and slug-based. | include |
| Public proving example | `docs/example_editorial.md` | Cross-link to the new typed-ref plus composition example without pretending editorial already proves it. | Prevents docs drift and keeps the proving stories honest. | include |
| Typed runtime-law example | `docs/example_typed_runtime_law.md` | Mention typed refs and composition as adjacent follow-on consumers, not the same feature. | Prevents the old registry/evidence slice from being mistaken for the new one. | include |
| Registry and evidence slice | `src/core/defs.ts`, `docs/example_typed_runtime_law.md`, `test/fixtures/source/registry-evidence.ts` | Reuse the new inline-ref and catalog language later only where it simplifies that slice. | Avoids parallel truth models without forcing unnecessary churn into this implementation. | defer |
| Additional operational families | future command-like catalogs for `env_var`, `path`, `endpoint` | Reuse the same catalog contract only after command refs prove the seam is still small. | Prevents early scope explosion. | defer |
| Table cells and example titles | authored-content schemas and renderers | Keep string-only in v1. | They are not required to satisfy the North Star. | exclude |
| Fragment markdown parsing | `src/source/fragments.ts` | Keep excluded from typed ref support in v1. | Reopening fragments would violate the current product boundary. | exclude |
<!-- arch_skill:block:call_site_audit:end -->

# 7) Depth-First Phased Implementation Plan (authoritative)

> Rule: systematic build, foundational first; every phase has exit criteria + explicit verification plan (tests optional). No fallbacks/runtime shims - the system must work correctly or fail loudly (delete superseded paths). Prefer programmatic checks per phase; defer manual/UI verification to finalization. Avoid negative-value tests (deletion checks, visual constants, doc-driven gates). Also: document new patterns/gotchas in code comments at the canonical boundary (high leverage, not comment spam).

<!-- arch_skill:block:phase_plan:start -->
## Phase 1 — Source Contracts And Lookup Substrate

Status: COMPLETE

Completed work:
- Added additive inline-text and inline-ref defs, command-backed catalog defs, and `surface.requiredSectionSlugs` in the core source model.
- Added authoring helpers for `artifactRef`, `surfaceRef`, `sectionRef`, `roleRef`, `commandRef`, and `command(...)`.
- Extended source validation and normalization for inline text, command catalogs, and required section contracts.
- Added graph-adjacent command lookup plus section lookup by `surfaceId + stableSlug`.
- Added targeted source, type, and graph tests that prove the new substrate directly.

* Goal:
  - Land the compiler-owned truth surfaces for typed refs, command catalogs, required section families, and section-family lookup without reopening fragments or the doc AST.
* Work:
  - Extend `src/core/defs.ts` with additive inline-text and inline-ref defs, command catalog defs, and `SurfaceDef.requiredSectionSlugs`.
  - Extend `src/source/builders.ts`, `src/source/schemas.ts`, and `src/source/normalize.ts` with the additive public input surface:
    - inline text in supported doctrine fields
    - `command` catalog input
    - `requiredSectionSlugs`
    - thin helper sugar for `artifactRef`, `surfaceRef`, `sectionRef`, `roleRef`, and `commandRef`
  - Extend `src/core/graph.ts`, `src/graph/indexes.ts`, and `src/graph/queries.ts` with:
    - command catalog lookup
    - section lookup by `surfaceId + stableSlug`
  - Keep `src/source/fragments.ts` and `src/doc/**` unchanged.
* Verification (smallest signal):
  - `npx vitest run test/source/nodes.test.ts test/source/normalize.test.ts test/types/authoring.test.ts test/graph/indexes.test.ts`
  - `npm run typecheck`
* Docs/comments (propagation; only if needed):
  - Add short boundary comments in `src/core/defs.ts` and the section-lookup helper explaining why section refs use `surfaceId + stableSlug` and why display text is renderer-owned.
* Exit criteria:
  - The new authored and normalized source shapes compile cleanly.
  - Command lookup and section-family lookup exist as compiler truth.
  - No fragment parsing, env-var catalogs, or doc-AST rewrites have slipped in.
* Rollback:
  - Revert the additive source and graph lookup surface as one slice before later phases adopt it.

## Phase 2 — Fail-Loud Enforcement

Status: COMPLETE

Completed work:
- Added `check.inline_ref.*` diagnostics for missing graph-backed refs, wrong-kind refs, missing section refs, missing command catalogs, and missing command entries.
- Added catalog duplicate diagnostics so the command-backed lookup seam cannot silently collapse to ambiguous truth.
- Added `check.surface.missing_required_section` for realized surfaces that omit declared canonical section families.
- Added dedicated check coverage for typed refs and extended surface-check coverage for required sections.

* Goal:
  - Make the new public surface trustworthy by rejecting broken refs and missing required section families in the check phase before render.
* Work:
  - Add `check.inline_ref.*` diagnostics in `src/checks/core-rules.ts` for:
    - missing node refs
    - wrong-kind node refs
    - missing section refs by `surfaceId + stableSlug`
    - missing command catalogs
    - missing command entries
  - Add `check.surface.missing_required_section` diagnostics for realized surfaces that omit a declared required slug.
  - Keep registry behavior and fragment behavior unchanged.
  - Add the dedicated ref-check proof coverage promised in Section 6.
* Verification (smallest signal):
  - `npx vitest run test/checks/surfaces.test.ts test/checks/typed-inline-refs.test.ts test/graph/indexes.test.ts`
  - `npm run typecheck`
* Docs/comments (propagation; only if needed):
  - Add one short comment near the new ref-check entry point explaining that typed refs must fail in `check`, not at markdown emission time.
* Exit criteria:
  - Broken refs and missing required sections fail deterministically in `check`.
  - Renderer code is not yet carrying enforcement responsibility that belongs in the checks layer.
* Rollback:
  - Revert the new diagnostics as one slice if error taxonomy or lookup semantics need redesign before adoption.

## Phase 3 — Render From Truth And Prove The Authored Experience

Status: COMPLETE

Completed work:
- Added renderer-boundary inline-text resolution so typed refs become plain markdown before doc-node creation.
- Rendered graph-backed refs from canonical node and section truth and rendered command refs from catalog-backed display truth.
- Added a dedicated typed-ref proving fixture and wired it into render and e2e coverage.
- Proved paragraphs, list items, and definition-list terms render cleanly from typed refs without changing the plain doc AST.

* Goal:
  - Turn valid typed refs into plain markdown from canonical truth while keeping the doc AST plain.
* Work:
  - Add inline-text resolution helpers in `src/markdown/renderers/common.ts` for:
    - paragraph text
    - list item text
    - definition-list terms and definitions
  - Render:
    - node refs from canonical node truth
    - section refs from canonical section titles
    - command refs from canonical command display values
  - Keep auto-links and relative-link policy explicitly out of scope.
  - Add the dedicated proving fixture:
    - `test/fixtures/source/typed-doctrine-refs.ts`
  - Update end-to-end and renderer tests so the typed authored experience is proven with plain markdown output.
* Verification (smallest signal):
  - `npx vitest run test/e2e/authored-content.test.ts test/render/role-home-shared.test.ts`
  - `npm run typecheck`
* Docs/comments (propagation; only if needed):
  - Add one short comment near the inline-text resolver explaining why refs resolve before doc-node creation and why the doc AST remains plain in v1.
* Exit criteria:
  - Typed refs render to plain markdown with canonical display text.
  - Raw-string doctrine still renders unchanged where no typed refs are used.
  - No auto-linking or fragment parsing has been added.
* Rollback:
  - Revert renderer resolution plus the typed-ref proving fixture without disturbing the underlying source and check contracts.

## Phase 4 — Adopt Required Composition In Templates And Proving Setups

Status: COMPLETE

Completed work:
- Added `requiredSections` sugar on template definitions and lowered it to slug-based `surface.requiredSectionSlugs`.
- Adopted the lowered contract in role-home and workflow-owner proving templates.
- Extended the same contract to project-home-root and shared-entrypoint proving templates because the implementation stayed trivial and those renderer families already assumed canonical section families.
- Proved the lowering and proving-setup adoption in template, render, and e2e coverage without changing rendered markdown contracts.

* Goal:
  - Move required section families out of helper convention and into durable surface truth for the main proving surfaces.
* Work:
  - Add `requiredSections` sugar in `src/source/templates.ts` and lower it to `surface.requiredSectionSlugs`.
  - Adopt that sugar first for:
    - role-home templates
    - workflow-owner templates
  - Update proving setups in `setups/editorial/surfaces.ts` and `setups/release_ops/surfaces.ts` to declare the canonical families already named in Section 6.
  - Keep broader adoption for packet workflows, standards, gates, and other families out unless the implementation remains obviously clean.
* Verification (smallest signal):
  - `npx vitest run test/source/templates.test.ts test/render/role-home-shared.test.ts test/e2e/editorial-vertical-slice.test.ts test/e2e/release-ops.test.ts`
  - `npm run typecheck`
* Docs/comments (propagation; only if needed):
  - Add one short comment in `src/source/templates.ts` explaining that helper-local section keys are ergonomic only and that required composition lowers to slug-based surface truth.
* Exit criteria:
  - Role-home and workflow-owner composition is compiler-visible rather than convention-only.
  - The proving setups exercise required section families without relying on helper-local keys as SSOT.
* Rollback:
  - Revert template sugar and proving-setup adoption together if the sugar shape proves awkward, while preserving the lower-level surface contract.

## Phase 5 — Public Docs, Example Adoption, And Final Verification

Status: COMPLETE

Completed work:
- Updated public docs and examples so the repo now teaches typed refs, command-backed catalogs, required section contracts, and the fragment migration rule explicitly.
- Reframed the generic runtime-law example so registries, evidence, typed refs, and required composition now read as one coherent framework surface.
- Added the final proving fixture references to the public docs and testing plan.
- Finished the final verification sweep, including a repo-wide `npm test`, without reopening the fragment boundary or widening the doc AST.

* Goal:
  - Teach the feature honestly, make the fragment adoption rule concrete in examples, and finish with the smallest honest verification sweep.
* Work:
  - Update public docs:
    - `README.md`
    - `docs/schema.md`
    - `docs/requirements.md`
    - `docs/architecture.md`
    - `docs/testing.md`
    - `docs/example_editorial.md`
    - `docs/example_typed_runtime_law.md`
  - Add or update one public example that shows:
    - typed refs in normal TS-authored doctrine
    - required composition on generated surfaces
    - drift-sensitive prose moved out of fragments and into TS-authored blocks where needed
  - Do the final code-comment sweep only at the canonical boundaries already named in earlier phases.
  - Run the honest final verification set for this slice.
* Verification (smallest signal):
  - `npx vitest run test/source/nodes.test.ts test/source/normalize.test.ts test/types/authoring.test.ts test/graph/indexes.test.ts test/checks/surfaces.test.ts test/checks/typed-inline-refs.test.ts test/source/templates.test.ts test/e2e/authored-content.test.ts test/render/role-home-shared.test.ts test/e2e/editorial-vertical-slice.test.ts test/e2e/release-ops.test.ts`
  - `npm run typecheck`
  - `npm run build`
  - Run `npm test` only if the close-out needs a repo-wide green claim; otherwise report targeted verification only.
* Docs/comments (propagation; only if needed):
  - Ensure the public docs explicitly say that fragments stay plain in v1 and that drift-sensitive fragment prose moves into TS-authored doctrine blocks first.
* Exit criteria:
  - The feature is implemented, documented, and proven without reopening fragments, env-var catalogs, or doc-AST inline nodes.
  - The public story and proving fixtures match the same exact surface described in Section 5.
* Rollback:
  - Revert public docs and proving-example adoption separately from core code only if the framework surface itself remains correct and the teaching story needs another pass.
<!-- arch_skill:block:phase_plan:end -->

# 8) Verification Strategy (common-sense; non-blocking)

## 8.1 Unit tests (contracts)
- Prefer source-shape and renderer-shape tests over broad golden churn.
- Verify missing refs, renamed refs, and missing required sections directly.

## 8.2 Integration tests (flows)
- Prefer one or two compile or render flows that prove typed refs survive to readable markdown and fail loudly when targets disappear.
- Prefer the targeted suites named in Section 7 over broad repo churn; only claim repo-wide green if `npm test` is actually run.

## 8.3 E2E / device tests (realistic)
- No device testing expected.

# 9) Rollout / Ops / Telemetry

## 9.1 Rollout plan
- Keep the surface additive.
- Expect existing raw-string doctrine to coexist until setups adopt typed refs where drift matters most.

## 9.2 Telemetry changes
- Likely none beyond deterministic diagnostics.

## 9.3 Operational runbook
- Public docs and examples must land with the feature.

# 10) Decision Log (append-only)

## 2026-04-02 - Start a new plan centered on typed doctrine references and required composition

Context
- The earlier registry-and-evidence plan shipped one useful slice, but user feedback clarified that the higher-value generic capability is broader:
  - important facts inside human-written doctrine need a typed way to stop being raw strings
  - required canonical document structure needs framework-level enforcement

Options
- Keep iterating only on registry and evidence modeling.
- Treat typed refs and composition as downstream local cleanup.
- Start a fresh architecture plan around typed inline references and required document composition, with registries, trust bundles, and optional operational catalogs treated as adjacent consumers of the same capability.

Decision
- Start a fresh plan.
- Treat typed inline refs and required document composition as the new primary architecture problem.
- Keep the new plan generic, fail-loud, and intentionally small.

Consequences
- This plan supersedes the earlier direction as the next framework-first investigation.
- The next honest move is `research`, not implementation.

Follow-ups
- Confirm the North Star before deeper planning.

## 2026-04-02 - North Star confirmed for typed refs plus required composition

Context
- The draft artifact proposed two primary framework moves:
  - one unified typed inline-reference mechanism for doctrine authored in TypeScript blocks
  - one declarative required-composition contract for generated doctrine surfaces
- The remaining question was whether that direction was the right framework-first answer, especially given the deliberate decision to keep markdown fragments plain in the first implementation cut.

Decision
- Confirm the North Star as written.
- Keep the fragment boundary explicit:
  - v1 adopts drift-sensitive prose by moving those statements into TypeScript-authored doctrine blocks
  - any fragment-safe reference syntax is a narrow later follow-up, not part of the first move
- Keep registries, trust bundles, and optional operational catalogs framed as consumers of the same core capability instead of separate architecture centers.

Consequences
- The plan artifact is now `active`.
- Later planning can assume:
  - one unified ref model must cover graph-backed and catalog-backed targets
  - required document composition is the second core primitive
  - the migration story for fragment-authored drift-sensitive prose must stay explicit

Follow-ups
- Run `$arch-step research` next.

## 2026-04-02 - Repo-grounded research and first deep-dive resolve toward inline refs plus surface contracts

Context
- The user asked for a combined `research` and `deep-dive` pass and explicitly asked to use parallel agents.
- Repo inspection and the parallel-agent split pressure-tested three possible centers of gravity:
  - inline typed refs first
  - required composition first
  - catalogs or registry-like lookup state first
- The important repo findings were:
  - authored doctrine text is still string-terminal in `src/core/defs.ts`
  - `src/markdown/renderers/common.ts` already has the clean authored-content lowering seam
  - template keys do not survive lowering, but `surface_section.stableSlug` does
  - `check` is already the right enforcement layer for cross-surface semantic law
  - fragments are intentionally plain and should stay that way in the first cut

Options
- Widen the doc AST and markdown renderer to carry semantic inline nodes end to end.
- Add helper-only assertions for required sections and keep composition law out of durable surface truth.
- Add one additive authored inline-ref model, one surface-level required-section contract, and one graph-adjacent catalog seam for sanctioned non-graph refs.

Decision
- Resolve the plan toward:
  - additive inline refs in authored TypeScript doctrine
  - renderer-boundary resolution to canonical display text before doc-node creation
  - surface-level required composition keyed by section `stableSlug`
  - one unified ref model that can resolve graph-backed or catalog-backed targets
  - one operational catalog family only in v1
- Explicitly defer:
  - doc-AST rewrites
  - automatic markdown links
  - fragment-safe ref syntax
  - overloading registries into the operational catalog story

Consequences
- The architecture stays framework-first and generic without encoding Lessons-specific nouns.
- The v1 design now has a concrete migration rule:
  - drift-sensitive fragment prose moves into TypeScript-authored doctrine blocks first
- The next honest move is `phase-plan`, not more open-ended design drift.

Follow-ups
- Write the authoritative phase plan around:
  - authored inline-text source changes
  - surface composition contracts
  - graph-adjacent catalog lookup
  - core checks
  - render-boundary resolution

## 2026-04-02 - Second deep-dive closes the remaining implementation-shaping choices

Context
- The plan already had the right center of gravity, but it still left a few choices open that would force `phase-plan` to keep designing instead of sequencing:
  - whether the public ref API should be generic-only or include sugar
  - which non-graph family should prove the catalog seam first
  - whether section refs should use ids or slug-plus-context resolution
  - whether the call-site audit was specific enough to later prove completeness

Options
- Leave those choices open and let `phase-plan` decide them.
- Resolve them now using repo evidence from the authored-content model, renderer boundary, template lowering, and surface checks.

Decision
- Resolve the public authoring surface to:
  - one internal inline-ref model
  - a very small sugar layer for `artifactRef`, `surfaceRef`, `sectionRef`, `roleRef`, and `commandRef`
- Resolve the first non-graph family to `command`.
- Resolve section refs to canonical `surface_section.id` in v1.
- Tighten Section 6 into an audit-ready change map plus a pattern-consolidation sweep.

Consequences
- The target architecture is now specific enough that `phase-plan` should not need to invent new contracts or reopen public API choices.
- The remaining phase-plan work is sequencing, verification sizing, and implementation slicing.
- External research remains non-blocking because the main architectural decisions are now grounded in local code.

Follow-ups
- Write the authoritative phase plan next.

## 2026-04-02 - Second deep-dive closes the remaining public-surface decisions

Context
- The first repo-grounded deep-dive left a few choices open that would otherwise leak into phase planning:
  - whether public authoring should expose a generic `ref(...)` object or readable family-specific helpers
  - whether the first non-graph proving family should be `command` or `env_var`
  - whether section refs should use section ids or slug-plus-context shorthand
- A second repo-only pass revisited the current authored-content model, template lowering, renderer seams, and proving tests to close those questions before Section 7 is written.

Options
- Leave the public API and catalog family open until phase planning.
- Choose a generic object-literal ref API and let authored setups build their own sugar.
- Close the public surface now with one narrow sugar layer, one narrow catalog family, and one exact section-identity rule.

Decision
- Close the public v1 surface now.
- Public authoring should use a small sugar layer:
  - `artifactRef(...)`
  - `surfaceRef(...)`
  - `sectionRef(...)`
  - `roleRef(...)`
  - `commandRef(...)`
- The internal model remains one unified inline-ref union for:
  - node-backed refs
  - catalog-backed refs
- The first non-graph catalog-backed family is `command`.
- Section refs use canonical `surface_section.id`.
- Required composition uses `surface.requiredSectionSlugs`.

Consequences
- Section 5 is now concrete enough that phase planning should not need to invent public contracts.
- Section 6 can now name exact symbols, new test files, and the real pattern-consolidation sweep.
- The plan still satisfies the North Star without reopening fragments, registries, or the doc AST.

Follow-ups
- Write Section 7 against this exact surface.

## 2026-04-02 - Section refs shift from generated ids to surface-plus-slug identity

Context
- The earlier deep-dive tightening pass correctly closed most public-surface questions, but it still resolved section refs to canonical `surface_section.id`.
- A final repo-only review against the North Star exposed the problem with that choice:
  - generated section ids are durable graph ids, but they are not the most elegant author-facing identity
  - template helpers can derive those ids, which would leak lowering details back into authored doctrine
  - the actual family identity that survives helper lowering is `surfaceId + stableSlug`

Options
- Keep section refs keyed by canonical `surface_section.id`.
- Change section refs to use `{ surfaceId, stableSlug }` while keeping required composition slug-based on surfaces.

Decision
- Change the public section-ref contract to `{ surfaceId, stableSlug }`.
- Keep `requiredSectionSlugs` on surfaces as the composition contract.
- Require graph/index query support for resolving section refs by `surfaceId + stableSlug` before render and check phases.

Consequences
- The public doctrine surface is now more aligned with the author's mental model and less coupled to helper-lowered ids.
- Phase planning should treat section-family lookup as an explicit implementation task in graph indexes, queries, checks, and renderer helpers.
- The North Star is better satisfied because authors reference canonical section families instead of generated implementation ids.

Follow-ups
- Write Section 7 against the `sectionRef({ surfaceId, stableSlug })` contract, not `sectionRef(id)`.

## 2026-04-02 - Authoritative v1 public surface is now closed for phase planning

Context
- After the repo-only deep-dive passes, the remaining risk was not architecture discovery but accidental re-interpretation:
  - one decision-log entry still reflected an earlier id-based section-ref choice
  - the plan needed one final authoritative statement of the public doctrine surface before Section 7 is written

Decision
- Treat this as the authoritative v1 public surface for phase planning:
  - public authoring uses a small sugar layer over one internal inline-ref model
  - section refs use `{ surfaceId, stableSlug }`
  - graph refs use canonical node ids plus expected node kind
  - the first non-graph catalog family is `command`
  - required composition uses `surface.requiredSectionSlugs`
  - typed refs do not accept author-provided display overrides in v1

Consequences
- Section 7 should sequence implementation, not reopen public-surface design.
- Any earlier id-based section-ref mention is superseded by the surface-plus-slug decision.
- The plan now meets the North Star quality bar for “fully specify before phase planning.”

Follow-ups
- Write the authoritative phase plan next.

## 2026-04-02 - Section 7 is now the authoritative execution checklist

Context
- The architecture and call-site audit were finally specific enough that execution order no longer needed more design work.
- The remaining risk was sequencing drift:
  - section-family lookup must exist before section-ref checks and render resolution can rely on it
  - proving examples must move drift-sensitive prose out of fragments rather than silently leaving the migration story incomplete

Decision
- Write Section 7 as a five-phase, depth-first execution plan:
  - source contracts plus lookup substrate
  - fail-loud enforcement
  - render-from-truth plus typed-ref proving fixture
  - template and proving-setup adoption
  - public docs/examples plus final verification

Consequences
- Section 7 is now the one execution checklist for this plan.
- Later helper passes should sharpen or audit this sequencing, not create a competing implementation list.
- The final verification story is explicit about targeted suites versus repo-wide green claims.

Follow-ups
- The next honest command is `implement`.

## 2026-04-02 - Implementation completed and the repo stayed green

Context
- The implementation run shipped all five planned phases:
  - source contracts and lookup substrate
  - fail-loud enforcement
  - renderer-boundary typed-ref resolution
  - template and proving-setup adoption
  - public docs, examples, and final verification
- The only intentional scope expansion was extending the same
  `requiredSections` contract from role-home and workflow-owner templates to
  project-home-root and shared-entrypoint templates because the framework
  surface did not grow and those renderer families already assumed canonical
  section families.

Decision
- Mark the plan complete.
- Keep the shipped framework surface as:
  - setup-level registries
  - setup-level catalogs, with `command` as the first catalog-backed family
  - typed refs in TypeScript-authored doctrine blocks
  - slug-based required section contracts on surfaces
- Keep fragments plain and the doc AST plain.

Consequences
- Important doctrine mentions no longer need to be raw strings when they are
  authored in TypeScript doctrine blocks.
- Canonical section families now fail loudly when omitted from realized
  surfaces that declare them.
- The repo now teaches the fragment adoption rule explicitly instead of
  leaving migration fuzzy.
- Targeted verification, `npm run build`, and repo-wide `npm test` all passed.

Follow-ups
- None required for this plan artifact.
- Future widening should reuse the same catalog-backed ref model instead of
  adding one-off helpers.
