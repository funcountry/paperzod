import type { ReferenceInput } from "paperzod";

export const references = [
  {
    id: "editorial_simple_clear_ref",
    referenceClass: "imported_reference",
    name: "Editorial Workflow Simple Clear",
    sourcePath: "docs/ref/EDITORIAL_WORKFLOW_SIMPLE_CLEAR.md"
  },
  {
    id: "editorial_structured_requirements_ref",
    referenceClass: "imported_reference",
    name: "Editorial Structured Doctrine Requirements",
    sourcePath: "docs/ref/EDITORIAL_STRUCTURED_DOCTRINE_REQUIREMENTS.md"
  },
  {
    id: "audience_research_reference",
    referenceClass: "runtime_reference",
    name: "Audience Research KB",
    sourcePath: "paperclip_home/project_homes/editorial/shared/technical_references/AUDIENCE_RESEARCH_KB.md"
  },
  {
    id: "github_access_reference",
    referenceClass: "support_reference",
    name: "Editorial GitHub Protocol",
    sourcePath: "paperclip_home/project_homes/editorial/shared/how_to_guides/EDITORIAL_GITHUB_PROTOCOL.md"
  },
  {
    id: "publish_bootstrap_reference",
    referenceClass: "support_reference",
    name: "Editorial Publish Bootstrap",
    sourcePath: "paperclip_home/project_homes/editorial/shared/agent_coordination/EDITORIAL_PUBLISH_BOOTSTRAP.md"
  }
] satisfies ReferenceInput[];
