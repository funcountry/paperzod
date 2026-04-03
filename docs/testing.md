# Testing Plan

## Goal

This document defines the proof standard for `paperzod`.

The question is not whether the repo has many tests.
The question is whether we can trust the compiler, its diagnostics, and its
generated markdown.

## What Counts As Real Proof

Useful evidence:

- normalized setup snapshots
- graph summaries and indexes
- structured diagnostics
- compile plans
- emitted file manifests
- final markdown output
- end-to-end compile results for real setup fixtures
- mutation tests that intentionally break required contracts

Weak evidence on its own:

- mock-heavy helper tests
- unstable internal snapshots
- smoke tests that never inspect plans, markdown, or diagnostics

## Proof Targets

The release gate should prove:

1. structured source can express more than one setup
2. the checker catches real contract drift
3. the planner maps semantic truth onto deterministic runtime paths
4. rendered markdown is readable and stable
5. emission and prune behavior are explicit and fail loudly when needed
6. the public docs, examples, and tests stay aligned

## Canonical Fixture Families

### `demo_minimal`

Fast happy-path debugging with very little noise.

### `shared_overrides`

Proof that reusable parts and setup-local keyed overrides work together.

It also proves:

- shared setup parts can now carry `catalogs` and `registries`
- keyed overrides stay collection-aware:
  registries by `id`, catalogs by `kind`

### `editorial_vertical_slice`

A narrow public slice of the high-fidelity editorial setup.

It proves:

- role-home rendering
- shared entrypoint rendering
- packet workflow rendering
- standards and gate rendering
- exact section ids and traces

### `editorial_full`

The high-fidelity public proving setup.

It proves:

- role homes
- shared entrypoint
- authoritative workflow owner
- per-lane packet workflow docs
- standards
- gate docs
- technical references
- how-to guides
- coordination docs
- imported references

### `release_ops`

A second setup with a different path shape and a smaller surface mix.

It proves the compiler is not hard-coded to the editorial example.

### `registry_evidence`

A small synthetic proving fixture for the new typed runtime-law slice.

It proves:

- setup-level registries can carry sanctioned vocab
- artifact evidence contracts normalize into plain setup truth
- graph and check layers can validate registry and evidence integrity
- renderers can emit evidence summaries from structured truth

This fixture exists so the public proof can show the feature clearly without
forcing it into the editorial setup just for demonstration value.

### `typed_doctrine_refs`

A small synthetic proving fixture for typed refs and required composition.

It proves:

- typed refs work in TypeScript-authored doctrine blocks
- paragraphs, list items, and definition-list terms can resolve refs
- graph-backed refs can cover artifacts, surfaces, sections, roles, review
  gates, packet contracts, and references
- command-backed and env-var-backed operational refs render from catalog truth
- required section contracts fail loudly in checks
- generated markdown stays plain even though authored doctrine carried typed refs

## Suite Expectations

The repo should keep meaningful coverage across:

- type-level authoring tests
- source normalization tests
- graph tests
- check tests
- planning and target tests
- render tests
- e2e compile tests
- mutation tests
- CLI tests
- stability tests
- performance sanity tests

When typed runtime-law surfaces change, the smallest honest proof usually
includes:

- `test/types/authoring.test.ts`
- `test/source/nodes.test.ts`
- `test/source/normalize.test.ts`
- `test/graph/indexes.test.ts`
- `test/checks/registry.test.ts`
- `test/checks/typed-inline-refs.test.ts`
- `test/checks/surfaces.test.ts`
- `test/render/role-home-shared.test.ts`
- `test/e2e/authored-content.test.ts`
- `test/source/templates.test.ts`

## Required Commands

When compiler, renderer, planner, target, or canonical setup truth changes,
run:

```sh
npm run typecheck
npm run test:types
npm run build
```

Run the smallest honest targeted suites for the changed area with:

```sh
npx vitest run <paths>
```

Before claiming broad verification, run:

```sh
npm test
```

## Open-Source Scrub Gate

Before calling the repo public, the scrub pass should also prove that the repo
no longer leaks internal proving surfaces or private path assumptions.

Run a repo search for:

- retired internal setup names
- sibling-repo path references
- local absolute workstation paths
- stale private output-root paths

The target state for that scrub search is no hits in tracked public files.

## Release Standard

We should only say the repo is ready when:

- the canonical editorial and release-ops setups both pass
- the generic `registry_evidence` and `typed_doctrine_refs` fixtures still
  prove the typed runtime-law surface cleanly
- targeted suites for changed layers pass
- the full suite passes
- snapshot updates were reviewed, not churned blindly
- public docs still describe the system the tests actually prove
