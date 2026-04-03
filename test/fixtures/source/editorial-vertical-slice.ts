import { defineRole, defineSetup, defineWorkflowStep } from "../../../src/source/index.js";

const editorialVerticalSliceSeed = defineSetup({
  id: "editorial_vertical_slice",
  name: "Editorial Vertical Slice",
  description: "A narrow proving slice for the editorial doctrine shape.",
  roles: [
    defineRole({
      id: "brief_researcher",
      name: "Brief Researcher",
      purpose: "Own the editorial brief lane and produce the editorial brief packet.",
      boundaries: ["Do not prewrite downstream story structure.", "Do not rename locked editorial concepts in later lanes."]
    })
  ],
  workflowSteps: [
    defineWorkflowStep({
      id: "brief_research_step",
      roleId: "brief_researcher",
      purpose: "Define what the section teaches, what it does not teach, and the evidence behind those calls.",
      requiredInputIds: [],
      supportInputIds: ["editorial_simple_clear_ref"],
      requiredOutputIds: ["editorial_brief_packet"],
      stopLine: "Stop once the editorial brief packet is coherent enough for the quality gate to judge.",
      nextGateId: "editorial_acceptance_gate"
    })
  ],
  reviewGates: [
    {
      id: "editorial_acceptance_gate",
      name: "Editorial Acceptance Gate",
      purpose: "Judge whether the brief lane proved the content burden and handed off a trustworthy packet.",
      checkIds: ["editorial_brief_packet", "workflow_lane_contract"]
    }
  ],
  packetContracts: [
    {
      id: "editorial_brief_contract",
      name: "Editorial Brief",
      conceptualArtifactIds: ["editorial_brief_packet"]
    }
  ],
  artifacts: [
    {
      id: "editorial_brief_packet",
      name: "EDITORIAL_BRIEF.md",
      artifactClass: "required",
      runtimePath: "_authoring/EDITORIAL_BRIEF.md"
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
      id: "brief_researcher_home",
      surfaceClass: "role_home",
      runtimePath: "paperclip_home/agents/brief_researcher/AGENTS.md",
      requiredSectionSlugs: ["read-first", "role-contract"]
    },
    {
      id: "editorial_readme",
      surfaceClass: "shared_entrypoint",
      runtimePath: "paperclip_home/project_homes/editorial/shared/README.md"
    },
    {
      id: "brief_researcher_workflow",
      surfaceClass: "packet_workflow",
      runtimePath: "paperclip_home/project_homes/editorial/shared/workflow_packets/BRIEF_RESEARCHER_WORKFLOW.md"
    },
    {
      id: "packet_shapes_standard",
      surfaceClass: "standard",
      runtimePath: "paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_PACKET_SHAPES.md"
    },
    {
      id: "acceptance_critic_gate_surface",
      surfaceClass: "gate",
      runtimePath: "paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_ACCEPTANCE_CRITERIA.md"
    }
  ],
  surfaceSections: [
    { id: "role_read_first", surfaceId: "brief_researcher_home", stableSlug: "read-first", title: "Read First" },
    { id: "role_contract", surfaceId: "brief_researcher_home", stableSlug: "role-contract", title: "Role Contract" },
    { id: "shared_read_order", surfaceId: "editorial_readme", stableSlug: "read-order", title: "Read Order" },
    {
      id: "workflow_lane_contract",
      surfaceId: "brief_researcher_workflow",
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
      id: "editorial_simple_clear_ref",
      referenceClass: "imported_reference",
      name: "Editorial Workflow Simple Clear",
      sourcePath: "docs/ref/EDITORIAL_WORKFLOW_SIMPLE_CLEAR.md"
    }
  ],
  generatedTargets: [
    {
      id: "brief_researcher_home_read_first_target",
      path: "paperclip_home/agents/brief_researcher/AGENTS.md",
      sourceIds: ["brief_researcher"],
      sectionId: "role_read_first"
    },
    {
      id: "brief_researcher_home_role_contract_target",
      path: "paperclip_home/agents/brief_researcher/AGENTS.md",
      sourceIds: ["brief_researcher"],
      sectionId: "role_contract"
    },
    {
      id: "editorial_readme_target",
      path: "paperclip_home/project_homes/editorial/shared/README.md",
      sourceIds: ["brief_research_step"],
      sectionId: "shared_read_order"
    },
    {
      id: "brief_researcher_workflow_target",
      path: "paperclip_home/project_homes/editorial/shared/workflow_packets/BRIEF_RESEARCHER_WORKFLOW.md",
      sourceIds: ["brief_research_step"],
      sectionId: "workflow_lane_contract"
    },
    {
      id: "packet_shapes_comment_shape_target",
      path: "paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_PACKET_SHAPES.md",
      sourceIds: ["comment_shape_standard"],
      sectionId: "standard_comment_shape"
    },
    {
      id: "packet_shapes_specialist_turn_shape_target",
      path: "paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_PACKET_SHAPES.md",
      sourceIds: ["specialist_turn_shape_standard"],
      sectionId: "standard_specialist_turn_shape"
    },
    {
      id: "acceptance_critic_gate_target",
      path: "paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_ACCEPTANCE_CRITERIA.md",
      sourceIds: ["editorial_acceptance_gate"],
      sectionId: "gate_what_critic_judges"
    }
  ],
  links: [
    { id: "brief_researcher_home_documents_role", kind: "documents", from: "brief_researcher_home", to: "brief_researcher" },
    { id: "role_read_first_documents_role", kind: "documents", from: "role_read_first", to: "brief_researcher" },
    { id: "role_contract_documents_role", kind: "documents", from: "role_contract", to: "brief_researcher" },
    { id: "role_contract_owned_by_role", kind: "owns", from: "brief_researcher", to: "role_contract" },
    { id: "shared_read_order_documents_step", kind: "documents", from: "shared_read_order", to: "brief_research_step" },
    { id: "workflow_surface_documents_contract", kind: "documents", from: "brief_researcher_workflow", to: "editorial_brief_contract" },
    { id: "workflow_lane_contract_documents_step", kind: "documents", from: "workflow_lane_contract", to: "brief_research_step" },
    { id: "workflow_lane_contract_owned_by_step", kind: "owns", from: "brief_research_step", to: "workflow_lane_contract" },
    { id: "standard_comment_shape_documents_artifact", kind: "documents", from: "standard_comment_shape", to: "comment_shape_standard" },
    {
      id: "standard_specialist_turn_shape_documents_artifact",
      kind: "documents",
      from: "standard_specialist_turn_shape",
      to: "specialist_turn_shape_standard"
    },
    { id: "role_reads_comment_shape", kind: "reads", from: "brief_researcher", to: "standard_comment_shape" },
    { id: "step_reads_specialist_turn_shape", kind: "reads", from: "brief_research_step", to: "standard_specialist_turn_shape" },
    {
      id: "gate_surface_documents_gate",
      kind: "documents",
      from: "acceptance_critic_gate_surface",
      to: "editorial_acceptance_gate"
    },
    {
      id: "gate_what_critic_judges_documents_gate",
      kind: "documents",
      from: "gate_what_critic_judges",
      to: "editorial_acceptance_gate"
    },
    { id: "gate_section_owned_by_gate", kind: "owns", from: "editorial_acceptance_gate", to: "gate_what_critic_judges" },
    { id: "step_grounds_simple_clear_ref", kind: "grounds", from: "brief_research_step", to: "editorial_simple_clear_ref" }
  ]
});

export default editorialVerticalSliceSeed;
