# Lessons Existing Lesson Maintenance Workflow

This file owns bounded existing lesson intake, repair classification, and
redesign boundaries.

Use it when work starts from an existing lesson bug, field report, GitHub
issue, playtest report, or bounded repair request.

## Intake Checklist

Make the active issue explicit about:

- requested repair scope
- touched lesson roots
- redesign boundary
- any bootstrap, runtime, tooling, or proof gap exposed by the request

## Bounded Audit Rule

Before widening a maintenance request into redesign:

- confirm the bug or gap from current lesson truth
- identify the smallest honest repair target
- classify which Lessons lane owns the real missing work
- keep the redesign boundary explicit if broader rewrite is truly required

## Routing Rule

- route to the earliest safe Lessons owner for the real missing work
- if no current specialist fits, keep the gap explicit on `Lessons Project Lead`
- do not let a maintenance shell become a vague fix everything bucket

## Closeout Rule

Do not call maintenance complete until:

- the bounded repair claim is true in current lesson truth
- any critic or publish burden that actually applies is cleared under the
  shared owners
