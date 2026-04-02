# Testing Plan

## Goal

This document defines how `paperzod` will prove that it has actually achieved
the product goals in
[docs/requirements.md](/Users/aelaguiz/workspace/paperzod/docs/requirements.md).

The standard is not "we have a lot of tests."
The standard is:

- we can trust the compiler
- we can trust the diagnostics
- we can trust the generated markdown
- we can trust that the product satisfies the Lessons proving case without
  becoming Lessons-specific

Current status:

- the automated release gate is currently green
- current automated evidence:
  - `49` test files passed
  - `166` tests passed
  - root typecheck passed
  - type-only authoring tests passed
  - build passed
  - the helper-backed editorial proving example passed through source, API,
    e2e, and CLI proof
- this document remains the normative release-gate spec for future changes

## First rule

We are not testing implementation trivia.
We are testing whether `paperzod` can replace a fragile hand-maintained
doctrine graph with a trustworthy compiled doctrine system.

If a test does not help answer that question, it is probably bullshit.

## Anti-bullshit rules

The following do not count as meaningful proof on their own:

- line coverage percentages
- tests that only assert private helper calls
- tests that only assert a mocked collaborator was invoked
- snapshots of unstable internal implementation details
- CLI smoke tests that do not inspect diagnostics, plans, diffs, or output
- render tests that only assert "a string was returned"
- graph tests that never exercise real setup fixtures

The following do count as meaningful proof:

- snapshots of normalized `SetupDef` objects
- snapshots of structured diagnostics
- snapshots of `CompilePlan` outputs
- snapshots of final emitted markdown
- emitted path manifests and file diffs
- end-to-end compile results for real fixtures
- mutation tests that intentionally break required contracts

Mocking should be minimal.
Use mocks only at hard boundaries such as filesystem writes or process-level
CLI invocation.

Most tests should run real source fixtures through real validation, graph,
planning, and rendering code.

## Product proof standard

We should only say the project has achieved its goals when all of the
following are proven:

1. Structured source can express the required doctrine model for at least two
   distinct setups.
2. The source model can express the full Lessons proving case honestly,
   including role homes, shared owners, packet workflow docs, standards, gates,
   references, and exact section-level links.
3. The model can also express a second non-Lessons setup without
   Lessons-specific branches.
4. Source validation rejects malformed definitions with useful, setup-aware
   diagnostics.
5. Graph linking rejects broken references and produces stable identity and
   ownership indexes for valid input.
6. Rule checks catch the drift classes named in the requirements doc.
7. Compile planning maps semantic nodes onto runtime files and exact runtime
   sections correctly.
8. Rendered markdown is readable, deterministic, and suitable for normal
   repo-owned doctrine surfaces.
9. The compiler is one-way:
   authored source is truth, generated markdown is runtime output, and manual
   edits to generated output are not treated as semantic source.
10. Shared building blocks can be reused across setups while preserving
    setup-local wording, paths, standards, gate rules, and compatibility
    mappings.
11. Small source changes produce narrow, intelligible plan and markdown diffs.
12. Re-running the compiler on unchanged input produces byte-identical output
    and stable diagnostics.

If any one of those remains unproven, the product is not done.

## Primary evidence artifacts

These are the artifacts that matter enough to snapshot or diff:

- `SetupDef`
- `DoctrineGraph` summaries and indexes
- structured diagnostics
- `CompilePlan`
- emitted file manifests
- final markdown files
- CLI stdout and stderr

These are the artifacts that do not matter enough to be a release gate:

- internal helper return values with no product meaning
- intermediate AST node shapes unless they directly explain a render failure
- raw mock interaction histories

## Fixture families

We need five fixture families.

### `demo_minimal`

A tiny setup used to prove the happy path with minimal noise.

It should contain:

- 2 roles
- 1 workflow step
- 1 review gate
- 1 packet contract
- 1 required artifact
- 1 support artifact
- 1 interim artifact
- 2 generated targets

Its job is fast debugging and narrow product proof.

### `shared_overrides`

A fixture family specifically for reuse and override behavior.

It should contain:

- shared reusable definitions consumed by two setups
- setup-local wording overrides
- setup-local output path overrides
- setup-local gate rule overrides
- setup-local compatibility mapping overrides

Its job is proving that reuse works without hiding local ownership.

### `lessons_vertical_slice`

A small but real Lessons slice.

It must include:

- one role-home `AGENTS.md`
- one project-shared `README.md`
- one packet workflow doc
- one standards doc
- one gate doc
- one imported grounding reference
- exact sections such as `Read First`, `Role Contract`, `Comment Shape`,
  `Specialist Turn Shape`, and one lane contract section

Its job is proving that the real Lessons shape works in a narrow vertical
slice.

### `lessons_full`

A high-fidelity Lessons proving setup.

The canonical repo-local source now lives in `setups/lessons/index.ts`.
That package is intentionally split across `roles.ts`, `workflow.ts`,
`artifacts.ts`, `references.ts`, `surfaces.ts`, `targets.ts`, and `links.ts`,
with `index.ts` as the only assembly boundary.
`test/fixtures/source/lessons-full.ts` is only a thin test-facing import
surface when a fixture-shaped path is still useful.

It must model the live surface families called out in the requirements:

- role-home docs
- shared `README.md`
- top-level workflow owner
- per-lane workflow docs
- standards
- gate docs
- technical references
- how-to guides
- coordination docs
- imported refs

It must also model:

- the cleaner conceptual artifact chain described in the ref docs
- the larger current runtime packet bundle that still exists on disk
- exact section-level contracts such as `Read First`, `Role Contract`,
  `Comment Shape`, `Specialist Turn Shape`, `What This Lane Must Do`, and gate
  rule sections

Its job is proving that the full Lessons requirement set is truly satisfied.

### `second_setup`

A second non-Lessons setup.

The canonical repo-local source now lives in `setups/core_dev/index.ts`.
That package follows the same modular local layout and still exports one plain
`SetupInput` from `index.ts`.

Candidates:

- `core_dev`
- `copy_pod`
- `content_ops`

Its job is proving that the system is genuinely multi-setup and not a
Lessons-shaped compiler.

## Test suites

The complete test plan has eleven suites.

### 1. Type-level authoring tests

These tests prove that the authoring API is actually usable in TypeScript.

They must prove:

- `defineSetup(...)` accepts valid setup declarations
- invalid enum values fail at type-check time when possible
- shared builders preserve useful literal information
- setup-local overrides remain type-safe
- exported core types are stable enough for users to program against

These tests matter because authoring ergonomics are part of the product.

### 2. Source shape tests

These tests validate node and link shapes in isolation.

They must prove:

- valid setup identity passes
- valid role identity passes
- valid workflow step shape passes
- valid review gate shape passes
- valid packet contract shape passes
- valid artifact shape passes for `required`, `conditional`, `support`,
  `reference`, and `legacy`
- valid surface shape passes for every required surface class
- valid surface section shape passes
- valid reference shape passes for every required reference class
- valid generated target shape passes
- valid link shape passes for every required link family

They must fail on:

- missing required fields
- invalid enum members
- malformed arrays
- malformed nested objects
- malformed route declarations
- malformed target declarations
- invalid conceptual-vs-runtime mapping declarations

### 3. Authoring composition and normalization tests

These tests prove that ergonomic authored source lowers into stable plain
definitions without losing meaning.

They must prove:

- builder helpers normalize into the same `SetupDef` as plain-object authoring
- shared reusable building blocks normalize correctly in multiple setups
- setup-local wording survives normalization
- setup-local path overrides survive normalization
- setup-local standards and gate rules survive normalization
- setup-local compatibility mappings survive normalization
- normalization preserves exact section-level data
- normalization preserves interim artifacts and support inputs
- normalization is deterministic

### 4. Graph linking and identity tests

These tests prove that valid definitions become a real doctrine graph.

They must prove:

- every node is indexed by stable id
- every link resolves to a real node
- every section belongs to a real surface
- workflow routes resolve
- generated targets resolve to real source units
- packet-to-runtime mappings resolve
- documentation links resolve correctly
- grounding links resolve correctly
- generation-provenance links resolve correctly
- ownership indexes are correct
- producer and consumer indexes are correct
- contract-surface and reference-surface classifications are preserved

They must fail on:

- broken `from`
- broken `to`
- duplicate ids
- section pointing at a missing surface
- route pointing at a missing step or gate
- mapping to a missing runtime artifact
- missing canonical owner when one is required

### 5. Workflow and contract semantics tests

These tests prove the actual doctrine logic, not just the graph structure.

They must prove:

- every workflow step has a role, purpose, required inputs, required outputs,
  stop line, and next owner or reviewer
- support inputs are not treated as required contract inputs
- interim artifacts can exist without pretending to be final trusted outputs
- downstream lanes can consume either direct artifacts or packet contracts as
  intended
- packet contracts express what later lanes are allowed to trust
- gates check the units they claim to check
- conceptual contracts and runtime compatibility residue can coexist honestly
- reference-only and support-only material is not mistaken for runtime
  contract output
- documented contract surfaces, grounding inputs, and looser support
  references are distinguished honestly

They must fail on:

- missing required inputs
- missing required outputs
- incomplete turn contracts
- lane outputs with no required downstream consumer or gate
- a downstream lane trusting a unit that was never produced or gated
- a gate depending on sections or artifacts that do not exist
- compatibility residue being treated as a live contract by mistake

### 6. Drift and rule-engine tests

These tests prove the checker catches the drift classes named in the
requirements doc.

They must fail on:

- broken links
- duplicate canonical owners
- orphaned sections
- stale packet references
- stale section references
- role contracts pointing at missing shared promises
- workflow owners no longer covered by packet docs or standards
- generated targets mapped from missing source units
- conceptual contract changed while runtime compatibility mapping stayed stale
- simplifying a lane without updating gate checks
- changing a role contract without updating dependent generated docs

They must also prove:

- legitimate non-owner references do not trigger ownership failures
- pointer-style references to canonical owners remain valid

### 7. Compile planning tests

These tests prove the compiler can translate graph semantics into runtime
doctrine surfaces and sections.

They must prove:

- semantic nodes are assigned to the correct runtime files
- exact source units are assigned to the correct runtime sections
- one conceptual contract can map to multiple runtime files where needed
- several source units can merge into one runtime file predictably
- every generated file and generated section can be traced back through
  `generated_target` and `generated_from` provenance
- stable section ordering is preserved
- stable file ordering is preserved
- target paths conform to the chosen target adapter
- file ownership is stable
- compile plans are serializable and reviewable

They must fail on:

- unresolved target paths
- target path collisions
- two incompatible owners assigned to one exclusive section
- required generated sections missing real source backing
- a runtime target claiming to exist with no renderable source content

### 8. Markdown render tests

These tests prove the runtime output is actually usable doctrine.

They must prove:

- output is plain markdown
- output is deterministic
- repeated renders are byte-identical on unchanged input
- headings are correct
- stable section targets are preserved through the deliberate raw HTML anchor
  output contract
- exact section identities survive heading rewrites
- renderer output does not leak raw JSON, debug objects, or schema jargon
- role-home output reads like a real `AGENTS.md`
- shared workflow output reads like a real shared doctrine doc
- standards and gate docs read like standards and gate docs, not generic
  dumps
- references are clearly distinguished from runtime contract docs
- pointer-to-owner rendering does not duplicate canonical contract prose where
  the model says to point instead of copy

They must include snapshots for:

- a role-home doc
- a shared entrypoint doc
- a workflow owner doc
- a packet workflow doc
- a standards doc
- a gate doc
- a technical reference doc
- a how-to doc
- a coordination doc

### 9. One-way generation, diff-locality, and emission tests

These tests prove the runtime model is truly one-way and operationally sane.

They must prove:

- compile output is fully derived from structured source
- existing generated markdown is not parsed back as semantic source
- manual edits to generated output are overwritten or surfaced as diffs on the
  next compile
- unchanged files are not rewritten unnecessarily
- one localized source change produces a localized compile-plan diff
- one localized source change produces a localized markdown diff
- generated output can land in normal repo-owned doctrine paths
- dry-run mode writes nothing
- diff mode reports meaningful file-level and section-level changes
- write mode creates and updates files safely

They must fail or warn on:

- writes outside the configured output scope
- conflicting emitted targets for the same path
- invalid output roots

### 10. CLI and operator-experience tests

These tests prove the real product surface is usable by a human operator.

They must prove:

- `paperzod validate <setup>` succeeds on valid input
- `paperzod validate <setup>` fails non-zero on invalid input
- `paperzod compile <setup>` succeeds on valid input
- `paperzod compile <setup>` fails non-zero when checks fail
- `paperzod compile --dry-run` reports planned writes without writing
- `paperzod doctor <setup>` explains failures in human-readable form
- CLI diagnostics include setup id, node id, phase, and actionable message

### 11. End-to-end proving suites

These are the release gate suites.

Each proving suite must run real setup source through real validation, graph,
planning, rendering, and emission logic.

## End-to-end proving matrix

### Proving case A: `demo_minimal`

This fixture passes only if:

- source validates
- graph resolves
- compile plan builds
- markdown renders
- emitted files match golden output
- one forced drift mutation produces the expected diagnostic

### Proving case B: `shared_overrides`

This fixture passes only if:

- shared definitions are reused in more than one setup
- setup-local wording overrides survive to final markdown
- setup-local path overrides survive to emitted targets
- setup-local gate rule differences survive to final docs
- local ownership remains obvious despite reuse

### Proving case C: `lessons_vertical_slice`

This fixture passes only if:

- the model includes exact runtime surfaces and exact sections
- generated role-home and shared docs read like real doctrine
- one conceptual packet contract maps honestly to current runtime outputs
- imported reference material is represented without pretending it is a
  generated contract surface
- at least `Read First`, `Role Contract`, `Comment Shape`,
  `Specialist Turn Shape`, and one lane contract section can be traced from
  source node to final markdown section
- a section rename without updated links fails as expected

### Proving case D: `lessons_full`

This fixture passes only if:

- all required Lessons surface families are represented
- emitted target paths fit a `paperclip_agents`-style doctrine tree
- full compile output is deterministic
- every required generated file maps back to real source nodes
- exact section-level read dependencies are represented
- conceptual packet contracts and current runtime bundles are both present in
  the graph and linked honestly
- at least one role-home section, one shared section, one packet section, one
  standards section, and one gate section can each be traced from source node
  to final markdown
- removing a critical standards or gate section causes the expected failures

### Proving case E: `second_setup`

This fixture passes only if:

- the same compiler pipeline works without Lessons-specific branches
- output paths and surface mixes differ from Lessons where appropriate
- shared compiler logic remains unchanged
- setup-local wording, standards, gate rules, and compatibility mappings are
  preserved

## Mutation and regression suite

We need explicit "break it on purpose" tests.

For each major fixture, create mutations such as:

- rename a role id without updating links
- rename a packet id without updating linked owners
- rename a section slug without updating readers
- rewrite a heading while keeping the stable id
- remove a required output
- remove a gate check
- move an artifact from `required` to `support` incorrectly
- remove an interim artifact that a later lane still references
- delete a runtime mapping for a still-live compatibility artifact
- assign two owners to one single-owner unit
- route a step to a missing next step
- change a standards rule without updating dependent gate docs

Each mutation should assert:

- the failing phase is correct
- the diagnostic code is stable
- the diagnostic message names the broken unit clearly
- the fix surface is obvious from the diagnostic

## Requirement coverage matrix

Every major requirement needs an explicit proving suite.

| Requirement area | What must be proven | Primary suites | Primary fixtures |
| --- | --- | --- | --- |
| Standalone multi-setup product | The compiler works for more than one setup shape | Type-level, normalization, end-to-end | `shared_overrides`, `second_setup` |
| Setup identity and role identity | Stable setup and role identities exist and resolve | Source shape, graph linking | all fixtures |
| Workflow steps and handoff order | Steps, routes, gates, and next-owner logic are valid | Source shape, semantics, compile planning | `demo_minimal`, `lessons_full`, `second_setup` |
| Review gates | Gates check real units and influence trust | Semantics, drift, render | `demo_minimal`, `lessons_full` |
| Packet and artifact contracts | Required, support, interim, legacy, conceptual, and runtime artifacts behave correctly | Source shape, semantics, compile planning | `demo_minimal`, `lessons_vertical_slice`, `lessons_full` |
| Runtime doctrine surfaces | All required surface families can be modeled and emitted | Source shape, compile planning, render | `lessons_full`, `second_setup` |
| Exact doctrine sections | Exact section-level reads, ownership, and generation work | Graph linking, semantics, render | `lessons_vertical_slice`, `lessons_full` |
| Support docs and references | Technical, grounding, imported, and external references are classified honestly | Source shape, semantics, render | `lessons_vertical_slice`, `lessons_full` |
| Generated markdown files and sections | Generated files and sections map back to source units | Graph linking, compile planning, render | all fixtures |
| Typed links | All link families validate and resolve | Source shape, graph linking | all fixtures |
| Required inputs, support inputs, interim work, outputs, stop lines | Full turn contracts are enforced | Source shape, semantics | `demo_minimal`, `lessons_full` |
| What downstream lanes may trust | Packet contracts and gate checks establish trusted outputs | Semantics, drift | `demo_minimal`, `lessons_full` |
| Canonical ownership | Single-owner rules are enforced and pointer-style reuse works | Graph linking, drift, render | `lessons_vertical_slice`, `lessons_full` |
| Plain markdown runtime output | Output is readable markdown, not a special UI format | Render, end-to-end | all fixtures |
| Repo-owned doctrine surfaces | Generated output lands safely in normal target file trees | Compile planning, one-way generation, end-to-end | `lessons_full`, `second_setup` |
| One-way generation | Structured source is truth and runtime markdown is output only | One-way generation, emission, end-to-end | all fixtures |
| Lightweight authoring and reuse | Shared building blocks and local overrides work sanely | Type-level, normalization, end-to-end | `shared_overrides`, `second_setup` |
| Small structural changes and easy review diffs | Localized changes produce localized plan and markdown diffs | One-way generation, emission, mutation suite | all fixtures |
| Rename maintenance ergonomics | Display-text renames stay local, id renames fail loudly and specifically | Mutation suite, determinism checks, CLI diagnostics | all fixtures |
| Drift detection | Required drift classes are caught mechanically | Drift suite, mutation suite | all fixtures |
| Lessons fit | The full Lessons proving case is modeled honestly | End-to-end, render, semantics | `lessons_vertical_slice`, `lessons_full` |

If a requirement area has no convincing proving suite, the product is not yet
verified.

## Manual review rubric

Some product claims are human-facing and should stay human-checked.

For each major proving fixture, review generated markdown and confirm:

- the docs read like normal Paperclip doctrine
- responsibilities are obvious
- required inputs and outputs are obvious
- stop lines are obvious
- the file and section hierarchy is readable
- references are clearly distinguished from runtime contract docs
- the output feels authoritative, not templated or robotic

Manual review is not a substitute for automated tests.
It is an additional gate for the readability claims in the requirements.

## Determinism and stability checks

The compiler must be boring in the right ways.

Required checks:

- same input produces byte-identical markdown
- same input produces the same diagnostics in the same order
- ordering does not depend on object insertion accidents
- changing heading text alone does not change stable section identity
- changing one source unit does not reorder unrelated output

## Performance guardrails

Performance is not the main claim, but the tool must still feel practical.

At minimum we need guardrail tests for:

- compile time for `demo_minimal`
- compile time for `lessons_full`
- memory staying reasonable at Lessons-fixture scale

Exact thresholds can be set later, but the tests should exist from the start
so regressions are visible.

## Release gate

Before saying `paperzod` is successful, all of these must be true:

- all type-level authoring tests pass
- all source shape tests pass
- all normalization tests pass
- all graph linking tests pass
- all workflow and contract semantics tests pass
- all drift and rule-engine tests pass
- all compile planning tests pass
- all render tests pass
- all one-way generation and emission tests pass
- all CLI tests pass
- `demo_minimal` passes end-to-end
- `shared_overrides` passes end-to-end
- `lessons_vertical_slice` passes end-to-end
- `lessons_full` passes end-to-end
- `second_setup` passes end-to-end
- manual review passes for the main proving fixtures

That is the standard for "we achieved the goal."

## Implementation order for the tests

The safest build order is:

1. type-level authoring tests
2. source shape tests
3. normalization tests
4. graph linking tests
5. workflow and contract semantics tests
6. drift and rule-engine tests
7. compile planning tests
8. render tests
9. one-way generation and emission tests
10. CLI tests
11. end-to-end proving suites

That order matches the architecture and forces us to prove the product from
source model outward instead of hiding gaps behind a late end-to-end test.
