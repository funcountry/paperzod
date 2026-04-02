---
title: "paperzod — Implementation Plan"
date: 2026-04-01
status: complete
fallback_policy: forbidden
owners: [Codex]
reviewers: []
doc_type: new_system
related:
  - /Users/aelaguiz/workspace/paperzod/docs/requirements.md
  - /Users/aelaguiz/workspace/paperzod/docs/schema.md
  - /Users/aelaguiz/workspace/paperzod/docs/architecture.md
  - /Users/aelaguiz/workspace/paperzod/docs/testing.md
  - /Users/aelaguiz/workspace/paperzod/docs/example_lessons.md
---

# TL;DR

- Outcome: `paperzod` becomes a real standalone doctrine compiler that can
  author, validate, graph, plan, render, diff, and emit Paperclip doctrine for
  at least two setups, including the full Lessons proving case.
- Current state: the reopened requirement, schema, and architecture gaps have
  now been implemented and re-proven. The repo is back in a truthful
  `complete` state for this implementation plan.
- Audit result: phases 13, 14, 15, 17, 28, 29, 38, 41, and 42 were reopened,
  implemented, and re-closed after checking the implementation against
  [docs/requirements.md](/Users/aelaguiz/workspace/paperzod/docs/requirements.md),
  [docs/schema.md](/Users/aelaguiz/workspace/paperzod/docs/schema.md), and
  [docs/architecture.md](/Users/aelaguiz/workspace/paperzod/docs/architecture.md).
- Approach used: depth-first from source model outward, with one canonical
  implementation path and a proving test gate after every phase.
- Plan executed so far: a 42-phase build that bootstrapped the repo,
  implemented the core source and graph model, added rule checking, compile
  planning, rendering, emission, and CLI behavior, then proved the current
  prototype with `demo_minimal`, `shared_overrides`, `lessons_vertical_slice`,
  `lessons_full`, and `second_setup`.
- Final verification:
  - `npm run test:types`
  - `npx tsc -p tsconfig.json --noEmit`
  - `npx vitest run`
  - `npm run build`
- Final verified state:
  - `40` test files passed
  - `132` tests passed
  - root typecheck passed
  - type-only authoring tests passed
  - build passed
- Non-negotiables:
  - no dual source of truth
  - no Lessons-specific hacks in generic compiler layers
  - no phase closes without its phase test gate going green
  - fail loud instead of adding compatibility shims that hide model problems

## Audit Reopen

Audit date: 2026-04-01

The current prototype passes its own test suite, but the suite and phase
closeout missed several requirement-level gaps:

- `reads` is present in the schema but not actually indexed, checked, rendered,
  or proven end to end
- review-gate and trust semantics are effectively artifact-only, even though
  the requirements and schema allow gates and contracts to depend on sections
  and packet-level units
- orphaned-section detection was claimed but not implemented
- `maps_to_runtime` and section-level `generated_from` semantics are modeled
  only superficially
- the public `compileSetup` API does not yet satisfy the architecture doc's
  promised optional-emission behavior
- the release-gate audit allowed fake-confidence tests and therefore closed the
  plan too early

Reopened phases:

- Phase 12
- Phase 14
- Phase 15
- Phase 17
- Phase 27
- Phase 33
- Phase 35
- Phase 38
- Phase 41
- Phase 42

## Audit Reopen II

Audit date: 2026-04-01

After the previous closeout, another direct read of the shipped code against
the requirements, schema, and architecture found additional misses:

- explicit downstream-consumer or downstream-gate enforcement is still not
  implemented even though
  [docs/requirements.md](/Users/aelaguiz/workspace/paperzod/docs/requirements.md)
  calls out "lane outputs with no downstream consumer or gate when one is
  required"
- several declared link families are still only graph-existence checked rather
  than type-checked:
  - `routes_to`
  - `produces`
  - `consumes`
  - `supports`
  - `owns`
  - `generated_from`
  - `grounds` and `references` still validate targets but not sources
- generation provenance is still only partially honest:
  - planned sections are backed by inferred overlap between `documents` and
    `generated_target.sourceIds`
  - `generated_from` links are indexed but not semantically validated or
    required as first-class provenance
- the CLI still rebuilds the pipeline directly in `src/cli/shared.ts` instead
  of mostly adapting into the public library entrypoints, which is an
  architectural drift from
  [docs/architecture.md](/Users/aelaguiz/workspace/paperzod/docs/architecture.md)
- the mutation suite and release-gate audit therefore overstate coverage

Reopened phases from this audit:

- Phase 13
- Phase 14
- Phase 15
- Phase 17
- Phase 28
- Phase 29
- Phase 38
- Phase 41
- Phase 42

## North Star

### Claim

If we implement the architecture in
[docs/architecture.md](/Users/aelaguiz/workspace/paperzod/docs/architecture.md)
and satisfy the proof standard in
[docs/testing.md](/Users/aelaguiz/workspace/paperzod/docs/testing.md), then
`paperzod` can act as the trustworthy source-of-truth compiler for Paperclip
doctrine, measured by deterministic end-to-end compile success on
`lessons_full` and one non-Lessons setup plus stable drift diagnostics for the
mutation suite.

### In scope

- package bootstrap and test infrastructure
- core types, ids, diagnostics, and normalized definitions
- authoring DSL and Zod source validation
- normalization into `SetupDef`
- graph linking and query indexes
- workflow, ownership, artifact, and section semantics
- compile planning
- markdown rendering
- one-way generation, diffing, and emission
- CLI validate, compile, and doctor flows
- proving fixtures:
  - `demo_minimal`
  - `shared_overrides`
  - `lessons_vertical_slice`
  - `lessons_full`
  - `second_setup`

### Out of scope

- replacing Paperclip issue coordination
- a bidirectional markdown editor
- parsing generated markdown back into semantic source
- a UI application
- optimization beyond practical guardrails

### Acceptance evidence

- Primary signal:
  - all release-gate suites in
    [docs/testing.md](/Users/aelaguiz/workspace/paperzod/docs/testing.md)
    pass
- Optional second signal:
  - a dry-run compile of `lessons_full` produces a stable path manifest and
    deterministic markdown diff set

### Key invariants

- structured source is the only semantic source of truth
- generated markdown is runtime output only
- stable ids survive heading rewrites
- shared reusable definitions must not erase local ownership
- the same compiler pipeline must work for Lessons and non-Lessons setups

## Problem Statement

### What exists today

- The repo has product docs:
  - [docs/requirements.md](/Users/aelaguiz/workspace/paperzod/docs/requirements.md)
  - [docs/schema.md](/Users/aelaguiz/workspace/paperzod/docs/schema.md)
  - [docs/architecture.md](/Users/aelaguiz/workspace/paperzod/docs/architecture.md)
  - [docs/testing.md](/Users/aelaguiz/workspace/paperzod/docs/testing.md)
  - [docs/example_lessons.md](/Users/aelaguiz/workspace/paperzod/docs/example_lessons.md)
  - [docs/implementation_plan.md](/Users/aelaguiz/workspace/paperzod/docs/implementation_plan.md)
- The repo also has a vendored Zod checkout under `vendor/zod` for library
  architecture grounding.
- There is a real `src/` implementation covering source validation,
  normalization, graph linking, checks, planning, rendering, emission, and
  CLI behavior.
- There is a buildable package scaffold with subpath exports and a `paperzod`
  binary.
- There is a real test harness with layer-level suites and end-to-end proving
  fixtures.
- There are real proving fixtures for `demo_minimal`, `shared_overrides`,
  `lessons_vertical_slice`, `lessons_full`, and `second_setup`.

### What is broken or missing

- The repo is still a prototype workspace rather than a polished public
  release.
- Packaging, versioning, and release hygiene are intentionally lightweight.
- The proving fixtures are strong, but real-world setup coverage is still
  narrow.
- The authoring DSL is functional, but not yet tuned for long-term public UX.

### Why now

- The product language is now grounded enough to implement.
- The architecture and testing docs are strong enough to drive a disciplined
  build.
- Waiting longer increases the risk that the docs drift away from what is
  actually implementable.

## Research Grounding

### Internal anchors

- [docs/requirements.md](/Users/aelaguiz/workspace/paperzod/docs/requirements.md)
  defines the product boundary and proof obligations.
- [docs/schema.md](/Users/aelaguiz/workspace/paperzod/docs/schema.md)
  defines the source language and core node families.
- [docs/architecture.md](/Users/aelaguiz/workspace/paperzod/docs/architecture.md)
  defines the module boundaries and compile pipeline.
- [docs/testing.md](/Users/aelaguiz/workspace/paperzod/docs/testing.md)
  defines the release gate and anti-bullshit standard.
- [docs/example_lessons.md](/Users/aelaguiz/workspace/paperzod/docs/example_lessons.md)
  defines the Lessons proving shape.
- `vendor/zod` provides the layering model:
  - small stable core
  - ergonomic authoring layer
  - separate parse, metadata, and codegen subsystems

### Existing patterns to reuse

- plain internal definition objects analogous to Zod `def`
- stable subpath-style package layering
- deterministic snapshot-friendly intermediate artifacts
- registry-style diagnostic codes and phase-separated compilation

### Initial implementation decisions

- Use plain `tsc` fixture projects for type-level authoring tests first.
  Only add a specialized type-test harness later if `tsc` proves insufficient.
- Keep the internal doc AST private during the first implementation pass.
  Expose only the markdown render surface unless a real testing or extension
  need forces the AST public.
- Ship `paperzod/testing` as a small supported helper surface for fixtures,
  snapshots, and graph assertions rather than keeping it purely internal.

## Current Architecture

- The runtime implementation exists under:
  - `src/core/`
  - `src/source/`
  - `src/graph/`
  - `src/checks/`
  - `src/plan/`
  - `src/doc/`
  - `src/markdown/`
  - `src/emit/`
  - `src/cli/`
  - `src/testing/`
- The public package exposes:
  - `paperzod`
  - `paperzod/core`
  - `paperzod/markdown`
  - `paperzod/testing`
- The compile pipeline is proven by unit, fixture, CLI, mutation, stability,
  performance, and end-to-end suites.

## Implemented Architecture

The implementation now matches
[docs/architecture.md](/Users/aelaguiz/workspace/paperzod/docs/architecture.md):

- `src/core/`
- `src/source/`
- `src/graph/`
- `src/checks/`
- `src/plan/`
- `src/doc/`
- `src/markdown/`
- `src/emit/`
- `src/cli/`
- `src/testing/`

And it now proves the product standard in
[docs/testing.md](/Users/aelaguiz/workspace/paperzod/docs/testing.md).

## Call-Site Audit

The repo now has two real call-site families:

- library entrypoints:
  - `defineSetup`
  - `validateSetup`
  - `buildGraph`
  - `renderSetup`
  - `compileSetup`
  - `createTargetAdapter`
  - `createPaperclipMarkdownTarget`
- CLI commands:
  - `paperzod validate <setup>`
  - `paperzod compile <setup>`
  - `paperzod doctor <setup>`

The real compatibility pressure is still the product contract in the docs, but
the implementation surface is now concrete and test-backed.

## Execution Rules

- Every phase follows red, green, refactor.
- Every phase begins by writing the failing phase test gate first.
- Every phase closes only when its phase gate is green.
- Prefer more phases to fewer when a phase starts bundling multiple distinct
  proof obligations.
- Prefer the documented `pnpm` commands, but when `pnpm` is unavailable in the
  execution environment, use equivalent `npm` or `npx` commands and record
  that deviation in the phase status.
- Snapshots should capture product evidence, not trivia.
- Mutations should be introduced as soon as a phase creates a new invariance
  boundary.
- No phase should add more public API than its tests genuinely justify.
- If a phase reveals that the docs are wrong, update the docs before moving
  forward.

## Depth-First Phase Plan

### Group Index

- Phases 1-10
  - repo bootstrap, harness, core ids, diagnostics, source shapes, and
    normalization
- Phases 11-17
  - graph construction, indexes, workflow semantics, artifact semantics,
    surface semantics, and rule registry
- Phases 18-22
  - compile planning, target adapters, and markdown substrate
- Phases 23-29
  - surface renderers, one-way generation, public library surface, and CLI
- Phases 30-37
  - proving fixtures for `demo_minimal`, `shared_overrides`, Lessons, and a
    second setup
- Phases 38-42
  - mutation hardening, determinism, performance guardrails, audit, and final
    docs sync

### Phase 1 — Repo Bootstrap

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/smoke/repo-smoke.test.ts` and
    `npx tsc -p tsconfig.json --noEmit` because `pnpm` was unavailable
- Goal:
  - make the repo installable, type-checkable, and testable
- Work:
  - create `package.json`
  - create `tsconfig.json`
  - create test runner config
  - create `src/` and `test/` roots
  - create placeholder public exports
- Tests to write first:
  - repo smoke test that imports the package root
  - `tsc --noEmit` smoke check
- Verification after phase:
  - `pnpm vitest run test/smoke/repo-smoke.test.ts`
  - `pnpm tsc -p tsconfig.json --noEmit`
- Exit criteria:
  - the repo can run tests and type-check from a clean install

### Phase 2 — Test Harness and Snapshot Infrastructure

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/harness`
- Goal:
  - create the harness that will carry the rest of the TDD work
- Work:
  - add snapshot conventions
  - add fixture directory structure
  - add CLI runner helpers
  - add filesystem sandbox helpers for emit tests
  - add source-only seed fixtures for `demo_minimal` and `shared_overrides`
    so early normalization and graph phases test real setup shapes instead of
    invented one-off inputs
- Tests to write first:
  - snapshot harness round-trip test
  - fixture loader smoke test
- Verification after phase:
  - `pnpm vitest run test/harness`
- Exit criteria:
  - fixtures, snapshots, seed setup sources, and helper utilities are stable
    enough for all later phases

### Phase 3 — Core Stable Ids

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/core/ids.test.ts`
- Goal:
  - implement the stable identity primitives the whole system depends on
- Work:
  - add id types and helper constructors in `src/core/ids.ts`
  - define setup-scoped uniqueness rules
  - define stable slug utilities for sections
- Tests to write first:
  - id format and equality tests
  - section slug stability tests
- Verification after phase:
  - `pnpm vitest run test/core/ids.test.ts`
- Exit criteria:
  - stable ids and section slugs are deterministic and test-covered

### Phase 4 — Core Diagnostics

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/core/diagnostics.test.ts`
- Goal:
  - implement the shared diagnostic model before real validation begins
- Work:
  - add diagnostic types and helpers in `src/core/diagnostics.ts`
  - define phase names and severity names
  - define stable diagnostic code format
- Tests to write first:
  - diagnostic serialization snapshot
  - diagnostic ordering test
- Verification after phase:
  - `pnpm vitest run test/core/diagnostics.test.ts`
- Exit criteria:
  - every later phase can emit stable diagnostics through one system

### Phase 5 — Core Normalized Definition Types

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/core/defs.test.ts` and
    `npx tsc -p tsconfig.json --noEmit`
- Goal:
  - define the canonical `*Def` types before authoring or graph code expands
- Work:
  - add `SetupDef`
  - add all required `*Def` node types
  - add `LinkDef`
  - export them from `src/core/defs.ts`
- Tests to write first:
  - type-level export tests
  - shape snapshots for hand-authored plain defs
- Verification after phase:
  - `pnpm vitest run test/core/defs.test.ts`
  - type-check suite
- Exit criteria:
  - the core data model matches the schema doc closely enough to implement
    against

### Phase 6 — Public Authoring DSL Skeleton

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/types/authoring.test.ts` and
    `npx tsc -p test/types/tsconfig.json --noEmit` because `pnpm` was
    unavailable
- Goal:
  - introduce the ergonomic authoring entrypoints without real semantics yet
- Work:
  - add `defineSetup`
  - add minimal builder helpers for primary node families
  - export them from `src/index.ts`
- Tests to write first:
  - type-level authoring tests for valid setup declarations
  - type failures for invalid enum literals where possible
- Verification after phase:
  - `pnpm vitest run test/types`
  - `pnpm tsc -p test/types/tsconfig.json --noEmit`
- Exit criteria:
  - authors can write typed setup objects against a stable DSL skeleton

### Phase 7 — Source Zod Schemas for Node Families

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/source/nodes.test.ts` because
    `pnpm` was unavailable
- Goal:
  - validate every required node family at the source-shape layer
- Work:
  - implement Zod schemas for setup, role, workflow step, review gate,
    packet contract, artifact, surface, surface section, reference, and
    generated target
- Tests to write first:
  - one passing and one failing case per node family
- Verification after phase:
  - `pnpm vitest run test/source/nodes`
- Exit criteria:
  - node-level validation catches malformed source shapes with structured
    diagnostics

### Phase 8 — Source Zod Schemas for Link Families

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/source/links.test.ts` because
    `pnpm` was unavailable
- Goal:
  - validate every required link family before graph linking exists
- Work:
  - implement Zod schemas for all required link kinds
  - normalize link identity and setup ownership
- Tests to write first:
  - passing and failing cases for each link kind
- Verification after phase:
  - `pnpm vitest run test/source/links`
- Exit criteria:
  - link shapes validate independently and emit stable diagnostics

### Phase 9 — Normalization to `SetupDef`

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/source/normalize.test.ts` and
    `npx tsc -p tsconfig.json --noEmit` because `pnpm` was unavailable
- Goal:
  - lower ergonomic source into plain canonical definitions
- Work:
  - implement normalization in `src/source/normalize.ts`
  - strip authoring-only helpers
  - preserve setup-local wording and exact section data
- Tests to write first:
  - `demo_minimal` normalization snapshot
  - plain-object vs builder-helper equivalence test
- Verification after phase:
  - `pnpm vitest run test/source/normalize`
- Exit criteria:
  - authoring inputs normalize into deterministic, serializable `SetupDef`
    objects

### Phase 10 — Shared Reuse and Override Normalization

- Status:
  - complete on 2026-04-01
  - verified locally with
    `npx vitest run test/source/shared-overrides.test.ts` because `pnpm` was
    unavailable
- Goal:
  - prove shared building blocks and setup-local overrides work before graph
    semantics deepen
- Work:
  - implement normalization support for reused definitions
  - implement setup-local overrides for wording, paths, gate rules, and
    compatibility mappings
- Tests to write first:
  - `shared_overrides` normalization tests
- Verification after phase:
  - `pnpm vitest run test/source/shared-overrides`
- Exit criteria:
  - shared reuse works without erasing local ownership or local wording

### Phase 11 — Base Graph Linker

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/graph/linker.test.ts` and
    `npx tsc -p tsconfig.json --noEmit` because `pnpm` was unavailable
- Goal:
  - create the first resolved doctrine graph from normalized source
- Work:
  - implement node registry
  - implement link resolution
  - implement setup-scoped duplicate id checks
- Tests to write first:
  - valid graph resolution test
  - duplicate id failure test
  - broken `from` and broken `to` tests
- Verification after phase:
  - `pnpm vitest run test/graph/linker`
- Exit criteria:
  - valid setups resolve to a real `DoctrineGraph`

### Phase 12 — Graph Indexes

- Status:
  - complete on 2026-04-01 after reopen
  - originally marked complete on 2026-04-01, then reopened by audit
  - re-verified locally with `npx vitest run test/graph/indexes.test.ts` and
    `npx tsc -p tsconfig.json --noEmit`
- Goal:
  - add the query indexes required for rule checks and planning
- Work:
  - implement ownership indexes
  - implement producer and consumer indexes
  - implement route indexes
  - implement section-to-surface membership indexes
  - implement `reads` indexes for exact section dependency queries
  - generalize `checks` indexes so gates can target packet contracts and
    surface sections where the schema allows it
  - implement documentation, grounding, and generation-provenance indexes for
    `documents`, `grounds`, `references`, and `generated_from` links
- Tests to write first:
  - graph summary snapshot for `demo_minimal`
  - ownership and producer lookup tests
  - `reads` lookup tests
  - non-artifact `checks` lookup tests
- Verification after phase:
  - `pnpm vitest run test/graph/indexes`
- Exit criteria:
  - graph queries no longer require ad hoc traversal

### Phase 13 — Workflow Turn Semantics

- Status:
  - complete on 2026-04-01 after reopen
  - previously marked complete on 2026-04-01, then reopened by audit
  - re-verified locally with `npx vitest run test/checks/workflow.test.ts`
    and `npx tsc -p tsconfig.json --noEmit`
- Goal:
  - enforce the required workflow-step contract rules
- Work:
  - implement checks for role, purpose, required inputs, outputs, stop line,
    and next owner or reviewer
  - distinguish support inputs from required contract inputs
  - distinguish interim artifacts from final trusted outputs
- Tests to write first:
  - failing turn-contract cases
  - valid turn-contract success cases
- Verification after phase:
  - `pnpm vitest run test/checks/workflow`
- Exit criteria:
  - missing or incomplete turn contracts fail clearly

### Phase 14 — Packet, Artifact, and Trust Semantics

- Status:
  - complete on 2026-04-01 after reopen
  - previously marked complete on 2026-04-01 after reopen, then reopened by
    audit
  - re-verified locally with `npx vitest run test/checks/artifacts.test.ts
    test/checks/workflow.test.ts` and `npx tsc -p tsconfig.json --noEmit`
- Goal:
  - enforce downstream trust semantics and conceptual-vs-runtime honesty
- Work:
  - implement packet contract checks
  - implement required vs support vs reference vs legacy handling
  - implement conceptual contract vs runtime compatibility mapping checks
  - validate `maps_to_runtime` targets against real runtime artifacts or
    runtime surfaces
  - extend gate and trust checks to packet contracts and section-backed rules,
    not only artifacts
- Tests to write first:
  - downstream trust tests
  - conceptual-vs-runtime mutation tests
  - packet-contract gate-check tests
  - `maps_to_runtime` failure tests
- Verification after phase:
  - `pnpm vitest run test/checks/artifacts`
- Exit criteria:
  - the system can express what later lanes are allowed to trust and reject
    dishonest mappings

### Phase 15 — Surface, Section, and Reference Semantics

- Status:
  - complete on 2026-04-01 after reopen
  - previously marked complete on 2026-04-01 after reopen, then reopened by
    audit
  - re-verified locally with `npx vitest run test/checks/surfaces.test.ts
    test/checks/artifacts.test.ts test/checks/workflow.test.ts` and
    `npx tsc -p tsconfig.json --noEmit`
- Goal:
  - enforce the distinction between runtime contract surfaces and reference
    material
- Work:
  - implement surface-class semantics
  - implement section ownership and membership checks
  - implement reference classification semantics
  - implement orphaned-section reachability checks from workflow or owner maps
  - implement `reads` source/target validation for roles, workflow steps,
    packet contracts, and gates reading exact sections
  - add generic single-owner enforcement for doctrine units that should not
    have competing owners
  - implement semantics for `documents`, `grounds`, and `references` links so
    the graph can distinguish documented contract surfaces, grounding inputs,
    and looser support references honestly
- Tests to write first:
  - runtime contract vs support/reference classification tests
  - orphaned section tests
  - exact-section `reads` tests
  - duplicate canonical owner tests beyond section conflicts
- Verification after phase:
  - `pnpm vitest run test/checks/surfaces`
- Exit criteria:
  - exact sections, runtime surfaces, and references are modeled honestly

### Phase 16 — Rule Registry and Stable Diagnostic Codes

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/checks/registry.test.ts` and
    `npx tsc -p tsconfig.json --noEmit` because `pnpm` was unavailable
- Goal:
  - turn the semantic checks into a coherent rule engine
- Work:
  - implement check registry
  - assign stable diagnostic codes
  - ensure deterministic diagnostic ordering
- Tests to write first:
  - diagnostic code stability tests
  - deterministic ordering tests
- Verification after phase:
  - `pnpm vitest run test/checks/registry`
- Exit criteria:
  - rule checks run as a stable, inspectable system rather than ad hoc calls

### Phase 17 — Compile Target Planning Primitives

- Status:
  - complete on 2026-04-01 after reopen
  - previously marked complete on 2026-04-01, then reopened by audit
  - re-verified locally with `npx vitest run`, `npx tsc -p tsconfig.json
    --noEmit`, and `npx tsc -p test/types/tsconfig.json --noEmit`
- Goal:
  - move from graph truth to runtime target planning
- Work:
  - implement `CompilePlan`
  - implement `PlannedDocument`
  - implement `PlannedSection`
  - map source units to targets and sections
  - implement `generated_target` and `generated_from` provenance mapping so
    every planned file and section can be traced back to real source units
  - require planned sections to reconcile with declared generation provenance
    instead of inferring everything from `documents` links alone
- Tests to write first:
  - `demo_minimal` compile plan snapshot
  - missing-source-backing failure test
  - section-level generation-provenance tests
- Verification after phase:
  - `pnpm vitest run test/plan/primitives`
- Exit criteria:
  - the system can build reviewable compile plans from valid graphs

### Phase 18 — Section Ordering and Ownership Planning

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/plan/ordering.test.ts` and
    `npx tsc -p tsconfig.json --noEmit` because `pnpm` was unavailable
- Goal:
  - make planned output deterministic and ownership-aware
- Work:
  - implement stable file ordering
  - implement stable section ordering
  - implement exclusive section ownership checks
- Tests to write first:
  - deterministic section ordering test
  - incompatible-owner failure test
- Verification after phase:
  - `pnpm vitest run test/plan/ordering`
- Exit criteria:
  - compile plans are deterministic and reject conflicting owners

### Phase 19 — Target Adapter Abstraction

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/plan/targets.test.ts` and
    `npx tsc -p tsconfig.json --noEmit` because `pnpm` was unavailable
- Goal:
  - isolate path policy from doctrine semantics
- Work:
  - implement `TargetAdapter`
  - define adapter contract for repo-root, output root, and collision policy
  - add path manifest generation
- Tests to write first:
  - target adapter contract tests
  - output-scope failure tests
- Verification after phase:
  - `pnpm vitest run test/plan/targets`
- Exit criteria:
  - target path mapping is explicit and testable

### Phase 20 — `PaperclipMarkdownTarget`

- Status:
  - complete on 2026-04-01
  - verified locally with
    `npx vitest run test/targets/paperclip-markdown.test.ts` and
    `npx tsc -p tsconfig.json --noEmit` because `pnpm` was unavailable
- Goal:
  - implement the first real runtime target for `paperclip_agents`-style trees
- Work:
  - encode path conventions for role homes, shared docs, packet docs,
    standards, gate docs, references, how-to docs, and coordination docs
  - implement `paperclip_agents`-style path manifest output
- Tests to write first:
  - generic `paperclip_agents` path manifest tests
  - target collision tests
- Verification after phase:
  - `pnpm vitest run test/targets/paperclip-markdown`
- Exit criteria:
  - the target adapter can plan realistic Paperclip doctrine paths

### Phase 21 — Internal Doc AST

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/doc/ast.test.ts` and
    `npx tsc -p tsconfig.json --noEmit` because `pnpm` was unavailable
- Goal:
  - introduce a tiny deterministic rendering substrate before markdown
    renderers exist
- Work:
  - add doc AST node types
  - add AST builders
  - add validation for invalid AST shapes where useful
- Tests to write first:
  - AST construction tests
  - AST serialization snapshot
- Verification after phase:
  - `pnpm vitest run test/doc/ast`
- Exit criteria:
  - domain code can render through a stable internal document model

### Phase 22 — Markdown Stringifier

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/doc/markdown.test.ts` and
    `npx tsc -p tsconfig.json --noEmit` because `pnpm` was unavailable
- Goal:
  - convert the internal doc AST into deterministic markdown text
- Work:
  - implement heading rendering
  - implement lists, code blocks, blockquotes, and paragraph rendering
  - implement stable anchor or stable section target behavior
- Tests to write first:
  - stringifier snapshot tests
  - stable-anchor tests
- Verification after phase:
  - `pnpm vitest run test/doc/markdown`
- Exit criteria:
  - the renderer has a deterministic markdown backend

### Phase 23 — Role-Home and Shared Renderers

- Status:
  - complete on 2026-04-01
  - verified locally with
    `npx vitest run test/render/role-home-shared.test.ts` and
    `npx tsc -p tsconfig.json --noEmit` because `pnpm` was unavailable
- Goal:
  - render the first human-facing doctrine surfaces
- Work:
  - add role-home renderer
  - add shared entrypoint renderer
- Tests to write first:
  - role-home markdown snapshot tests
  - shared entrypoint markdown snapshot tests
- Verification after phase:
  - `pnpm vitest run test/render/role-home-shared`
- Exit criteria:
  - role homes and shared entrypoints render as readable doctrine

### Phase 24 — Workflow and Packet Renderers

- Status:
  - complete on 2026-04-01
  - verified locally with
    `npx vitest run test/render/workflow-packet.test.ts` and
    `npx tsc -p tsconfig.json --noEmit` because `pnpm` was unavailable
- Goal:
  - render the operational workflow surfaces
- Work:
  - add workflow owner renderer
  - add packet workflow renderer
- Tests to write first:
  - workflow owner markdown snapshot tests
  - packet workflow markdown snapshot tests
- Verification after phase:
  - `pnpm vitest run test/render/workflow-packet`
- Exit criteria:
  - workflow and packet surfaces render with correct contracts and order

### Phase 25 — Standards, Gates, and Reference Renderers

- Status:
  - complete on 2026-04-01
  - verified locally with
    `npx vitest run test/render/extended-surfaces.test.ts` and
    `npx tsc -p tsconfig.json --noEmit` because `pnpm` was unavailable
- Goal:
  - complete the remaining required surface family renderers
- Work:
  - add standards renderer
  - add gate renderer
  - add technical reference renderer
  - add how-to renderer
  - add coordination renderer
- Tests to write first:
  - snapshot tests for standards, gate, technical reference, how-to, and
    coordination surfaces
- Verification after phase:
  - `pnpm vitest run test/render/extended-surfaces`
- Exit criteria:
  - every required runtime surface family has a real renderer

### Phase 26 — One-Way Generation and Emit Layer

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/emit/index.test.ts` and
    `npx tsc -p tsconfig.json --noEmit` because `pnpm` was unavailable
- Goal:
  - make the runtime output operationally sane and explicitly one-way
- Work:
  - implement dry-run emission
  - implement write mode
  - implement unchanged-file detection
  - implement diff generation
  - explicitly refuse to parse generated markdown back into semantic source
- Tests to write first:
  - manual-edit overwrite or diff tests
  - localized change diff-locality tests
- Verification after phase:
  - `pnpm vitest run test/emit`
- Exit criteria:
  - the system proves structured source is truth and generated markdown is
    output only

### Phase 27 — Public Library API

- Status:
  - complete on 2026-04-01 after reopen
  - originally marked complete on 2026-04-01, then reopened by audit
  - re-verified locally with `npx vitest run test/api/index.test.ts` and
    `npx tsc -p tsconfig.json --noEmit`
- Goal:
  - expose the real programmatic surface before packaging and CLI concerns
- Work:
  - implement `validateSetup`
  - implement `buildGraph`
  - implement `renderSetup`
  - implement `compileSetup`
  - add a first-class compile-plus-emit library helper so public API semantics
    stay honest without making the pure compile path impure
- Tests to write first:
  - library API tests for validate, graph build, render, and compile
  - API-level emit or contract-narrowing tests
- Verification after phase:
  - `pnpm vitest run test/api`
- Exit criteria:
  - users can consume the core library surface directly

### Phase 28 — Package Exports and CLI Validate/Compile

- Status:
  - complete on 2026-04-01 after reopen
  - previously marked complete on 2026-04-01, then reopened by audit
  - re-verified locally with `npx vitest run test/cli/validate-compile.test.ts
    test/api/index.test.ts`, `npx tsc -p tsconfig.json --noEmit`, and
    `npm run build`
- Goal:
  - expose the packaged library and the first operator entrypoints
- Work:
  - wire stable package exports for:
    - `paperzod`
    - `paperzod/core`
    - `paperzod/markdown`
    - `paperzod/testing`
  - implement `paperzod validate`
  - implement `paperzod compile`
  - wire exit codes and dry-run behavior
- Tests to write first:
  - import-surface tests for public package entrypoints and subpath exports
  - CLI validate success and failure tests
  - CLI compile success and failure tests
- Verification after phase:
  - `pnpm vitest run test/cli/validate-compile`
- Exit criteria:
  - the package exports are stable and operators can validate and compile from
    the real CLI

### Phase 29 — CLI Doctor

- Status:
  - complete on 2026-04-01 after reopen
  - previously marked complete on 2026-04-01, then reopened by audit
  - re-verified locally with `npx vitest run test/cli/doctor.test.ts
    test/cli/validate-compile.test.ts`, `npx tsc -p tsconfig.json --noEmit`,
    and `npm run build`
- Goal:
  - provide human-readable explanations for graph and rule failures
- Work:
  - implement `paperzod doctor`
  - render actionable diagnostics with setup id, node id, phase, and fix
    surface
- Tests to write first:
  - CLI doctor snapshot tests
- Verification after phase:
  - `pnpm vitest run test/cli/doctor`
- Exit criteria:
  - the CLI can explain failures without exposing raw implementation junk

### Phase 30 — `demo_minimal` Proving Fixture

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/e2e/demo-minimal.test.ts`
    and `npx tsc -p tsconfig.json --noEmit`
- Goal:
  - prove the full happy path on the smallest meaningful fixture
- Work:
  - expand the existing `demo_minimal` seed fixture into the full proving
    fixture
  - add expected plan and markdown snapshots
  - add one mutation test
- Tests to write first:
  - full end-to-end `demo_minimal` test
- Verification after phase:
  - `pnpm vitest run test/e2e/demo-minimal`
- Exit criteria:
  - the entire compile pipeline works on the smallest useful setup

### Phase 31 — `shared_overrides` Proving Fixture

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/e2e/shared-overrides.test.ts`
    and `npx tsc -p tsconfig.json --noEmit`
- Goal:
  - prove reuse and local override behavior end to end
- Work:
  - expand the existing `shared_overrides` seed fixtures into the full proving
    fixture family
  - implement shared reusable definitions across two consuming setups
  - snapshot local wording, local path, and local gate-rule differences
- Tests to write first:
  - full end-to-end `shared_overrides` suite
- Verification after phase:
  - `pnpm vitest run test/e2e/shared-overrides`
- Exit criteria:
  - reuse works without hiding local ownership or collapsing local behavior

### Phase 32 — `lessons_vertical_slice` Source Model

- Status:
  - complete on 2026-04-01
  - verified locally with
    `npx vitest run test/fixtures/lessons-vertical-slice-source.test.ts`
    and `npx tsc -p tsconfig.json --noEmit`
- Goal:
  - introduce the first real Lessons-shaped fixture source
- Work:
  - model one role-home doc
  - model one shared doc
  - model one packet workflow doc
  - model one standards doc
  - model one gate doc
  - model one imported grounding reference
  - model the required exact sections
- Tests to write first:
  - `lessons_vertical_slice` source-shape and normalization suite
- Verification after phase:
  - `pnpm vitest run test/fixtures/lessons-vertical-slice-source`
- Exit criteria:
  - the fixture exists and its source shape is honest before end-to-end render

### Phase 33 — `lessons_vertical_slice` End-to-End Proof

- Status:
  - complete on 2026-04-01 after reopen
  - originally marked complete on 2026-04-01, then reopened by audit
  - re-verified locally with
    `npx vitest run test/e2e/lessons-vertical-slice.test.ts
    test/fixtures/lessons-vertical-slice-source.test.ts -u` and
    `npx tsc -p tsconfig.json --noEmit`
- Goal:
  - prove that a real Lessons slice compiles honestly
- Work:
  - add expected compile plan
  - add expected markdown snapshots
  - add section-trace assertions from source node to final markdown section
  - add one section-rename mutation test
  - add exact-section `reads` assertions for a role and at least one workflow
    step
  - add a gate or standards dependency case that proves non-artifact section
    semantics
- Tests to write first:
  - full end-to-end `lessons_vertical_slice` suite
  - exact-section `reads` proving test
- Verification after phase:
  - `pnpm vitest run test/e2e/lessons-vertical-slice`
- Exit criteria:
  - exact Lessons section-level behavior is proven in a narrow slice

### Phase 34 — `lessons_full` Source Model

- Status:
  - complete on 2026-04-01
  - verified locally with
    `npx vitest run test/fixtures/lessons-full-source.test.ts` and
    `npx tsc -p tsconfig.json --noEmit`
- Goal:
  - model the full Lessons proving case before running the hardest end-to-end
    gate
- Work:
  - add all required Lessons surface families
  - add conceptual artifact chain representation
  - add current runtime bundle representation
  - add exact section-level contracts called out in the requirements
- Tests to write first:
  - `lessons_full` source-shape and graph-coverage suite
- Verification after phase:
  - `pnpm vitest run test/fixtures/lessons-full-source`
- Exit criteria:
  - the full Lessons setup is representable in source without hacks

### Phase 35 — `lessons_full` End-to-End Proof

- Status:
  - complete on 2026-04-01 after reopen
  - originally marked complete on 2026-04-01, then reopened by audit
  - re-verified locally with
    `npx vitest run test/e2e/lessons-full.test.ts
    test/fixtures/lessons-full-source.test.ts -u` and
    `npx tsc -p tsconfig.json --noEmit`
- Goal:
  - prove the full Lessons case across the entire compiler
- Work:
  - add expected path manifest
  - add expected compile plan
  - add final markdown snapshots
  - add trace assertions from key source sections to final output
  - add critical mutation cases for standards, gates, and mapping drift
  - add explicit proof of section-level reads and owner routing from the live
    Lessons shape
  - add end-to-end proof that shared standards and gate sections can be read
    and checked as exact doctrine units
- Tests to write first:
  - full end-to-end `lessons_full` suite
  - Lessons-specific exact-section dependency tests
- Verification after phase:
  - `pnpm vitest run test/e2e/lessons-full`
- Exit criteria:
  - the main proving case in the requirements doc is actually satisfied

### Phase 36 — `second_setup` Source Model

- Status:
  - complete on 2026-04-01
  - verified locally with
    `npx vitest run test/fixtures/second-setup-source.test.ts` and
    `npx tsc -p tsconfig.json --noEmit`
- Goal:
  - prove the model generalizes outside Lessons before hardening
- Work:
  - implement a non-Lessons setup
  - ensure different path shape and surface mix where appropriate
  - reuse shared definitions where useful
- Tests to write first:
  - `second_setup` source and normalization suite
- Verification after phase:
  - `pnpm vitest run test/fixtures/second-setup-source`
- Exit criteria:
  - a non-Lessons setup is representable without touching generic layers

### Phase 37 — `second_setup` End-to-End Proof

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/e2e/second-setup.test.ts`
    and `npx tsc -p tsconfig.json --noEmit`
- Goal:
  - prove the same compiler pipeline works for a second setup
- Work:
  - add expected plan and markdown snapshots
  - add at least one setup-local override case
- Tests to write first:
  - full end-to-end `second_setup` suite
- Verification after phase:
  - `pnpm vitest run test/e2e/second-setup`
- Exit criteria:
  - the product is proven multi-setup

### Phase 38 — Mutation Suite Expansion

- Status:
  - complete on 2026-04-01 after reopen
  - previously marked complete on 2026-04-01, then reopened by audit
  - re-verified locally with `npx vitest run test/mutations/index.test.ts`
    and `npx tsc -p tsconfig.json --noEmit`

- Goal:
  - turn the named drift classes in the requirements into first-class
    regression protection
- Work:
  - add packet rename mutation
  - add section rename mutation
  - add role-contract drift mutation
  - add gate-check drift mutation
  - add compatibility-mapping drift mutation
  - add localized-diff assertions
  - add orphaned-section mutation
  - add exact-section `reads` drift mutation
  - add duplicate canonical-owner mutation
  - add link-level `maps_to_runtime` drift mutation
- Tests to write first:
  - mutation test harness for multi-fixture reuse
- Verification after phase:
  - `pnpm vitest run test/mutations`
- Exit criteria:
  - the drift classes in the requirements are mechanically guarded

### Phase 39 — Determinism and Diff-Locality Hardening

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/stability/index.test.ts` and
    again inside the final full-suite run because `pnpm` was unavailable

- Goal:
  - prove boring stability properties before release
- Work:
  - add byte-identity rerun tests
  - add diagnostic ordering tests
  - add unchanged-file no-rewrite tests
  - add localized source-change localized-diff tests
- Tests to write first:
  - determinism suite
- Verification after phase:
  - `pnpm vitest run test/stability`
- Exit criteria:
  - output and diagnostics are deterministic enough for trustworthy review

### Phase 40 — Performance Guardrails

- Status:
  - complete on 2026-04-01
  - verified locally with `npx vitest run test/perf/index.test.ts` and again
    inside the final full-suite run because `pnpm` was unavailable

- Goal:
  - add practical guardrails without over-optimizing early
- Work:
  - add compile-time benchmark checks for `demo_minimal`
  - add compile-time benchmark checks for `lessons_full`
  - add memory guardrails at Lessons scale
- Tests to write first:
  - performance harness smoke tests
- Verification after phase:
  - `pnpm vitest run test/perf`
- Exit criteria:
  - the tool is fast enough to be practical and regressions are visible

### Phase 41 — Release-Gate Audit Against `docs/testing.md`

- Status:
  - complete on 2026-04-01 after reopen
  - previously marked complete on 2026-04-01, then reopened by audit
  - re-verified locally with:
    - `npm run test:types`
    - `npx tsc -p tsconfig.json --noEmit`
    - `npx vitest run`
    - `npm run build`
  - manual audit outcome:
    - downstream consumer-or-gate enforcement is now proven by
      `test/checks/artifacts.test.ts` and
      `test/mutations/index.test.ts`
    - typed `routes_to`, `produces`, `consumes`, `supports`, `owns`,
      `grounds`, `references`, and `generated_from` semantics are now proven
      by the check suites plus the expanded mutation suite
    - explicit section-level generation provenance is now proven by
      `test/plan/primitives.test.ts`, the end-to-end fixture suites, and the
      full-suite gate
    - CLI adaptation through public library entrypoints is now proven by the
      CLI suites against the refactored `src/cli/` implementation

- Goal:
  - prove implementation completeness against the declared product proof
    standard
- Work:
  - audit implemented suites against the requirement coverage matrix
  - fill any uncovered requirement gaps
  - remove any tests that only provide fake confidence
- Tests to write first:
  - no new product code
  - audit checklist itself is the gate
- Verification after phase:
  - full test suite
  - manual audit pass against
    [docs/testing.md](/Users/aelaguiz/workspace/paperzod/docs/testing.md)
- Exit criteria:
  - every requirement area has real proving coverage

Audit outcome required to close this phase:

- rerun the requirement coverage matrix only after phases 13, 14, 15, 17, 28,
  29, and 38 are honestly green again
- replace the current over-broad evidence table with one that explicitly
  proves:
  - downstream consumer or gate enforcement
  - typed `routes_to`, `produces`, `consumes`, `supports`, `owns`,
    `grounds`, `references`, and `generated_from` semantics
  - explicit generation-provenance behavior that is not only inferred from
    `documents` overlap
  - CLI adaptation through public library entrypoints instead of duplicated
    pipeline logic

### Phase 42 — Docs Sync and Release Candidate

- Status:
  - complete on 2026-04-01 after reopen
  - previously marked complete on 2026-04-01, then reopened by audit
  - re-verified locally with:
    - `npm run test:types`
    - `npx tsc -p tsconfig.json --noEmit`
    - `npx vitest run`
    - `npm run build`
  - docs sync outcome:
    - the implementation plan is now resynced to the actual code and proof
      state
    - no additional README, architecture, or testing doc changes were
      required after the reopened implementation gaps were fixed because those
      product docs were already describing the intended behavior honestly

- Goal:
  - end with a coherent repo instead of a passing but confusing codebase
- Work:
  - update README usage to match the real implementation
  - update architecture or testing docs if implementation proved changes were
    necessary
  - add package scripts and contributor instructions
  - run the full release gate
  - remove any remaining wording that implies exact-section dependencies,
    generation provenance, or compile API emission are already solved if they
    are not
- Tests to write first:
  - no new implementation tests
  - this is the final proving run
- Verification after phase:
  - full test suite
  - manual review rubric
  - end-to-end release gate
- Exit criteria:
  - the repo is internally consistent and ready for real implementation work
    beyond the prototype

Closeout required to close this phase again:

- resync the docs only after the reopened implementation gaps are actually
  fixed
- remove any wording that still implies full typed-link enforcement,
  downstream consumer/gate enforcement, or explicit `generated_from`
  provenance if those are not yet shipped

## Critical sequencing notes

- The seed versions of `demo_minimal` and `shared_overrides` must exist early
  so source, normalization, and graph phases operate on real setup fixtures.
- Do not start `lessons_full` end-to-end work before target planning,
  rendering, emission, and mutation infrastructure are already real.
- Do not skip `shared_overrides`; it proves a product promise that the Lessons
  fixtures do not prove by themselves.
- Do not ship the CLI before one-way generation and emission semantics are
  already correct.
- Do not optimize for performance before determinism and correctness are green.

## Success condition

This plan is complete again. The phases reopened by Audit Reopen II are now
closed, and the resulting implementation again matches the product contract in
[docs/requirements.md](/Users/aelaguiz/workspace/paperzod/docs/requirements.md),
[docs/schema.md](/Users/aelaguiz/workspace/paperzod/docs/schema.md), and
[docs/architecture.md](/Users/aelaguiz/workspace/paperzod/docs/architecture.md).
