# Lessons Publish And Followthrough Workflow

This file owns the Lessons-specific publish, PR, QR, and followthrough rules
for work that changes lesson files in the attached checkout.

Use the repo-root publish and followthrough owner for generic stop law.
Use the local GitHub and QR guides for helper mechanics.

## Keep These Facts Current

- keep `pull_request` work products current whenever they exist
- keep the current PR and QR state explicit on the active issue when publish
  or followthrough is the live job

## Publish Intent

When Lessons work uses the staging QR publish path, the current issue must say
whether the publish intent is `ship` or `prototype`.

- `ship`
  - requires the current run gate bundle
  - requires `PRE_PUBLISH_AUDIT.md`
  - requires `## Result: PASS`
  - forbids `--skip-compile`
- `prototype`
  - may use incomplete bundle receipts, but the packet must say exactly what
    is missing
  - may use `--skip-compile`

Do not use the QR publish path as a shortcut around packet, review, or receipt
law.

## Publish And Followthrough Rules

- open or refresh the PR when lesson files, receipts, or followthrough state
  changed
- keep the PR work product current with URL, status, review state, and QR
  status when applicable
- use
  `paperclip_home/project_homes/lessons/shared/how_to_guides/LESSONS_GITHUB_ACCESS_PROTOCOL.md`
  for GitHub helper mechanics
- use
  `paperclip_home/project_homes/lessons/shared/how_to_guides/LESSONS_STAGING_QR_PROTOCOL.md`
  for staging QR helper mechanics

## Extra Merge-Ready Rules

For Lessons work, `ready to merge` additionally requires:

- an open not draft PR
- current checks
- mergeable, conflict free state
- current QR state when lesson content is in scope
- current packet files and receipts that match `pull_request` truth
- no unresolved review problem or uncommitted file cleanup hidden as later
  cleanup
