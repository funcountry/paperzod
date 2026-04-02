# PokerKB

This file owns the Lessons-local PokerKB runner path, URL routing, query
discipline, and example commands.

Use `technical_references/LESSONS_TOOL_REFERENCE.md` for the evergreen
explanation of what PokerKB is for.
Use `lessons_content_standards/LESSONS_POKER_GROUNDING_RULES.md` for when
grounding is required.
Use `lessons_content_standards/LESSON_RIGHT_MOVE_RULES.md` when a lesson tells
the learner the right move in a specific hand.

## Local runner

- The runner in this file is a repo-owned helper in `paperclip_agents`.
- In the command examples below, replace `<paperclip_agents_root>` with the repo
  root that contains this doctrine file.
- runner: `<paperclip_agents_root>/paperclip_home/project_homes/lessons/tools/poker_kb.py`

Run it with:

```bash
python3 "<paperclip_agents_root>/paperclip_home/project_homes/lessons/tools/poker_kb.py" --list-tools
```

## Tool allowlist

- `kb_search_summary_only`
- `kb_authoritative_answer`
- `kb_compare_perspectives`
- `kb_validate_claim`

## URL routing

PokerKB uses split services.

Preferred environment:

```bash
export POKERKB_BOOKS_BASE_URL=http://pokerkb-books.tail.fun.country
export POKERKB_FORUMS_BASE_URL=http://pokerkb-forums.tail.fun.country
```

Defaults if unset:

- `books` -> `http://pokerkb-books.tail.fun.country`
- `forums` -> `http://pokerkb-forums.tail.fun.country`

Lessons rule:

- do not assume localhost PokerKB services during normal Lessons execution
- only use a localhost override when the issue explicitly says a local
  standalone PokerKB service is part of the task

Always pass `namespace` explicitly.

## Slow answer calls

- `kb_search_summary_only` is usually faster than the answer tools.
- `kb_authoritative_answer`, `kb_compare_perspectives`, and
  `kb_validate_claim` may take longer because they hit the answer path first.
- A quiet first pass is not by itself a failure. Give the runner its default
  timeout before deciding the call is stuck.
- For normal Lessons work, do not lower `POKERKB_TIMEOUT_SECONDS` below the
  runner default. If you need an explicit manual override for a direct shell
  test, use `60` seconds or more.
- If an answer call still fails, retry once with the same query or narrow the
  query.
- If a `forums` copy prompt returns `[no-context]`, do not retry by adding
  more lesson explanation to the same abstract sentence shape.
- Retry with the same spot as one short learner line that already sounds like
  poker language.
- Do not poison the prompt by leading the witness or embedding your own answer
  in the PokerKB query.
- If the answer mostly repeats wording that first appeared in your query, treat
  that as a rewrite of your wording, not as independent proof.
- If exact-line retry still misses, ask how players talk about that exact spot
  in player language.
- If it still cannot return usable grounding, record the failed query and
  output, any retry query and retry output, and follow
  `lessons_content_standards/LESSONS_POKER_GROUNDING_RULES.md`.

## Query discipline

For strategic questions, always state:

- table format, default `6-max`
- game type when relevant
- stack depth when relevant

Use:

- `books` for correctness, definitions, and authoritative answers
- `forums` for player phrasing and terminology sanity-checks

For copy prompts:

- ask for the poker spot or learner line directly
- keep your own teaching explanation out of the query when the job is to learn
  how poker people naturally talk about the spot
- be careful not to poison the prompt by smuggling your preferred wording into
  the question and then mistaking the echo for proof
- keep separate the wording you put into the query, the wording PokerKB
  returned on its own, and the final line you chose to ship
- prefer one exact spot plus one exact action over an abstract lesson label

## Rule

This file does not decide whether a claim is grounded enough. It only tells you
how to run PokerKB well. Use
`lessons_content_standards/LESSONS_POKER_GROUNDING_RULES.md` for grounding
policy and `lessons_content_standards/LESSON_RIGHT_MOVE_RULES.md` for concrete
right-move claims.

## Example commands

Authoritative answer:

```bash
python3 "<paperclip_agents_root>/paperclip_home/project_homes/lessons/tools/poker_kb.py" \
  kb_authoritative_answer \
  --json '{"namespace":"books","query":"For 6-max cash ~100bb, define a squeeze in poker in 2 sentences."}'
```

Search summary:

```bash
python3 "<paperclip_agents_root>/paperclip_home/project_homes/lessons/tools/poker_kb.py" \
  kb_search_summary_only \
  --json '{"namespace":"forums","query":"For 6-max cash ~100bb, what do players usually call a cold call after an open?"}'
```

## Good and bad copy prompt examples

These examples teach the pattern. They are not a lookup table or a banned-word
list.

### Case 1: the query carried the teaching wording, so the answer echoed it

Bad prompt:

```text
For 6-max cash (~100bb), tighten these beginner lesson guided-walkthrough lines so they sound like a real poker coach but stay beginner-safe. Keep `3-bet` as the term. Return exactly: 1A: <line> 1B: <line> 2A: <line> 2B: <line> 3A: <line> 3B: <line> 4A: <line> 4B: <line>. Lines: 1) HJ opened, so you are facing an open now. 2) This is not raise-or-fold and it is not a limped pot. 3) Your menu here is Fold, Call, or 3-bet. 4) A 3-bet is raising the opener again before the flop.
```

Why this is bad:
The prompt is not just asking for poker language. It is asking PokerKB to
rewrite the lesson's own explanation wording. If PokerKB repeats that wording,
that is not independent evidence that poker players or coaches naturally say
it.

Actual result from `books`:

```text
1A: HJ opened, so you’re facing an open.
1B: HJ opened, so you’re up against an open.
2A: This isn’t a raise-or-fold spot, and it isn’t a limped pot.
2B: This is not a raise-or-fold spot, and it’s not a limped pot.
3A: Your options here are Fold, Call, or 3-bet.
3B: Your menu here is Fold, Call, or 3-bet.
4A: A 3-bet means reraising the opener before the flop.
4B: A 3-bet is raising the opener again before the flop.
```

Better prompt:

```text
For 6-max cash (~100bb), rewrite this beginner coaching line in clean poker language. Output exactly: A: <line> B: <line> C: <line>. Text: "Facing an HJ open from CO, the three actions are fold, call, or 3-bet."
```

Why this is better:
It asks for the spot and the actions directly. The answer has to stand on real
poker phrasing instead of on the lesson's own explanation wording.

Actual result from `books`:

```text
A: Facing an HJ open, the cutoff can fold, call, or 3-bet.
B: Versus an HJ open, CO can fold, call, or 3-bet.
C: When the hijack opens, the cutoff can fold, call, or 3-bet.
```

What changed in the answer:
The bad prompt let `books` echo the lesson wording back. The better prompt
returned spot-first poker language and dropped the teaching phrase.

### Case 2: the query carried lesson-tree labels, so the answer echoed them

Bad prompt:

```text
For 6-max cash (~100bb), beginner lesson copy, rewrite these lines for AKo taking the 3-bet branch in two spots. Keep them coach-like and beginner-safe. Return exactly: 6C: <coach> 6W: <wrong feedback> 6R: <right feedback> 8C: <coach> 8W: <wrong feedback> 8R: <right feedback>. Spot 6 is CO with AKo facing an HJ 2.5bb open. Spot 8 is CO with AKo facing a UTG 2.5bb open. Lines: step 6 coach: AK is too strong to drift into a call. step 6 wrong: AKo should take the aggressive branch here. 3-bet. step 6 right: Big ace, one open, no callers. Clean 3-bet. step 8 coach: Strong big cards still want the aggressive branch. step 8 wrong: Even versus UTG, AKo is strong enough to 3-bet here. step 8 right: AKo still belongs in the 3-bet branch.
```

Why this is bad:
The prompt is still asking PokerKB to work inside the lesson's own tree
language. If the answer repeats that tree language, it still has not proved
that a poker coach would talk that way.

Actual result from `books`:

```text
6C: AKo is too strong to just call here.
6W: AKo should take the aggressive branch here and 3-bet.
6R: Big ace, one open, no callers. Clean 3-bet.
8C: Strong big cards still want the aggressive branch.
8W: Even versus UTG, AKo is strong enough to 3-bet here.
8R: AKo still belongs in the 3-bet branch.
```

Better prompts:

```text
For 6-max cash (~100bb), rewrite this beginner coaching line in clean poker language. Output exactly: A: <line> B: <line> C: <line>. Text: "CO vs HJ 2.5bb open with AKo: do not just call. 3-bet."
```

```text
For 6-max cash (~100bb), rewrite this beginner coaching line in clean poker language. Output exactly: A: <line> B: <line> C: <line>. Text: "CO vs UTG 2.5bb open with AKo: do not just call. 3-bet."
```

Why these are better:
They ask for the action in the actual spot. The answer has to describe what to
do with AKo instead of leaning on lesson-tree labels.

Actual result from `books` for the HJ spot:

```text
A: CO vs HJ 2.5bb open: AKo is a 3-bet, not a call.
B: Facing a 2.5bb HJ open from the CO with AKo, 3-bet instead of flat-calling.
C: In 6-max cash at ~100bb, AKo versus an HJ open is a 3-bet from the CO.
```

Actual result from `books` for the UTG spot:

```text
A: CO vs UTG 2.5bb open with AKo: do not flat-call; 3-bet.
B: Facing a 2.5bb UTG open in the CO with AKo, you should not just call -- 3-bet instead.
C: In the CO against a 2.5bb UTG open, AKo is a 3-bet, not a call.
```

What changed in the answer:
The bad prompt let `books` echo the lesson-tree labels back. The better
prompts returned direct poker action language like `3-bet` and `not a call`.

### Case 3: the abstract lesson sentence got rejected, then the poker-native retry worked

Bad prompt:

```text
For 6-max cash (~100bb), rewrite this line in natural poker coaching language, 5 options. Text: KJo facing a UTG open is a fold.
```

Why this is bad:
It reads like a lesson label, not like something a player or coach would say.
Adding more lesson detail to the same sentence shape still tends to get
`[no-context]`.

Actual result from `forums`:

```text
Sorry, I'm not able to provide an answer to that question.[no-context]
```

Better prompt:

```text
For 6-max cash (~100bb), rewrite this line (<=80 chars), 5 options. Text: "CO vs UTG open: fold KJo."
```

Why this is better:
It gives `forums` one exact spot and one short action phrase that already
sounds like something a player would say.

Actual result from `forums`:

```text
CO vs UTG open: fold KJo.
Fold KJo vs UTG open in CO.
CO facing UTG open: KJo is a fold.
CO vs UTG open: KJo is too weak--fold.
Versus UTG open from CO, KJo is a fold.
```

If you still need a wider family of player phrasing, ask for that directly:

```text
In forum/player language for 6-max cash (~100bb), how do players talk about folding KJo in the CO versus a UTG 2.5bb open with players behind? Give 5 short lines.
```

Why this helps:
Once the exact-line retry is grounded in the real spot, this follow-up can pull
shorter player-language variants without making PokerKB guess what your lesson
label means.

Actual result from `forums`:

```text
Fold pre.
KJo is a muck here.
Too dominated to flat UTG.
With players behind, this is the time to tighten up.
I'd just let the KJ/KTo-type hands go.
```

What changed in the answer:
The bad prompt got rejected as an abstract lesson sentence. The better prompts
gave `forums` a real spot and poker-native phrasing, so it returned usable
player language instead of `[no-context]`.
