import type { ReferenceInput } from "paperzod";

export const references = [
  {
    id: "lessons_simple_clear_ref",
    referenceClass: "imported_reference",
    name: "Lessons Workflow Simple Clear",
    sourcePath: "docs/ref/LESSONS_WORKFLOW_SIMPLE_CLEAR.md"
  },
  {
    id: "lessons_structured_requirements_ref",
    referenceClass: "imported_reference",
    name: "Lessons Structured Doctrine Requirements",
    sourcePath: "docs/ref/LESSONS_STRUCTURED_DOCTRINE_REQUIREMENTS_2026-04-01.md"
  },
  {
    id: "poker_kb_reference",
    referenceClass: "runtime_reference",
    name: "Poker KB",
    sourcePath: "paperclip_home/project_homes/lessons/shared/technical_references/POKER_KB.md"
  },
  {
    id: "github_access_reference",
    referenceClass: "support_reference",
    name: "Lessons GitHub Access Protocol",
    sourcePath: "paperclip_home/project_homes/lessons/shared/how_to_guides/LESSONS_GITHUB_ACCESS_PROTOCOL.md"
  },
  {
    id: "mobile_bootstrap_reference",
    referenceClass: "support_reference",
    name: "Lessons PSMobile Bootstrap",
    sourcePath: "paperclip_home/project_homes/lessons/shared/agent_coordination/LESSONS_PSMOBILE_BOOTSTRAP.md"
  }
] satisfies ReferenceInput[];
