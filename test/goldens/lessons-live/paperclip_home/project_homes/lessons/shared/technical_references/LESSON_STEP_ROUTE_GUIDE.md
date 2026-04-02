# Lesson Step Route Guide

This file owns route choice for lesson step materialization.

Use it to decide which playable route fits the step shape. Do not use it for
packet closeout or receipt policy. For proof and finish-line rules, use the
receipt policy and workflow docs.

## Baseline Validation Checks

Use two roots on purpose:

- use the attached checkout for live product truth and for validation commands
  that belong to that checkout
- use the `paperclip_agents` repo only as the home of the shared helper
  scripts under `paperclip_home/project_homes/lessons/tools/`

In the helper commands below, replace `<paperclip_agents_root>` with the repo
root that contains this doctrine file.

Shared helper scripts, run from the attached checkout with its own `uv`
environment:

- lesson step kinds:
  - `uv run python "<paperclip_agents_root>/paperclip_home/project_homes/lessons/tools/playable_layout/list_lesson_step_kinds.py"`
- guided child-kind list:
  - `uv run python "<paperclip_agents_root>/paperclip_home/project_homes/lessons/tools/playable_layout/list_guided_child_kinds.py"`
- candidate step validation:
  - `uv run python "<paperclip_agents_root>/paperclip_home/project_homes/lessons/tools/playable_layout/validate_lesson_step_json.py" --in /absolute/path/to/step.json`

Do not rewrite those helper commands as attached-checkout-relative
`paperclip_home/...` paths. The helper files live in `paperclip_agents`, not in
the attached checkout.

Attached-checkout validation:
- lesson validation:
  - `make lessons-validate-one ID="$TARGET_LESSON_ID"`
- full validation when the issue explicitly requires it:
  - `make lessons-sync`

If the checkout does not expose the kind you expected, inspect the current repo
file or proof named by the issue or by durable route notes. Do not invent a
route from stale skill names or from missing helper paths.

## Route rules

### Standard Supported Kinds

Use the standard route when the step is not one of the specialized
families below.

Rules:

- discover current kinds from the live checkout, not from memory
- choose the kind by user-visible intent
- preserve caller text or explicit placeholders; do not freewrite final copy
- validate the emitted step before treating it as trustworthy

### `guided_walkthrough`

Treat `guided_walkthrough` as a dedicated route.

Rules:

- confirm the live checkout exposes `guided_walkthrough`
- discover child kinds from the shared helper
- do not assume guided beats are headline-incapable; headline support is part
  of the current product surface when the live models expose it
- every beat needs a valid focus target
- if the walkthrough is showing the same poker spot over several beats, keep
  the same players and action from beat to beat unless the lesson is teaching
  a clear change
- do not fade a player who is still in the hand; if they raised, called, or
  stayed in, they should still look active on screen
- do not nest `guided_walkthrough` inside itself
- do not narrate actions or state the learner cannot actually see
- validate the final step JSON after structural checks

### `scripted_hand`

Treat `scripted_hand` as a dedicated route.

Rules:

- confirm the live checkout exposes `scripted_hand`
- start from a real OHH hand object plus explicit decision cursors
- do not write the timeline or decision cursors by hand from guesswork
- validate the step only after cursor intent is explainable against the hero
  action points
- the issue cannot name the specialized builder file or proof it expects
- the live checkout contradicts the durable notes you were planning to use

## Receipt expectations

For any specialized or ambiguous route, leave enough proof that the next lane
can see:

- which route was chosen and why
- which live repo file or command confirmed that route
- which validator command passed
- which current `lesson_root/_authoring/ACTION_AUTHORITY.md` record the built step still
  preserves when an exact action recommendation shown to the learner is in scope
- whether any placeholders remain

## Guardrails

- do not use the generic route as a backdoor for specialized kinds
- do not treat a nearly-valid step as good enough
- do not let a build edit change a prescriptive action claim without current
  action authority parity
- do not hide route ambiguity behind a passing manifest if the step by step route
  was wrong
- do not borrow old external skill names as if they were still runtime
  dependencies
