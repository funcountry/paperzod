# Editorial Structured Doctrine Requirements

## Purpose

This document states the public authoring pressures behind the canonical
editorial example.

The point is not "build an editorial-specific compiler."
The point is "prove that a generic compiler can support a setup with these
real workflow pressures."

## Requirements

The system should let the setup author:

- define semantic workflow truth once
- keep long prose in markdown fragments where that is the honest authoring mode
- declare exact section ownership
- point roles and steps at exact shared sections
- separate conceptual packet contracts from compatibility-only runtime files
- add setup-local checks without forking the compiler
- declare compiler-owned output scopes explicitly

## Runtime Surfaces Needed By The Example

The example needs first-class surfaces for:

- role homes
- a project home root
- a shared entrypoint
- a workflow owner
- lane workflow docs
- standards
- a gate
- technical references
- how-to guides
- coordination docs

## Architectural Pressure

The editorial example stresses the product in five places:

1. shared-section projection
2. explicit output ownership and prune behavior
3. narrow but useful authored markdown fragments
4. setup-local checks
5. stable-id keyed overrides

## Success Criteria

The public example is successful when:

- the setup source stays readable
- the normalized model stays small
- generated markdown is deterministic
- docs, examples, and tests all prove the same story
- the same framework also supports `release_ops` without editorial branches
