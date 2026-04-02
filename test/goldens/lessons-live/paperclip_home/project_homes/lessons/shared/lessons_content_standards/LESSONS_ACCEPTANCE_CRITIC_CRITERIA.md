# Lessons Acceptance Critic Criteria

This file owns what the Lessons critic needs before full review, how verdicts
work, and who the work should go to next when it is not ready.

Use it with:

- `proof_packets/LESSONS_ACCEPTANCE_CRITIC_WORKFLOW.md`
- `lessons_content_standards/LESSONS_QUALITY_BAR.md`

## Default review shape

- The critic reviews the current Lessons work named on the active issue.
- Downstream work does not treat a packet as cleared until the critic leaves an
  explicit `accept` or `changes requested` verdict.

## What the critic judges

The critic checks:

- output quality against the shared Lessons quality bar
- for lesson architecture packets, whether `LESSON_ARCHITECTURE.md` includes a
  recent curriculum flow table built from real current lesson data across the
  previous few sections
- for lesson architecture packets, whether `LESSON_ARCHITECTURE.md` includes a
  separate real comparable lessons table built from real current lesson data
- for lesson architecture packets, whether the packet uses those two tables to
  defend the proposed step count, rep budget, and `shorter, same, or longer`
  judgment
- for lesson architecture packets, whether the packet says why the lesson
  should not be shorter and why it should not be longer
- for lesson architecture packets, whether the packet says what must stay
  stable and what can vary safely
- for lesson architecture packets that use `guided_walkthrough`, whether exact
  pacing is grounded in current comparable lesson length proof
- for section architecture packets, whether
  `section_root/_authoring/SECTION_FLOW_AUDIT.md` exists and lists the
  previous two sections with their lesson counts
- for section architecture packets, whether
  `section_root/_authoring/SECTION_ARCHITECTURE.md` uses that audit to explain
  what this section is building on and why the count is not too small
- for section architecture packets, whether the proposed section stays in the
  same general size range as the recent run of the track
- whether conflicting stale lesson-writing files still sit in the touched area
  and would make the next owner guess which files are live
- whether any remaining missing work was routed to the earliest lane that owns
  it

## Verdict rules

- `accept` means the current issue is clear for the declared next step
- `changes requested` must name the exact failing gates and the real owning lane
- do not hide rejection inside vague summary language
- keep the verdict short and concrete
- do not accept a lesson architecture packet when the recent curriculum flow
  table is missing or is built from guessed numbers instead of real current
  lesson data
- do not accept a lesson architecture packet when the real comparable lessons
  table is missing or is built from guessed numbers instead of real current
  lesson data
- do not accept a lesson architecture packet when the recent curriculum flow
  and the real comparable lessons are blended into one friendly precedent list
- do not accept a lesson architecture packet when the lesson drops sharply
  below the lesson-size band the learner has just been moving through
- do not accept a lesson architecture packet when the packet never explains
  why the lesson should not be shorter and why it should not be longer
- do not accept a lesson architecture packet with `guided_walkthrough` when
  exact pacing rests on habit, prompt defaults, or stale precedent instead of
  current comparable proof
- do not accept a section architecture packet when the section drops sharply
  below the previous two sections
- do not accept a section architecture packet when
  `section_root/_authoring/SECTION_FLOW_AUDIT.md` exists only as a table and
  the count decision ignores it
- do not accept a packet when conflicting stale lesson-writing files still sit
  beside the touched area as parallel truth
- if stale files are the only thing left and the current packet already makes
  the cleanup obvious, clear them in the critic pass and then leave your
  verdict
- if you still leave `changes requested` for stale files, name the exact file
  paths and say why you could not safely clear them yourself
- when the next owner is explicit, name that owner and do not leave ownership
  implied in prose
- when the next owner is explicit and ownership is changing now, reassign the
  same issue at the same time
- if ownership is not changing, do not force a fake reassignment

## Remediation routing

- Route remediation to the lane that owns the missing files, receipts, or checks.
- Do not send work back to the last downstream worker by habit.
- Do not take over normal packet work inside the critic lane.
- Send the issue back only when the stale files need new section, lesson, or
  packet judgment, or when some other real missing work remains.
- If the correct owner is unclear, the next owner is `Lessons Project Lead`
  inside the current Lessons chain.
