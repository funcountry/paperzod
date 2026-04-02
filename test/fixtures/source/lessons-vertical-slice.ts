import { defineRole, defineSetup, defineWorkflowStep } from "../../../src/source/index.js";

const lessonsVerticalSliceSeed = defineSetup({
  id: "lessons_vertical_slice",
  name: "Lessons Vertical Slice",
  description: "A narrow proving slice for the Lessons doctrine shape.",
  roles: [
    defineRole({
      id: "section_dossier_engineer",
      name: "Section Dossier Engineer",
      purpose: "Own the section dossier lane and produce the section dossier packet.",
      boundaries: ["Do not reteach downstream lesson flow.", "Do not rename locked section concepts in later lanes."]
    })
  ],
  workflowSteps: [
    defineWorkflowStep({
      id: "section_dossier_step",
      roleId: "section_dossier_engineer",
      purpose: "Define what the section teaches, what it does not teach, and the evidence behind those calls.",
      requiredInputIds: [],
      supportInputIds: ["lessons_simple_clear_ref"],
      requiredOutputIds: ["section_dossier_packet"],
      stopLine: "Stop once the section dossier packet is coherent enough for the critic to judge.",
      nextGateId: "lessons_acceptance_critic_gate"
    })
  ],
  reviewGates: [
    {
      id: "lessons_acceptance_critic_gate",
      name: "Lessons Acceptance Critic",
      purpose: "Judge whether the dossier lane proved the section burden and handed off a trustworthy packet.",
      checkIds: ["section_dossier_packet", "workflow_lane_contract"]
    }
  ],
  packetContracts: [
    {
      id: "section_dossier_contract",
      name: "Section Dossier",
      conceptualArtifactIds: ["section_dossier_packet"]
    }
  ],
  artifacts: [
    {
      id: "section_dossier_packet",
      name: "SECTION_DOSSIER.md",
      artifactClass: "required",
      runtimePath: "_authoring/SECTION_DOSSIER.md"
    },
    {
      id: "comment_shape_standard",
      name: "Comment Shape Standard",
      artifactClass: "reference"
    },
    {
      id: "specialist_turn_shape_standard",
      name: "Specialist Turn Shape Standard",
      artifactClass: "reference"
    }
  ],
  surfaces: [
    {
      id: "dossier_role_home",
      surfaceClass: "role_home",
      runtimePath: "project_homes/lessons/roles/section_dossier_engineer/AGENTS.md"
    },
    {
      id: "lessons_readme",
      surfaceClass: "shared_entrypoint",
      runtimePath: "project_homes/lessons/shared/README.md"
    },
    {
      id: "section_dossier_workflow",
      surfaceClass: "packet_workflow",
      runtimePath: "project_homes/lessons/shared/proof_packets/SECTION_DOSSIER_ENGINEER_WORKFLOW.md"
    },
    {
      id: "packet_shapes_standard",
      surfaceClass: "standard",
      runtimePath: "project_homes/lessons/shared/lessons_content_standards/LESSONS_PACKET_SHAPES.md"
    },
    {
      id: "acceptance_critic_gate_surface",
      surfaceClass: "gate",
      runtimePath: "project_homes/lessons/shared/lessons_content_standards/LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md"
    }
  ],
  surfaceSections: [
    { id: "role_read_first", surfaceId: "dossier_role_home", stableSlug: "read-first", title: "Read First" },
    { id: "role_contract", surfaceId: "dossier_role_home", stableSlug: "role-contract", title: "Role Contract" },
    { id: "shared_read_order", surfaceId: "lessons_readme", stableSlug: "read-order", title: "Read Order" },
    {
      id: "workflow_lane_contract",
      surfaceId: "section_dossier_workflow",
      stableSlug: "what-this-lane-must-do",
      title: "What This Lane Must Do"
    },
    {
      id: "standard_comment_shape",
      surfaceId: "packet_shapes_standard",
      stableSlug: "comment-shape",
      title: "Comment Shape"
    },
    {
      id: "standard_specialist_turn_shape",
      surfaceId: "packet_shapes_standard",
      stableSlug: "specialist-turn-shape",
      title: "Specialist Turn Shape"
    },
    {
      id: "gate_what_critic_judges",
      surfaceId: "acceptance_critic_gate_surface",
      stableSlug: "what-the-critic-judges",
      title: "What the critic judges"
    }
  ],
  references: [
    {
      id: "lessons_simple_clear_ref",
      referenceClass: "imported_reference",
      name: "Lessons Workflow Simple Clear",
      sourcePath: "docs/ref/LESSONS_WORKFLOW_SIMPLE_CLEAR.md"
    }
  ],
  generatedTargets: [
    {
      id: "dossier_role_home_read_first_target",
      path: "project_homes/lessons/roles/section_dossier_engineer/AGENTS.md",
      sourceIds: ["section_dossier_engineer"],
      sectionId: "role_read_first"
    },
    {
      id: "dossier_role_home_role_contract_target",
      path: "project_homes/lessons/roles/section_dossier_engineer/AGENTS.md",
      sourceIds: ["section_dossier_engineer"],
      sectionId: "role_contract"
    },
    {
      id: "lessons_readme_target",
      path: "project_homes/lessons/shared/README.md",
      sourceIds: ["section_dossier_step"],
      sectionId: "shared_read_order"
    },
    {
      id: "section_dossier_workflow_target",
      path: "project_homes/lessons/shared/proof_packets/SECTION_DOSSIER_ENGINEER_WORKFLOW.md",
      sourceIds: ["section_dossier_step"],
      sectionId: "workflow_lane_contract"
    },
    {
      id: "packet_shapes_comment_shape_target",
      path: "project_homes/lessons/shared/lessons_content_standards/LESSONS_PACKET_SHAPES.md",
      sourceIds: ["comment_shape_standard"],
      sectionId: "standard_comment_shape"
    },
    {
      id: "packet_shapes_specialist_turn_shape_target",
      path: "project_homes/lessons/shared/lessons_content_standards/LESSONS_PACKET_SHAPES.md",
      sourceIds: ["specialist_turn_shape_standard"],
      sectionId: "standard_specialist_turn_shape"
    },
    {
      id: "acceptance_critic_gate_target",
      path: "project_homes/lessons/shared/lessons_content_standards/LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md",
      sourceIds: ["lessons_acceptance_critic_gate"],
      sectionId: "gate_what_critic_judges"
    }
  ],
  links: [
    { id: "dossier_home_documents_role", kind: "documents", from: "dossier_role_home", to: "section_dossier_engineer" },
    { id: "role_read_first_documents_role", kind: "documents", from: "role_read_first", to: "section_dossier_engineer" },
    { id: "role_contract_documents_role", kind: "documents", from: "role_contract", to: "section_dossier_engineer" },
    { id: "role_contract_owned_by_role", kind: "owns", from: "section_dossier_engineer", to: "role_contract" },
    { id: "shared_read_order_documents_step", kind: "documents", from: "shared_read_order", to: "section_dossier_step" },
    { id: "workflow_surface_documents_contract", kind: "documents", from: "section_dossier_workflow", to: "section_dossier_contract" },
    { id: "workflow_lane_contract_documents_step", kind: "documents", from: "workflow_lane_contract", to: "section_dossier_step" },
    { id: "workflow_lane_contract_owned_by_step", kind: "owns", from: "section_dossier_step", to: "workflow_lane_contract" },
    { id: "standard_comment_shape_documents_artifact", kind: "documents", from: "standard_comment_shape", to: "comment_shape_standard" },
    {
      id: "standard_specialist_turn_shape_documents_artifact",
      kind: "documents",
      from: "standard_specialist_turn_shape",
      to: "specialist_turn_shape_standard"
    },
    { id: "role_reads_comment_shape", kind: "reads", from: "section_dossier_engineer", to: "standard_comment_shape" },
    { id: "step_reads_specialist_turn_shape", kind: "reads", from: "section_dossier_step", to: "standard_specialist_turn_shape" },
    {
      id: "gate_surface_documents_gate",
      kind: "documents",
      from: "acceptance_critic_gate_surface",
      to: "lessons_acceptance_critic_gate"
    },
    {
      id: "gate_what_critic_judges_documents_gate",
      kind: "documents",
      from: "gate_what_critic_judges",
      to: "lessons_acceptance_critic_gate"
    },
    { id: "gate_section_owned_by_gate", kind: "owns", from: "lessons_acceptance_critic_gate", to: "gate_what_critic_judges" },
    { id: "step_grounds_simple_clear_ref", kind: "grounds", from: "section_dossier_step", to: "lessons_simple_clear_ref" }
  ]
});

export default lessonsVerticalSliceSeed;
