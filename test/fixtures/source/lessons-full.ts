import { defineRole, defineSetup, defineWorkflowStep } from "../../../src/source/index.js";

const lessonsFullSeed = defineSetup({
  id: "lessons_full",
  name: "Lessons Full",
  description: "A broader proving fixture for the full Lessons doctrine requirement set.",
  roles: [
    defineRole({
      id: "section_dossier_engineer",
      name: "Section Dossier Engineer",
      purpose: "Define the section burden and produce the section dossier contract.",
      boundaries: ["Do not choose final lesson copy.", "Do not silently collapse runtime bundle drift."]
    }),
    defineRole({
      id: "lessons_lesson_architect",
      name: "Lessons Lesson Architect",
      purpose: "Turn the section burden into a concrete lesson plan for one lesson slot.",
      boundaries: ["Do not change locked upstream concepts.", "Do not invent playables outside the accepted strategy."]
    })
  ],
  workflowSteps: [
    defineWorkflowStep({
      id: "section_dossier_step",
      roleId: "section_dossier_engineer",
      purpose: "Define what the section teaches, what it does not teach, and the receipts behind those calls.",
      requiredInputIds: [],
      supportInputIds: ["lessons_simple_clear_ref", "poker_kb_reference"],
      requiredOutputIds: ["section_dossier_packet"],
      stopLine: "Stop once the section dossier packet is coherent enough for lesson planning to trust.",
      nextStepId: "lesson_architect_step"
    }),
    defineWorkflowStep({
      id: "lesson_architect_step",
      roleId: "lessons_lesson_architect",
      purpose: "Turn the upstream dossier into a lesson plan with explicit teaching burden and deferred work.",
      requiredInputIds: ["section_dossier_contract"],
      supportInputIds: ["packet_shape_standard_artifact", "quality_bar_standard_artifact", "lessons_structured_requirements_ref"],
      requiredOutputIds: ["lesson_plan_packet"],
      stopLine: "Stop once the lesson plan is stable enough for the critic to judge.",
      nextGateId: "lessons_acceptance_critic_gate"
    })
  ],
  reviewGates: [
    {
      id: "lessons_acceptance_critic_gate",
      name: "Lessons Acceptance Critic",
      purpose: "Judge whether the packet chain is trustworthy and the quality bar still holds.",
      checkIds: ["lesson_plan_packet", "quality_bar_section"]
    }
  ],
  packetContracts: [
    {
      id: "section_dossier_contract",
      name: "Section Dossier",
      conceptualArtifactIds: ["section_dossier_packet"],
      runtimeArtifactIds: ["prior_knowledge_map_md", "brief_md", "concepts_md"]
    },
    {
      id: "lesson_plan_contract",
      name: "Lesson Plan",
      conceptualArtifactIds: ["lesson_plan_packet"],
      runtimeArtifactIds: ["lesson_plan_runtime"]
    }
  ],
  artifacts: [
    { id: "section_dossier_packet", name: "SECTION_DOSSIER.md", artifactClass: "required", runtimePath: "_authoring/SECTION_DOSSIER.md" },
    { id: "lesson_plan_packet", name: "LESSON_PLAN.md", artifactClass: "required", runtimePath: "_authoring/LESSON_PLAN.md" },
    { id: "prior_knowledge_map_md", name: "PRIOR_KNOWLEDGE_MAP.md", artifactClass: "legacy", runtimePath: "_authoring/PRIOR_KNOWLEDGE_MAP.md", compatibilityOnly: true },
    { id: "brief_md", name: "BRIEF.md", artifactClass: "legacy", runtimePath: "_authoring/BRIEF.md", compatibilityOnly: true },
    { id: "concepts_md", name: "CONCEPTS.md", artifactClass: "legacy", runtimePath: "_authoring/CONCEPTS.md", compatibilityOnly: true },
    { id: "lesson_plan_runtime", name: "LESSON_PLAN_RUNTIME.md", artifactClass: "legacy", runtimePath: "_authoring/LESSON_PLAN_RUNTIME.md", compatibilityOnly: true },
    { id: "comment_shape_contract", name: "Comment Shape", artifactClass: "reference" },
    { id: "specialist_turn_shape_contract", name: "Specialist Turn Shape", artifactClass: "reference" },
    { id: "packet_shape_standard_artifact", name: "Packet Shape Standard", artifactClass: "reference" },
    { id: "quality_bar_standard_artifact", name: "Quality Bar Standard", artifactClass: "reference" }
  ],
  surfaces: [
    { id: "dossier_role_home", surfaceClass: "role_home", runtimePath: "project_homes/lessons/roles/section_dossier_engineer/AGENTS.md" },
    { id: "lesson_architect_home", surfaceClass: "role_home", runtimePath: "project_homes/lessons/roles/lessons_lesson_architect/AGENTS.md" },
    { id: "lessons_readme", surfaceClass: "shared_entrypoint", runtimePath: "project_homes/lessons/shared/README.md" },
    {
      id: "authoritative_workflow",
      surfaceClass: "workflow_owner",
      runtimePath: "project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md"
    },
    {
      id: "section_dossier_workflow",
      surfaceClass: "packet_workflow",
      runtimePath: "project_homes/lessons/shared/proof_packets/SECTION_DOSSIER_ENGINEER_WORKFLOW.md"
    },
    {
      id: "lesson_architect_workflow",
      surfaceClass: "packet_workflow",
      runtimePath: "project_homes/lessons/shared/proof_packets/LESSONS_LESSON_ARCHITECT_WORKFLOW.md"
    },
    {
      id: "packet_shapes_standard",
      surfaceClass: "standard",
      runtimePath: "project_homes/lessons/shared/lessons_content_standards/LESSONS_PACKET_SHAPES.md"
    },
    {
      id: "quality_bar_standard",
      surfaceClass: "standard",
      runtimePath: "project_homes/lessons/shared/lessons_content_standards/LESSONS_QUALITY_BAR.md"
    },
    {
      id: "acceptance_critic_gate_surface",
      surfaceClass: "gate",
      runtimePath: "project_homes/lessons/shared/lessons_content_standards/LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md"
    },
    {
      id: "poker_kb_surface",
      surfaceClass: "technical_reference",
      runtimePath: "project_homes/lessons/shared/technical_references/POKER_KB.md"
    },
    {
      id: "github_protocol_surface",
      surfaceClass: "how_to",
      runtimePath: "project_homes/lessons/shared/how_to_guides/LESSONS_GITHUB_ACCESS_PROTOCOL.md"
    },
    {
      id: "mobile_bootstrap_surface",
      surfaceClass: "coordination",
      runtimePath: "project_homes/lessons/shared/agent_coordination/LESSONS_PSMOBILE_BOOTSTRAP.md"
    }
  ],
  surfaceSections: [
    { id: "dossier_read_first", surfaceId: "dossier_role_home", stableSlug: "read-first", title: "Read First" },
    { id: "dossier_role_contract", surfaceId: "dossier_role_home", stableSlug: "role-contract", title: "Role Contract" },
    { id: "lesson_architect_read_first", surfaceId: "lesson_architect_home", stableSlug: "read-first", title: "Read First" },
    { id: "lesson_architect_role_contract", surfaceId: "lesson_architect_home", stableSlug: "role-contract", title: "Role Contract" },
    { id: "shared_read_order", surfaceId: "lessons_readme", stableSlug: "read-order", title: "Read Order" },
    { id: "workflow_owner_map", surfaceId: "authoritative_workflow", stableSlug: "owner-map", title: "Owner Map" },
    { id: "workflow_comment_shape", surfaceId: "authoritative_workflow", stableSlug: "comment-shape", title: "Comment Shape" },
    {
      id: "workflow_specialist_turn_shape",
      surfaceId: "authoritative_workflow",
      stableSlug: "specialist-turn-shape",
      title: "Specialist Turn Shape"
    },
    {
      id: "section_dossier_lane_contract",
      surfaceId: "section_dossier_workflow",
      stableSlug: "what-this-lane-must-do",
      title: "What This Lane Must Do"
    },
    {
      id: "lesson_architect_lane_contract",
      surfaceId: "lesson_architect_workflow",
      stableSlug: "what-this-lane-must-do",
      title: "What This Lane Must Do"
    },
    { id: "packet_shape_section", surfaceId: "packet_shapes_standard", stableSlug: "packet-shape", title: "Packet Shape" },
    { id: "quality_bar_section", surfaceId: "quality_bar_standard", stableSlug: "quality-bar", title: "Quality Bar" },
    {
      id: "gate_what_critic_judges",
      surfaceId: "acceptance_critic_gate_surface",
      stableSlug: "what-the-critic-judges",
      title: "What the critic judges"
    },
    { id: "poker_kb_section", surfaceId: "poker_kb_surface", stableSlug: "poker-kb", title: "Poker KB" },
    { id: "github_protocol_section", surfaceId: "github_protocol_surface", stableSlug: "github-access", title: "GitHub Access" },
    { id: "mobile_bootstrap_section", surfaceId: "mobile_bootstrap_surface", stableSlug: "bootstrap", title: "Bootstrap" }
  ],
  references: [
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
      sourcePath: "project_homes/lessons/shared/technical_references/POKER_KB.md"
    },
    {
      id: "github_access_reference",
      referenceClass: "support_reference",
      name: "Lessons GitHub Access Protocol",
      sourcePath: "project_homes/lessons/shared/how_to_guides/LESSONS_GITHUB_ACCESS_PROTOCOL.md"
    },
    {
      id: "mobile_bootstrap_reference",
      referenceClass: "support_reference",
      name: "Lessons PSMobile Bootstrap",
      sourcePath: "project_homes/lessons/shared/agent_coordination/LESSONS_PSMOBILE_BOOTSTRAP.md"
    }
  ],
  generatedTargets: [
    {
      id: "dossier_role_home_read_first_target",
      path: "project_homes/lessons/roles/section_dossier_engineer/AGENTS.md",
      sourceIds: ["section_dossier_engineer"],
      sectionId: "dossier_read_first"
    },
    {
      id: "dossier_role_home_role_contract_target",
      path: "project_homes/lessons/roles/section_dossier_engineer/AGENTS.md",
      sourceIds: ["section_dossier_engineer"],
      sectionId: "dossier_role_contract"
    },
    {
      id: "lesson_architect_home_read_first_target",
      path: "project_homes/lessons/roles/lessons_lesson_architect/AGENTS.md",
      sourceIds: ["lessons_lesson_architect"],
      sectionId: "lesson_architect_read_first"
    },
    {
      id: "lesson_architect_home_role_contract_target",
      path: "project_homes/lessons/roles/lessons_lesson_architect/AGENTS.md",
      sourceIds: ["lessons_lesson_architect"],
      sectionId: "lesson_architect_role_contract"
    },
    {
      id: "lessons_readme_target",
      path: "project_homes/lessons/shared/README.md",
      sourceIds: ["section_dossier_step"],
      sectionId: "shared_read_order"
    },
    {
      id: "authoritative_workflow_owner_map_target",
      path: "project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md",
      sourceIds: ["lesson_architect_step"],
      sectionId: "workflow_owner_map"
    },
    {
      id: "authoritative_workflow_comment_shape_target",
      path: "project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md",
      sourceIds: ["comment_shape_contract"],
      sectionId: "workflow_comment_shape"
    },
    {
      id: "authoritative_workflow_specialist_turn_shape_target",
      path: "project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md",
      sourceIds: ["specialist_turn_shape_contract"],
      sectionId: "workflow_specialist_turn_shape"
    },
    {
      id: "section_dossier_workflow_target",
      path: "project_homes/lessons/shared/proof_packets/SECTION_DOSSIER_ENGINEER_WORKFLOW.md",
      sourceIds: ["section_dossier_step"],
      sectionId: "section_dossier_lane_contract"
    },
    {
      id: "lesson_architect_workflow_target",
      path: "project_homes/lessons/shared/proof_packets/LESSONS_LESSON_ARCHITECT_WORKFLOW.md",
      sourceIds: ["lesson_architect_step"],
      sectionId: "lesson_architect_lane_contract"
    },
    {
      id: "packet_shapes_standard_target",
      path: "project_homes/lessons/shared/lessons_content_standards/LESSONS_PACKET_SHAPES.md",
      sourceIds: ["packet_shape_standard_artifact"],
      sectionId: "packet_shape_section"
    },
    {
      id: "quality_bar_standard_target",
      path: "project_homes/lessons/shared/lessons_content_standards/LESSONS_QUALITY_BAR.md",
      sourceIds: ["quality_bar_standard_artifact"],
      sectionId: "quality_bar_section"
    },
    {
      id: "acceptance_critic_gate_target",
      path: "project_homes/lessons/shared/lessons_content_standards/LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md",
      sourceIds: ["lessons_acceptance_critic_gate"],
      sectionId: "gate_what_critic_judges"
    },
    {
      id: "poker_kb_surface_target",
      path: "project_homes/lessons/shared/technical_references/POKER_KB.md",
      sourceIds: ["poker_kb_reference"],
      sectionId: "poker_kb_section"
    },
    {
      id: "github_protocol_surface_target",
      path: "project_homes/lessons/shared/how_to_guides/LESSONS_GITHUB_ACCESS_PROTOCOL.md",
      sourceIds: ["github_access_reference"],
      sectionId: "github_protocol_section"
    },
    {
      id: "mobile_bootstrap_surface_target",
      path: "project_homes/lessons/shared/agent_coordination/LESSONS_PSMOBILE_BOOTSTRAP.md",
      sourceIds: ["mobile_bootstrap_reference"],
      sectionId: "mobile_bootstrap_section"
    }
  ],
  links: [
    { id: "dossier_home_documents_role", kind: "documents", from: "dossier_role_home", to: "section_dossier_engineer" },
    { id: "dossier_read_first_documents_role", kind: "documents", from: "dossier_read_first", to: "section_dossier_engineer" },
    { id: "dossier_role_contract_documents_role", kind: "documents", from: "dossier_role_contract", to: "section_dossier_engineer" },
    { id: "dossier_role_contract_owned_by_role", kind: "owns", from: "section_dossier_engineer", to: "dossier_role_contract" },
    { id: "lesson_home_documents_role", kind: "documents", from: "lesson_architect_home", to: "lessons_lesson_architect" },
    { id: "lesson_read_first_documents_role", kind: "documents", from: "lesson_architect_read_first", to: "lessons_lesson_architect" },
    { id: "lesson_role_contract_documents_role", kind: "documents", from: "lesson_architect_role_contract", to: "lessons_lesson_architect" },
    { id: "lesson_role_contract_owned_by_role", kind: "owns", from: "lessons_lesson_architect", to: "lesson_architect_role_contract" },
    { id: "shared_read_order_documents_dossier_step", kind: "documents", from: "shared_read_order", to: "section_dossier_step" },
    { id: "workflow_owner_map_documents_lesson_step", kind: "documents", from: "workflow_owner_map", to: "lesson_architect_step" },
    { id: "workflow_comment_shape_documents_artifact", kind: "documents", from: "workflow_comment_shape", to: "comment_shape_contract" },
    {
      id: "workflow_specialist_turn_shape_documents_artifact",
      kind: "documents",
      from: "workflow_specialist_turn_shape",
      to: "specialist_turn_shape_contract"
    },
    { id: "section_dossier_workflow_documents_contract", kind: "documents", from: "section_dossier_workflow", to: "section_dossier_contract" },
    {
      id: "section_dossier_lane_contract_documents_step",
      kind: "documents",
      from: "section_dossier_lane_contract",
      to: "section_dossier_step"
    },
    { id: "section_dossier_lane_contract_owned_by_step", kind: "owns", from: "section_dossier_step", to: "section_dossier_lane_contract" },
    { id: "lesson_architect_workflow_documents_contract", kind: "documents", from: "lesson_architect_workflow", to: "lesson_plan_contract" },
    {
      id: "lesson_architect_lane_contract_documents_step",
      kind: "documents",
      from: "lesson_architect_lane_contract",
      to: "lesson_architect_step"
    },
    { id: "lesson_architect_lane_contract_owned_by_step", kind: "owns", from: "lesson_architect_step", to: "lesson_architect_lane_contract" },
    { id: "packet_shape_section_documents_artifact", kind: "documents", from: "packet_shape_section", to: "packet_shape_standard_artifact" },
    { id: "quality_bar_section_documents_artifact", kind: "documents", from: "quality_bar_section", to: "quality_bar_standard_artifact" },
    { id: "dossier_role_reads_comment_shape", kind: "reads", from: "section_dossier_engineer", to: "workflow_comment_shape" },
    {
      id: "dossier_role_reads_specialist_turn_shape",
      kind: "reads",
      from: "section_dossier_engineer",
      to: "workflow_specialist_turn_shape"
    },
    { id: "lesson_step_reads_packet_shape", kind: "reads", from: "lesson_architect_step", to: "packet_shape_section" },
    { id: "lesson_step_reads_quality_bar", kind: "reads", from: "lesson_architect_step", to: "quality_bar_section" },
    { id: "gate_surface_documents_gate", kind: "documents", from: "acceptance_critic_gate_surface", to: "lessons_acceptance_critic_gate" },
    { id: "gate_what_critic_judges_documents_gate", kind: "documents", from: "gate_what_critic_judges", to: "lessons_acceptance_critic_gate" },
    { id: "gate_section_owned_by_gate", kind: "owns", from: "lessons_acceptance_critic_gate", to: "gate_what_critic_judges" },
    { id: "gate_reads_quality_bar", kind: "reads", from: "lessons_acceptance_critic_gate", to: "quality_bar_section" },
    { id: "poker_kb_surface_documents_reference", kind: "documents", from: "poker_kb_surface", to: "poker_kb_reference" },
    { id: "poker_kb_section_documents_reference", kind: "documents", from: "poker_kb_section", to: "poker_kb_reference" },
    { id: "github_protocol_surface_documents_reference", kind: "documents", from: "github_protocol_surface", to: "github_access_reference" },
    { id: "github_protocol_section_documents_reference", kind: "documents", from: "github_protocol_section", to: "github_access_reference" },
    { id: "mobile_bootstrap_surface_documents_reference", kind: "documents", from: "mobile_bootstrap_surface", to: "mobile_bootstrap_reference" },
    { id: "mobile_bootstrap_section_documents_reference", kind: "documents", from: "mobile_bootstrap_section", to: "mobile_bootstrap_reference" },
    { id: "dossier_step_grounds_simple_clear", kind: "grounds", from: "section_dossier_step", to: "lessons_simple_clear_ref" },
    { id: "lesson_step_grounds_requirements", kind: "grounds", from: "lesson_architect_step", to: "lessons_structured_requirements_ref" },
    { id: "lesson_step_references_poker_kb", kind: "references", from: "lesson_architect_step", to: "poker_kb_reference" }
  ]
});

export default lessonsFullSeed;
