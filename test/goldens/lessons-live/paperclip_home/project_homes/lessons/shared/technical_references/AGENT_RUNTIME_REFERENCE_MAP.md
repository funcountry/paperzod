# Lessons Agent Runtime Reference Map

This file exists for one job: if you remember an old dependency name, it
points you to the current Lessons owner in this repo.

Use `paperclip_home/project_homes/lessons/shared/README.md` for the live shared
owner map.

This file is a lookup table, not a second doctrine home or part of normal
startup reading.

## Former Dependency Names

| Lane | Former dependency | Current replacement in this repo | Notes |
| --- | --- | --- | --- |
| Section Concepts and Terms Curator | `psmobile-lesson-poker-kb-interface` | `paperclip_home/project_homes/lessons/shared/technical_references/POKER_KB.md` plus `paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_POKER_GROUNDING_RULES.md` | Historical name only; live runtime uses the split-URL local runner and the grounding rule now lives in a separate owner |
| Section Concepts and Terms Curator | `psmobile-lesson-concept-curator` | `paperclip_home/project_homes/lessons/shared/proof_packets/SECTION_CONCEPTS_TERMS_CURATOR_WORKFLOW.md` | Semantic-first concept mapping and new-concept rules |
| Section Concepts and Terms Curator | `psmobile-lesson-term-curator` | `paperclip_home/project_homes/lessons/shared/proof_packets/SECTION_CONCEPTS_TERMS_CURATOR_WORKFLOW.md` | Exact term lookup, alias/new-term decisions, validator gates |
| Lessons Copywriter | `psmobile-lesson-poker-kb-interface` | `paperclip_home/project_homes/lessons/shared/technical_references/POKER_KB.md` plus `paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_POKER_GROUNDING_RULES.md` | Historical name only; live runtime uses the split-URL local runner and the grounding rule now lives in a separate owner |
| Lessons Copywriter | `poker-native-copy` | `paperclip_home/project_homes/lessons/shared/proof_packets/LESSONS_COPYWRITER_WORKFLOW.md` | Historical name only; use the shared copywriting workflow in this repo |
| Lessons Copywriter | `poker-kb` | `paperclip_home/project_homes/lessons/shared/technical_references/POKER_KB.md` plus `paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_POKER_GROUNDING_RULES.md` plus `paperclip_home/project_homes/lessons/shared/proof_packets/LESSONS_COPYWRITER_WORKFLOW.md` | Raw follow-up KB primitives stay local to the shared runner; grounding policy lives in the grounding rules file |
| Lessons Playable Materializer | `psmobile-playable-layout` | `paperclip_home/project_homes/lessons/shared/technical_references/LESSON_STEP_ROUTE_GUIDE.md` plus `paperclip_home/project_homes/lessons/tools/playable_layout/list_lesson_step_kinds.py` and `paperclip_home/project_homes/lessons/tools/playable_layout/validate_lesson_step_json.py` | Generic formulaic step route |
| Lessons Playable Materializer | `psmobile-guided walkthrough-layout` | `paperclip_home/project_homes/lessons/shared/technical_references/LESSON_STEP_ROUTE_GUIDE.md` plus `paperclip_home/project_homes/lessons/tools/playable_layout/list_guided_child_kinds.py` and `paperclip_home/project_homes/lessons/tools/playable_layout/validate_lesson_step_json.py` | Dedicated `guided_walkthrough` route |
| Lessons Playable Materializer | `psmobile-scripted-hand-layout` | `paperclip_home/project_homes/lessons/shared/technical_references/LESSON_STEP_ROUTE_GUIDE.md` plus `paperclip_home/project_homes/lessons/tools/playable_layout/validate_lesson_step_json.py` | Dedicated `scripted_hand` route |
| Lessons Playable Materializer | `lesson-ohh-builder` and `lesson-scripted-playable` | `paperclip_home/project_homes/lessons/shared/technical_references/LESSON_STEP_ROUTE_GUIDE.md` | Historical names only; use the local scripted-hand route contract |
| All lessons lanes | global `gh` login on this machine or `$HOME/workspace/agents` GitHub helpers | `paperclip_home/project_homes/lessons/shared/proof_packets/LESSONS_PUBLISH_AND_FOLLOWTHROUGH_WORKFLOW.md`, `paperclip_home/project_homes/lessons/shared/how_to_guides/LESSONS_GITHUB_ACCESS_PROTOCOL.md`, plus `paperclip_home/project_homes/lessons/tools/lessons-gh`, `paperclip_home/project_homes/lessons/tools/lessons-git`, and `paperclip_home/project_homes/lessons/tools/update_pr_with_lessons_qrs.sh` | GitHub access now lives in this repo and the publish rules now live in the publish-and-followthrough owner |
| All lessons lanes | `lesson-r2-staging-qr` | `paperclip_home/project_homes/lessons/shared/proof_packets/LESSONS_PUBLISH_AND_FOLLOWTHROUGH_WORKFLOW.md`, `paperclip_home/project_homes/lessons/shared/how_to_guides/LESSONS_STAGING_QR_PROTOCOL.md`, plus `paperclip_home/project_homes/lessons/tools/lessons-staging-qr` and `paperclip_home/project_homes/lessons/tools/verify_lessons_staging_qr.sh` | Staging QR rules live here now; QR generation lives in the local tools and PR-body timing lives in the publish-and-followthrough owner |
| All lessons lanes | shared `qr-code` skill for lessons playtest links | `paperclip_home/project_homes/lessons/shared/how_to_guides/LESSONS_STAGING_QR_PROTOCOL.md` plus `paperclip_home/project_homes/lessons/tools/qr_text_png.py` and `paperclip_home/project_homes/lessons/tools/qrcodegen.py` | Lessons deep links use a custom URI scheme, so the pod now vendors its own QR renderer locally |

## Rule

If the old name you need is not in this map, start with
`paperclip_home/project_homes/lessons/shared/README.md`.

If the needed owner is still missing, do not reach into a sibling repo or an
old skill pack. Add or repair the correct owner in this repo instead.
