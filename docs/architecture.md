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

### Resolved graph

This is where ids, ownership, section lookups, and workflow indexes are linked.

### Compile plan

This is the concrete runtime output plan:

- document ids
- section ids
- rendered paths
- source traces
- ownership and prune metadata

### Rendered documents

This is the final markdown plus manifest information.

## Repo Layering

The repo keeps each compiler phase local:

- `src/source/**` for authoring helpers, modules, composition, fragments, and
  normalization
- `src/graph/**` for graph linking and indexes
- `src/checks/**` for generic checks and registry composition
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

That is why setup-local checks and output ownership live in the source module
envelope, while owned prune behavior lives in planning and emit layers.

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

Do:

- keep setup-local truth under `setups/**`
- keep `src/**` framework-only
- ship docs, examples, and tests together when public authoring surfaces change

## Public Proof Surfaces

The architecture is only convincing if the repo shows it publicly in three
places:

- docs that explain the system plainly
- canonical example setups under `setups/**`
- tests that prove manifests, plans, markdown, and diagnostics
