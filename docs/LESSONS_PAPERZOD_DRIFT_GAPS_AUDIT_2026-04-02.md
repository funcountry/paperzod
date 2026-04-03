# Lessons Paperzod Drift Gaps Audit

Date: 2026-04-02  
Status: active  
Scope: `doctrine_src/lessons/**` and the current `../paperzod` source surface

## TL;DR

`paperzod` is already good at enforcing graph truth.
It can protect setup shape, ids, workflow order, link validity, generated
section provenance, output path ownership, and a lot of packet and artifact
structure.

It is not yet good at enforcing authored doctrine inside prose.
Once a rule is written as a paragraph, list item, definition entry, or
fragment line, the compiler mostly sees an opaque string.

That leaves a large class of still-driftable runtime law in the Lessons source:

- packet filenames and packet composition
- next-owner routing text
- role-home section names repeated in prose
- verdict and publish-state vocab
- proof-schema requirements
- support-file families and compatibility residue
- tool paths, commands, hostnames, and route labels
- role-to-support-section attachment
- output-prune ownership that is wired, but not locally checked

This document is the full audit of those gaps, with specific examples and the
best current guess about whether the fix belongs in local source cleanup or in
`paperzod` itself.

## What Counted As Driftable

For this audit, a thing counted as driftable when both of these were true:

- it reads like live runtime law, not just explanatory prose
- changing the underlying truth would not fail current `paperzod` validation,
  current Lessons-local checks, or generated-output audits

I did not count purely qualitative standards text that is not trying to mirror
a structured source-of-truth object.
Examples:

- general quality-bar prose
- coaching-tone guidance
- ordinary explanatory sentences with no canonical ids, paths, packet names,
  or status values embedded in them

## Audit Method

This was a read-heavy audit, not a product-test pass.

- Read the full Lessons source under `doctrine_src/lessons/**`.
- Read the relevant `paperzod` source that defines authored content, templates,
  graph validation, planning, and emit behavior.
- Ran parallel audit passes over:
  - role-local doctrine
  - shared workflow, standards, and references
  - model and checks
  - current `paperzod` capability boundaries
- One parallel verifier reported that `doctor`,
  `scripts/audit_lessons_doctrine_shape.sh`, and
  `scripts/audit_lessons_compiled_output.sh` all pass on the current tree.
  That is consistent with these findings being semantic drift gaps, not basic
  graph-breakage.

## What Paperzod Enforces Well Today

These are not the problem.

- Setup graph shape:
  ids, node kinds, link kinds, section slugs, generated-target provenance, and
  owned output scope overlap.
- Workflow graph truth:
  role ids, required inputs and outputs, next step and next gate targets,
  critic-step ownership, and publish-gate structure.
- Surface and section truth:
  surface existence, section parent rules, section addressability, and
  generated target linkage.
- Packet and artifact graph truth:
  conceptual artifact declarations, runtime artifact declarations, and packet
  contract membership.
- Lessons-local structural truth:
  live role-home family, runtime path family, absence of project-home runtime
  surfaces, and the expected workflow chain.

The sharp boundary is this:

- graph truth is typed and checked
- authored body content is mostly plain strings

That is why the current system can be structurally healthy while still leaving
important doctrine driftable.

## The Core Product Boundary

The most important current `paperzod` limitation is simple:

- authored content blocks are generic
- generic blocks only carry strings
- the compiler does not understand the meaning of those strings

Today the authored-content model stops at:

- `paragraph`
- ordered or unordered lists
- ordered steps
- rule lists
- definition lists
- tables
- code blocks
- `example`
- `good_bad_examples`

That means the compiler does not have first-class authored content for:

- `artifact_ref`
- `packet_contract_ref`
- `role_ref`
- `section_ref`
- `path_ref`
- `command_ref`
- `status_value`
- `enum_value`
- `host_ref`
- typed proof-schema blocks

As a result, all of those currently survive in Lessons doctrine as opaque
strings.

## Drift Pattern 1: Structured Artifacts Repeated As Raw Prose

### What drifts

Canonical packet filenames, packet composition, and runtime paths are repeated
manually in prose even though structured truth already exists.

### Current structured truth

- `doctrine_src/lessons/model/artifacts.ts`
- `doctrine_src/lessons/model/packet_contracts.ts`

### Concrete examples

- `SECTION_DOSSIER.md`
- `SECTION_CONCEPTS_AND_TERMS.md`
- `SECTION_LESSON_MAP.md`
- `SECTION_PLAYABLE_STRATEGY.md`
- `LESSON_PLAN.md`
- `LESSON_SITUATIONS.md`
- `ACTION_AUTHORITY.md`
- `lesson_manifest.json`
- `MANIFEST_VALIDATION.md`
- `COPY_GROUNDING.md`
- `section_root/_authoring/...`
- `lesson_root/_authoring/...`

Representative files:

- `doctrine_src/lessons/shared/packet_contracts/*.md`
- `doctrine_src/lessons/shared/standards/packet_shapes.blocks.ts`
- `doctrine_src/lessons/roles/*/packet_at_a_glance.blocks.ts`

### Why current paperzod misses it

The artifact model knows the ids and paths.
The role and packet prose does not reference those ids structurally.
It retypes the names and paths as strings.

If the artifact name or composition changes, the graph can stay valid while the
role-home prose quietly goes stale.

### Product gap

`paperzod` needs typed artifact and packet references inside authored content,
or a higher-level API that renders packet summaries directly from structured
artifact and packet-contract inputs.

### Local mitigation available today

Some duplication can be reduced locally by generating role packet summaries
from the artifact model instead of hand-writing filenames in each role file.
That would reduce drift, but it would still be a local convention rather than
a first-class source-language guarantee.

## Drift Pattern 2: Workflow Routing And Next Owners Repeated As Raw Prose

### What drifts

The same workflow law is written once in the structured chain and again in
plain English in shared workflow and role-home packet summaries.

### Current structured truth

- `doctrine_src/lessons/ids.ts`
- `doctrine_src/lessons/model/workflow.ts`
- `doctrine_src/lessons/checks.ts`

### Concrete examples

- the full lane chain in `shared/workflow/workflow_core.blocks.ts`
- repeated `lessons_acceptance_critic` next-owner text in role packet summaries
- `lessons_project_lead` called out manually as the post-critic publish owner
- critic reroute language such as `earliest honest owner`

Representative files:

- `doctrine_src/lessons/shared/workflow/workflow_core.blocks.ts`
- `doctrine_src/lessons/roles/lessons_project_lead/packet_at_a_glance.blocks.ts`
- `doctrine_src/lessons/roles/lessons_acceptance_critic/packet_at_a_glance.blocks.ts`
- `doctrine_src/lessons/roles/section_dossier_engineer/packet_at_a_glance.blocks.ts`

### Why current paperzod misses it

Current checks validate the workflow graph.
They do not validate that prose still matches the graph.

### Product gap

`paperzod` needs one or both of these:

- typed workflow references inside authored content
- a generated workflow-summary block that renders from step ids and role ids

### Local mitigation available today

High.
This is one of the clearest cases where local source cleanup can remove a lot
of drift even before `paperzod` grows new block types.

## Drift Pattern 3: Role-Home Section Titles And Lookup Order Repeated In Prose

### What drifts

Section titles and read order already exist structurally, but the builder text
repeats them manually.

### Current structured truth

- `doctrine_src/lessons/roles/role_home_template.ts`
- `doctrine_src/lessons/model/links.ts`

### Concrete examples

- `Workflow Core`
- `How To Take A Turn`
- `Packet At A Glance`
- `Standards And Support`
- `Role Contract`
- `Use This Role When`

Representative files:

- `doctrine_src/lessons/roles/builders.ts`
- `doctrine_src/lessons/roles/lessons_acceptance_critic/role_contract.md`

### Why current paperzod misses it

The template owns the section catalog.
The prose that names those sections is just a string.

### Product gap

Small but real.
`paperzod` would benefit from typed section references or a lightweight
interpolation surface for section titles and anchors.

### Local mitigation available today

Very high.
These strings could be rendered from the template today with no core compiler
change.

## Drift Pattern 4: Comment Shape, Verdict Shape, And Publish-State Vocab Are Prose-Only

### What drifts

The runtime doctrine assumes specific verdict words, publish intent values,
readiness labels, and comment-shape expectations that are not modeled anywhere
as typed setup data.

### Concrete examples

- `accept`
- `changes requested`
- `not_applicable`
- `ship`
- `prototype`
- `ready to merge`
- `latest packet comment`
- `Decisions locked:`

Representative files:

- `doctrine_src/lessons/shared/standards/critic_criteria.blocks.ts`
- `doctrine_src/lessons/shared/standards/copy_standards.blocks.ts`
- `doctrine_src/lessons/shared/workflow/publish_and_followthrough.blocks.ts`
- `doctrine_src/lessons/shared/workflow/how_to_take_a_turn.blocks.ts`
- `doctrine_src/lessons/roles/lessons_acceptance_critic/packet_at_a_glance.blocks.ts`
- `doctrine_src/lessons/roles/lessons_project_lead/*.md`

### Why current paperzod misses it

The graph knows there is a critic verdict artifact and a publish gate.
It does not know the allowed vocabulary for verdicts, notes, readiness states,
or publish intent.

### Product gap

This is a real `paperzod` feature gap.
If these values are meant to be canonical, the source language needs typed
setup-level enums or small domain objects for:

- verdict values
- publish intent values
- readiness state values
- comment-shape fields

## Drift Pattern 5: Proof Schema Lives Only In Human Prose

### What drifts

Lessons doctrine names exact proof fields and required support receipts, but
those expectations are not declared in any typed schema.

### Concrete examples

- `ACTION_AUTHORITY.md` must carry `policy_id`
- publish requires `PRE_PUBLISH_AUDIT.md`
- publish requires `## Result: PASS`
- route proof must name which validator command passed
- critic requires `SECTION_FLOW_AUDIT.md`

Representative files:

- `doctrine_src/lessons/shared/standards/right_move_rules.blocks.ts`
- `doctrine_src/lessons/shared/standards/critic_criteria.blocks.ts`
- `doctrine_src/lessons/shared/references/lesson_step_route_guide.blocks.ts`
- `doctrine_src/lessons/shared/workflow/publish_and_followthrough.blocks.ts`

### Why current paperzod misses it

The artifact graph knows an artifact exists.
It does not know the required fields, required receipts, required subsections,
or the allowed evidence bundle for that artifact.

### Product gap

This is one of the strongest candidates for `paperzod` product work.
If the source language is meant to protect runtime packet law, it needs a
first-class way to declare proof schemas or required evidence bundles.

## Drift Pattern 6: Support-File Families And Compatibility Residue Are Prose-Only

### What drifts

The live doctrine names many support files and “supporting proof” families that
are not modeled in `artifacts.ts`.

### Concrete examples

- `PRIOR_KNOWLEDGE_MAP.md`
- `ADVANCEMENT_DELTA.md`
- `BRIEF.md`
- `CONCEPTS.md`
- `VOCAB.md`
- `TERM_DECISIONS.md`
- `LEARNING_JOBS.md`
- `SECTION_FLOW_AUDIT.md`
- `TEMPLATE_DECISION.md`
- `LESSON_ARCHITECTURE.md`
- `SITUATION_SYNTHESIS.md`
- `COPY_RECEIPTS.md`
- `ANTI_LEAK_AUDIT.md`
- `GUIDED_WALKTHROUGH_LENGTH_REPORT.md`
- `LOG.md`
- `PROBLEMS.md`
- `HAND_USAGE_LEDGER.md`

Representative files:

- `doctrine_src/lessons/shared/packet_contracts/*.md`
- `doctrine_src/lessons/shared/standards/packet_shapes.blocks.ts`
- `doctrine_src/lessons/roles/section_dossier_engineer/role_contract.md`
- `doctrine_src/lessons/roles/lessons_section_architect/role_contract.md`

### Why current paperzod misses it

Those names read like compatibility contracts or support-evidence law, but
they are not modeled as artifacts, residue mappings, or packet-support bundles.

### Product gap

Real.
`paperzod` needs a first-class way to model:

- compatibility residue
- support evidence families
- support files attached to a conceptual packet

Without that, the compiler cannot tell the difference between “just an
example filename” and “live runtime law that must stay in sync.”

## Drift Pattern 7: Tool Paths, Commands, Env Vars, Hosts, And Route Labels Are Hard-Coded

### What drifts

Shared reference doctrine contains many literal commands, helper paths, host
URLs, env vars, and route labels that the compiler does not understand.

### Concrete examples

- `paperclip_home/project_homes/lessons/tools/poker_kb.py`
- `paperclip_home/project_homes/lessons/tools/lessons-gh`
- `paperclip_home/project_homes/lessons/tools/lessons-staging-qr`
- `verify_lessons_github_access.sh`
- `update_pr_with_lessons_qrs.sh`
- `uv run python "<paperclip_agents_root>/.../validate_lesson_step_json.py"`
- `make lessons-validate-one ID="$TARGET_LESSON_ID"`
- `make lessons-sync`
- `POKERKB_TIMEOUT_SECONDS`
- `https://play-origin.pokerskill.com/mcp/hand_builder`
- `https://play-origin.pokerskill.com`
- `play-origin`
- `localhost`
- `HandBuilder`
- `Play_Vs_AI`
- `FastCards`
- `PokerKB`
- `Poker Core AI`

Representative files:

- `doctrine_src/lessons/shared/references/github_access.md`
- `doctrine_src/lessons/shared/references/staging_qr.md`
- `doctrine_src/lessons/shared/references/poker_kb.blocks.ts`
- `doctrine_src/lessons/shared/references/lesson_step_route_guide.blocks.ts`
- `doctrine_src/lessons/shared/references/tools_boundary.blocks.ts`
- `doctrine_src/lessons/shared/standards/right_move_rules.blocks.ts`

### Why current paperzod misses it

These are plain strings in prose or fragments.
There is no structured tool catalog, command catalog, endpoint catalog, or
env-var registry in the setup model.

### Product gap

There are two layers here:

- local cleanup can centralize these constants in one shared source owner now
- true enforcement needs first-class tool, command, and endpoint references in
  `paperzod`

## Drift Pattern 8: Role-To-Support-Section Attachment Is Assembly-Only

### What drifts

Per-role inclusion of standards and references is currently decided by local
assembly code, not by a semantically checked “role requires these doctrine
families” declaration.

### Current structure

- `doctrine_src/lessons/shared/fragments.ts`
- `doctrine_src/lessons/roles/*/index.ts`

### Why it matters

A critical shared doctrine fragment can disappear from one role home and the
current graph checks will still pass if the surface and workflow chain remain
valid.

### Product gap

This is a real modeling gap if you want drift-proof runtime composition.
`paperzod` needs a structured way to declare required shared doctrine families
per role home, not just ad hoc inclusion in `index.ts`.

## Drift Pattern 9: Output Ownership Is Wired But Not Checked By Lessons Local Rules

### What drifts

The destructive output boundary is declared and used by compile, but the local
Lessons check suite does not verify that it still matches the intended live
contract.

### Current structure

- `doctrine_src/lessons/ids.ts`
- `doctrine_src/lessons/setup.ts`

### Why current paperzod misses it

Core `paperzod` enforces overlap and planner correctness for owned output
scopes, but the Lessons-local rules do not validate that the chosen delete
boundary still matches Lessons intent.

### Product gap

This is mostly a local-check gap, not a new core-language need.
If you want stronger protection now, add a Lessons-local rule that audits
`ownedOutputScopes` against the intended runtime family.

## Drift Pattern 10: Support Vocabulary And Enum-Like Labels Are Unstructured

### What drifts

Many role and shared docs use values that look canonical, but they are not
defined as typed enums anywhere.

### Concrete examples

- `guided_walkthrough`
- `scripted_hand`
- `policy_id`
- `books`
- `forums`
- `placeholder-copy status`
- `route guide`
- `sanctioned tool routes`
- concept-term decision labels such as `concept`, `defined term`, `both`,
  `writer vocabulary`, `reject`

Representative files:

- `doctrine_src/lessons/shared/references/lesson_step_route_guide.blocks.ts`
- `doctrine_src/lessons/shared/references/poker_kb.blocks.ts`
- `doctrine_src/lessons/shared/standards/right_move_rules.blocks.ts`
- `doctrine_src/lessons/roles/*/role_contract.md`

### Why current paperzod misses it

Current authored content does not support constrained values inside prose.

### Product gap

If these values are canonical setup law, `paperzod` needs typed enums or typed
registry-backed references inside authored blocks.

## What Can Be Fixed Locally Right Now

These are still driftable today, but they do not need a new `paperzod`
feature before cleanup can start.

- Render workflow order and next-owner summaries from `model/workflow.ts`
  instead of writing them manually in `.blocks.ts`.
- Render packet filenames and packet composition from `model/artifacts.ts` and
  `model/packet_contracts.ts` instead of hand-writing them in role summaries.
- Render role-home section-title references from `role_home_template.ts`
  instead of repeating the titles as builder prose.
- Centralize shared helper paths, hostnames, route labels, and commands behind
  one shared constants owner instead of repeating them across standards and
  references.
- Centralize role-home support-section attachment decisions enough that missing
  fragments are visible and reviewable in one place.

These steps will reduce drift a lot, but they still will not make prose
references first-class compiler truth.

## What Looks Like Real Paperzod Product Work

If the goal is “drift proof” instead of “harder to drift,” these are the
highest-value `paperzod` upgrades.

### 1. Typed inline references inside authored content

Add first-class authored content nodes for things like:

- artifact refs
- packet-contract refs
- role refs
- section refs
- path refs
- command refs
- endpoint refs

That would let prose point at semantic ids instead of repeating strings.

### 2. Setup-level enums and registry-backed values

Add a typed way to declare and reference setup-level vocab such as:

- verdict values
- publish intent values
- readiness states
- route labels
- support-note values like `not_applicable`

### 3. Proof-schema and support-evidence modeling

Let artifacts or packet contracts declare:

- required support files
- required receipt families
- required fields or proof keys
- compatibility residue

That would cover things like `policy_id`, `PRE_PUBLISH_AUDIT.md`, and support
file families currently trapped in prose.

### 4. Role-home composition law

Add a first-class way to declare which shared doctrine families each role home
must carry.
That would turn fragment inclusion from local assembly convention into checked
setup truth.

### 5. Tool and endpoint catalogs

If Lessons is going to keep living on sanctioned helpers and sanctioned hosts,
model those as setup-level entities so authored doctrine can reference them
structurally.

## Bottom Line

The current Lessons source is not “drift proof.”
It is “graph-proof, prose-fragile.”

That is still real progress.
The graph truth is much better than the old hand-maintained doctrine tree.
But the last hard class of drift is exactly the class you pointed at:
runtime-law strings inside authored prose that look canonical, but that the
compiler cannot currently see.

If you want the next round of `paperzod` work to matter, focus first on:

1. typed authored-content references
2. setup-level enums and registries
3. proof-schema and support-evidence modeling
4. checked role-home composition

Those four would close most of the serious Lessons drift gaps found in this
audit.
