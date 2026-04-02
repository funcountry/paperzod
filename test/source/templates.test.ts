import { describe, expect, it } from "vitest";

import { defineWorkflowOwnerTemplate } from "../../src/source/index.js";

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
});
