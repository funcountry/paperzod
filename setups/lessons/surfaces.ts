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
  id: "lessons_project_home_root",
  sections: [{ key: "projectHomeMap", id: "project_home_map", stableSlug: "project-home-map", title: "Project Home Map" }] as const
});

const dossierRoleHomeTemplate = defineRoleHomeTemplate({
  id: "section_dossier_role_home",
  sections: [
    { key: "readFirst", id: "dossier_read_first", stableSlug: "read-first", title: "Read First" },
    { key: "roleContract", id: "dossier_role_contract", stableSlug: "role-contract", title: "Role Contract" }
  ] as const
});

const lessonArchitectRoleHomeTemplate = defineRoleHomeTemplate({
  id: "lessons_lesson_architect_role_home",
  sections: [
    { key: "readFirst", id: "lesson_architect_read_first", stableSlug: "read-first", title: "Read First" },
    { key: "roleContract", id: "lesson_architect_role_contract", stableSlug: "role-contract", title: "Role Contract" }
  ] as const
});

const sharedEntrypointTemplate = defineSharedEntrypointTemplate({
  id: "lessons_shared_entrypoint",
  sections: [{ key: "readOrder", id: "shared_read_order", stableSlug: "read-order", title: "Read Order" }] as const
});

const workflowOwnerTemplate = defineWorkflowOwnerTemplate({
  id: "lessons_workflow_owner",
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

const sectionDossierWorkflowTemplate = definePacketWorkflowTemplate({
  id: "section_dossier_packet_workflow",
  sections: [
    {
      key: "laneContract",
      id: "section_dossier_lane_contract",
      stableSlug: "what-this-lane-must-do",
      title: "What This Lane Must Do"
    }
  ] as const
});

const lessonArchitectWorkflowTemplate = definePacketWorkflowTemplate({
  id: "lesson_architect_packet_workflow",
  sections: [
    {
      key: "laneContract",
      id: "lesson_architect_lane_contract",
      stableSlug: "what-this-lane-must-do",
      title: "What This Lane Must Do"
    }
  ] as const
});

const packetShapesTemplate = defineStandardTemplate({
  id: "lessons_packet_shapes_standard",
  sections: [{ key: "packetShape", id: "packet_shape_section", stableSlug: "packet-shape", title: "Packet Shape" }] as const
});

const qualityBarTemplate = defineStandardTemplate({
  id: "lessons_quality_bar_standard",
  sections: [{ key: "qualityBar", id: "quality_bar_section", stableSlug: "quality-bar", title: "Quality Bar" }] as const
});

const gateTemplate = defineGateTemplate({
  id: "lessons_acceptance_gate",
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
  id: "lessons_poker_kb_reference",
  sections: [{ key: "pokerKb", id: "poker_kb_section", stableSlug: "poker-kb", title: "Poker KB" }] as const
});

const howToTemplate = defineHowToTemplate({
  id: "lessons_github_access_how_to",
  sections: [{ key: "githubAccess", id: "github_protocol_section", stableSlug: "github-access", title: "GitHub Access" }] as const
});

const coordinationTemplate = defineCoordinationTemplate({
  id: "lessons_mobile_bootstrap_coordination",
  sections: [{ key: "bootstrap", id: "mobile_bootstrap_section", stableSlug: "bootstrap", title: "Bootstrap" }] as const
});

export const surfaceDocumentParts = [
  projectHomeTemplate.document({
    surfaceId: "lessons_project_home_root",
    runtimePath: "paperclip_home/project_homes/lessons/README.md",
    title: "Lessons Project Home",
    intro: [{ kind: "paragraph", text: "This is the repo home for Lessons shared doctrine and role-local runtime guidance." }],
    sections: {
      projectHomeMap: {
        documentsTo: "section_dossier_step"
      }
    }
  }),
  dossierRoleHomeTemplate.document({
    surfaceId: "dossier_role_home",
    runtimePath: "paperclip_home/agents/section_dossier_engineer/AGENTS.md",
    roleId: "section_dossier_engineer"
  }),
  lessonArchitectRoleHomeTemplate.document({
    surfaceId: "lesson_architect_home",
    runtimePath: "paperclip_home/agents/lessons_lesson_architect/AGENTS.md",
    roleId: "lessons_lesson_architect"
  }),
  sharedEntrypointTemplate.document({
    surfaceId: "lessons_readme",
    runtimePath: "paperclip_home/project_homes/lessons/shared/README.md",
    title: "Lessons Shared Doctrine",
    intro: [
      { kind: "paragraph", text: "This folder is the live shared doctrine home for the Lessons project." },
      { kind: "paragraph", text: "Start here, then open the one surface that owns your current question." }
    ],
    sections: {
      readOrder: {
        documentsTo: "section_dossier_step"
      }
    }
  }),
  workflowOwnerTemplate.document({
    surfaceId: "authoritative_workflow",
    runtimePath: "paperclip_home/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md",
    title: "Lessons Workflow",
    intro: [
      { kind: "paragraph", text: "This is the top-level workflow for Lessons." },
      { kind: "paragraph", text: "Use this file for lane order, same-issue handoff, and owner routing." }
    ],
    workflowStepId: "lesson_architect_step",
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
  sectionDossierWorkflowTemplate.document({
    surfaceId: "section_dossier_workflow",
    runtimePath: "paperclip_home/project_homes/lessons/shared/proof_packets/SECTION_DOSSIER_ENGINEER_WORKFLOW.md",
    packetContractId: "section_dossier_contract",
    workflowStepId: "section_dossier_step"
  }),
  lessonArchitectWorkflowTemplate.document({
    surfaceId: "lesson_architect_workflow",
    runtimePath: "paperclip_home/project_homes/lessons/shared/proof_packets/LESSONS_LESSON_ARCHITECT_WORKFLOW.md",
    packetContractId: "lesson_plan_contract",
    workflowStepId: "lesson_architect_step"
  }),
  packetShapesTemplate.document({
    surfaceId: "packet_shapes_standard",
    runtimePath: "paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_PACKET_SHAPES.md",
    artifactId: "packet_shape_standard_artifact",
    surfaceDocumentsTo: [],
    title: "Lessons Packet Shapes",
    intro: [
      { kind: "paragraph", text: "This file owns the packet families used to start Lessons work." },
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
    runtimePath: "paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_QUALITY_BAR.md",
    artifactId: "quality_bar_standard_artifact",
    surfaceDocumentsTo: [],
    title: "Lessons Quality Bar",
    intro: [
      { kind: "paragraph", text: "This is the shared qualitative standard for judging Lessons output." },
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
    runtimePath: "paperclip_home/project_homes/lessons/shared/lessons_content_standards/LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md",
    reviewGateId: "lessons_acceptance_critic_gate",
    title: "Lessons Acceptance Critic Criteria"
  }),
  technicalReferenceTemplate.document({
    surfaceId: "poker_kb_surface",
    runtimePath: "paperclip_home/project_homes/lessons/shared/technical_references/POKER_KB.md",
    referenceId: "poker_kb_reference",
    title: "Poker KB",
    intro: [
      {
        kind: "paragraph",
        text: "This file owns the Lessons-local PokerKB runner path, URL routing, query discipline, and example commands."
      },
      { kind: "paragraph", text: "Use it when the current task needs repo-owned PokerKB runner or query discipline guidance." }
    ],
    sections: {
      pokerKb: {
        body: [
          { kind: "paragraph", text: "Use this section when the current task needs the local PokerKB runner or query-discipline guidance." },
          {
            kind: "unordered_list",
            items: ["Reference source: `paperclip_home/project_homes/lessons/shared/technical_references/POKER_KB.md`."]
          }
        ]
      }
    }
  }),
  howToTemplate.document({
    surfaceId: "github_protocol_surface",
    runtimePath: "paperclip_home/project_homes/lessons/shared/how_to_guides/LESSONS_GITHUB_ACCESS_PROTOCOL.md",
    referenceId: "github_access_reference",
    title: "Lessons GitHub Access Protocol",
    intro: [{ kind: "paragraph", text: "This file is the shared GitHub access guide for the Lessons project." }],
    sections: {
      githubAccess: {
        body: [
          { kind: "paragraph", text: "Use this guide when the current task depends on `Lessons GitHub Access Protocol`." },
          {
            kind: "unordered_list",
            items: ["Procedure source: `paperclip_home/project_homes/lessons/shared/how_to_guides/LESSONS_GITHUB_ACCESS_PROTOCOL.md`."]
          }
        ]
      }
    }
  }),
  coordinationTemplate.document({
    surfaceId: "mobile_bootstrap_surface",
    runtimePath: "paperclip_home/project_homes/lessons/shared/agent_coordination/LESSONS_PSMOBILE_BOOTSTRAP.md",
    referenceId: "mobile_bootstrap_reference",
    title: "Lessons PSMobile Bootstrap",
    intro: [{ kind: "paragraph", text: "This file owns attached-checkout startup and runtime handling." }],
    sections: {
      bootstrap: {
        body: [
          { kind: "paragraph", text: "Use this guide when the current task depends on `Lessons PSMobile Bootstrap`." },
          {
            kind: "unordered_list",
            items: ["Coordination source: `paperclip_home/project_homes/lessons/shared/agent_coordination/LESSONS_PSMOBILE_BOOTSTRAP.md`."]
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
