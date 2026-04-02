# Lessons Tool Reference

This document is the evergreen reference for the core utilities used in
Lessons work.

It explains what each utility is, what it does well, what it should not be
used for, and how it applies to lesson authorship.

This file explains what each tool is for.
Use `lessons_content_standards/LESSONS_POKER_GROUNDING_RULES.md` for wording
and concept grounding.
Use `lessons_content_standards/LESSON_RIGHT_MOVE_RULES.md` for concrete
right-move rules and the sanctioned `play-origin` routes.

## Quick Boundary Map

| Utility | Best for | Not for |
| --- | --- | --- |
| FastCards | deterministic poker mechanics, ranges, combo math, legality, replay-backed validation, OHH analytics | exact strategy authority |
| PokerKB | definitions, terminology, framing, player language, grounded claim checks | exact action authority |
| HandBuilder | constructing exact spots, setting exact cards and action lines, certifying OHH hand histories, and inspecting policy output on built hands | replacing FastCards, PokerKB, or shared authority law |
| Play_Vs_AI | live session stepping, visible action menus, runtime parity capture, authority payloads, OHH export | replacing FastCards, PokerKB, or HandBuilder on fixed chosen hand spots |

## FastCards

### What it is

FastCards is the deterministic poker-math and validation utility. It is a
primitive tool, not a strategist.

### Capability families

- range and combo work
  - expand labels into combos
  - expand combos into labels
  - count combos
  - fetch indexed combos deterministically
- hand and board analysis
  - hand properties
  - blocker counts
  - draw detection
  - draw-quality analysis
  - board texture
  - board category
- showdown and hand-strength utilities
  - best-five evaluation
  - showdown comparison
  - best-five enumeration
  - kicker-impact analysis
- nuts and winner analysis
  - nuts analysis
  - nuts radar
  - exhaustive winner checks
- legality and replay-backed validation
  - direct action legality validation
  - action validation from OHH
  - full OHH action validation
  - puzzle OHH validation
  - decision-choice validation at a puzzle boundary
- OHH analytics
  - hero view
  - board profile
  - SPR
  - scare-card analysis
- grid and UI helpers
  - grid generation by rank
  - grid generation by suit
  - grid selection helpers
- dealing, hashing, and stats
  - round dealing
  - stable deal hashes
  - card hashes
  - deck counts
  - starting-hand combo stats
  - hand-category basics
  - five-card category stats

### What it is good at

- generating deterministic candidate sets such as `QQ+, AKo, AKs, AQs`
- proving that the set is honestly wide enough
- validating that a concrete combo belongs to a declared set
- validating that a proposed action is mechanically legal
- replaying an OHH hand history and validating actions against the actual state
- validating recorded puzzle choices at the decision boundary
- checking whether a board or hand has the properties a lesson claims
- proving that two reps are materially different rather than accidental
  near-duplicates
- fingerprinting or deduping candidate reps deterministically
- supporting UI-style range and grid work when lesson design needs a structured
  hand-family view

### How it applies to lesson authorship

- building candidate hand families for lesson reps
- proving that a kept hand came from a declared family
- validating preflop pool construction before any authority consult
- checking blockers, draws, textures, and board classes for postflop lessons
- validating whether a shown action menu is mechanically legal in a replayed
  state
- auditing recorded decision points for lessons or puzzles
- creating deterministic receipts for set math and rep selection

### What it is not for

- deciding whether Hero should fold, call, bet, raise, 3-bet, or jam
- certifying a right answer shown to the learner in a concrete spot
- replacing a policy engine or authority consult
- default scenario-pack generation

## PokerKB

### What it is

PokerKB is the grounded poker knowledge utility for definitions, meaning,
framing, terminology, and real poker wording.

Use `lessons_content_standards/LESSONS_POKER_GROUNDING_RULES.md` for when
grounding is required.

### Tool families

- `kb_search_summary_only`
  - retrieve concise grounded summaries
- `kb_authoritative_answer`
  - answer a scoped poker question directly
- `kb_compare_perspectives`
  - compare strategic lenses or schools of thought
- `kb_validate_claim`
  - test whether a poker claim is supportable

### What it is good at

- defining terms cleanly
- checking whether a phrase sounds like real poker language a player would actually use
- separating formal book framing from player phrasing
- validating concept level claims before they become lesson copy
- comparing two reasonable ways to explain the same idea
- grounding family level statements such as fold family, value-raise family,
  cold-call family, or bluff-catch family
- checking whether a explanation for the learner is conceptually honest
- checking whether a fixed candidate set is described or labeled sensibly

### How it applies to lesson authorship

- defining learner-safe terms
- grounding step names and concept names
- checking whether lesson language sounds like real poker language instead of AI prose
- validating family level framing before concrete reps are chosen
- checking books versus forums when formal language and player language differ
- validating misconception claims, hint copy, and short explanations
- labeling or sanity-checking a fixed candidate set without pretending to be
  the exact action authority

### What it is not for

- deciding the exact best action in a concrete hand plus spot
- certifying that a shown rep is a clean fold, call, bet, or 3-bet anchor
- generating the final candidate set by itself
- replacing the current authority route for action claims shown to the learner

## HandBuilder

### What it is

HandBuilder is the sessioned RustAI hand construction, OHH-certification, and
decision evaluation utility.

It is for building exact spots, replaying them, inspecting the resulting node,
and exporting or evaluating the decision point.

### Capability families

- preset and settings discovery
  - list cash presets
  - list tournament presets
  - describe preset settings
  - read default cash settings
  - read default tournament settings
- session lifecycle
  - create session
  - read session details
  - read tournament state
  - update tournament stacks and levels
- dealing
  - deal exact hole cards
  - deal random hole cards
  - mix exact and random seats in the same hand
  - reserve flop, turn, and river cards at hand start
  - deal flop, turn, and river
- node inspection and action sequencing
  - inspect current node status
  - inspect current legal actions
  - fold
  - check or call
  - bet
  - raise to
  - apply actions one node at a time
- policy and evaluation
  - get policy recommendations for the current acting player
  - inspect action probabilities on the built hand
  - run one-shot decision evaluation from OHH
  - inspect source type, EV, and recommendation payloads when returned
- export and results
  - dump current OHH
  - inspect final results and winners
  - finalize a terminal hand
- certification and exact spot shaping
  - certify that a built sequence reaches the intended decision point
  - prove that exact cards and exact action history produce the intended node
  - create reusable exact spot receipts for audit or shaping work

### What it is good at

- constructing an exact spot instead of waiting for it to occur naturally
- creating reproducible OHH fixtures
- certifying that a decision point is where you think it is
- proving that a sequence of actions leads to a specific boundary
- creating exact hole card and board card examples when the task needs a
  hand history artifact
- inspecting legal actions and current node status on the constructed hand
- reading policy recommendations on a built hand without a separate live
  session-harvest loop
- evaluating one OHH decision point directly when the task is audit or shaping
- auditing whether a lesson or puzzle hand history is internally coherent

### How it applies to lesson authorship

- building exact candidate reps when lesson work needs a specific hand and spot
- certifying that a proposed lesson rep reaches the claimed decision boundary
- exporting a clean OHH artifact for review or downstream use
- checking whether a hero decision point is actually the one the lesson claims
- inspecting the legal menu and policy output on an exact built rep
- serving as the primary exact spot runner when the lesson already knows the
  stable frame and needs chosen Hero hands tested directly
- running exact spot work without relying on random live sampling
- creating precise test fixtures for lesson or puzzle audits

### What it is not for

- replacing the shared lessons doctrine about which lesson shapes require
  HandBuilder and what receipts must be left
- replacing FastCards range, combo, or legality work
- replacing PokerKB terminology or framing work
- replacing Play_Vs_AI when the job is live runtime parity or live menu capture

## Play_Vs_AI

### What it is

Play_Vs_AI is the live runtime service that exposes session state, visible
action menus, and the exact authority payloads used for action shown to the learner
claims on the live runtime.

The current sanctioned live runtime path is defined by
`lessons_content_standards/LESSON_RIGHT_MOVE_RULES.md`.
Today that path is on `play-origin`.
For fixed frame lessons with chosen Hero hands, HandBuilder is the primary
runner for exact spots and Play_Vs_AI is the secondary parity and
runtime confirmation tool.

### Current Lessons runtime path

- `https://play-origin.pokerskill.com`

### Runtime routes

- capabilities discovery
  - `GET /v1/capabilities`
- session creation
  - `POST /v1/sessions/cash`
- hand lifecycle
  - `POST /v1/sessions/<sessionId>/hand/start`
  - `POST /v1/sessions/<sessionId>/hand/step`
  - `POST /v1/sessions/<sessionId>/hand/hero_action`
  - `POST /v1/sessions/<sessionId>/hand/finalize`
- OHH export
  - `GET /v1/sessions/<sessionId>/hand/ohh_view`

### What it exposes

- live ladder and preset capabilities
- session identity
- hero seat
- hero hole cards after hand start
- current node type
- round and current player
- applied actions
- auto-applied actions
- legal actions
- hero turn sizing
- OHH delta
- OHH payload
- hand and decision indices
- hero decision evaluation payloads
- active policy context

### What it is good at

- discovering the live capability and preset state
- creating a live session for the exact player count and ladder family needed
- stepping forward until Hero reaches a target decision point
- confirming the exact action strip and sizing state Hero sees
- retrieving the raw live runtime payload behind a action claim shown to the learner
- exporting the live hand state as OHH based data
- confirming whether a concrete candidate rep lands on a stable hero-turn spot
- capturing the current action distribution or recommendation for an exact hand
  and spot when the runtime itself is the object being checked

### How it applies to lesson authorship

- verifying that a lesson spot actually exists on the sanctioned runtime
- capturing the exact menu the learner would see
- capturing live parity support for concrete fold, call, bet, raise, 3-bet, or
  jam claims
- verifying that the final kept rep matches the live runtime state
- collecting OHH based receipts for review and parity work

### What it is not for

- generating candidate hand pools
- defining terminology
- validating concept level claims without a concrete spot
- acting as the primary runner for exact spots when the lesson already knows the
  frame and needs chosen Hero hands or an exact forced action line
- replacing HandBuilder when the job is to construct or certify an OHH hand
  history directly

## Quick Reference

| Need | Default utility |
| --- | --- |
| Expand a range into exact combos | FastCards |
| Count or inspect pool breadth | FastCards |
| Validate an action mechanically in a replayed state | FastCards |
| Check board texture, blockers, draws, or SPR | FastCards |
| Define a term or concept cleanly | PokerKB |
| Check player phrasing or aliases | PokerKB |
| Validate a concept level claim | PokerKB |
| Construct an exact hole card or reserved board spot | HandBuilder |
| Build or certify an OpenHH hand history | HandBuilder |
| Certify a concrete decision point in a hand history | HandBuilder |
| Inspect legal actions or policy output on a built exact spot | HandBuilder |
| Run one-shot OHH decision evaluation for shaping or audit | HandBuilder |
| Discover live ladder and preset capabilities | Play_Vs_AI |
| Step to a live hero-turn spot | Play_Vs_AI |
| Retrieve current exact action authority payloads | Play_Vs_AI |

## Anti-Patterns

- Asking FastCards to answer a strategy question.
- Asking PokerKB to certify a concrete action as correct.
- Asking HandBuilder to stand in for a policy or authority engine.
- Treating HandBuilder capability growth as automatic permission to ignore
  shared lessons authority doctrine.
- Using Play_Vs_AI to replace deterministic range or combo work.
- Using Play_Vs_AI to replace terminology or framing work.
- Treating family framing as exact action authority.
- Treating terminology support as exact action authority.
- Treating a hand history artifact as if it were a strategic endorsement.
- Treating a remembered session or stale packet as if it were current authority.
- Naming any host other than `https://play-origin.pokerskill.com` as the
  sanctioned path for exact action authority in this reference.
