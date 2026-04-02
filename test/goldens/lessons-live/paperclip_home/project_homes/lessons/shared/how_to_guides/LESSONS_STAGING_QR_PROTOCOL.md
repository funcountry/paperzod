# Lessons Staging QR Protocol

This file is the shared staging QR and lessons-dev publish helper guide for
the Lessons project.

This file owns only:

- staging QR generation mechanics
- lessons-dev manifest publish mechanics
- local QR helper execution
- QR block generation mechanics

It does not own:

- the rule that a PR must exist
- the rule that a PR body must be refreshed now
- PR followthrough state or stop behavior
- the decision that the current publish intent is `ship` or `prototype`

Those workflow rules are owned by:

- `paperclip_home/project_homes/lessons/shared/proof_packets/LESSONS_PUBLISH_AND_FOLLOWTHROUGH_WORKFLOW.md`

## Rule

For lessons staging QR work, the only allowed shared files and helpers are:

These helpers are repo-owned. They do not live in the attached checkout.
In command examples below, replace `<paperclip_agents_root>` with the repo root
that contains this doctrine file.

1. `paperclip_home/project_homes/lessons/shared/how_to_guides/LESSONS_STAGING_QR_PROTOCOL.md`
2. `paperclip_home/project_homes/lessons/tools/lessons-staging-qr`
3. `paperclip_home/project_homes/lessons/tools/verify_lessons_staging_qr.sh`
4. `paperclip_home/project_homes/lessons/tools/qr_text_png.py`
5. `paperclip_home/project_homes/lessons/tools/qrcodegen.py`
6. the ignored local env file `paperclip_home/project_homes/lessons/tools/lessons_r2_publish.env`

Anything else requires explicit approval in the current thread or a real
governance source.

Do not depend on:

- `$HOME/workspace/agents`
- the old `lesson-r2-staging-qr` skill path
- sibling repos or old workspace trees
- ad hoc QR scripts outside `paperclip_home/project_homes/lessons/tools/`
- secret files or shell state that live globally on this machine

## Allowed execution boundary

Lessons agents may depend on only these filesystem locations by default:

1. `paperclip_home/project_homes/lessons/**`
2. the active lessons repo checkout attached to the Paperclip lessons project

Anything outside those two locations is out of bounds unless the current thread
or a real governance source explicitly authorizes it.

## Attached checkout relationship

The staging QR protocol is separate from the attached lessons checkout.

Use the attached checkout for:

- compile and validation commands
- current app-route and deep-link truth
- lesson assets

Use the tools in `paperclip_home/project_homes/lessons/tools/` for:

- loading the local lessons R2 publish env
- publishing a compiled manifest to the lessons-dev bucket
- generating staging deep links
- rendering QR PNGs
- publishing QR PNGs to a public URL for PR-body embedding
- emitting one PR-body-ready QR markdown block per lesson
- smoke-testing the local QR path

## Current Attached-Checkout Facts To Verify

Before you trust the staging QR protocol, verify the attached checkout still
supports the current deep-link path:

- `apps/flutter/lib/app/deep_links.dart`
  - route contains `dev-loaded-lessons`
- `apps/flutter/android/app/src/staging/AndroidManifest.xml`
  - staging scheme contains `com.pokerskill.app.staging`
- `apps/flutter/ios/Flutter/Debug-staging.xcconfig`
  - `APP_URL_SCHEME = com.pokerskill.app.staging`

If the attached checkout changes these routes or schemes, update this protocol
and the local tools together.

## Local secret file

The local lessons R2 publish env file is:

- `paperclip_home/project_homes/lessons/tools/lessons_r2_publish.env`

Expected keys:

- `LESSONS_R2_ACCESS_KEY_ID`
- `LESSONS_R2_SECRET_ACCESS_KEY`
- `LESSONS_R2_ENDPOINT`
- `LESSONS_R2_BUCKET`
- `LESSONS_R2_PUBLIC_BASE_URL`
- `LESSONS_R2_REGION`

This file is ignored by git and must stay local.

## Required commands

### Smoke test

```bash
bash "<paperclip_agents_root>/paperclip_home/project_homes/lessons/tools/verify_lessons_staging_qr.sh"
```

That command must:

- verify the attached checkout still exposes the `dev-loaded-lessons` route
- verify the staging scheme is still `com.pokerskill.app.staging`
- verify the local R2 env file loads successfully
- generate a smoke-test QR PNG under
  `paperclip_home/project_homes/lessons/tools/local_outbound/`

### Publish a lesson manifest and generate a staging QR

```bash
bash "<paperclip_agents_root>/paperclip_home/project_homes/lessons/tools/lessons-staging-qr" \
  --lesson-id <lessonId> \
  --publish-intent ship
```

Outputs:

- `MANIFEST_FILE=...`
- `MANIFEST_URL=...`
- `STAGING_DEEP_LINK=...`
- `QR_PNG=...`
- `QR_PUBLIC_URL=...`
- `PR_QR_BLOCK_FILE=...`

Use the emitted `PR_QR_BLOCK_FILE` with
`paperclip_home/project_homes/lessons/tools/update_pr_with_lessons_qrs.sh`
when the lesson belongs to a PR.

## PR QR Output

The `lessons-staging-qr` tool emits:

- `QR_PUBLIC_URL`
- `PR_QR_BLOCK_FILE`

Use the emitted `PR_QR_BLOCK_FILE` with the local to the repo PR body update helper
when the shared git/PR workflow owner says the current PR body needs refreshed
lesson QR blocks.

## Failure mode

If the local env file is missing, the attached checkout cannot prove the route,
or the publish command cannot prove the required gate state, stop and
escalate.

Do not route around the failure by:

- falling back to `$HOME/workspace/agents`
- reviving the old skill path as a runtime dependency
- hardcoding a stale `psmobile` clone path
- using a different repo copy as implied truth
