import {
  composeSetup,
  defineRoleHomeTemplate,
  defineSetup,
  defineStandardTemplate,
  defineWorkflowOwnerTemplate,
  loadFragments
} from "../../../src/index.js";

import type { AuthoredContentBlock } from "../../../src/core/defs.js";

function paragraph(text: string): AuthoredContentBlock[] {
  return [{ kind: "paragraph", text }];
}

function bullets(...items: string[]): AuthoredContentBlock[] {
  return [{ kind: "unordered_list", items }];
}

const roleHomeTemplate = defineRoleHomeTemplate({
  id: "role_home",
  sections: [
    { key: "readFirst", title: "Read First" },
    { key: "yourJob", title: "Your Job" },
    { key: "inputs", title: "Inputs" },
    { key: "outputs", title: "Outputs" },
    { key: "stopLine", title: "Stop Line" }
  ] as const
});

const workflowOwnerTemplate = defineWorkflowOwnerTemplate({
  id: "workflow_owner",
  sections: [
    { key: "goal", title: "Goal" },
    { key: "stepOrder", title: "Step Order" },
    { key: "handoffRules", title: "Handoff Rules" },
    { key: "sendBackRules", title: "Send Back Rules" }
  ] as const
});

const standardTemplate = defineStandardTemplate({
  id: "draft_quality",
  sections: [
    { key: "whatGoodLooksLike", title: "What Good Looks Like" },
    { key: "sendBackWhen", title: "Send Back When" },
    { key: "examples", title: "Examples" }
  ] as const
});

const workflowFragments = loadFragments(new URL("../fragments/editorial/workflow/", import.meta.url), {
  goal: "goal.md",
  handoffRules: "handoff_rules.md",
  sendBackRules: "send_back_rules.md"
});

const editorialExample = composeSetup(
  defineSetup({
    id: "editorial_example",
    name: "Editorial Example",
    description: "A small proving setup for reusable document shapes and fragment-backed prose.",
    roles: [
      { id: "writer", name: "Writer", purpose: "Write the first clean draft." },
      { id: "critic", name: "Critic", purpose: "Review the draft and decide whether it can move forward." },
      { id: "publisher", name: "Publisher", purpose: "Publish only after critic review passes." }
    ],
    workflowSteps: [
      {
        id: "draft_issue",
        roleId: "writer",
        purpose: "Draft the issue from the current brief.",
        requiredInputIds: ["brief_packet"],
        requiredOutputIds: ["draft_packet"],
        stopLine: "Stop when the draft is ready for critic review.",
        nextStepId: "review_draft"
      },
      {
        id: "review_draft",
        roleId: "critic",
        purpose: "Review the draft against the shared quality standard.",
        requiredInputIds: ["draft_packet"],
        requiredOutputIds: ["review_notes"],
        stopLine: "Stop when the draft passes or goes back with clear notes.",
        nextStepId: "publish_issue"
      },
      {
        id: "publish_issue",
        roleId: "publisher",
        purpose: "Publish the issue after critic review passes.",
        requiredInputIds: ["draft_packet", "review_notes"],
        requiredOutputIds: ["published_issue"],
        stopLine: "Stop when the issue is published.",
        nextGateId: "publish_gate"
      }
    ],
    reviewGates: [
      {
        id: "publish_gate",
        name: "Publish Gate",
        purpose: "Confirm the final issue is ready to ship.",
        checkIds: ["published_issue"]
      }
    ],
    artifacts: [
      { id: "brief_packet", name: "BRIEF.md", artifactClass: "required", runtimePath: "generated/editorial/packets/BRIEF.md" },
      { id: "draft_packet", name: "DRAFT.md", artifactClass: "required", runtimePath: "generated/editorial/packets/DRAFT.md" },
      {
        id: "review_notes",
        name: "REVIEW_NOTES.md",
        artifactClass: "required",
        runtimePath: "generated/editorial/packets/REVIEW_NOTES.md"
      },
      {
        id: "published_issue",
        name: "PUBLISHED_ISSUE.md",
        artifactClass: "required",
        runtimePath: "generated/editorial/packets/PUBLISHED_ISSUE.md"
      }
    ],
    links: [
      { id: "writer_reads_workflow", kind: "reads", from: "writer", to: "editorial_workflow" },
      { id: "writer_reads_standard", kind: "reads", from: "writer", to: "draft_quality_standard" },
      { id: "critic_reads_workflow", kind: "reads", from: "critic", to: "editorial_workflow" },
      { id: "critic_reads_standard", kind: "reads", from: "critic", to: "draft_quality_standard" },
      { id: "publisher_reads_workflow", kind: "reads", from: "publisher", to: "editorial_workflow" }
    ]
  }),
  roleHomeTemplate.document({
    surfaceId: "writer_home",
    runtimePath: "generated/editorial/roles/writer/AGENTS.md",
    roleId: "writer",
    sections: {
      readFirst: {
        body: paragraph("Read the shared workflow, then the draft-quality standard, then the current brief.")
      },
      yourJob: {
        body: paragraph("Write the draft for the current issue. Do not publish it yourself.")
      },
      inputs: {
        body: bullets("Shared workflow", "Draft Quality Standard", "BRIEF.md")
      },
      outputs: {
        body: bullets("DRAFT.md")
      },
      stopLine: {
        body: paragraph("Stop when the draft is ready for critic review. Send the issue to Critic next.")
      }
    }
  }),
  roleHomeTemplate.document({
    surfaceId: "critic_home",
    runtimePath: "generated/editorial/roles/critic/AGENTS.md",
    roleId: "critic",
    sections: {
      readFirst: {
        body: paragraph("Read the shared workflow, the draft-quality standard, and the current draft before you review.")
      },
      yourJob: {
        body: paragraph("Review the draft, decide whether it passes, and explain any send-back clearly.")
      },
      inputs: {
        body: bullets("Shared workflow", "Draft Quality Standard", "DRAFT.md")
      },
      outputs: {
        body: bullets("REVIEW_NOTES.md")
      },
      stopLine: {
        body: paragraph("Stop when the draft either passes or goes back with clear notes.")
      }
    }
  }),
  roleHomeTemplate.document({
    surfaceId: "publisher_home",
    runtimePath: "generated/editorial/roles/publisher/AGENTS.md",
    roleId: "publisher",
    sections: {
      readFirst: {
        body: paragraph("Read the shared workflow, then confirm the draft and review notes are both present.")
      },
      yourJob: {
        body: paragraph("Publish the issue only after critic review passes.")
      },
      inputs: {
        body: bullets("Shared workflow", "DRAFT.md", "REVIEW_NOTES.md")
      },
      outputs: {
        body: bullets("PUBLISHED_ISSUE.md")
      },
      stopLine: {
        body: paragraph("Stop when the issue is published and the final packet is ready for handoff.")
      }
    }
  }),
  workflowOwnerTemplate.document({
    surfaceId: "editorial_workflow",
    runtimePath: "generated/editorial/shared/AUTHORITATIVE_WORKFLOW.md",
    workflowStepId: "draft_issue",
    title: "Authoritative Workflow",
    sections: {
      goal: {
        body: workflowFragments.goal
      },
      stepOrder: {
        documentsTo: ["draft_issue", "review_draft", "publish_issue"],
        body: [
          {
            kind: "ordered_list",
            items: [
              "Writer drafts the issue.",
              "Critic reviews the draft.",
              "Publisher publishes after critic review passes."
            ]
          }
        ]
      },
      handoffRules: {
        documentsTo: ["draft_issue", "review_draft"],
        body: workflowFragments.handoffRules
      },
      sendBackRules: {
        documentsTo: "review_draft",
        body: workflowFragments.sendBackRules
      }
    }
  }),
  standardTemplate.document({
    surfaceId: "draft_quality_standard",
    runtimePath: "generated/editorial/standards/DRAFT_QUALITY.md",
    artifactId: "draft_packet",
    title: "Draft Quality Standard",
    sections: {
      whatGoodLooksLike: {
        body: bullets("The draft matches the brief.", "Claims are grounded.", "The wording is clear.")
      },
      sendBackWhen: {
        body: bullets(
          "The draft changes the meaning of the brief.",
          "The draft makes unsupported claims.",
          "The draft is incomplete."
        )
      },
      examples: {
        body: paragraph("Use the shared workflow notes and review comments as the working examples for this small proving setup.")
      }
    }
  })
);

export default editorialExample;
