# Lesson Copy Standards

This file is the shared standard for lesson copy.

Use it together with:

- `lessons_content_standards/LESSONS_POKER_GROUNDING_RULES.md`
- `lessons_content_standards/LESSON_RIGHT_MOVE_RULES.md`
- `proof_packets/LESSONS_COPYWRITER_WORKFLOW.md`

Copy is not accepted because it sounds smooth. It is accepted when it sounds
like real poker coaching, preserves the lesson's teaching job, and leaves a
clear record of the grounding behind the wording.

`lessons_content_standards/LESSONS_POKER_GROUNDING_RULES.md` owns how Lessons
grounds meaning and player-language wording.
`lessons_content_standards/LESSON_RIGHT_MOVE_RULES.md` owns the proof required
when a lesson tells the learner the right move in a specific hand. Copy may
phrase an action recommendation that already has a current authority record.
Copy may not invent, sharpen, or strengthen one.

## Core law

Raw poker copy instinct is not trustworthy enough for shipped learner text.

For material learner copy changes:

- use Books for the semantic skeleton and correct concept language
- use Forums for player/coaching wording and lexical validation
- synthesize from returned poker language instead of freewriting from instinct

If a line still sounds like an AI politely describing poker, it is not done.

## Non-negotiables

- Do not treat PokerKB as optional because the line feels obvious.
- Do not use PokerKB as citation garnish or a dumb word generator.
- Do not turn family framing or generic poker truth into an exact `you should
  X here` claim without current `lesson_root/_authoring/ACTION_AUTHORITY.md`
  support.
- Do not use `branch label`, `terminology`, or other softer copy framing to
  keep a concrete unsupported action step alive.
- Do not quietly drop the Forums pass after a weak miss or `[without context]`.
- Do not invent new terms the learner sees or new aliases during copy work.
- Do not let smoother prose hide a weak lesson burden, weak manifest, or weak
  answer contract.
- Do not leak the answer in prompt text, coach text, coach commentary, or
  feedback.

## Recognition tests

Run these before claiming the copy is ready:

### 1. Source-of-words test

Can you point to the Books or Forums language that shaped the final line?

If not, you probably freewrote it.

### 2. Authority test

If the line tells the learner exactly what a player should do in a concrete
spot, can you point to the current
`lesson_root/_authoring/ACTION_AUTHORITY.md` record?

If not, the line is not ready.

If the step still shows a concrete hand / spot plus action labeled answer or
feedback, it still needs action authority even when the copy says the learner
is `just naming the branch`.

### 3. Out-loud test

Would a player or coach actually say this sentence out loud?

If it sounds translated, padded, or outsider-written, keep iterating.

### 4. Lexical test

Did you keep a generic phrase even though the KB returned a more native one?

Common upgrades:

- `calls too often` -> `station`
- `raise the limper` -> `iso the limper`
- `small continuation bet` -> `go small`, `small c-bet`, `range-bet`
- `people do not bluff enough here` -> `pool underbluffs`, `find the fold`
- `solver allows this sometimes` -> `solver mixes`

### 5. Context test

Does the tone fit this part of the lesson?

- hints should not sound like solver notes
- coach lines should not sound like product marketing
- solver-review lines should use study language when that is the real job

### 6. Compression test

Can the line get shorter without losing the real poker wording?

Real poker copy is usually tighter than the generic draft.

## Surface rules

### Action labels

Visible button labels have a narrower contract than the rest of the copy.

This contract applies to answer button text shown to the learner only.
It does not apply to:

- prompts
- coach text
- coach commentary
- hints
- feedback
- subtitles
- concept teaching language

For action buttons shown to the learner:

- keep the label short, instantly readable, and start with the action family
- default to canonical short action labels:
  - `Fold`
  - `Check`
  - `Call`
  - `Bet`
  - `Raise`
  - `All-in`
- short action family labels such as `3-bet` or `4-bet` are acceptable only
  when the action family itself is the choice shown to the learner and the label
  still fits mobile cleanly
- include a compact size token only when sizing or mechanics is the explicit
  learning job
- if the step explicitly combines action + why in one choice shown to the learner,
  allow only the current narrow compact hybrid form that keeps the action
  family first and the suffix to one short reason token:
  - `3-bet (Value)`
  - `3-bet (Pressure)`
- do not put strategy labels, explanation copy, or local taxonomy on the
  button:
  - `Cold call`
  - `Blind defense`
  - `Overlimp`
  - `Isolation raise`
  - `Continue`
  - or similar
- do not let labels drift away from the answer contract after a copy pass
- do not relabel a concrete unsupported action step as naming or
  terminology work; remove the step or route the burden back through the
  owning workflow lane instead
- keep mobile fit explicit:
  - target short labels by default
  - hard cap table and button action labels at 18 characters
  - if the nuance does not fit, move the nuance into coach text, commentary,
    or feedback instead of stretching the button

System diagnosis:

- prior drift was possible because strategy language explanation and the
  visible button label contract were treated as one job
- they are different jobs
- explanation copy may teach `cold call` or `blind defense`
- the button label still has to stay on the short visible action contract

Ownership note:

- this file owns the visible action button contract
- architecture, materialization, copy, and critic packets must read this
  contract back explicitly when visible action choices are in scope
- attached product repo checklists, overlays, and validator output may support
  evidence, but they do not redefine or clear this contract

### Prompts, hints, and coach text

- cue the deciding variable without pre solving the learner's choice
- teach the concept, not the exact answer string
- preserve the lesson's teaching job instead of expanding the lesson with new
  theory

### Feedback

- keep feedback aligned with the current answer contract
- wrong answer feedback should teach the deciding variable
- do not patch structural confusion with extra prose

## Good and bad examples

Use these to copy the workflow and voice bar, not to cargo-cult the exact
final lines into unrelated spots.

- Bad: `This player calls too often, so don't get cute. Bet your good hands and let them pay you off.`
- Better: `This guy's a station, so don't get fancy. Just value-bet your good hands and let him pay.`

- Bad: `This is the kind of line people don't bluff enough, so folding may feel tight but it saves money.`
- Better: `Pool underbluffs this line, so even if it feels nitty, just find the fold.`

- Bad: `This board favors the preflop raiser, so a small continuation bet prints with your whole range.`
- Better: `This board smashes the PFR, so just go small and c-bet range.`

- Bad: `If a weak player limps in front of you, punish the dead money and get the hand heads-up.`
- Better: `Iso the limper, punish the dead money, and get it heads-up.`

- Bad: `After flop checks through, villain's range is often capped and indifferent, so the turn stab gets through a lot.`
- Better: `Flop goes check-check, so the turn stab is good. Range looks capped when they don't fire.`

- Bad: `Solver does not mind this at some frequency.`
- Better: `Solver mixes here.`

## Failure patterns to kill

- generic educational software tone with poker sprinkled on top
- textbook paraphrase where a player shorthand exists
- formal explanation that ignores the copy context
- line-by-line polish that leaves the lesson voice incoherent
- pre-choice language that tells the learner what button to press
- feedback that only makes sense after the answer is already known

## Evidence Expectation

For every material learner copy change, the receipt trail should make
these things visible:

- the locator or file that changed
- the current `lesson_root/_authoring/ACTION_AUTHORITY.md` or an explicit
  `not_applicable` note when no exact prescriptive action line was in scope
- the Books receipt or explicit failed attempt
- the Forums receipt or explicit failed attempt
- `A (chosen)` plus useful alternates when the wording is sensitive during review
- the exact returned language that shaped the final line
