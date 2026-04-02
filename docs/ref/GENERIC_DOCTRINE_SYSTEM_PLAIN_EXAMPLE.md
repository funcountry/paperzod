# Generic Doctrine System Plain Example

## Start With A Simple Example

Suppose we have a small workflow with three roles:

- `Writer`
- `Critic`
- `Publisher`

Here is the human problem we want the system to solve:

- `Writer` reads the brief and writes `DRAFT.md`
- `Critic` reviews `DRAFT.md`
- `Publisher` only runs after `Critic` passes the draft
- every role has a short role guide
- there is one shared workflow doc that shows the step order
- there is one standards doc that tells the critic what to check

We do not want to hand-maintain all of those markdown files separately.

We want one structured source that says:

- who does each step
- what each step reads
- what each step writes
- what rules always hold
- which markdown files should be generated

The graph part is not the hard part.
The hard part is making it easy to declare those rules once, reuse them, and
get usable markdown out.

The canonical editorial example is the same problem with more roles, more
packets, and more shared docs.

## What A Good Product Would Let Us Do

In the best case, we would be able to do four simple things:

1. Define a few reusable document templates.
2. Define one setup that fills those templates with real roles, workflow
   steps, standards, and output paths.
3. Load pre-authored markdown fragments where we want humans to own the prose.
4. Generate the markdown docs that agents actually read.

That means the setup author would not hand-write ten slightly different
`AGENTS.md` files.
They would define one `role home` template and fill it with the facts for each
role.

## Best-Case Usage

The examples below are illustrative pseudocode.
They show the product shape we want, not the exact API we already have.

### 1. Define a role-home template once

```ts
const roleHomeTemplate = docTemplate({
  kind: "role_home",
  sections: [
    section("read_first"),
    section("your_job"),
    section("inputs"),
    section("outputs"),
    section("stop_line"),
  ],
});
```

### 2. Fill that template with a real role

```ts
role({
  id: "writer",
  name: "Writer",
  template: "roleHome",
  reads: [
    "shared.workflow",
    "standards.copy_rules",
    "packets.brief",
  ],
  writes: ["packets.draft"],
  stopLine: "Stop when the draft is ready for critic review.",
  nextRole: "critic",
});
```

### 3. Define a workflow template once

```ts
const workflowTemplate = docTemplate({
  kind: "workflow_owner",
  sections: [
    section("goal"),
    section("step_order"),
    section("handoff_rules"),
    section("send_back_rules"),
  ],
});
```

### 4. Fill that template with real workflow facts

```ts
workflow({
  id: "main",
  template: "workflow",
  steps: ["writer", "critic", "publisher"],
  rules: [
    "A critic review must happen before publish.",
    "Publisher cannot skip critic review.",
  ],
});
```

### 5. Define a standards template once

```ts
const standardsTemplate = docTemplate({
  kind: "standard",
  sections: [
    section("what_good_looks_like"),
    section("send_back_when"),
    section("examples"),
  ],
});
```

### 6. Fill that template with real standards

```ts
standard({
  id: "draft_quality",
  name: "Draft Quality Standard",
  template: "standard",
  goodLooksLike: [
    "The draft matches the brief.",
    "Claims are grounded.",
    "The wording is clear.",
  ],
  sendBackWhen: [
    "The draft changes the meaning of the brief.",
    "The draft makes unsupported claims.",
    "The draft is incomplete.",
  ],
});
```

### 7. Load authored markdown fragments where they help

In a real setup, we would not want every section body to live inline in
TypeScript.

The nicer pattern is:

- keep structure, ids, paths, and graph rules in TypeScript
- keep longer prose in authored markdown fragments
- use a few small helpers to load those fragments into the final setup

For example:

```ts
const workflowFragments = loadFragments("./fragments/workflow", {
  goal: "goal.md",
  handoffRules: "handoff_rules.md",
  sendBackRules: "send_back_rules.md",
});

workflow({
  id: "main",
  template: "workflow",
  steps: ["writer", "critic", "publisher"],
  sections: {
    goal: workflowFragments.goal,
    handoff_rules: workflowFragments.handoffRules,
    send_back_rules: workflowFragments.sendBackRules,
  },
  rules: [
    "A critic review must happen before publish.",
    "Publisher cannot skip critic review.",
  ],
});
```

That lets us keep real prose in files like:

- `fragments/workflow/goal.md`
- `fragments/workflow/handoff_rules.md`
- `fragments/workflow/send_back_rules.md`

while still letting TypeScript decide:

- where those fragments land
- which template they fill
- which workflow they belong to
- which ids and paths they map to
- which rules must still validate

## The Markdown We Would Want Back

### Generated role guide

```md
# Writer

## Read First

Read the shared workflow, then the copy rules, then the current brief.

## Your Job

Write the draft for the current issue.
Do not publish it yourself.

## Inputs

- Shared workflow
- Copy rules
- `BRIEF.md`

## Outputs

- `DRAFT.md`

## Stop Line

Stop when the draft is ready for critic review.
Send the issue to `Critic` next.
```

### Generated workflow doc

```md
# Authoritative Workflow

## Goal

Move one issue from draft to publish in a fixed order.

## Step Order

1. `Writer`
2. `Critic`
3. `Publisher`

## Handoff Rules

- `Writer` hands off to `Critic`
- `Critic` hands off to `Publisher` on pass
- `Critic` sends work back to `Writer` on fail

## Send Back Rules

- `Publisher` must not run before `Critic` passes
- `Critic` must explain what failed and what needs to change
```

### Generated standards doc

```md
# Draft Quality Standard

## What Good Looks Like

- The draft matches the brief
- Claims are grounded
- The wording is clear

## Send Back When

- The draft changes the meaning of the brief
- The draft makes unsupported claims
- The draft is incomplete

## Examples

### Good

- The draft explains the same point as the brief in plain language

### Bad

- The draft adds a stronger claim that the brief did not support
```

## Why This Matters

This is the difference between:

- a graph that can store nodes and edges
- a system that is pleasant to use for a real doctrine product

A strong graph is necessary, but not sufficient.

The system becomes truly useful when a setup author can say:

- "all role guides use this shape"
- "all workflow docs use this shape"
- "all critic standards use this shape"
- "load these prose fragments into those sections"
- "this workflow must always include a critic step before publish"
- "generate the markdown docs for these roles and these shared owners"

without re-implementing those ideas by hand every time.

## How This Maps To Editorial

The canonical editorial example is the same pattern at a larger size.

Instead of `Writer`, `Critic`, and `Publisher`, editorial has roles like:

- `Brief Researcher`
- `Story Architect`
- `Quality Critic`
- `Publication Coordinator`

Instead of one `DRAFT.md`, editorial has packets like:

- `EDITORIAL_BRIEF.md`
- `STORY_OUTLINE.md`
- `REVIEW_NOTES.md`
- `PUBLICATION_PACKET.md`

The point is the same:

- define reusable document shapes once
- fill them with real workflow facts
- generate the runtime markdown that agents will read

That is the product surface we want a generic system like `paperzod` to make
easy.
