# Lesson Right Move Rules

This file owns one question: if a lesson tells the learner the right move in a
specific hand, what proof is required before that line is allowed?

Use it with:

- `technical_references/LESSONS_TOOL_REFERENCE.md`
- `lessons_content_standards/LESSONS_POKER_GROUNDING_RULES.md`

`technical_references/LESSONS_TOOL_REFERENCE.md` explains what each tool is
for. This file decides when a concrete move claim is allowed and which proof
path is approved.

## Core Rule

If a lesson tells the learner that a player should take poker action `X` in
concrete spot `Y`, Poker Core AI must be the authority for that exact
spot/action claim.

Examples:

- `Fold here.`
- `You should call this combo.`
- `Raise here.`
- wrong-answer feedback that says the better action was `call`, `fold`,
  `raise`, `check`, `bet`, `3-bet`, or `jam`

If the exact action claim is unsupported, unavailable, mismatched, or
inconclusive, the lesson may not ship that prescriptive line.

## Renaming A Concrete Step Does Not Remove The Requirement

A lesson step still teaches a specific action when all of these are true:

- it shows a concrete hero hand in a concrete spot
- the learner is choosing, confirming, or judging an action-labeled answer
- correctness, endorsement, or feedback still treats one action as the right
  line for that concrete spot

This remains true even if the packet calls the step:

- `branch label`
- `terminology`
- `menu install`
- `naming the line`
- or any similar softer label

To remove the requirement, you must make a real change:

- remove the concrete action step entirely
- replace the concrete rep from the earliest owning lane
- or route the work upstream until the step becomes honest

Reusing the same concrete hand, spot, and action step under softer wording is
not a legal escape hatch.

## What Each Tool May Support

| Need | Approved tool | What proof to leave |
| --- | --- | --- |
| Mechanical fact | FastCards | normal mechanical receipt trail |
| Concept framing, terminology, or real poker wording | PokerKB | Books and Forums receipts |
| Specific right move in one fixed concrete spot | Poker Core AI via HandBuilder on `play-origin` | `lesson_root/_authoring/ACTION_AUTHORITY.md` plus raw HandBuilder artifact |
| Live runtime parity or action-menu capture | Poker Core AI via Play_Vs_AI on `play-origin` | stepped runtime artifact plus parity note |

## Authority Split

- FastCards is for mechanics, legality, classification, deterministic candidate
  sets, and validation. It is never the authority for the right move in a
  concrete learner-facing spot.
- PokerKB is for meaning, framing, terminology, and player-language wording.
  It is never the authority for the right move in a concrete learner-facing
  spot.
- Poker Core AI is the only authority for the right move in a concrete
  learner-facing spot.

## Exact-Clearance Rule

When a packet contains a concrete right-move claim, the lesson root must carry
a current `lesson_root/_authoring/ACTION_AUTHORITY.md` with at least:

- the step identifier or file name
- the exact spot spec
- the exact hero hand, board, and action history used for the consult
- the `policy_id`
- the raw consult artifact reference
- the normalized chosen action summary
- the parity note that binds this record to the current manifest or copy file

## Lane Boundary

- dossier, curator, architecture, playable strategy, and lesson architecture
  may define the decision family, misconception, and action menu in scope
- situation synthesis may widen pools with FastCards and frame the rep family
  with PokerKB
- situation synthesis must not freeze a final kept rep that teaches an exact
  action without current Poker Core AI authority for that exact spot
- later lanes may preserve the current kind of claim, but may not downgrade a
  concrete unsupported action step into `label only`,
  `terminology only`, or similar cover
- materializer may preserve an action-authority record, but may not drift it
- copy may phrase an already-authoritative action recommendation, but may not
  invent, sharpen, or strengthen one

## Required Artifact

Before a packet may claim that the chosen authority path is available, it must
carry one of these:

- current capability proof for the exact path it plans to use
- current raw consult evidence for the exact kept rep

## Approved Consult Route By Lesson Shape

For fixed-frame lessons where the stable spot is already known and the live
variable is mainly the chosen hero hand or a small exact rep set, the approved
Lessons path for exact action authority is HandBuilder on:

- `https://play-origin.pokerskill.com/mcp/hand_builder`

Use it this way:

- create the exact HandBuilder session needed for the lesson shape
- set the exact player count, seat, and position state needed for the spot
- set the exact hero hole cards and any other exact cards the spot requires
- apply the exact action line until the target decision point is reached
- inspect the resulting node, legal actions, and current policy or evaluation
  output for that exact built spot
- persist the raw HandBuilder artifact, the exported OHH, and any named
  `policy_id` returned by the current evaluation route
- bind the chosen `policy_id` plus the exact built spot to
  `lesson_root/_authoring/ACTION_AUTHORITY.md`

If the lesson shape is fixed but HandBuilder cannot express the spot, cannot
return current policy output, or cannot name a current `policy_id` for the
exact kept rep, keep the issue blocked and route owner resolution through
`AUTHORITATIVE_LESSONS_WORKFLOW.md`.

For live runtime parity, menu capture, or stepped session confirmation on the
same sanctioned host, the approved secondary service is Play_Vs_AI `/v1/*` on:

- `https://play-origin.pokerskill.com`

Use Play_Vs_AI this way:

- discover live ladders and policy families with `GET /v1/capabilities`
- capture the live menu, action strip, and stepped session receipts for parity
  or runtime confirmation work
- persist the raw stepped consult artifact when a packet needs live runtime
  parity in addition to the exact built spot

For fixed-frame chosen-hand lesson work, Play_Vs_AI cash-session stepping is
secondary parity evidence, not the required primary runner for exact spots.

Route rules:

- do not treat Play_Vs_AI cash-session sampling as the required primary route
  for a lesson that already knows the exact frame and needs chosen hero hands
- do not treat HandBuilder as shaping only for that lesson shape; it is the
  approved authority path for exact spots on `play-origin`
- do not claim `@rustai/poker-sdk`, `sdk.policy.listPolicies()`, or
  `sdk.policy.evaluatePolicy()` as the approved Lessons authority route unless
  the attached checkout actually exposes a working `/api/policies` and
  `/api/evaluate` route and this file is updated in place
- the generated SDK localhost default is not an approved Lessons authority
  route
- do not substitute any other host for the approved `play-origin` consult
  route in doctrine, issue guidance, or execution packets unless this file is
  updated in place first
- do not substitute ad hoc backend health probes for current HandBuilder or
  Play_Vs_AI raw consult artifacts
- an attached checkout backend proxy is acceptable only when it forwards to
  the same sanctioned `play-origin` HandBuilder or Play_Vs_AI service and
  preserves the raw consult payloads named above
- if HandBuilder cannot reach the needed spot or cannot return current raw
  artifacts, keep the issue blocked and route owner resolution through
  `AUTHORITATIVE_LESSONS_WORKFLOW.md`

## Stop And Escalate Rule

Unsupported spot classes, missing policy coverage, or inconclusive consults are
not permission to fall back to instinct, FastCards, PokerKB, or inherited copy.

When authority is missing:

- widen or reshape the candidate set from the owning upstream lane
- remove the concrete action step from scope
- or keep the issue blocked until the owning lane resolves the authority gap

Do not guess Poker Core AI consult URLs from PokerKB docs, repo-local localhost
examples, or ad hoc SDK experiments. Exact right-move proof is legal only when
the issue or shared tooling contract names the approved consult route.

Do not keep the same concrete hand, spot, and action-labeled correct answer and
claim the step is only teaching the branch name.

Do not ship the exact action claim anyway.
