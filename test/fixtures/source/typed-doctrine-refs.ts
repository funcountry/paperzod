import { artifactRef, command, commandRef, defineSetup, roleRef, sectionRef, surfaceRef } from "../../../src/source/index.js";

const typedDoctrineRefsSeed = defineSetup({
  id: "typed_doctrine_refs",
  name: "Typed Doctrine Refs",
  catalogs: [{ kind: "command", entries: [command("paperclip_status", "./paperclip status")] }],
  roles: [{ id: "author", name: "Author", purpose: "Author the runtime doctrine honestly." }],
  artifacts: [{ id: "action_authority", name: "ACTION_AUTHORITY.md", artifactClass: "required" }],
  surfaces: [
    {
      id: "author_home",
      surfaceClass: "role_home",
      runtimePath: "paperclip_home/agents/author/AGENTS.md",
      preamble: [
        {
          kind: "paragraph",
          text: ["Read ", artifactRef("action_authority"), " before asking ", roleRef("author"), " to take final action."]
        },
        {
          kind: "rule_list",
          items: [
            ["Run ", commandRef("paperclip_status"), " before changing runtime docs."],
            {
              text: ["Then open ", sectionRef({ surfaceId: "workflow_surface", stableSlug: "owner-map" }), "."],
              children: [["If routing is still unclear, read ", surfaceRef("workflow_surface"), " end to end."]]
            }
          ]
        },
        {
          kind: "definition_list",
          items: [
            {
              term: [sectionRef({ surfaceId: "workflow_surface", stableSlug: "owner-map" })],
              definitions: [["The canonical owner-routing section in ", surfaceRef("workflow_surface"), "."]]
            }
          ]
        }
      ]
    },
    {
      id: "workflow_surface",
      surfaceClass: "workflow_owner",
      runtimePath: "paperclip_home/project_homes/editorial/shared/AUTHORITATIVE_EDITORIAL_WORKFLOW.md"
    }
  ],
  surfaceSections: [
    {
      id: "read_first",
      surfaceId: "author_home",
      stableSlug: "read-first",
      title: "Read First",
      body: [{ kind: "paragraph", text: ["Start with ", sectionRef({ surfaceId: "workflow_surface", stableSlug: "owner-map" }), "."] }]
    },
    {
      id: "role_contract",
      surfaceId: "author_home",
      stableSlug: "role-contract",
      title: "Role Contract",
      body: [{ kind: "paragraph", text: ["Treat ", artifactRef("action_authority"), " as the action gate."] }]
    },
    {
      id: "owner_map",
      surfaceId: "workflow_surface",
      stableSlug: "owner-map",
      title: "Owner Map",
      body: [{ kind: "paragraph", text: "Use this section for owner routing." }]
    }
  ],
  generatedTargets: [
    { id: "read_first_target", path: "paperclip_home/agents/author/AGENTS.md", sourceIds: ["author"], sectionId: "read_first" },
    { id: "role_contract_target", path: "paperclip_home/agents/author/AGENTS.md", sourceIds: ["author"], sectionId: "role_contract" },
    { id: "owner_map_target", path: "paperclip_home/project_homes/editorial/shared/AUTHORITATIVE_EDITORIAL_WORKFLOW.md", sourceIds: ["author"], sectionId: "owner_map" }
  ],
  links: [
    { id: "author_home_documents_author", kind: "documents", from: "author_home", to: "author" },
    { id: "read_first_documents_author", kind: "documents", from: "read_first", to: "author" },
    { id: "role_contract_documents_author", kind: "documents", from: "role_contract", to: "author" },
    { id: "owner_map_documents_author", kind: "documents", from: "owner_map", to: "author" }
  ]
});

export default typedDoctrineRefsSeed;
