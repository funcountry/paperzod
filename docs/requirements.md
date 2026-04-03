# Requirements

## Goal

`paperzod` is a standalone compiler for structured Paperclip doctrine.

It must let a setup author define semantic workflow truth once, validate the
graph mechanically, and compile the markdown that agents actually read at
runtime.

The product is generic. The repo proves that claim with two canonical setups:

- `editorial` as the high-fidelity proving case
- `release_ops` as a second setup with a different path shape and surface mix

## Product Boundary

`paperzod` is responsible for:

- authoring-time setup definitions
- graph validation
- compile planning
- deterministic markdown rendering
- target-specific output planning and emission

`paperzod` is not responsible for:

- parsing generated markdown back into source truth
- owning arbitrary CommonMark authoring
- being specific to one pod, one repo, or one workflow style
- becoming a bag of setup-local scripts

## Core Requirements

The system must represent:

- setup identity
- roles
- workflow steps
- review gates
- packet contracts
- artifacts
- setup-level registries
- setup-level operational catalogs
- artifact evidence contracts
- typed doctrine refs inside TypeScript-authored blocks
- runtime surfaces
- exact surface sections
- required section contracts on surfaces
- references
- generated targets
- typed links between those units

The system must express:

- required inputs
- optional support inputs
- required outputs
- stop lines
- next-step and next-gate routing
- section-level reads
- single ownership where single ownership is expected
- compatibility residue where conceptual contracts and runtime bundles differ
- sanctioned vocab where runtime law should come from one canonical setup-level
  source
- sanctioned operational refs where runtime law should not drift in prose
- required evidence artifacts and required claims for trust-sensitive artifacts
- required canonical section families for generated surfaces

## Runtime Requirements

- Generated output must be plain markdown.
- Generated markdown must be readable without a custom UI.
- Generated output must work with Paperclip-style `paperclip_home/**` layouts.
- Stable section anchors must survive heading rewrites.
- Generated output is runtime output, not a second semantic truth system.

## Authoring Requirements

- The stable low-level contract is plain `SetupInput`.
- Ergonomic helpers may exist on top of `SetupInput`, but they must lower back
  into the same normalized model.
- Setup-local prose should stay easy to write in markdown fragments.
- Drift-sensitive prose may move into TypeScript-authored blocks when it needs
  typed refs; fragments stay plain in v1.
- Shared document shapes should be reusable across setups.
- Setup-local checks and output ownership should be declarative, not hidden in
  shell scripts.
- Typed runtime law should stay small and explicit instead of leaking into
  arbitrary prose conventions.

## Validation Requirements

The checker must reject:

- broken ids and broken links
- malformed turn contracts
- duplicate stable ids
- duplicate owners where the model expects one owner
- missing required outputs
- invalid gate checks
- invalid runtime artifact mappings
- duplicate registry ids and duplicate registry entry ids
- duplicate catalog kinds and duplicate catalog entry ids
- invalid registry references from artifact evidence claims
- missing or circular artifact evidence dependencies
- broken typed refs to missing or wrong-kind targets
- missing required section families on realized surfaces
- generated targets that do not map back to real source units

The checker should make drift visible when:

- a role reads a section that no longer exists
- a gate points at a missing packet or section
- a shared standard is removed or renamed without updating dependents
- an emitted output tree no longer matches compiler-owned output declarations

## Output Management Requirements

- Setup modules may declare owned output scopes.
- Prune behavior must stay explicit.
- Dry-run should report owned deletes without mutating files.
- Write mode without prune authority should fail loudly when owned stale files
  are present.
- The repo should not depend on ad hoc shell delete lists to keep emitted trees
  clean.

## Public Proof Requirements

The repo must prove the generic contract with public, readable examples:

- docs that explain the product in plain English
- canonical setup packages under `setups/**`
- fixture-backed tests that exercise real setup shapes
- snapshots or inline expectations that prove manifests, plans, and markdown

The public proof should show:

- a high-fidelity setup with role homes, shared entrypoints, workflow owners,
  packet workflow docs, standards, gates, and references
- a second setup with a different shape that uses the same compiler pipeline
- setup-local wording, paths, and ownership without core compiler branches
- one generic constrained-vocab, typed-ref, and artifact-evidence story that is
  not tied to Lessons-specific nouns
- a small synthetic proving fixture when a framework feature should be shown
  clearly without being forced into the canonical setup packages

## Acceptance Checklist

The project meets this requirements doc when all of the following are true:

1. `SetupInput` can model both canonical setups honestly.
2. Helper-backed authoring stays additive and lowers into plain setup truth.
3. The checker catches the failure classes above with useful diagnostics.
4. The planner maps semantic truth onto deterministic runtime paths.
5. Emitted markdown is readable and stable.
6. Setup-local checks, owned output scopes, shared projection, keyed overrides,
   and narrow markdown fragments all work without widening the normalized node
   model.
   `applyKeyedOverrides(...)` remains collection-aware and stable-selector based:
   registries by `id`, catalogs by `kind`.
7. The repo-level docs, examples, and tests all tell the same public story.
