# Lessons Workflow Simple Clear

## Goal

We already simplified the Lessons workflow. That part was good.

What is missing now is the end-to-end curriculum logic that should happen
before lesson materialization:

- what the learner should already know
- what this section should newly teach
- which concepts and terms belong in the section
- which lessons teach which concepts
- what each lesson introduces, and in what order

This note is only an input/output map for the lanes we likely need to touch.
It is not an implementation plan.

## North Stars

- Keep the handoff chain simple.
- Prefer clear ownership over process machinery.
- Make the next move obvious from the current packet.
- Give each idea, decision, and artifact one clear owner.
- Remove duplicate patterns and competing ways of doing the same job.
- Use specific expectations and examples instead of vague process language.
- Keep the workflow linear enough that someone can follow it in one pass.

## Desired Outcomes

- A Lessons agent should be able to look at the current lane, the current
  packet, and the immediate upstream packet and know what to do next.
- Each lane should have one clear job, one clear handoff, and one clear stop
  line.
- The packet chain should carry the real decisions forward so later lanes do
  not have to guess, reconstruct context, or invent missing logic.
- Concept, term, lesson, playable, situation, and copy decisions should flow
  forward cleanly without being re-decided in downstream lanes.
- Good work should be easy to recognize because the examples, packet names,
  and ownership lines are concrete.
- The critic should be able to check the flow quickly because the chain is
  crisp, the artifacts are explicit, and the ownership boundaries are clean.
- The whole system should feel simple, direct, and hard to misunderstand.

## Canonical Example For This Doc

- Track 02: `Beginner Strategy` (`track_02_poker-fundamentals-beginner-strategy`)
- Section 03: `Play Some Poker` (`section_03_play-some-poker`)
- Section summary:
  - `Your first session loop: what hands to play, raise-or-fold, and a simple flop plan (missed flop + top pair).`

## Packet Cheat Sheet

This is the ideal packet layout for the workflow we want.

It is not a readback of today's on-disk packet names.

All packet filenames below are assumed to live under the owning root's
`_authoring/` directory.

### Section-level packets

- `_authoring/SECTION_DOSSIER.md`
  - owns the learner baseline, the section advancement target, what the section will and will not teach, and the PokerKB grounding behind those calls

- `_authoring/SECTION_CONCEPTS_AND_TERMS.md`
  - owns the ordered concept and term map for the section

- `_authoring/SECTION_LESSON_MAP.md`
  - owns lesson count, lesson order, and what each lesson is there to teach

- `_authoring/SECTION_PLAYABLE_STRATEGY.md`
  - owns the accepted playable families and the downstream constraints they create

### Lesson-level packets

- `_authoring/LESSON_PLAN.md`
  - owns lesson length, step plan, what is new here, what is reinforced, and what is deferred

- `_authoring/LESSON_SITUATIONS.md`
  - owns the concrete kept spots for each step, plus the rejected spots and repetition control

- `_authoring/ACTION_AUTHORITY.md`
  - only when the lesson teaches the right move in a concrete spot

- `_authoring/lesson_manifest.json`
  - owns the built lesson the learner will actually see

- `_authoring/MANIFEST_VALIDATION.md`
  - owns route choice, validation proof, and any build constraints that later lanes must preserve

- `_authoring/COPY_GROUNDING.md`
  - owns copy grounding, locked-term preservation, and leak checks

## Linear Flow

1. `Section Dossier Engineer`
   - Input:
     - `No packet`: track and section metadata
     - `No packet`: prior section and prior track context from the catalog
     - `No packet`: PokerKB discovery consults about what should come next for the learner

   - Interim:
     - a prior-curriculum summary
     - a plain-language section-truth table

   - Output:
     - `_authoring/SECTION_DOSSIER.md`
     - this packet owns the learner baseline, the section advancement target, what the section will and will not teach, and the receipts behind those calls

2. `Section Concepts and Terms Curator`
   - Input:
     - `_authoring/SECTION_DOSSIER.md`: the section teaching burden in plain language
     - `No packet`: PokerKB grounding for disputed meaning, naming, and poker-native wording

   - Interim:
     - a concept-versus-term decision list
     - an ordered teaching path for the section

   - Output:
     - `_authoring/SECTION_CONCEPTS_AND_TERMS.md`
     - this packet owns the ordered concept map, the terms under each concept, what is new versus existing, and any glossary calls

3. `Lessons Section Architect`
   - Input:
     - `_authoring/SECTION_DOSSIER.md`: what this section must accomplish and what it must not reteach
     - `_authoring/SECTION_CONCEPTS_AND_TERMS.md`: the locked concepts and terms for this section
     - nearby previous `_authoring/SECTION_LESSON_MAP.md` packets: section-size and lesson-flow context from earlier sections

   - Interim:
     - a recent-section size readback
     - a concept-to-lesson mapping draft

   - Output:
     - `_authoring/SECTION_LESSON_MAP.md`
     - this packet owns lesson count, lesson order, what each lesson teaches, and what each lesson introduces versus reinforces

4. `Lessons Playable Strategist`
   - Input:
     - `_authoring/SECTION_LESSON_MAP.md`: the lesson jobs the section needs to support
     - `_authoring/SECTION_DOSSIER.md`: the section promise in plain English
     - `No packet`: explicit user guidance about playable shape
     - `No packet`: current product evidence about what playable families really exist

   - Interim:
     - a ranked playable-options list
     - a downstream constraint list

   - Output:
     - `_authoring/SECTION_PLAYABLE_STRATEGY.md`
     - this packet owns the accepted playable families, rejected playable families, and the constraints later lesson lanes must preserve

5. `Lessons Lesson Architect`
   - Input:
     - `_authoring/SECTION_LESSON_MAP.md`: the lesson slot this lesson owns
     - `_authoring/SECTION_CONCEPTS_AND_TERMS.md`: the concepts and terms this lesson must carry
     - `_authoring/SECTION_PLAYABLE_STRATEGY.md`: the playable constraints for this lesson
     - nearby previous `_authoring/LESSON_PLAN.md` packets: recent lesson-size and comparable-lesson context

   - Interim:
      - a recent lesson-flow table
      - a real comparable-lessons table

   - Output:
      - `_authoring/LESSON_PLAN.md`
      - this packet owns lesson length, step order, what is new, what is reinforced, what is deferred, what must stay stable, and what can vary safely

6. `Lessons Situation Synthesizer`
   - Input:
     - `_authoring/LESSON_PLAN.md`: the step jobs and teaching burden
     - `_authoring/SECTION_PLAYABLE_STRATEGY.md`: any step-level playable constraints that still matter
     - `No packet`: FastCards, PokerKB, and Poker Core AI grounding and tooling

   - Interim:
     - a deterministic candidate set
     - a rejection trail and repetition check

   - Output:
     - `_authoring/LESSON_SITUATIONS.md`
     - this packet owns the kept spots for each step, the rejected spots, and why the kept spots won
     - `_authoring/ACTION_AUTHORITY.md` when exact action is being taught
     - this packet owns the right-move proof for any concrete action claim

7. `Lessons Playable Materializer`
   - Input:
     - `_authoring/LESSON_PLAN.md`: the locked lesson structure
     - `_authoring/LESSON_SITUATIONS.md`: the kept concrete spots
     - `_authoring/ACTION_AUTHORITY.md` when exact action is in scope
     - `No packet`: step-route guide, validators, and current product truth from the live checkout

   - Interim:
     - a route-by-step build table
     - a validation readback

   - Output:
     - `_authoring/lesson_manifest.json`
     - this packet owns the built lesson structure and step data
     - `_authoring/MANIFEST_VALIDATION.md`
     - this packet owns route choice, validation proof, and any build constraints the copywriter must preserve

8. `Lessons Copywriter`
   - Input:
     - `_authoring/SECTION_CONCEPTS_AND_TERMS.md`: the locked concepts and terms that must survive into learner-facing copy
     - `_authoring/LESSON_PLAN.md`: the lesson burden and step jobs
     - `_authoring/LESSON_SITUATIONS.md`: the concrete spots
     - `_authoring/ACTION_AUTHORITY.md` when exact action is in scope
     - `_authoring/lesson_manifest.json`: the current built lesson
     - `_authoring/MANIFEST_VALIDATION.md`: any length or structure constraints the copy pass must respect
     - `No packet`: PokerKB Books and Forums grounding

   - Interim:
     - a copy requirements map by learner-facing surface
     - grounded wording options that keep the locked terms instead of renaming the concept

   - Output:
     - `_authoring/lesson_manifest.json`
     - this packet is updated with final learner-facing copy, feedback, and coach text without changing structure
     - `_authoring/COPY_GROUNDING.md`
     - this packet owns per-surface copy decisions, required terms preserved, Books and Forums receipts, and leak checks

9. `Lessons Acceptance Critic`
   - Input:
     - the current lane's output packet or packets
     - the upstream packet chain that current packet depends on
     - `No packet`: quality bar, grounding rules, copy rules, and right-move rules

   - Interim:
     - a review checklist
     - a short failing-gates list when something drifted or lost proof

   - Output:
     - `No packet`: explicit verdict comment and reroute to the earliest honest owner

----------


# Definitions

interim artifacts are items that it builds itself, probably from inputs but maybe not explicitly passed in like an argument maybe more like just looked up 

# OPEN ITEMS

How does this differ if we have a section description or not? (can be overriden with user instruction to rewrite, etc)
Where do we emit our actual section description that goes into json?
We probably need to come back and refactor `paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_PACKET_SHAPES.md` so it matches these forward artifacts more directly instead of mostly reading like the full on-disk packet bundle.

Wher edo we create new terms explicitely? e.g. define them, etc

-------


# Real Example Artifacts For Track 02 / Section 03

These examples use real catalog data from the current `Track 02 / Section 03`
surfaces:

- `track.meta.json`
- `section.meta.json`
- `_authoring/BRIEF.md`
- `_authoring/CONCEPTS.md`
- the current published `lesson_manifest.json` files in this section

## 1. `Section Dossier Engineer`

### Real interim artifact: what they learned in previous tracks/sections

- Track 01 / Section 01 `Cards & Deck Basics`: `card-notation`, `deck-composition`, `hand-notation`, `offsuit`, `pocket-pair`, `suit`, `suited`, `wheel`
- Track 01 / Section 02 `Hand Rankings & Kicker Logic`: `flush`, `four-of-a-kind`, `full-house`, `hand-rankings`, `kicker`, `one-pair`, `royal-flush`, `set`, `straight`, `straight-flush`, `three-of-a-kind`, `trips`, `two-pair`, `wheel`
- Track 01 / Section 03 `Read the Board & Pick Winners`: `best-five-rule`, `counterfeit`, `flush`, `hand-ranking`, `kicker`, `paired-board`, `playing-the-board`, `split-pot`, `straight`
- Track 02 / Section 01 `Positions, Blinds & Actions`: `action-order`, `betting-actions`, `blinds`, `minimum-raise`, `position`, `position-advantage`, `raise`, `reopening-action`
- Track 02 / Section 02 `Draw Fundamentals`: `backdoor-flush-draw`, `clean-outs`, `combo-draw`, `counting-outs`, `dirty-outs`, `double-gutshot`, `flush-draw`, `gutshot`, `monotone-board`, `nut-flush-draw`, `open-ended-straight-draw`, `rule-of-4-2`, `straight-draw`

### Real output artifact: what they'll learn in this section

#### Where they get it from

The PokerKB consult is based on what the learner already knows plus where they
are in the track.

Do not seed it with the section answer if the job is to discover what this
section should teach.

#### Example input packet for PokerKB

- Track goal:
  `Positions, action order, draw basics, and first-session decision flow.`
- Previous sections in this track:
  `Positions, Blinds & Actions`
  `Draw Fundamentals`
- Prior curriculum summary:
  the section-by-section concept list above from Track 01 / Section 01 through Track 02 / Section 02
- Constraints:
  `6-max cash`
  `~100bb`
  `section-sized, not a whole track`
  `beginner-safe`
  `plain language`
  `do not assume my answer`
- Primary ask:
  `Given what the learner already knows, what is the next natural chapter in their learning journey? Tell me what comes next, why it comes next, what belongs inside it, and where it should stop so it does not try to teach too much.`
- Boundary follow-up:
  `For a first real session, is that chapter enough on its own, or does it need one tiny postflop bridge to make the loop usable?`
- Narrow follow-ups after the chapter is found:
  `What should a beginner understand about opening early versus late?`
  `Is raise-or-fold the right beginner default when first in?`
  `After raising and getting called, when should they bet more often and when should they check more often?`
  `What should they do with top pair after raising preflop?`

#### Example

This is what the output can look like once the lane has consulted PokerKB and
assembled the section-truth table.

| What they should learn | Plain-language truth | PokerKB receipts |
| --- | --- | --- |
| What hands do I play? | Stay tighter early and wider late. This section should introduce a simple first-in opening baseline by position. | `ans-fb30316b3fc4`, `ans-0a8ace76ab4a` |
| Do I raise or fold? | If a hand is strong enough to play first in, raise it. Open-limping is not the beginner default. | `ans-fb30316b3fc4`, `ans-f21edfb3e501` |
| Do I need a simple plan after I raise? | Yes. For a first real session, preflop alone is a little too narrow. The section should close the loop with one tiny flop continuation heuristic. | `ans-d1a0d7a6ff69` |
| Do I bet a flop I missed? | Bet more often heads-up on dry boards. Check more often on wet boards and in multi-way pots. | `ans-d1a0d7a6ff69`, `ans-b75e0b619778` |
| What do I do with top pair? | Value-bet the obvious spots and slow down fast when the board or the action gets scary. | `ans-d1a0d7a6ff69`, `ans-cf9f7a28a23d` |

## 2. `Section Concepts and Terms Curator`

### Real input artifact: what this section is trying to teach

- The learner should leave this section knowing that position changes which hands they can play.
- The learner should leave this section with a raise-first default when they enter the pot first.
- The learner should leave this section with a simple postflop split between bet and check after getting called.
- The learner should leave this section with a basic top-pair value plan and slow-down cues.

### Where they get it from

- the section-truth table from the dossier step
- `psmobile-lesson-terms-and-concepts-primer` first, to ramp up on terms versus concepts and split the candidate list into concept, term, both, or reject
- `psmobile-lesson-concept-curator` to map to existing concepts or create new concept IDs
- `psmobile-lesson-term-curator` to map to existing terms, add aliases, or create new learner-facing terms
- `psmobile-lesson-poker-kb-interface` to ground concept legitimacy, definitions, aliases, and poker-native wording with books/forums receipts

### Real output artifact: concept and term mapping

1. `position`
   - Concept status: existing
   - Section job: position changes which hands the learner can play
   - Terms under this concept:
     - `early position` - existing term
     - `late position` - existing term

2. `opening-ranges`
   - Concept status: new
   - Section job: tighter early, wider late
   - Terms under this concept:
     - `opening range` - new term

3. `open-raise-sizing`
   - Concept status: new
   - Section job: if a hand is strong enough to play first in, raise it
   - Terms under this concept:
     - `open raise` - existing term
     - `open limp` - existing term

4. `continuation-bet`
   - Concept status: new
   - Section job: after raising and getting called, the learner needs one simple bet-versus-check default
   - Terms under this concept:
     - `continuation bet` - existing term
     - `c-bet` - existing term

5. `board-texture`
   - Concept status: new
   - Section job: dry versus wet is the simple board-reading lens this section needs
   - Terms under this concept:
     - `dry board` - existing term
     - `wet board` - existing term

6. `top-pair`
   - Concept status: new
   - Section job: top pair is the made-hand anchor for the section's simple value plan
   - Terms under this concept:
     - `top pair` - existing term

7. `value-bet`
   - Concept status: new
   - Section job: value-bet the obvious spots, then slow down on danger signals
   - Terms under this concept:
     - `value bet` - existing term

## 3. `Lessons Section Architect`

### Real input artifact: the concept and term mapping this section has to turn into lessons

1. `position`
   - terms: `early position`, `late position`

2. `opening-ranges`
   - terms: `opening range`

3. `open-raise-sizing`
   - terms: `open raise`, `open limp`

4. `continuation-bet`
   - terms: `continuation bet`, `c-bet`

5. `board-texture`
   - terms: `dry board`, `wet board`

6. `top-pair`
   - terms: `top pair`

7. `value-bet`
   - terms: `value bet`

### Real interim artifact: recent section lesson counts

For this section there are only five prior sections in the curriculum so far,
so the readback uses all five.

| Prior section | Lesson count | Concepts taught |
| --- | --- | --- |
| Track 01 / Section 01 `Cards & Deck Basics` | 3 | `card-notation`, `deck-composition`, `hand-notation`, `offsuit`, `pocket-pair`, `suit`, `suited`, `wheel` |
| Track 01 / Section 02 `Hand Rankings & Kicker Logic` | 6 | `flush`, `four-of-a-kind`, `full-house`, `hand-rankings`, `kicker`, `one-pair`, `royal-flush`, `set`, `straight`, `straight-flush`, `three-of-a-kind`, `trips`, `two-pair`, `wheel` |
| Track 01 / Section 03 `Read the Board & Pick Winners` | 7 | `best-five-rule`, `counterfeit`, `flush`, `hand-ranking`, `kicker`, `paired-board`, `playing-the-board`, `split-pot`, `straight` |
| Track 02 / Section 01 `Positions, Blinds & Actions` | 5 | `action-order`, `betting-actions`, `blinds`, `minimum-raise`, `position`, `position-advantage`, `raise`, `reopening-action` |
| Track 02 / Section 02 `Draw Fundamentals` | 6 | `backdoor-flush-draw`, `clean-outs`, `combo-draw`, `counting-outs`, `dirty-outs`, `double-gutshot`, `flush-draw`, `gutshot`, `monotone-board`, `nut-flush-draw`, `open-ended-straight-draw`, `rule-of-4-2`, `straight-draw` |

### Real output artifact: which lesson teaches what

- Lesson count: `6`

1. `First Orbit Mindset`
   - What it does: installs the starting-hand baseline
   - Concepts: `position`, `opening-ranges`

2. `Raise or Fold (No Limping)`
   - What it does: turns the starting-hand baseline into a raise-first default
   - Concepts: `opening-ranges`, `position`, `open-raise-sizing`

3. `After You Raise: Simple Flop Plan`
   - What it does: explains the learner's first simple plan after getting called
   - Concepts: `continuation-bet`, `board-texture`

4. `Missed Flop: Bet or Check?`
   - What it does: narrows missed-flop play to one usable heuristic
   - Concepts: `continuation-bet`, `board-texture`

5. `First Contact Postflop`
   - What it does: teaches the top-pair value baseline
   - Concepts: `top-pair`, `value-bet`, `board-texture`

6. `Put it together`
   - What it does: acts as the section capstone and reinforces the earlier section concepts
   - Concepts: `position`, `opening-ranges`, `open-raise-sizing`, `continuation-bet`, `board-texture`, `top-pair`, `value-bet`

## 4. `Lessons Playable Strategist`

This section is only a stub for now.

There is no live `PLAYABLE_STRATEGY.md` in `Track 02 / Section 03` today, so
the closest current evidence is the real `_authoring/TEMPLATE.md` plus the
shared strategist workflow.

### Real input artifact: section architecture plus current playable evidence

- Section architecture output:
  - 6 lessons
  - preflop baseline lessons
  - missed-flop lessons
  - top-pair value lesson
  - capstone lesson
- Current product evidence:
  - `_authoring/TEMPLATE.md`

### Real output artifact: playable strategy stub

- Section playable direction:
  - preflop-first, with only the minimum postflop needed to complete the first-session loop
- Accepted playable families:
  - preflop fundamentals -> `guided_walkthrough` + `single_select_with_hand`
  - missed-flop lessons -> `guided_walkthrough` + `single_select_with_hand_board`
  - top-pair value lesson -> `guided_walkthrough` + `single_select_with_hand_board`
  - capstone -> `scripted_hand`
- Downstream constraints:
  - target roughly `90-120s` per lesson
  - use 2 options when possible
  - only use 3 options when `Limp` needs to appear as an explicit wrong choice
  - do not introduce a new mechanic in a lesson's test step
  - keep the capstone heads-up and simple

## 5. `Lessons Lesson Architect`

There is no live `LESSON_ARCHITECTURE.md` in this section today, so the sample
below is grounded in the real lesson doctrine plus the live `BRIEF.md`,
`CONCEPTS.md`, and `lesson_manifest.json` for this lesson.

### Real input artifact: one lesson from the section plan

| Field | Value |
| --- | --- |
| Lesson title | `Raise or Fold (No Limping)` |
| Lesson id | `poker-fundamentals-quickstart_play-some-poker_4a5e83a1` |
| Section job | Give the learner a raise-first default when they enter the pot first |
| Playable strategy input | `guided_walkthrough` + `single_select_with_hand`; 3 options allowed only when `Limp` needs to be shown as a wrong choice |
| Introduces | `open-raise-sizing` as the raise-first beginner default |
| Reinforces | `position`, `opening-ranges` |
| Current shape | 1 `guided_walkthrough` + 4 `single_select_with_hand` reps |

### Real interim artifact: recent lesson flow

Recent section totals before this lesson:

- `Draw Fundamentals` - 6 lessons / 36 total steps
- `Play Some Poker` so far - 1 lesson / 6 total steps

| Recent lesson before this one | Section | Step count | Main step kinds |
| --- | --- | --- | --- |
| `Draws vs Made Hands` | `Draw Fundamentals` | 8 | `pick_n_from_pool_with_hand_board`, `select_multiple_hands_with_board`, `single_select_with_hand_board` |
| `Straight Chances & Gutshots` | `Draw Fundamentals` | 6 | `pick_n_from_pool_with_hand_board`, `select_multiple_hands_with_board`, `single_select_with_hand_board` |
| `Out Counts & Cautions` | `Draw Fundamentals` | 6 | `pick_n_from_pool_with_hand_board`, `select_multiple_hands_with_board`, `single_select_with_hand_board` |
| `Nut Flushes & Monotone Boards` | `Draw Fundamentals` | 5 | `select_multiple_hands_with_board`, `showdown_outcome_select`, `single_select_with_hand_board` |
| `Outs II: Clean vs Dirty & Quick Rates` | `Draw Fundamentals` | 4 | `single_select`, `single_select_with_hand_board` |
| `Capstone - Draw Review` | `Draw Fundamentals` | 7 | `pick_n_from_pool_with_hand_board`, `single_select_with_hand_board` |
| `First Orbit Mindset` | `Play Some Poker` | 6 | `guided_walkthrough`, `single_select_with_hand` |

### Real interim artifact: real comparable lessons

| Comparable lesson | Step count | Main step kinds | Why it is comparable |
| --- | --- | --- | --- |
| `First Orbit Mindset` | 6 | `guided_walkthrough`, `single_select_with_hand` | Same section, same beginner preflop family, and the same first-in decision burden built around `position` and `opening-ranges`. |
| `Small Blind: Raise or Fold` | 9 | `guided_walkthrough`, `single_select_with_hand` | Same raise-or-fold playable family, but later in the curriculum and more branchy because the small blind creates a tighter, stranger first-in spot. |
| `First In: Don't Limp` | 13 | `guided_walkthrough`, `single_select_with_hand` | Same anti-limp teaching job, but much later in the curriculum when the learner can handle many more reps and more nuanced first-in cases. |

### Real output artifact: sample lesson architecture output

#### Lesson size decision

- Chosen size: `5 steps total`
- Size judgment: `slightly shorter` than the immediate 6-step lesson the learner just saw, but still in the same beginner size band
- Why this should not be shorter:
  - the lesson needs one walkthrough to install the raise-first lens before grading
  - it needs one explicit rep where `Limp` shows up as a wrong answer
  - it needs both a later-position rep and an early-position rep
  - it still needs a final test rep after those contrasts are established
- Why this should not be longer:
  - this lesson is adding one beginner habit, not teaching a full opening system
  - `position` and the opening baseline were already installed in `First Orbit Mindset`
  - blind-versus-blind spots, overlimping, isolation, and sizing branches are all deferred

#### What this lesson owns

- New here:
  - raise-first default when first in
  - open-limping is not the beginner baseline
- Building on:
  - `position`
  - `opening-ranges`
- Not reteaching:
  - blinds
  - action order
  - draw concepts
- Must stay stable:
  - first-in spots only
  - one walkthrough, then quick cash-out into graded reps
  - at least one explicit `Limp` wrong answer
  - a clear early-versus-late contrast
- Can vary safely:
  - the exact hole-card examples
  - which late-position seat gets used in practice
  - the exact open-size wording, as long as it stays one simple default

#### Step plan

| Step | Kind | What this step does | Introduces | Reinforces / tests |
| --- | --- | --- | --- | --- |
| 1 | `guided_walkthrough` | Installs the raise-first lens before the learner sees a graded decision. | `open-raise-sizing` | `position` |
| 2 | `single_select_with_hand` | Shows a first real first-in choice with `Limp` present as an explicit wrong answer. | `open-raise-sizing` as an action choice | `opening-ranges`, `position` |
| 3 | `single_select_with_hand` | Practices the raise-or-fold baseline in a later-position spot. |  | `opening-ranges`, `position` |
| 4 | `single_select_with_hand` | Practices the same baseline in an earlier-position spot so the learner feels the tighter threshold. |  | `opening-ranges`, `position` |
| 5 | `single_select_with_hand` | Tests whether the learner can apply raise-or-fold cleanly in a new first-in spot. |  | `opening-ranges`, `position`, `open-raise-sizing` |

## 6. `Lessons Situation Synthesizer`

There is no live `SITUATION_SYNTHESIS.md` in this section today, so the sample
below is grounded in the live `lesson_manifest.json` plus the lesson-architecture
output above.

### Real input artifact: step plan this lane has to turn into concrete reps

| Step | What this step needs |
| --- | --- |
| 1 | one walkthrough beat that installs the raise-first lens before grading |
| 2 | one late-position first-in spot where `Limp` appears as an explicit wrong answer |
| 3 | one late-position first-in spot that shows position helps, but junk still folds |
| 4 | one early-position first-in spot that feels tighter than the late-position spots |
| 5 | one fresh first-in test spot that checks raise-or-fold without reteaching |

### Real output artifact: sample kept-reps table

| Step | Kept spot | Hero hand | Choice set | Why this rep stays |
| --- | --- | --- | --- | --- |
| 1 | `BTN first in` walkthrough | `Td9d` | walkthrough beat | cashes the walkthrough out into the same first real spot the learner sees next |
| 2 | `BTN first in` | `Td9d` | `Fold / Limp / Raise` | this is the cleanest place to make `Limp` visibly wrong without adding extra branches |
| 3 | `BTN first in` | `8c4d` | `Fold / Raise` | shows that late position widens the range, but not enough to play trash |
| 4 | `UTG first in` | `QdTh` | `Fold / Raise` | makes the early-versus-late contrast obvious with one common trouble hand |
| 5 | `CO first in` | `5c5d` | `Fold / Raise` | tests whether the learner can still raise first in with a simple late-position value hand |

### Real output artifact: exact-action authority note

- This lesson shows concrete hero hands in concrete spots and marks one action as correct.
- Under `LESSON_RIGHT_MOVE_RULES.md`, that means this lesson would also need a current `ACTION_AUTHORITY.md`.
- There is no live `ACTION_AUTHORITY.md` in this checkout today.

## 7. `Lessons Playable Materializer`

The live output from this lane is the current `lesson_manifest.json`.

### Real input artifact: what it has to materialize

| Step | Step kind | Locked job | Kept rep |
| --- | --- | --- | --- |
| 1 | `guided_walkthrough` | install raise-first before the first graded rep | `BTN / Td9d` walkthrough beat |
| 2 | `single_select_with_hand` | show `Limp` as the wrong answer | `BTN / Td9d` |
| 3 | `single_select_with_hand` | late-position junk still folds | `BTN / 8c4d` |
| 4 | `single_select_with_hand` | early position tightens the range | `UTG / QdTh` |
| 5 | `single_select_with_hand` | final raise-or-fold test | `CO / 5c5d` |

### Real output artifact: current manifest readback

| Step | Kind | Headline | Options shown |
| --- | --- | --- | --- |
| 1 | `guided_walkthrough` | `Raise-first: if you play it, raise` | walkthrough beat |
| 2 | `single_select_with_hand` | `BTN: raise, limp, or fold?` | `Fold / Limp / Raise` |
| 3 | `single_select_with_hand` | `BTN: raise or fold?` | `Fold / Raise` |
| 4 | `single_select_with_hand` | `UTG: raise or fold?` | `Fold / Raise` |
| 5 | `single_select_with_hand` | `CO: raise or fold?` | `Fold / Raise` |

## 8. `Lessons Copywriter`

There is no live `COPY_RECEIPTS.md` or `ANTI_LEAK_AUDIT.md` for this lesson
today, so the sample below shows the shape this lane should leave.

### Real input artifact: copy requirements for this lesson

| Surface | What it needs to do | Locked concepts and terms it must preserve | Must not do |
| --- | --- | --- | --- |
| Step 1 walkthrough headline and coach text | install the raise-first habit in plain poker language | `open raise`, `open limp`, `position` | drift into vague language like `aggressive branch` |
| Step 2 visible options | keep the answer contract explicit and mobile-safe | `Fold`, `Limp`, `Raise` | rename the actions or turn them into strategy labels |
| Step 2 coach text and feedback | explain why first-in defaults to raise-or-fold | `raise`, `limp`, `raise-first` | invent a new term for the same idea |
| Step 3 and 4 coach text and feedback | keep the late-versus-early contrast clear | `Button`, `UTG`, `late position`, `early position` | flatten the spot into generic `be selective` language |
| Step 5 feedback | reinforce the late-position open with a simple made hand | `position`, `raise`, `open raise` | smuggle in a bigger postflop promise than the lesson owns |

### Where they get it from

- the current `lesson_manifest.json`
- the section concept-and-term mapping from the curator step
- the lesson architecture packet, so the copy still matches the lesson burden
- the situation packet, so the copy still matches the kept reps
- `ACTION_AUTHORITY.md` when exact action lines are in scope
- `LESSONS_POKER_GROUNDING_RULES.md`, `LESSON_COPY_STANDARDS.md`, and `POKER_KB.md`

For this lane, PokerKB use changes a little:

- do not ask PokerKB to rename a concept that the curator already locked
- ask PokerKB how to say this exact spot or learner line cleanly while keeping the locked terms
- use Books for the meaning skeleton and Forums for the player-language pass

### Real output artifact: sample copy packet readback

#### `lesson_manifest.json` copy pass

- Step 1:
  - Headline: `Raise-first: if you play it, raise`
  - Coach text: `Late position: raise-or-fold. Limp isn't the default`
- Step 2:
  - Headline: `BTN: raise, limp, or fold?`
  - Coach text: `First in: raise or fold`
  - Right feedback: `Good raise. Raise-first keeps pots simpler and avoids limped multiway flops.`
- Step 4:
  - Headline: `UTG: raise or fold?`
  - Coach text: `Early seats: start tighter`
  - Right feedback: `Nice. Tightening up early avoids tough out-of-position spots.`

#### `COPY_RECEIPTS.md`

- one entry per material learner-facing line
- each entry names:
  - the surface
  - the locked terms it had to preserve
  - the Books receipt
  - the Forums receipt
  - the final line chosen

#### `ANTI_LEAK_AUDIT.md`

- Step 1 cues the habit without showing the graded answer choice yet.
- Step 2 headline names the action menu but does not tell the learner which button to press.
- Visible buttons stay on the short action-label contract: `Fold`, `Limp`, `Raise`.
- Feedback teaches the deciding variable after the answer instead of leaking it before the click.

## 9. `Lessons Acceptance Critic`

In the real workflow the critic sits between every normal lane.

For this doc, it is parked here at the end so the full check list is easy to
see in one place.

### Real input artifact: what the critic would review

- the current packet from the lane that just ran
- the upstream packet chain that packet depends on
- the quality bar, grounding rules, copy standards, and right-move rules

### Real output artifact: new checks this flow adds

1. Dossier:
   - the section truths came from discovery-style PokerKB consults, not a seeded `confirm my answer` prompt
   - the section-truth table has real receipts
2. Curator:
   - every concept and term maps back to a dossier truth
   - no learner-facing term appears downstream unless the curator already locked it
3. Section architect:
   - every locked concept lands in a lesson slot
   - no lesson exists without a plain-English teaching job
4. Playable strategist:
   - the playable family supports the teaching job instead of changing it
   - the downstream constraints still match the section burden
5. Lesson architect:
   - the recent lesson-flow table and real comparable-lessons table both exist
   - the step plan says what is new, what is reinforced, and what is deferred
6. Situation synthesizer:
   - every kept rep maps back to a step job
   - the packet keeps a candidate-set trail, a rejection trail, and repetition control
   - `ACTION_AUTHORITY.md` exists when the learner is being taught the right move in a concrete spot
7. Playable materializer:
   - the manifest preserves the locked step kinds, answer contract, and validation proof
   - visible action labels still follow the shared button contract
8. Copywriter:
   - the locked concepts and terms actually survive into the learner copy
   - no new terms or aliases were invented in the copy pass
   - Books and Forums grounding exists for material learner-facing lines
   - the anti-leak audit is real and the answer contract still lines up
9. Cross-lane:
   - later packets do not invent new concepts, terms, or right-move claims that were never cleared upstream
   - deferrals stay deferred instead of sneaking back in as copy or feedback

After the final `accept`, the issue goes back to `Lessons Project Lead` for
publish and followthrough.

-------

# PokerKB Example Prompts

This is the part that matters for the dossier step.

The good prompts do not tell PokerKB what the section is and ask it to bless
that answer. The good prompts hand it the learner baseline and ask what should
come next, why, and where that chapter should stop.

## Bad Prompt: We Already Picked The Section

- Receipt: `ans-67eed86305c2`
- Prompt:
  `Given this beginner track context: Track 02 Beginner Strategy, Section 03 Play Some Poker... what are the plain-language things the learner should understand or know how to do by the end of this section?`
- What came back:
  broad beginner poker advice like what a cash game is, paying attention to opponents, and staying calm.
- Verdict:
  bad
- Why:
  we already told it what section we were building, so it never had to help us decide what should come next.

## Bad Prompt: Rewrite My Existing Answer

- Receipt: `ans-d06c5d2831e3`
- Prompt:
  `Rewrite this section goal in poker-native language.`
- What came back:
  basically our own section goal, just phrased more cleanly in poker language.
- Verdict:
  bad for discovery
- Why:
  this can help with copy later, but it does not help decide what the section should teach.

## Good Prompt: What Is The Next Natural Chapter?

- Receipt: `ans-fb30316b3fc4`
- Prompt:
  `Here is what the learner already knows. What is the next natural chapter in their learning journey? What belongs in it, why, and where should it stop?`
- What came back:
  `Opening the Pot` as the next chapter, meaning first-in preflop open-raising by position, range thinking, and a hard stop before limped pots, facing raises, or deeper postflop play.
- Verdict:
  worked
- Why:
  this is the thought-partner posture. It starts from learner baseline and asks PokerKB to reason about progression.

## Good Prompt: Same Question, Simpler Wording

- Receipt: `ans-3f5dfd463327`
- Prompt:
  `Without assuming my preferred section, what would a good coach usually teach next as the next natural chapter?`
- What came back:
  again, preflop opening ranges by position as the next section-sized chapter.
- Verdict:
  worked
- Why:
  same shape, same result. That is a good sign that the prompt is discovering something stable instead of just reacting to one phrasing.

## Useful Follow-Up: Check The Boundary

- Receipt: `ans-61930a7c12f3`
- Prompt:
  `Is the next natural chapter mostly a preflop decision chapter, or should it already include a tiny postflop plan too?`
- What came back:
  mostly preflop, but maybe with a very small postflop intention layer.
- Verdict:
  useful, but fuzzy
- Why:
  this is a follow-up prompt, not a first prompt. It helps refine the edge of the section after the main chapter has already been found.

## Good Follow-Up: Does First Session Need One Tiny Bridge?

- Receipt: `ans-d1a0d7a6ff69`
- Prompt:
  `For a first real session, is opening ranges alone enough, or should the section close the loop with one simple flop continuation heuristic too?`
- What came back:
  opening ranges alone are a little too narrow for a first session; better to add one tiny flop continuation heuristic and stop there.
- Verdict:
  worked
- Why:
  once PokerKB had already helped define the next chapter, this prompt was good at deciding whether the chapter should end at pure preflop or extend one inch into postflop.

## Bad Prompt: Too Much Track Goal Up Front

- Receipt: `ans-5b33a2a1ba6b`
- Prompt:
  `Given the track goal of first-session decision flow, what should the next section-sized chapter be now?`
- What came back:
  it jumped ahead and proposed a flop-play chapter as the next section.
- Verdict:
  did not work well
- Why:
  this prompt over-weighted the track goal and under-weighted the immediate sequence of learning, so it skipped over the preflop foundation step.

## What Actually Worked

- Start with what the learner already knows.
- Ask what the next natural chapter is.
- Ask why that chapter comes next.
- Ask where that chapter should stop.
- Only after that, ask whether a first-session goal justifies one tiny bridge beyond that stopping point.

## What Did Not Work

- Giving PokerKB the section answer and asking what the learner should know by the end.
- Asking PokerKB to rewrite our section goal before it has helped decide the section.
- Leaning too hard on track-level goals like `first-session decision flow` before locking the next immediate chapter.
