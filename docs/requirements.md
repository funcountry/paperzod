# Requirements

## Goal

Build `paperzod` as a standalone project for authoring structured doctrine,
validating doctrine graphs, and compiling runtime markdown for Paperclip
setups.

These are the requirements for `paperzod` itself.
They are not the requirements for the Lessons pod.

Lessons is the main proving case right now, so the product must be able to
satisfy the Lessons reference material in
[`docs/ref`](/Users/aelaguiz/workspace/paperzod/docs/ref) and the live Lessons
shape in `../paperclip_agents`, while still remaining general-purpose.

Status as of 2026-04-01:

- the current prototype implements and proves the core compiler path described
  here against fixture-based proving cases
- this document remains normative product scope, not a changelog
- exact live path parity with every current `paperclip_agents` surface is an
  example-layer concern and should not be confused with the core product
  boundary

## Product boundary

`paperzod` should be able to model and compile doctrine for more than one
Paperclip setup.

Examples:

- Lessons
- a core dev setup
- a copy or content setup
- any future Paperclip project or pod with its own roles, workflow, standards,
  and handoff rules

The product must not assume:

- one setup per repo
- one workflow style
- one packet style
- one directory layout
- one target output tree

## The short version

We do not just want better docs.

We want a standalone doctrine compiler that can:

- define the source-of-truth graph for a setup
- validate the graph mechanically
- compile runtime markdown from that graph
- detect drift when the graph and output no longer match

The runtime surface still needs to be ordinary markdown.
Paperclip agents should be able to read the output directly.

## Core product requirements

The product must be able to represent:

- setup identity
- roles and agent identities
- workflow steps and handoff order
- review gates
- packet and artifact contracts
- runtime doctrine surfaces
- exact doctrine sections within those surfaces
- support docs and reference docs
- generated markdown files and generated sections
- typed links between all of those units

The product must also be able to express:

- required inputs
- optional support inputs
- interim work products
- required outputs
- stop lines
- next owner or next reviewer
- what later lanes are allowed to trust
- one canonical owner for each rule or contract

## Runtime requirements

- The runtime output must be plain markdown.
- Generated markdown should be readable without a custom UI or proprietary
  viewer.
- Generated markdown should be able to land in normal repo-owned doctrine
  surfaces.
- The system should support one-way generation:
  author structured source, compile markdown, treat markdown as runtime output.
- The system should not require humans to maintain the structured source and
  the generated markdown as equal peer truth systems.

## Authoring requirements

- The authoring surface must stay lightweight.
- TypeScript plus Zod is acceptable if it keeps the model clear and strongly
  typed.
- Small structural changes should require small source edits.
- Shared building blocks should be reusable across setups.
- Setup-local wording, paths, and standards should still be easy to express.
- Human writing still matters. The compiler should help maintain doctrine, not
  replace clear prose with dense metadata.

## Doctrine graph requirements

The system must treat doctrine as a graph, not just a pile of files.

That means it must be able to model:

- which source unit owns which rule
- which role reads which exact shared sections
- which step produces which packet or artifact
- which gate checks which outputs or sections
- which surfaces are runtime contract surfaces
- which surfaces are support or reference only
- which generated sections come from which source units

If the graph stays implicit, the project fails.

## Section-level addressability requirements

This is a hard requirement, not an optional nice-to-have.

- Every important doctrine unit must have a stable identifier.
- The system must support links to exact generated sections, not just whole
  files.
- Roles, workflow steps, gates, and packet contracts must be able to depend on
  exact shared sections, not only on whole documents.
- Stable ids should survive heading rewrites and prose edits.
- Generated markdown should preserve stable anchors or equivalent stable
  section targets.

This requirement comes directly from the Lessons reference docs, which
explicitly ask for section-level ownership and linking.

## Ownership requirements

- Each important rule, workflow meaning, or contract should have one canonical
  owner.
- The owner might be:
  - a role-local contract
  - a project-shared workflow owner
  - a packet workflow owner
  - a standard section
  - a gate section
  - a support or reference owner
- The checker should reject competing owners for the same doctrine unit when
  the system expects a single owner.
- The product should prefer pointers to the owner over duplicated prose across
  multiple generated files.

## Turn contract requirements

For each workflow step, the model must be able to declare:

- role name
- purpose
- required inputs
- optional support inputs
- interim artifacts
- required outputs
- stop line
- next owner or reviewer

These cannot remain mere writing conventions if we want reliable validation.

## Surface requirements

The product must treat runtime doctrine surfaces as first-class objects.

It must be able to model surface families such as:

- role-home docs
- shared entrypoint docs
- top-level workflow owners
- per-lane workflow docs
- standards
- gate docs
- technical references
- how-to guides
- coordination docs

And it must be able to model sections inside those surfaces.

That means the source model needs to represent both:

- the file-level runtime surface
- the stable addressable section-level units inside that file

## Packet and artifact requirements

Each artifact or packet member should declare:

- what kind of thing it is
- whether it is required, conditional, support, reference-only, or legacy
- who produces it
- who consumes it
- whether downstream lanes consume it directly or only through a rolled-up
  packet
- whether it is a live runtime contract or a compatibility residue

The product must also distinguish between:

- conceptual contracts
- current runtime files

That matters because one conceptual packet contract may still map to several
current on-disk files while an existing setup is being cleaned up.

The product must model that explicitly.

## Reference requirements

The product must be able to contain and classify references we care about.

That includes:

- setup-local technical references
- setup-local how-to guides
- imported grounding docs
- external or non-generated references
- references that are read by roles but are not themselves lane contracts

The system should be able to say whether a reference is:

- runtime-readable doctrine
- support material
- grounding material
- imported reference input
- external reference only

This requirement exists so the project can honestly model both live doctrine
and the references that shape it.

## Validation requirements

The checker should reject:

- broken links
- missing required inputs
- missing required outputs
- incomplete turn contracts
- duplicate stable ids
- duplicate canonical owners when single ownership is expected
- orphaned sections that should be reachable from a workflow or owner map
- stale references to removed packet names or removed sections
- role contracts that depend on shared promises that no longer exist
- workflow owners that point to packet docs or standards that no longer cover
  the required contract
- generated targets that do not map back to real source units
- lane outputs with no downstream consumer or gate when one is required

The checker should also detect drift such as:

- renaming a packet without updating linked owners
- renaming a section without updating linked owners
- simplifying a lane without updating gate checks
- changing a role contract without updating generated docs that depend on it
- changing a conceptual contract while leaving runtime compatibility mappings
  stale

## Extensibility requirements

The product should support both shared and setup-specific doctrine.

That means we need room for:

- reusable building blocks shared across setups
- setup-local overrides
- setup-local wording
- setup-local output paths
- setup-local gate rules
- setup-local compatibility mappings

Reuse should reduce duplication.
It should not make local ownership harder to see.

## Ergonomic requirements

- Review diffs should make structural changes easy to inspect.
- Renaming a role, packet, or standard should not require a scavenger hunt.
- It should be obvious where to add a new lane, artifact, gate, surface, or
  reference.
- The same language should stay consistent across requirements, schema, source,
  and generated output.

## Lessons fit requirements

These are still product requirements for `paperzod`.
They exist because the current Lessons setup is the proving case.

Current implementation note:

- the prototype proving fixtures already cover most of this shape
- exact live role-home path parity with `paperclip_home/agents/<role>/AGENTS.md`
  is still a target shape rather than a fully shipped adapter convention

The product must be able to model a setup that looks like the live Lessons
shape in `../paperclip_agents`, including:

- role-local `paperclip_home/agents/<role>/AGENTS.md`
- a project-shared start-here doc such as
  `paperclip_home/project_homes/lessons/shared/README.md`
- a top-level workflow owner such as
  `AUTHORITATIVE_LESSONS_WORKFLOW.md`
- per-lane workflow docs under `proof_packets/`
- standards under `lessons_content_standards/`
- gate docs such as `LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md`
- technical references under `technical_references/`
- how-to guides under `how_to_guides/`
- coordination docs under `agent_coordination/`
- imported grounding references such as the copied docs in
  [`docs/ref`](/Users/aelaguiz/workspace/paperzod/docs/ref)

The product must also be able to express the current Lessons tension between:

- the cleaner conceptual artifact chain described in the reference docs
- the larger current packet bundle that the live runtime still uses

And it must be able to model exact doctrine sections such as:

- role-home `Read First`
- role-home `Role Contract`
- shared `Comment Shape`
- shared `Specialist Turn Shape`
- packet workflow `What This Lane Must Do`
- standards and gate rule sections

If the product cannot model both the file-level surfaces and those exact
section-level contracts, it does not satisfy the reference case.

## Non-goals

- This is not a replacement for Paperclip issue coordination.
- This is not a generic knowledge graph for every repo concern.
- This is not a publishing framework project.
- This is not a second live doctrine universe that humans also edit by hand.
- This is not a request to replace clear human writing with dense metadata.

## Success criteria

We should call this successful when:

- one setup can be authored from structured source and compiled into usable
  markdown
- the checker catches the drift that humans currently catch late or miss
- the generated markdown remains readable and trustworthy
- the system can honestly model the Lessons reference case without flattening
  its role-home, shared-owner, standards, gate, section, and reference
  structure
- the language also generalizes cleanly to at least one non-Lessons setup
- the total model is smaller and clearer than the hand-maintained doctrine
  graph it replaces
