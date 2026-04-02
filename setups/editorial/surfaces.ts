import {
  defineCoordinationTemplate,
  defineGateTemplate,
  defineHowToTemplate,
  definePacketWorkflowTemplate,
  defineProjectHomeRootTemplate,
  defineRoleHomeTemplate,
  defineSharedEntrypointTemplate,
  defineStandardTemplate,
  defineTechnicalReferenceTemplate,
  defineWorkflowOwnerTemplate,
  type SetupPart,
  type SurfaceInput,
  type SurfaceSectionInput
} from "paperzod";

const projectHomeTemplate = defineProjectHomeRootTemplate({
  id: "editorial_project_home_root",
  sections: [{ key: "projectHomeMap", id: "project_home_map", stableSlug: "project-home-map", title: "Project Home Map" }] as const
});

const briefResearcherRoleHomeTemplate = defineRoleHomeTemplate({
  id: "brief_researcher_role_home",
  sections: [
    { key: "readFirst", id: "brief_researcher_read_first", stableSlug: "read-first", title: "Read First" },
    { key: "roleContract", id: "brief_researcher_role_contract", stableSlug: "role-contract", title: "Role Contract" }
  ] as const
});

const storyArchitectRoleHomeTemplate = defineRoleHomeTemplate({
  id: "story_architect_role_home",
  sections: [
    { key: "readFirst", id: "story_architect_read_first", stableSlug: "read-first", title: "Read First" },
    { key: "roleContract", id: "story_architect_role_contract", stableSlug: "role-contract", title: "Role Contract" }
  ] as const
});

const sharedEntrypointTemplate = defineSharedEntrypointTemplate({
  id: "editorial_shared_entrypoint",
  sections: [{ key: "readOrder", id: "shared_read_order", stableSlug: "read-order", title: "Read Order" }] as const
});

const workflowOwnerTemplate = defineWorkflowOwnerTemplate({
  id: "editorial_workflow_owner",
  sections: [
    { key: "ownerMap", id: "workflow_owner_map", stableSlug: "owner-map", title: "Owner Map" },
    { key: "commentShape", id: "workflow_comment_shape", stableSlug: "comment-shape", title: "Comment Shape" },
    {
      key: "specialistTurnShape",
      id: "workflow_specialist_turn_shape",
      stableSlug: "specialist-turn-shape",
      title: "Specialist Turn Shape"
    }
  ] as const
});

const briefResearcherWorkflowTemplate = definePacketWorkflowTemplate({
  id: "editorial_brief_packet_workflow",
  sections: [
    {
      key: "laneContract",
      id: "brief_researcher_lane_contract",
      stableSlug: "what-this-lane-must-do",
      title: "What This Lane Must Do"
    }
  ] as const
});

const storyArchitectWorkflowTemplate = definePacketWorkflowTemplate({
  id: "story_architect_packet_workflow",
  sections: [
    {
      key: "laneContract",
      id: "story_architect_lane_contract",
      stableSlug: "what-this-lane-must-do",
      title: "What This Lane Must Do"
    }
  ] as const
});

const packetShapesTemplate = defineStandardTemplate({
  id: "editorial_packet_shapes_standard",
  sections: [{ key: "packetShape", id: "packet_shape_section", stableSlug: "packet-shape", title: "Packet Shape" }] as const
});

const qualityBarTemplate = defineStandardTemplate({
  id: "editorial_quality_bar_standard",
  sections: [{ key: "qualityBar", id: "quality_bar_section", stableSlug: "quality-bar", title: "Quality Bar" }] as const
});

const gateTemplate = defineGateTemplate({
  id: "editorial_acceptance_gate_template",
  sections: [
    {
      key: "whatCriticJudges",
      id: "gate_what_critic_judges",
      stableSlug: "what-the-critic-judges",
      title: "What the critic judges"
    }
  ] as const
});

const technicalReferenceTemplate = defineTechnicalReferenceTemplate({
  id: "editorial_audience_research_reference",
  sections: [{ key: "audienceResearch", id: "audience_research_section", stableSlug: "audience-research", title: "Audience Research KB" }] as const
});

const howToTemplate = defineHowToTemplate({
  id: "editorial_github_access_how_to",
  sections: [{ key: "githubAccess", id: "github_protocol_section", stableSlug: "github-access", title: "GitHub Access" }] as const
});

const coordinationTemplate = defineCoordinationTemplate({
  id: "editorial_publish_bootstrap_coordination",
  sections: [{ key: "publishBootstrap", id: "publish_bootstrap_section", stableSlug: "bootstrap", title: "Bootstrap" }] as const
});

export const surfaceDocumentParts = [
  projectHomeTemplate.document({
    surfaceId: "editorial_project_home_root",
    runtimePath: "paperclip_home/project_homes/editorial/README.md",
    title: "Editorial Project Home",
    intro: [{ kind: "paragraph", text: "This is the repo home for shared editorial doctrine and role-local runtime guidance." }],
    sections: {
      projectHomeMap: {
        documentsTo: "brief_research_step"
      }
    }
  }),
  briefResearcherRoleHomeTemplate.document({
    surfaceId: "brief_researcher_home",
    runtimePath: "paperclip_home/agents/brief_researcher/AGENTS.md",
    roleId: "brief_researcher"
  }),
  storyArchitectRoleHomeTemplate.document({
    surfaceId: "story_architect_home",
    runtimePath: "paperclip_home/agents/story_architect/AGENTS.md",
    roleId: "story_architect"
  }),
  sharedEntrypointTemplate.document({
    surfaceId: "editorial_readme",
    runtimePath: "paperclip_home/project_homes/editorial/shared/README.md",
    title: "Editorial Shared Doctrine",
    intro: [
      { kind: "paragraph", text: "This folder is the live shared doctrine home for the Editorial project." },
      { kind: "paragraph", text: "Start here, then open the one surface that owns your current question." }
    ],
    sections: {
      readOrder: {
        documentsTo: "brief_research_step"
      }
    }
  }),
  workflowOwnerTemplate.document({
    surfaceId: "authoritative_workflow",
    runtimePath: "paperclip_home/project_homes/editorial/shared/AUTHORITATIVE_EDITORIAL_WORKFLOW.md",
    title: "Editorial Workflow",
    intro: [
      { kind: "paragraph", text: "This is the top-level workflow for the Editorial setup." },
      { kind: "paragraph", text: "Use this file for lane order, same-issue handoff, and owner routing." }
    ],
    workflowStepId: "story_architect_step",
    surfaceDocumentsTo: [],
    sections: {
      commentShape: {
        documentsTo: "comment_shape_contract",
        body: [{ kind: "paragraph", text: "Use `Comment Shape` as the shared handoff comment contract." }]
      },
      specialistTurnShape: {
        documentsTo: "specialist_turn_shape_contract",
        body: [{ kind: "paragraph", text: "Use `Specialist Turn Shape` as the shared specialist-turn contract." }]
      }
    }
  }),
  briefResearcherWorkflowTemplate.document({
    surfaceId: "brief_researcher_workflow",
    runtimePath: "paperclip_home/project_homes/editorial/shared/workflow_packets/BRIEF_RESEARCHER_WORKFLOW.md",
    packetContractId: "editorial_brief_contract",
    workflowStepId: "brief_research_step"
  }),
  storyArchitectWorkflowTemplate.document({
    surfaceId: "story_architect_workflow",
    runtimePath: "paperclip_home/project_homes/editorial/shared/workflow_packets/STORY_ARCHITECT_WORKFLOW.md",
    packetContractId: "story_outline_contract",
    workflowStepId: "story_architect_step"
  }),
  packetShapesTemplate.document({
    surfaceId: "packet_shapes_standard",
    runtimePath: "paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_PACKET_SHAPES.md",
    artifactId: "packet_shape_standard_artifact",
    surfaceDocumentsTo: [],
    title: "Editorial Packet Shapes",
    intro: [
      { kind: "paragraph", text: "This file owns the packet families used to start editorial work." },
      { kind: "paragraph", text: "Use it to answer one question: what packet shape should I create for this job?" }
    ],
    sections: {
      packetShape: {
        body: [
          { kind: "paragraph", text: "Use this section when the current job needs the canonical packet-shape rule." },
          { kind: "unordered_list", items: ["Current standard source: `Packet Shape Standard`."] }
        ]
      }
    }
  }),
  qualityBarTemplate.document({
    surfaceId: "quality_bar_standard",
    runtimePath: "paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_QUALITY_BAR.md",
    artifactId: "quality_bar_standard_artifact",
    surfaceDocumentsTo: [],
    title: "Editorial Quality Bar",
    intro: [
      { kind: "paragraph", text: "This is the shared qualitative standard for judging editorial output." },
      {
        kind: "paragraph",
        text: "Use it when the current task needs the quality bar the critic and downstream lanes should trust."
      }
    ],
    sections: {
      qualityBar: {
        body: [
          { kind: "paragraph", text: "Use this section as the shared quality bar the critic and downstream lanes should trust." },
          { kind: "unordered_list", items: ["Current standard source: `Quality Bar Standard`."] }
        ]
      }
    }
  }),
  gateTemplate.document({
    surfaceId: "acceptance_critic_gate_surface",
    runtimePath: "paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_ACCEPTANCE_CRITERIA.md",
    reviewGateId: "editorial_acceptance_gate",
    title: "Editorial Acceptance Criteria"
  }),
  technicalReferenceTemplate.document({
    surfaceId: "audience_research_surface",
    runtimePath: "paperclip_home/project_homes/editorial/shared/technical_references/AUDIENCE_RESEARCH_KB.md",
    referenceId: "audience_research_reference",
    title: "Audience Research KB",
    intro: [
      {
        kind: "paragraph",
        text: "This file owns the shared audience-research reference path, lookup discipline, and example commands."
      },
      { kind: "paragraph", text: "Use it when the current task needs repo-owned audience-research guidance." }
    ],
    sections: {
      audienceResearch: {
        body: [
          { kind: "paragraph", text: "Use this section when the current task needs the local audience-research guidance." },
          {
            kind: "unordered_list",
            items: ["Reference source: `paperclip_home/project_homes/editorial/shared/technical_references/AUDIENCE_RESEARCH_KB.md`."]
          }
        ]
      }
    }
  }),
  howToTemplate.document({
    surfaceId: "github_protocol_surface",
    runtimePath: "paperclip_home/project_homes/editorial/shared/how_to_guides/EDITORIAL_GITHUB_PROTOCOL.md",
    referenceId: "github_access_reference",
    title: "Editorial GitHub Protocol",
    intro: [{ kind: "paragraph", text: "This file is the shared GitHub access guide for the Editorial project." }],
    sections: {
      githubAccess: {
        body: [
          { kind: "paragraph", text: "Use this guide when the current task depends on `Editorial GitHub Protocol`." },
          {
            kind: "unordered_list",
            items: ["Procedure source: `paperclip_home/project_homes/editorial/shared/how_to_guides/EDITORIAL_GITHUB_PROTOCOL.md`."]
          }
        ]
      }
    }
  }),
  coordinationTemplate.document({
    surfaceId: "publish_bootstrap_surface",
    runtimePath: "paperclip_home/project_homes/editorial/shared/agent_coordination/EDITORIAL_PUBLISH_BOOTSTRAP.md",
    referenceId: "publish_bootstrap_reference",
    title: "Editorial Publish Bootstrap",
    intro: [{ kind: "paragraph", text: "This file owns publish bootstrap and runtime coordination guidance." }],
    sections: {
      publishBootstrap: {
        body: [
          { kind: "paragraph", text: "Use this guide when the current task depends on `Editorial Publish Bootstrap`." },
          {
            kind: "unordered_list",
            items: ["Coordination source: `paperclip_home/project_homes/editorial/shared/agent_coordination/EDITORIAL_PUBLISH_BOOTSTRAP.md`."]
          }
        ]
      }
    }
  })
] satisfies readonly SetupPart[];

function collectSurfaces(parts: readonly SetupPart[]): SurfaceInput[] {
  return parts.flatMap((part) => part.surfaces ?? []);
}

function collectSurfaceSections(parts: readonly SetupPart[]): SurfaceSectionInput[] {
  return parts.flatMap((part) => part.surfaceSections ?? []);
}

export const surfaces = collectSurfaces(surfaceDocumentParts);
export const surfaceSections = collectSurfaceSections(surfaceDocumentParts);
