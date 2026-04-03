# Architecture

## Goal

`paperzod` behaves like a small compiler for Paperclip doctrine.

It takes authored setup source, validates it, resolves it into a graph, plans
runtime output, renders markdown, and optionally emits files.

The architectural rule is:

- keep the core model small
- keep the ergonomic layer separate
- lower rich authoring inputs early
- keep validation, planning, rendering, and emission distinct

## Pipeline

The shipped pipeline is:

1. normalize authored source
2. build the graph
3. run checks
4. build a compile plan
5. render documents
6. emit documents

That pipeline is orchestrated from `src/index.ts`.

## Internal Representations

### Authoring source

This is what setup authors write:

- `defineSetup(...)`
- `defineSetupModule(...)`
- helper-backed setup parts
- fragment-backed prose

### Normalized definitions

This is the plain canonical internal model:

- JSON-serializable
- function-free
- snapshot-friendly
- includes setup-level registries, setup-level catalogs, artifact-level
  evidence contracts, typed inline refs, and surface-level required section
  contracts

Helper-only section optionality resolves before this layer.
`whenConfigured` template sections either lower into ordinary surface sections
and generated targets or disappear entirely. There is no second normalized
model for "maybe present later" sections.

### Resolved graph

This is where ids, ownership, section lookups, and workflow indexes are linked.

Registries and catalogs stay graph-adjacent lookup truth in this phase:

- `graph.catalogs`
- `graph.catalogByKind`
- `graph.registries`
- `graph.registryById`
- `graph.indexes.sectionIdBySurfaceIdAndStableSlug`

They do not widen into routed graph nodes.

### Compile plan

This is the concrete runtime output plan:

- document ids
- section ids
- rendered paths
- source traces
- ownership and prune metadata

Only emitted sections reach this layer. Sparse template sections that were not
configured never appear in document section ids, source traces, or planned
paths.

### Rendered documents

This is the final markdown plus manifest information.

## Repo Layering

The repo keeps each compiler phase local:

- `src/source/**` for authoring helpers, modules, composition, fragments, and
  normalization
- `src/graph/**` for graph linking and indexes
- `src/checks/**` for generic checks, typed-ref enforcement, composition
  enforcement, and registry/catalog integrity
- `src/plan/**` for document and target planning
- `src/doc/**` and `src/markdown/**` for document AST and markdown renderers
- `src/emit/**` for write behavior and prune enforcement
- `src/cli/**` for validate, doctor, and compile entrypoints

## Canonical Setup Packages

The repo proves the architecture with repo-local setup packages:

- `setups/editorial/**`
- `setups/release_ops/**`

Those packages are intentionally split into local modules such as:

- `roles.ts`
- `workflow.ts`
- `artifacts.ts`
- `references.ts`
- `surfaces.ts`
- `targets.ts`
- `links.ts`
- `index.ts`

`index.ts` is the assembly boundary. The semantic truth inside remains one
plain setup.

## Helper Placement

Helpers belong in the source layer when they:

- improve authoring ergonomics
- lower back into plain setup truth
- do not require new normalized node kinds

Behavior belongs deeper in the compiler when it changes:

- validation semantics
- graph semantics
- plan construction
- emission lifecycle

That same rule is why constrained vocab, operational catalogs, evidence law,
typed refs, and required section contracts live in the normalized model now.

That is why setup-local checks and output ownership live in the source module
envelope, while owned prune behavior lives in planning and emit layers.

It is also why section-emission policy lives in `src/source/**`: section
existence is source truth, not a renderer guess.

## Typed Refs And Composition Boundary

The typed-ref and composition slice follows one strict boundary:

- typed refs are allowed only in TypeScript-authored doctrine blocks in v1
- renderers resolve those refs to plain markdown text before doc-node creation
- fragments stay plain and string-only
- required section contracts live on surfaces as stable slugs, not on helper
  keys or generated section ids
- helper composition carries setup-level lookup truth through the same plain
  `SetupInput` path:
  registries by `id`, catalogs by `kind`

The same boundary now applies to sparse template sections:

- helper-layer emission decides whether a section exists
- checks validate that emitted role-home sections are trustworthy
- plan and render only operate on emitted sections
- wrapper parents with children render as headings plus child sections, not as
  generic fallback prose

That keeps the public authoring surface small while still making the important
drift classes compiler-visible.

## Output Ownership And Prune

Compiler-owned output scopes are part of the architecture now.

The lifecycle is:

1. source modules declare owned scopes
2. planning computes expected outputs
3. emission compares expected outputs to owned files
4. dry-run reports stale owned paths
5. write mode without prune authority fails loudly
6. write mode with explicit prune authority may delete stale owned paths

This keeps deletion explicit and keeps ownership out of ad hoc shell scripts.

## Architectural Guardrails

Do not:

- widen the normalized model just to make helper syntax nicer
- add setup-specific branches in `src/**`
- let generated markdown become semantic input
- smuggle ownership or checks into undocumented side channels
- reopen fragment parsing just to make typed refs work inside markdown files

Do:

- keep setup-local truth under `setups/**`
- keep `src/**` framework-only
- ship docs, examples, and tests together when public authoring surfaces change
- keep typed runtime law narrow
- move drift-sensitive fragment lines into TypeScript-authored doctrine blocks
  instead of pretending fragments are semantic

## Public Proof Surfaces

The architecture is only convincing if the repo shows it publicly in three
places:

- docs that explain the system plainly
- canonical example setups under `setups/**`
- tests that prove manifests, plans, markdown, and diagnostics

For small framework-first surfaces that should not be jammed into the canonical
setups just to make the docs look complete, the repo may also use a synthetic
fixture under `test/fixtures/source/**` and a matching example doc. That is
the right pattern for:

- `registries` and `artifact.evidence`
- typed doctrine refs and required section contracts
