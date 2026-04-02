import { describe, expect, it } from "vitest";

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
  projectDocumentSections
} from "../../src/source/index.js";

describe("document-shape helpers", () => {
  it("lower reusable workflow-owner templates into ordinary setup parts", () => {
    const workflowTemplate = defineWorkflowOwnerTemplate({
      id: "workflow_owner",
      sections: [
        { key: "goal", title: "Goal" },
        { key: "handoffRules", title: "Handoff Rules" },
        { key: "sendBackRules", title: "Send Back Rules", parentKey: "handoffRules" }
      ] as const
    });

    const part = workflowTemplate.document({
      surfaceId: "workflow_doc",
      runtimePath: "generated/WORKFLOW.md",
      workflowStepId: "draft_issue",
      title: "Editorial Workflow",
      sections: {
        goal: {
          body: [{ kind: "paragraph", text: "Move the issue from draft to publish in one fixed order." }]
        },
        sendBackRules: {
          documentsTo: "review_draft",
          body: [{ kind: "unordered_list", items: ["Send the draft back with clear notes."] }]
        }
      }
    });

    expect(part).toEqual({
      surfaces: [
        {
          id: "workflow_doc",
          surfaceClass: "workflow_owner",
          runtimePath: "generated/WORKFLOW.md",
          title: "Editorial Workflow"
        }
      ],
      surfaceSections: [
        {
          id: "workflow_doc_goal",
          surfaceId: "workflow_doc",
          stableSlug: "goal",
          title: "Goal",
          body: [{ kind: "paragraph", text: "Move the issue from draft to publish in one fixed order." }]
        },
        {
          id: "workflow_doc_handoff_rules",
          surfaceId: "workflow_doc",
          stableSlug: "handoff-rules",
          title: "Handoff Rules"
        },
        {
          id: "workflow_doc_send_back_rules",
          surfaceId: "workflow_doc",
          stableSlug: "send-back-rules",
          title: "Send Back Rules",
          parentSectionId: "workflow_doc_handoff_rules",
          body: [{ kind: "unordered_list", items: ["Send the draft back with clear notes."] }]
        }
      ],
      generatedTargets: [
        {
          id: "workflow_doc_goal_target",
          path: "generated/WORKFLOW.md",
          sourceIds: ["workflow_doc_goal", "draft_issue"],
          sectionId: "workflow_doc_goal"
        },
        {
          id: "workflow_doc_handoff_rules_target",
          path: "generated/WORKFLOW.md",
          sourceIds: ["workflow_doc_handoff_rules", "draft_issue"],
          sectionId: "workflow_doc_handoff_rules"
        },
        {
          id: "workflow_doc_send_back_rules_target",
          path: "generated/WORKFLOW.md",
          sourceIds: ["workflow_doc_send_back_rules", "review_draft"],
          sectionId: "workflow_doc_send_back_rules"
        }
      ],
      links: [
        { id: "workflow_doc_documents_draft_issue", kind: "documents", from: "workflow_doc", to: "draft_issue" },
        { id: "workflow_doc_goal_documents_draft_issue", kind: "documents", from: "workflow_doc_goal", to: "draft_issue" },
        {
          id: "workflow_doc_handoff_rules_documents_draft_issue",
          kind: "documents",
          from: "workflow_doc_handoff_rules",
          to: "draft_issue"
        },
        {
          id: "workflow_doc_send_back_rules_documents_review_draft",
          kind: "documents",
          from: "workflow_doc_send_back_rules",
          to: "review_draft"
        }
      ]
    });
  });

  it("supports the remaining proving-setup surface families", () => {
    const projectHomeRoot = defineProjectHomeRootTemplate({
      id: "project_home",
      sections: [{ key: "map", title: "Map", id: "project_home_map" }] as const
    }).document({
      surfaceId: "project_home_root",
      runtimePath: "generated/README.md",
      sections: {
        map: {
          documentsTo: "step_1"
        }
      }
    });

    const sharedEntrypoint = defineSharedEntrypointTemplate({
      id: "shared_entrypoint",
      sections: [{ key: "readOrder", title: "Read Order" }] as const
    }).document({
      surfaceId: "shared_readme",
      runtimePath: "generated/shared/README.md",
      sections: {
        readOrder: {
          documentsTo: "step_1"
        }
      }
    });

    const packetWorkflow = definePacketWorkflowTemplate({
      id: "packet_workflow",
      sections: [{ key: "laneContract", title: "Lane Contract" }] as const
    }).document({
      surfaceId: "packet_workflow",
      runtimePath: "generated/workflows/PACKET.md",
      packetContractId: "packet_contract",
      workflowStepId: "step_1"
    });

    const gate = defineGateTemplate({
      id: "gate",
      sections: [{ key: "criteria", title: "Criteria" }] as const
    }).document({
      surfaceId: "review_gate_surface",
      runtimePath: "generated/gates/REVIEW.md",
      reviewGateId: "review_gate"
    });

    const technicalReference = defineTechnicalReferenceTemplate({
      id: "technical_reference",
      sections: [{ key: "reference", title: "Reference" }] as const
    }).document({
      surfaceId: "technical_reference_surface",
      runtimePath: "generated/references/KB.md",
      referenceId: "kb_reference"
    });

    const howTo = defineHowToTemplate({
      id: "how_to",
      sections: [{ key: "procedure", title: "Procedure" }] as const
    }).document({
      surfaceId: "how_to_surface",
      runtimePath: "generated/runbooks/PROCEDURE.md",
      referenceId: "procedure_reference"
    });

    const coordination = defineCoordinationTemplate({
      id: "coordination",
      sections: [{ key: "bootstrap", title: "Bootstrap" }] as const
    }).document({
      surfaceId: "coordination_surface",
      runtimePath: "generated/coordination/BOOTSTRAP.md",
      referenceId: "bootstrap_reference"
    });

    expect(projectHomeRoot.surfaces?.[0]?.surfaceClass).toBe("project_home_root");
    expect(projectHomeRoot.surfaceSections?.[0]?.id).toBe("project_home_map");
    expect(projectHomeRoot.links).toEqual([
      { id: "project_home_map_documents_step_1", kind: "documents", from: "project_home_map", to: "step_1" }
    ]);

    expect(sharedEntrypoint.surfaces?.[0]?.surfaceClass).toBe("shared_entrypoint");
    expect(sharedEntrypoint.links).toEqual([
      { id: "shared_readme_read_order_documents_step_1", kind: "documents", from: "shared_readme_read_order", to: "step_1" }
    ]);

    expect(packetWorkflow.links).toEqual([
      { id: "packet_workflow_documents_packet_contract", kind: "documents", from: "packet_workflow", to: "packet_contract" },
      {
        id: "packet_workflow_lane_contract_documents_step_1",
        kind: "documents",
        from: "packet_workflow_lane_contract",
        to: "step_1"
      }
    ]);

    expect(gate.links).toEqual([
      { id: "review_gate_surface_documents_review_gate", kind: "documents", from: "review_gate_surface", to: "review_gate" },
      {
        id: "review_gate_surface_criteria_documents_review_gate",
        kind: "documents",
        from: "review_gate_surface_criteria",
        to: "review_gate"
      }
    ]);

    expect(technicalReference.links).toEqual([
      {
        id: "technical_reference_surface_documents_kb_reference",
        kind: "documents",
        from: "technical_reference_surface",
        to: "kb_reference"
      },
      {
        id: "technical_reference_surface_reference_documents_kb_reference",
        kind: "documents",
        from: "technical_reference_surface_reference",
        to: "kb_reference"
      }
    ]);

    expect(howTo.links).toEqual([
      { id: "how_to_surface_documents_procedure_reference", kind: "documents", from: "how_to_surface", to: "procedure_reference" },
      {
        id: "how_to_surface_procedure_documents_procedure_reference",
        kind: "documents",
        from: "how_to_surface_procedure",
        to: "procedure_reference"
      }
    ]);

    expect(coordination.links).toEqual([
      {
        id: "coordination_surface_documents_bootstrap_reference",
        kind: "documents",
        from: "coordination_surface",
        to: "bootstrap_reference"
      },
      {
        id: "coordination_surface_bootstrap_documents_bootstrap_reference",
        kind: "documents",
        from: "coordination_surface_bootstrap",
        to: "bootstrap_reference"
      }
    ]);
  });

  it("lets setup authors disable default surface links while keeping section defaults", () => {
    const standardTemplate = defineStandardTemplate({
      id: "standard",
      sections: [{ key: "qualityBar", id: "quality_bar_section", title: "Quality Bar" }] as const
    });

    const part = standardTemplate.document({
      surfaceId: "quality_bar_standard",
      runtimePath: "generated/QUALITY.md",
      artifactId: "quality_bar_artifact",
      surfaceDocumentsTo: []
    });

    expect(part.links).toEqual([
      {
        id: "quality_bar_section_documents_quality_bar_artifact",
        kind: "documents",
        from: "quality_bar_section",
        to: "quality_bar_artifact"
      }
    ]);
    expect(part.generatedTargets).toEqual([
      {
        id: "quality_bar_section_target",
        path: "generated/QUALITY.md",
        sourceIds: ["quality_bar_section", "quality_bar_artifact"],
        sectionId: "quality_bar_section"
      }
    ]);
  });

  it("projects one shared section catalog into many destination documents", () => {
    const roleHomeTemplate = defineRoleHomeTemplate({
      id: "role_home",
      sections: [
        { key: "readFirst", title: "Read First" },
        { key: "roleContract", title: "Role Contract" }
      ] as const
    });

    const [writerHome, criticHome] = projectDocumentSections(roleHomeTemplate, {
      sections: {
        readFirst: {
          body: [{ kind: "paragraph", text: "Read the shared workflow first." }],
          sourceIds: ["shared_workflow"]
        }
      },
      destinations: [
        {
          surfaceId: "writer_home",
          runtimePath: "generated/writer/AGENTS.md",
          roleId: "writer",
          sections: {
            readFirst: {
              body: [{ kind: "paragraph", text: "Read the shared workflow first, then the current brief." }],
              sourceIds: ["writer_brief"]
            }
          }
        },
        {
          surfaceId: "critic_home",
          runtimePath: "generated/critic/AGENTS.md",
          roleId: "critic",
          sections: {
            roleContract: {
              documentsTo: "review_gate"
            }
          }
        }
      ]
    });

    expect(writerHome).toEqual({
      surfaces: [
        {
          id: "writer_home",
          surfaceClass: "role_home",
          runtimePath: "generated/writer/AGENTS.md"
        }
      ],
      surfaceSections: [
        {
          id: "writer_home_read_first",
          surfaceId: "writer_home",
          stableSlug: "read-first",
          title: "Read First",
          body: [{ kind: "paragraph", text: "Read the shared workflow first, then the current brief." }]
        },
        {
          id: "writer_home_role_contract",
          surfaceId: "writer_home",
          stableSlug: "role-contract",
          title: "Role Contract"
        }
      ],
      generatedTargets: [
        {
          id: "writer_home_read_first_target",
          path: "generated/writer/AGENTS.md",
          sourceIds: ["writer_home_read_first", "writer", "shared_workflow", "writer_brief"],
          sectionId: "writer_home_read_first"
        },
        {
          id: "writer_home_role_contract_target",
          path: "generated/writer/AGENTS.md",
          sourceIds: ["writer_home_role_contract", "writer"],
          sectionId: "writer_home_role_contract"
        }
      ],
      links: [
        { id: "writer_home_documents_writer", kind: "documents", from: "writer_home", to: "writer" },
        { id: "writer_home_read_first_documents_writer", kind: "documents", from: "writer_home_read_first", to: "writer" },
        {
          id: "writer_home_role_contract_documents_writer",
          kind: "documents",
          from: "writer_home_role_contract",
          to: "writer"
        }
      ]
    });

    expect(criticHome).toEqual({
      surfaces: [
        {
          id: "critic_home",
          surfaceClass: "role_home",
          runtimePath: "generated/critic/AGENTS.md"
        }
      ],
      surfaceSections: [
        {
          id: "critic_home_read_first",
          surfaceId: "critic_home",
          stableSlug: "read-first",
          title: "Read First",
          body: [{ kind: "paragraph", text: "Read the shared workflow first." }]
        },
        {
          id: "critic_home_role_contract",
          surfaceId: "critic_home",
          stableSlug: "role-contract",
          title: "Role Contract"
        }
      ],
      generatedTargets: [
        {
          id: "critic_home_read_first_target",
          path: "generated/critic/AGENTS.md",
          sourceIds: ["critic_home_read_first", "critic", "shared_workflow"],
          sectionId: "critic_home_read_first"
        },
        {
          id: "critic_home_role_contract_target",
          path: "generated/critic/AGENTS.md",
          sourceIds: ["critic_home_role_contract", "review_gate"],
          sectionId: "critic_home_role_contract"
        }
      ],
      links: [
        { id: "critic_home_documents_critic", kind: "documents", from: "critic_home", to: "critic" },
        { id: "critic_home_read_first_documents_critic", kind: "documents", from: "critic_home_read_first", to: "critic" },
        {
          id: "critic_home_role_contract_documents_review_gate",
          kind: "documents",
          from: "critic_home_role_contract",
          to: "review_gate"
        }
      ]
    });
  });
});
