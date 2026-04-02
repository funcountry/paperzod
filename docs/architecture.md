# Architecture

## Goal

`paperzod` should behave like a small compiler for Paperclip doctrine.

It should take authored setup definitions, validate them, resolve them into a
graph, plan runtime surfaces, and emit plain markdown plus machine-readable
diagnostics.

This is not a markdown templating project.
It is a source-model-first doctrine compiler.

Status as of 2026-04-01:

- the prototype architecture is implemented
- the repo now has a working compiler pipeline, CLI, and proving fixtures
- this document describes the architecture we actually shipped, while still
  noting the design rules that shaped it

## Architectural rule

The right architectural model is the one Zod itself uses well:

- keep the stable core small
- keep the ergonomic API separate from the core
- keep validation, metadata, and generation as distinct subsystems
- lower rich authoring inputs into a plain internal representation early

The biggest lesson from `vendor/zod` is not a specific helper method.
It is the package shape.

Zod works because:

- `zod/v4/core` is a narrow, stable substrate
- the public `zod` package is an ergonomic layer on top
- parsing, metadata registries, and JSON Schema generation are separate modules
- internal schema definitions are plain data that later phases can inspect

`paperzod` should copy that shape.

## What `paperzod` should not be

It should not be:

- a bag of ad hoc setup scripts
- a system where Zod schemas themselves are mistaken for the doctrine graph
- a markdown string concatenation utility
- a product that mixes filesystem writes, graph rules, and rendering in one
  layer
- a Lessons-only implementation with a fake veneer of generality

## Current product shape

Start as one package with stable subpath exports.

That is simpler than a multi-package workspace, but still gives us the clean
layering we want.

Current public exports:

- `paperzod`
- `paperzod/core`
- `paperzod/markdown`
- `paperzod/testing`

Meaning:

- `paperzod`
  - the default ergonomic API
  - authoring helpers
  - compile entrypoints
- `paperzod/core`
  - the stable low-level doctrine types, diagnostics, graph contracts, and
    compile-plan contracts
- `paperzod/markdown`
  - markdown renderers and Paperclip-oriented surface emitters
- `paperzod/testing`
  - fixture helpers, snapshot helpers, and graph assertion utilities

If the repo later grows enough to deserve separate packages, those package
boundaries should preserve these same import paths.

## Current repo layout

```txt
paperzod/
  README.md
  package.json
  tsconfig.json
  docs/
    requirements.md
    schema.md
    architecture.md
    testing.md
    implementation_plan.md
    example_lessons.md
    ref/
  src/
    index.ts
    core/
      index.ts
      ids.ts
      defs.ts
      diagnostics.ts
      compile-types.ts
      graph.ts
    source/
      index.ts
      schemas.ts
      builders.ts
      normalize.ts
    graph/
      index.ts
      linker.ts
      indexes.ts
      queries.ts
    checks/
      index.ts
      registry.ts
      core-rules.ts
      paperclip-rules.ts
    plan/
      index.ts
      targets.ts
    doc/
      index.ts
      ast.ts
      builders.ts
      markdown.ts
    markdown/
      index.ts
      renderers/
        role-home.ts
        workflow-owner.ts
        packet-workflow.ts
        standard.ts
        gate.ts
        reference.ts
    emit/
      index.ts
    cli/
      index.ts
      compile.ts
      validate.ts
      doctor.ts
      shared.ts
    testing/
      index.ts
  test/
    api/
    checks/
    cli/
    core/
    doc/
    e2e/
    emit/
    fixtures/
      source/
    graph/
    helpers/
    mutations/
    perf/
    plan/
    render/
    smoke/
    source/
    stability/
    targets/
    types/
```

This layout keeps each phase local and testable.

## The five internal representations

The compiler moves through five representations.

Each representation should be explicit and typed.
Do not let later stages keep reaching back into raw authoring objects.

### 1. Authoring source

This is the ergonomic TypeScript layer a setup author writes.

Current shipped helpers:

- `defineSetup(...)`
- `defineRole(...)`
- `defineWorkflowStep(...)`
- `defineSurface(...)`

The remaining node families are currently authored as plain objects inside the
setup declaration.

This layer is allowed to be pleasant and slightly richer than plain data.

### 2. Normalized definitions

This is the canonical internal data model.

It should be:

- plain objects
- JSON-serializable
- free of functions
- stable enough for snapshots and future tooling

This is the `paperzod` equivalent of Zod's internal schema `def`.

Primary type:

- `SetupDef`

Containing arrays or maps of:

- `RoleDef`
- `WorkflowStepDef`
- `ReviewGateDef`
- `PacketContractDef`
- `ArtifactDef`
- `SurfaceDef`
- `SurfaceSectionDef`
- `ReferenceDef`
- `GeneratedTargetDef`
- `LinkDef`

### 3. Resolved graph

This is the semantic graph with ids linked and indexes built.

Primary type:

- `DoctrineGraph`

It should provide:

- node lookup by id
- edge lookup by source and target
- section-to-surface lookup
- workflow ordering
- ownership indexes
- artifact producer and consumer indexes

### 4. Compile plan

This is the concrete plan for runtime output.

Primary types:

- `CompilePlan`
- `PlannedDocument`
- `PlannedSection`

This is where the system decides:

- which runtime files exist
- which sections land in each file
- what order sections appear in
- which semantic nodes contribute to each section

### 5. Rendered result

This is the final materialized output.

Primary types:

- `RenderedDocument`
- `RenderResult`
- `EmitResult`

This layer should contain:

- markdown strings
- file paths
- section anchor data
- diagnostics
- write summaries

## Core modules

### `src/core/`

This must stay small and boring.

It should define:

- stable ids and id helpers
- the normalized doctrine definition types
- the compile-plan types
- structured diagnostics
- graph-facing shared types

This layer should not import Node filesystem utilities or markdown renderers.

### `src/source/`

This is the authoring and validation layer.

It should contain:

- Zod schemas for source shapes
- builder helpers for ergonomic setup authoring
- normalization from authoring inputs to `SetupDef`

This is where Zod belongs most heavily.

### `src/graph/`

This is the linker and query layer.

It should:

- resolve ids
- build indexes
- expose reusable graph queries
- avoid rendering concerns

This is where setup semantics become navigable.

### `src/checks/`

This is the rule engine.

It should run invariant checks over `DoctrineGraph`.

Each rule should be small and named.
Examples:

- duplicate owner check
- broken read reference check
- missing producer check
- missing consumer check
- orphaned section check
- runtime mapping gap check

Checks should emit structured diagnostics, not throw raw exceptions.

### `src/plan/`

This is the bridge from semantic graph to runtime doctrine output.

It should decide:

- surface membership
- section ordering
- target path mapping
- file ownership
- merge behavior when several source nodes render into one runtime file

This layer is crucial.
It is the difference between "we have a graph" and "we can actually compile
usable doctrine."

### `src/doc/`

This should be a tiny internal document AST.

Do not render markdown by letting domain code concatenate strings directly.

Current doc nodes:

- `doc`
- `section`
- `paragraph`
- `bullet_list`
- `bullet_item`
- `code_block`
- `blockquote`

That is enough for doctrine output and keeps formatting deterministic.

### `src/markdown/`

This layer converts planned doctrine sections into the internal doc AST and
then into markdown text.

Renderer modules should be organized by surface class, not by setup.

Examples:

- role-home renderer
- workflow-owner renderer
- packet-workflow renderer
- standard renderer
- gate renderer
- reference renderer

### `src/emit/`

This is the only layer that touches the filesystem.

It should support:

- dry run
- write
- diff against current files
- overwrite policy
- compile summary output

Everything before this layer should be pure.
In the current prototype those behaviors live together in
`src/emit/index.ts`.

### `src/cli/`

This should be very small.

The CLI should mostly adapt command-line arguments into library entrypoints.

Current commands:

- `paperzod validate <setup>`
- `paperzod compile <setup>`
- `paperzod doctor <setup>`

## Zod integration strategy

The vendor code makes one architectural decision very clear:

When building a library, distinguish between the ergonomic layer and the stable
core layer.

For `paperzod`, that means:

- use `zod` classic in `src/source/` for authoring schemas and developer
  ergonomics
- use `zod/v4/core` only if `paperzod` later introduces low-level extension
  points that accept foreign Zod schemas
- do not build the doctrine graph out of Zod schema instances
- lower source definitions into plain `*Def` objects as early as possible

### Which Zod features we should use

Use these heavily:

- `z.object(...)`
- `z.enum(...)`
- `z.discriminatedUnion(...)`
- `z.array(...)`
- `z.record(...)`
- `z.lazy(...)` where recursive structures are unavoidable
- `safeParse` for ingestion and diagnostics

Use these carefully:

- custom registries via `z.registry(...)`
- `toJSONSchema(...)`

Avoid treating these as product state:

- `z.globalRegistry`
- `.meta()` as the location of setup truth

The right use of registries here is limited:

- documenting the authoring schema
- exporting JSON Schema for tooling
- attaching compile hints to authoring schema definitions

The wrong use is:

- storing role ownership
- storing workflow relationships
- storing artifact flow
- storing runtime doctrine mappings

Those belong in the actual setup definitions and graph.

## Diagnostics model

`paperzod` should have its own diagnostic system.

Recommended shape:

```ts
type Diagnostic = {
  code: string;
  severity: "error" | "warning" | "info";
  phase: "source" | "graph" | "check" | "plan" | "render" | "emit";
  message: string;
  nodeId?: string;
  relatedIds?: string[];
  path?: string[];
};
```

Why:

- Zod issues are good for source-shape failures
- they are not enough for graph and doctrine failures
- we need one uniform surface for CLI output, testing, and editor tooling

The compiler should translate Zod issues into `paperzod` diagnostics rather
than leaking raw Zod errors through the whole stack.

## Compile pipeline

The compile pipeline should be explicit and phase-separated.

Current flow:

1. load setup module
2. normalize authored inputs to `SetupDef`
3. validate all source shapes with Zod
4. build `DoctrineGraph`
5. run check registry against the graph
6. build `CompilePlan`
7. render planned documents into the internal doc AST
8. stringify markdown
9. emit files or produce a dry-run diff
10. return diagnostics plus a compile summary

Only steps `1` and `9` should involve I/O.
Everything else should be pure and snapshot-testable.

## Public library entrypoints

The default package should expose a small number of high-value entrypoints.

Current API:

```ts
import {
  defineSetup,
  validateSetup,
  renderSetup,
  compileSetup,
  compileAndEmitSetup,
  buildGraph,
  createTargetAdapter,
  createPaperclipMarkdownTarget,
} from "paperzod";
```

Meaning:

- `defineSetup`
  - ergonomic authoring helper
- `validateSetup`
  - source validation only
- `buildGraph`
  - graph linking over normalized `SetupDef` data
- `renderSetup`
  - pure render without filesystem writes
- `compileSetup`
  - full pure compile including target planning and manifest resolution
- `compileAndEmitSetup`
  - full compile plus explicit emit or dry-run behavior

`paperzod/core` should expose lower-level types and utilities, not the main
authoring DSL.

## Runtime target model

The product must remain general across Paperclip setups, but it still needs a
strong first-class runtime target for `paperclip_agents` style doctrine trees.

Current abstraction:

- `TargetAdapter`

Responsibilities:

- map generated targets to repo paths
- define path and naming policy
- define overwrite policy
- define optional file preambles or generation markers

The first concrete implementation should be:

- `createPaperclipMarkdownTarget(...)`

This is the place to encode directory conventions such as:

- role-home `AGENTS.md`
- shared `README.md`
- top-level workflow owner docs
- packet workflow docs
- standards docs
- gate docs
- technical references
- how-to guides
- coordination docs

That target adapter should know about path conventions.
It should not know about workflow semantics.

Current limitation:

- `createPaperclipMarkdownTarget(...)` validates `role_home` outputs under a
  `.../roles/.../AGENTS.md` convention
- the live Lessons tree in `../paperclip_agents` still keeps role homes under
  `paperclip_home/agents/.../AGENTS.md`
- the current proving fixtures therefore use a simplified project-home role
  path convention instead of exact live role-home parity

## Setup model

A setup module should be a pure data declaration plus tiny helpers.

A setup should declare:

- setup metadata
- roles
- workflow steps
- gates
- packet contracts
- artifacts
- runtime surfaces
- runtime surface sections
- references
- generated targets
- typed links

It should not directly write files.
It should not contain imperative compile logic.

That keeps setup authoring readable and reviewable.

## Lessons as the proving case

The Lessons example should live as a first-class example setup, not as a pile
of special cases embedded in the compiler.

In the current prototype, the executable Lessons proving fixtures live under:

- `test/fixtures/source/lessons-vertical-slice.ts`
- `test/fixtures/source/lessons-full.ts`

Its job is to prove that `paperzod` can model:

- role homes
- shared owners
- packet workflow owners
- standards
- critics and gates
- technical references
- imported grounding docs
- conceptual packet contracts mapped onto current runtime bundles
- exact section-level reads and ownership

If the Lessons example requires compiler exceptions instead of clean source
data, the architecture is wrong.

## Testing strategy

The Zod repo is a good reminder here as well:
core behavior should be test-first and fixture-driven.

`paperzod` now has:

- unit tests for source validation
- unit tests for graph checks
- fixture tests for compile plans
- snapshot tests for rendered markdown
- a vertical-slice Lessons compile fixture
- a full Lessons compile fixture

Recommended golden outputs:

- normalized `SetupDef`
- diagnostics
- compile plan
- rendered markdown
- target manifest and emit diffs

## Build order

The safest implementation order is:

1. `src/core/` plus `src/source/`
2. `src/graph/`
3. `src/checks/`
4. `src/plan/`
5. `src/doc/` plus `src/markdown/`
6. `src/emit/` and `src/cli/`
7. proving fixtures under `test/fixtures/source/` and `test/e2e/`

That gives us a narrow vertical slice without mixing concerns too early.

## Final design rule

The architecture is correct if a workflow change can be made in one authored
setup definition and then propagate through the system as:

- source validation failures when the shape is wrong
- graph diagnostics when links drift
- rule diagnostics when contracts break
- deterministic markdown changes when runtime doctrine must update

That is the real product.
Everything else is support machinery.
