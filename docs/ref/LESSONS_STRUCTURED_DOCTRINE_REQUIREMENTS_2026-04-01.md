# Lessons Structured Doctrine Requirements

## Goal

This document captures the problem we are trying to solve for Lessons doctrine,
why the current markdown-only maintenance model is painful, and what a
lightweight enforced structure should do instead.

The scope is the Lessons pod only:

- the Lessons agents
- the Lessons shared project doctrine
- the links between role-local contracts, shared workflow owners, packet
  owners, standards, and gates

This is not a full implementation plan yet.
It is a requirements and rationale note.

## The Short Version

We do not just want better docs.

We want a lightweight doctrine system for the Lessons pod that can define:

- each agent's input contract
- each agent's output contract
- each agent's turn shape
- the shared workflow and handoff path
- the standards and critic checks that apply to that work

We also want that structure to be enforced instead of maintained by hand across
many markdown files.

The runtime surface still needs to be plain markdown, or something that
compiles cleanly and fully to markdown, so it stays Paperclip-native and agent
readable.

## What We Are Actually Trying To Get

The target system should let us do all of these things inside one project:

- name a specific doctrine section and link to it directly
- define which role, shared owner, or workflow step owns that section
- say what that role reads
- say what that role produces
- say what later lanes are allowed to rely on
- say what the critic checks
- say which links are required, optional support, or only reference material
- reject drift when one part changes and the linked parts are not updated

The point is to stop treating the Lessons doctrine graph as a manual markdown
editing problem.

## Why This Matters

The current Lessons doctrine already has good ownership boundaries.

The hard part is keeping the graph of those boundaries honest over time.

Today we have to maintain that graph manually across:

- role-local `AGENTS.md` files
- the Lessons shared entrypoint
- the top-level workflow file
- per-lane packet workflow files
- packet-shape docs
- content standards
- helper and reference docs

That is manageable when the structure is stable and small.
It gets painful when we are actively redesigning the packet chain, lane inputs,
or what later lanes are supposed to trust.

The problem is not that the current doctrine has no structure.
The problem is that the structure is spread across many markdown files with too
little mechanical enforcement.

## Why The Current Model Drifts

`docs/LESSONS_WORKFLOW_SIMPLE_CLEAR.md` says the quiet part out loud.
It describes the workflow we want, but it also says that the packet cheat sheet
is not a readback of today's on-disk packet names.

That means the conceptual workflow and the live doctrine are already split.

The document is trying to describe a cleaner, simpler packet chain:

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

That is useful because it makes the chain easier to reason about.

But the live shared doctrine still has to speak in current packet bundles,
current file names, role-local read order, packet-shape rules, and critic
expectations.
Keeping those aligned by hand is exactly where the pain comes from.

The same note even calls out one concrete example of this drift:

- we probably need to refactor
  `paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_PACKET_SHAPES.md`
  so it matches those forward artifacts more directly instead of mostly reading
  like the full on-disk packet bundle

That is not just a wording problem.
It is a structural maintenance problem.

## What Is Already Working

The current Lessons doctrine already has a sensible high-level split.

- `paperclip_home/project_homes/lessons/shared/README.md`
  - start-here map and owner lookup
- `paperclip_home/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md`
  - lane order, same-issue handoff, and comment shape
- `paperclip_home/project_homes/lessons/shared/proof_packets/*.md`
  - what each lane must produce and prove
- `paperclip_home/project_homes/lessons/shared/lessons_content_standards/*.md`
  - packet shapes, quality bar, grounding rules, copy rules, and right-move
    rules
- `paperclip_home/agents/<role>/AGENTS.md`
  - role-local boundaries and read order

That separation is a strength.

The thing we are missing is a structured way to say how those pieces link
together and to validate that the links stay honest.

## Concrete Examples From The Live Lessons Doctrine

### Example 1. One conceptual lane contract is spread across many files

The live top-level workflow says to use:

- `lessons_content_standards/LESSONS_PACKET_SHAPES.md` to choose the packet
  shape
- each owner's packet workflow file for the actual work in that step

That is reasonable.
But it means the full contract for one lane already spans multiple owners.

For example, the `Lessons Section Architect` role currently depends on:

- its role-local `AGENTS.md`
- the Lessons shared `README.md`
- `AUTHORITATIVE_LESSONS_WORKFLOW.md`
- `proof_packets/LESSONS_SECTION_ARCHITECT_WORKFLOW.md`
- `lessons_content_standards/LESSONS_PACKET_SHAPES.md`
- `lessons_content_standards/LESSONS_QUALITY_BAR.md`

That is not wrong.
It is just easy to drift because the linkage is implicit and manual.

### Example 2. The ideal packet chain is cleaner than the live packet bundle

`docs/LESSONS_WORKFLOW_SIMPLE_CLEAR.md` proposes a clean section-level flow:

- `SECTION_DOSSIER.md`
- `SECTION_CONCEPTS_AND_TERMS.md`
- `SECTION_LESSON_MAP.md`
- `SECTION_PLAYABLE_STRATEGY.md`

The live packet-shape owner still describes the section packet as a larger
bundle of current files such as:

- `PRIOR_KNOWLEDGE_MAP.md`
- `ADVANCEMENT_DELTA.md`
- `BRIEF.md`
- `CONCEPTS.md`
- `LOG.md`
- `PROBLEMS.md`
- `HAND_USAGE_LEDGER.md`
- `VOCAB.md`
- `TERM_DECISIONS.md`
- `LEARNING_JOBS.md`
- `SECTION_FLOW_AUDIT.md`
- `STRAWMAN_LESSON_CONTAINERS.md`
- `TEMPLATE_DECISION.md`
- `TEMPLATE.md`
- `SECTION_ARCHITECTURE.md`
- `PLAYABLE_STRATEGY.md`

That is a real example of the difference between:

- the conceptual contract we want later lanes to think in
- the current file-level bundle the live doctrine still has to describe

### Example 3. Some files are central contracts and some are only support

In practice, not every named file has the same downstream importance.

For example:

- `SECTION_ARCHITECTURE.md` and `SECTION_FLOW_AUDIT.md` are strong downstream
  surfaces for the section architecture lane
- `LOG.md` is often support
- `PROBLEMS.md` and `HAND_USAGE_LEDGER.md` may matter, but often as conditional
  support instead of central downstream contract files

Right now that distinction is mostly expressed in prose.
It is not machine-readable.

That is a real source of confusion.
When the graph is manual, it is hard to tell whether a file is:

- required downstream contract
- conditional support
- reference-only background
- stale artifact we should stop naming

### Example 4. We can describe missing workflow, but we cannot enforce it

Some live packet workflow files still have sections like `# Missing workflow`.

That is useful as an honest note.
But it also shows the current system cannot tell us mechanically that a role
contract is incomplete, that a required input is not declared, or that a lane's
output is not fully wired into later lanes.

## The Actual Requirements

### Scope Requirements

- The system is scoped to one Paperclip project or pod at a time.
- The first target is Lessons only.
- It does not need to solve the whole repo before it is useful.

### Authoring Requirements

- The authoring surface must stay lightweight.
- Plain markdown is ideal.
- If we use a higher-level source, it must compile cleanly and fully to
  markdown.
- Humans should still be able to read the runtime output without a custom tool
  or UI.
- The structure should be easy to edit when one lane contract changes.

### Addressability Requirements

- Every important doctrine unit must have a stable, direct reference target.
- We need to link to exact sections, not just whole files.
- Those references should stay stable even if we rewrite the prose title of a
  section.
- The addressing system should work naturally inside markdown.

### Ownership Requirements

- A doctrine unit must declare its owner.
- The owner might be:
  - a role-local contract
  - a project-shared workflow owner
  - a project-shared content standard
  - a helper or reference owner
- The system should be able to detect competing owners for the same rule.
- One rule, workflow meaning, or packet contract should have one canonical
  owner.

### Linkage Requirements

- A role contract should be able to declare exactly which shared sections it
  depends on.
- A workflow step should be able to declare:
  - what it reads
  - what it produces
  - what it may use as support
  - what the next lane is allowed to trust
- A critic or gate should be able to declare what sections or artifacts it
  checks.
- A shared packet definition should be able to link to the producing lane and
  the consuming lanes.
- The system should make upstream and downstream dependencies explicit instead
  of burying them in prose.

### Turn Contract Requirements

- For each lane, we need to be able to define:
  - role name
  - purpose
  - required inputs
  - optional support inputs
  - interim work products
  - required outputs
  - stop line
  - next expected reviewer or owner
- This should be first-class structure, not just a paragraph convention.

### Packet Contract Requirements

- Each packet or artifact should be classed clearly.
- At minimum, we need to distinguish:
  - required contract artifact
  - conditional artifact
  - support artifact
  - reference-only artifact
- We should be able to say whether downstream lanes consume the file directly
  or only rely on it through a rolled-up packet.
- We should be able to declare whether a file is still live doctrine or just
  legacy residue.

### Validation Requirements

- The system should reject broken links.
- The system should reject missing required linked sections.
- The system should reject orphaned sections that are supposed to be reachable
  from a workflow or owner map.
- The system should reject duplicate owners for the same doctrine unit.
- The system should reject a lane definition that names an output with no
  downstream consumer when one is required.
- The system should reject stale references to removed packet names or removed
  sections.
- The system should reject incomplete turn contracts when required fields are
  missing.

### Drift Detection Requirements

- If we rename a packet or section, the checker should tell us everything that
  still points at the old name.
- If we simplify a lane contract, the checker should tell us what shared owners
  still describe the old shape.
- If a role-local home expects inputs that the shared workflow no longer
  promises, the checker should fail.
- If the shared workflow points to a packet workflow or standard that no longer
  covers the required contract, the checker should fail.

### Runtime Requirements

- Paperclip agents still need a markdown runtime surface they can read without
  special translation.
- We should not create a second competing live doctrine universe that people
  also edit by hand.
- If there is a source format above markdown, the generation path must be
  one-way and clear:
  - author in the structured source
  - generate markdown
  - treat the generated markdown as the runtime read surface
- We should not hand-maintain both the source and the generated markdown as two
  peers.

### Ergonomic Requirements

- Small changes should require small edits.
- Renaming a concept should not require a scavenger hunt across many files.
- It should be obvious where to add a new lane rule, packet rule, or critic
  dependency.
- Review diffs should make structural changes easy to inspect.

## Likely Minimum Model

This is not the final design, but it helps make the requirements concrete.

We probably need structured nodes like:

- role
- shared workflow owner
- packet
- artifact
- standard
- critic gate
- helper or reference doc

We probably need typed links like:

- `owns`
- `reads`
- `produces`
- `consumes`
- `supports`
- `routes_to`
- `critic_checks`
- `depends_on`
- `generated_from`

Without typed links, we are back to generic prose references and manual drift.

## Non-Goals

- This is not a generic knowledge graph for the whole repo.
- This is not a replacement for Paperclip issue coordination.
- This is not a proposal to move live Lessons doctrine into an unrelated new
  doctrine home just because a tool wants one.
- This is not a request for a heavy schema system that becomes harder to
  maintain than the current markdown.
- This is not about replacing clear human writing with dense metadata.

## What Success Looks Like

- A Lessons agent can jump to one exact doctrine section and understand its
  turn contract quickly.
- A lane change is made in one structured place and the checker tells us what
  else must change.
- Shared workflow, role-local contracts, packet definitions, and critic rules
  stay linked without hand-maintained guesswork.
- The runtime output remains ordinary markdown that works naturally with
  Paperclip and the agents.
- The Lessons doctrine graph becomes easier to change and harder to break.

## Why This Is Worth Doing

The current manual markdown model makes a disciplined structure possible, but
it does not make it cheap.

That is the core problem.

As soon as we try to improve the Lessons workflow for real, we start carrying a
mental graph across many files:

- which lane owns which decision
- which packet name is conceptual versus current on-disk
- which helper file is support versus required downstream contract
- which shared owner must change when a lane contract changes
- which role homes still point at the old structure

That is exactly the kind of problem a lightweight enforced structure should
solve.

## Next Step

The next useful move is to turn these requirements into a small design for the
Lessons pod only:

- the minimum node types
- the minimum link types
- the markdown runtime shape
- the validation rules
- and whether we want markdown-first authoring or a small source format that
  compiles to markdown

## External Audit

### Audit Goal

This audit asks a practical question:

What are other teams already using that gets us closest to a lightweight,
community-supported, markdown-native way to structure and enforce doctrine for
one project like Lessons?

The evaluation criteria are:

- plain markdown or near-markdown authoring
- direct links to specific sections or stable targets
- validation of broken links and missing structure
- enough structure to define role contracts and packet contracts
- enough community support that we are not betting on a dead end
- light enough that it does not become a larger maintenance problem than the
  one we have now

### Market Pattern

The market is split into a few different families.

There are tools that are strong at markdown validation.
There are tools that are strong at cross-references and publishing.
There are tools that are strong at rich structured content.

Very few tools natively model the exact thing we want:

- role-local contracts
- shared workflow owners
- packet contracts
- critic gates
- typed links between them

So the realistic question is not "which tool already does all of this?"

It is:

"Which tool gives us the best foundation with the least custom work?"

### Candidate 1. `mdschema`

What it is:

- a declarative schema-based markdown validator and template generator

What it already gives us:

- schema-driven validation in YAML
- nested section and heading structure rules
- frontmatter validation
- internal anchor and file link validation
- generated markdown templates from schemas
- a GitHub Action
- a small standalone CLI

Why it is a strong fit:

- It works directly on markdown files instead of requiring a separate doctrine
  home.
- It is lightweight.
- It is the closest thing we found to "define the expected structure of this
  doctrine file and fail if it drifts."
- It maps well to our need to enforce shapes such as:
  - role `AGENTS.md`
  - lane workflow files
  - standards files
  - project entrypoints

Why it is not enough by itself:

- It validates document structure, not a full doctrine graph.
- It does not appear to natively understand:
  - role A consumes packet B
  - critic C checks outputs from lane D
  - file X is support-only while file Y is a required downstream contract
  - single-owner semantics across multiple doctrine files

Community and maturity:

- community is still small
- the repo is active and installable through Homebrew, npm, and Go
- as of 2026-04-01, GitHub shows 54 stars and the repo advertises GitHub
  Action support

Verdict:

- Best lightweight base layer for structure enforcement
- Not a complete doctrine graph solution on its own

### Candidate 2. MyST Markdown and `mystmd`

What it is:

- a markdown-based authoring and publishing framework with a standardized AST,
  labels, cross-references, directives, roles, and multiple output targets

What it already gives us:

- explicit labels and cross-references to sections and other targets
- external project references
- warnings for unresolved references
- strict link checking during site builds
- a published AST and transform ecosystem
- multi-format output beyond HTML

Why it is a strong fit:

- It has a real structured markdown model, not just headings plus string
  matching.
- Labels and targets are closer to what we want than ordinary heading links.
- It gives us a more semantic base than plain markdown, while still feeling
  markdown-first.
- It is a plausible base if we decide we want a richer AST for doctrine.

Why it may be too heavy:

- It is more of a full authoring and publishing framework than a narrow
  doctrine validator.
- The Lessons problem is about lane contracts and workflow graph integrity, not
  rich publishing features.
- It may be more power than we need for a project-local doctrine system.

Community and maturity:

- community-backed and active
- supports npm, PyPI, and Conda
- as of 2026-04-01, GitHub shows 484 stars and release `mystmd@1.8.3`

Verdict:

- Strong if we want a richer semantic markdown substrate
- Probably heavier than necessary for the first Lessons-only version

### Candidate 3. MkDocs plus Material for MkDocs plus `mkdocs-autorefs`

What it is:

- a very widely used markdown docs stack with a large ecosystem
- `mkdocs-autorefs` adds cross-page heading references, heading aliases, and
  backlinks

What it already gives us:

- markdown-native docs
- built-in link and anchor validation in MkDocs
- explicit warning control for broken doc links and anchors
- section aliases and backlinks through `mkdocs-autorefs`
- a very large user and plugin ecosystem

Why it is a strong fit:

- It is probably the best-supported lightweight markdown docs stack in this
  space.
- It handles section-level references better than plain markdown if you add
  aliases.
- It is good at discovery, navigation, search, and cross-page reference
  hygiene.

Why it is not enough by itself:

- It is a docs site stack, not a doctrine contract system.
- It does not natively enforce role-turn structure, packet contracts, or
  graph-level ownership rules.
- We would still need a separate schema or validator layer for the actual
  Lessons workflow semantics.

Community and maturity:

- very strong
- `mkdocs` has a large long-running community
- `mkdocs-material` is especially widely adopted
- as of 2026-04-01:
  - `mkdocs` shows 21.9k stars
  - `mkdocs-material` shows 26.4k stars and release `9.7.6`
  - the Material project says it is trusted by more than 50,000 individuals
    and organizations

Verdict:

- Best lightweight publishing and navigation layer
- Weak on contract enforcement unless paired with another validator

### Candidate 4. Markdoc

What it is:

- Stripe's markdown-based authoring framework with custom tags, a machine
  readable AST, and validation hooks

What it already gives us:

- markdown-based structured authoring
- custom tags, nodes, and attributes
- syntax validation and schema-like validation through config
- strong extensibility for custom document structures

Why it is attractive:

- It is one of the strongest options if we want custom structural blocks inside
  markdown itself.
- It has a real validation story and a machine-readable AST.
- It was designed for complex documentation, not just simple notes.

Why it may be the wrong fit:

- It pushes us toward a rendering framework and app-style docs stack.
- It is not primarily a markdown validator for ordinary repo files.
- It is better at structured content rendering than at checking a graph of
  markdown doctrine files that already live in repo-owned surfaces.

Community and maturity:

- well-known and credible
- not as broad in day-to-day docs-as-code usage as MkDocs or Docusaurus
- as of 2026-04-01, GitHub shows 8k stars and release `0.5.7`

Verdict:

- Strong structured markdown framework
- Probably heavier and more app-oriented than we need for Lessons doctrine

### Candidate 5. Antora

What it is:

- a documentation site generator designed for single-repo or multi-repo docs,
  strong cross references, and versioned publishing

What it already gives us:

- decoupled cross references
- page and in-page references that are not tied to filesystem paths
- multi-repository aggregation
- strong versioning and navigation model

Why people use it:

- It is strong for large docs programs spread across repositories and versions.
- It is particularly good for teams already using AsciiDoc.

Why it is not a fit for our first move:

- It is AsciiDoc-first, not Markdown-first.
- The format change alone is a big mismatch for the Lessons requirement.
- It is also more site-generator heavy than we need for a project-local
  doctrine enforcement problem.

Community and maturity:

- established and still active
- the official site and docs are current
- the GitLab project shows 5,252 commits and 94 tags as of 2026-04-01

Verdict:

- Strong product for large versioned docs estates
- Wrong markup and too heavy for the Lessons-first use case

### Candidate 6. Docusaurus

What it is:

- a very popular docs site framework from Meta

What it already gives us:

- markdown and MDX docs
- explicit heading IDs
- a large docs ecosystem and strong community support
- stable linking to headings and docs pages

Why it is relevant:

- It shows what a mature community-supported markdown docs stack looks like.
- Explicit heading IDs are useful for stable references.

Why it is not enough:

- It is mainly a publishing framework.
- It does not solve schema enforcement or doctrine graph enforcement by
  itself.
- It is heavier than a pure markdown validator stack.

Community and maturity:

- extremely strong
- as of 2026-04-01, GitHub shows 63.3k stars and release `3.9.2`

Verdict:

- Excellent docs platform
- Not the best base for enforcing a Lessons doctrine graph

### Candidate 7. Vale and the unified/remark lint stack

What it is:

- low-level markdown and prose linting building blocks rather than a single
  doctrine system

What this family gives us:

- prose and terminology linting with Vale
- markdown structure and style linting with `remark-lint`
- broken heading and file link checks with `remark-validate-links`
- frontmatter schema checks through remark plugins

Why this matters:

- If we want to keep everything close to ordinary markdown and build our own
  small doctrine checker, these are strong building blocks.
- Vale is especially useful for enforcing naming, wording, or forbidden
  terminology in doctrine.

Why it is not enough by itself:

- This is a toolkit, not a doctrine model.
- We would still have to design the Lessons-specific graph rules ourselves.
- The setup burden can spread across multiple tools and configs.

Community and maturity:

- strong and mature at the linting layer
- as of 2026-04-01:
  - Vale shows 5.3k stars and release `v3.14.1`
  - `remark-lint` shows 1k stars
  - `remark-validate-links` shows 124 stars

Verdict:

- Best low-level linting building blocks
- Good companions, not a complete answer

### Candidate 8. Note-graph tools such as Obsidian or Dendron

What they are:

- markdown knowledge-base and note-graph tools

Why they came up:

- they support wiki links, heading links, and in some cases block references
- they make it easier to author linked notes

Why they are not a good primary answer here:

- they are stronger at personal or team knowledge authoring than at enforced
  doctrine contracts
- they do not naturally fit Paperclip-native runtime doctrine as a checked
  source of truth
- Dendron in particular appears to have support concerns and weaker current
  momentum than the stronger docs-as-code candidates

Verdict:

- useful inspiration for authoring ergonomics
- not recommended as the primary Lessons doctrine system

### Shortlist

If we optimize for markdown-native output, lightweight setup, and real adoption,
the strongest shortlist is:

1. `mdschema`
2. MkDocs + Material + `mkdocs-autorefs`
3. MyST Markdown
4. Vale + remark as companion linting tools

### Best Fit By Job

- best lightweight structure validator:
  - `mdschema`
- best community-supported markdown docs platform:
  - MkDocs + Material
- best section aliasing and backlinks in a markdown docs stack:
  - `mkdocs-autorefs`
- best rich semantic markdown substrate:
  - MyST
- best prose and wording linting companion:
  - Vale
- best app-like structured markdown framework:
  - Markdoc

### What I Would Not Choose First

- Antora
  - wrong markup family for our first move
- Docusaurus
  - excellent docs product, but too framework-heavy for this specific problem
- note-graph tools as the primary runtime doctrine layer
  - not strong enough on enforcement

### Recommended Direction

The strongest practical direction for Lessons looks like this:

Option A:

- author ordinary markdown in the existing repo-owned doctrine surfaces
- use `mdschema` to enforce per-file doctrine shape
- add small frontmatter metadata for owner, inputs, outputs, and artifact kind
- write a tiny custom Lessons graph checker for the cross-file rules

Option B:

- if we also want a real published docs site with stronger discovery and
  backlinks, pair Option A with MkDocs + Material + `mkdocs-autorefs`

Option C:

- if we decide we want a more semantic structured markdown substrate from day
  one, evaluate a MyST-based design, but that is a bigger move and should be a
  conscious choice

### Bottom Line

There does not appear to be a widely adopted community tool that already models
the exact Lessons doctrine graph we want out of the box.

But there is a strong lightweight path:

- use `mdschema` for structure enforcement
- optionally use MkDocs + Material + `mkdocs-autorefs` for discovery and stable
  section references
- add one small custom validator for the Lessons-specific graph semantics that
  generic markdown tools do not understand

That is the first approach I would prototype before betting on a heavier new
authoring system.

### Research Sources

- `mdschema`
  - https://github.com/jackchuka/mdschema
- MyST Markdown and `mystmd`
  - https://mystmd.org/docs/mystjs/cross-references
  - https://mystmd.org/cli/reference
  - https://github.com/jupyter-book/mystmd
- MkDocs, Material for MkDocs, and `mkdocs-autorefs`
  - https://www.mkdocs.org/user-guide/configuration/
  - https://mkdocstrings.github.io/autorefs/
  - https://github.com/mkdocs/mkdocs
  - https://github.com/squidfunk/mkdocs-material
  - https://github.com/mkdocstrings/autorefs
- Markdoc
  - https://markdoc.dev/docs/overview
  - https://markdoc.dev/docs/validation
  - https://github.com/markdoc/markdoc
- Antora
  - https://antora.org/
  - https://docs.antora.org/antora/latest/asciidoc/in-page-xref/
  - https://gitlab.com/antora/antora
- Docusaurus
  - https://docusaurus.io/docs/markdown-features/links
  - https://docusaurus.io/docs/markdown-features/toc
  - https://github.com/facebook/docusaurus
- Vale and remark
  - https://vale.sh/docs
  - https://github.com/vale-cli/vale
  - https://github.com/remarkjs/remark-lint
  - https://github.com/remarkjs/remark-validate-links
