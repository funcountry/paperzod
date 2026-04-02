import {
  defineGateTemplate,
  defineHowToTemplate,
  defineRoleHomeTemplate,
  defineSharedEntrypointTemplate,
  defineWorkflowOwnerTemplate,
  type SetupPart,
  type SurfaceInput,
  type SurfaceSectionInput
} from "paperzod";

const roleHomeTemplate = defineRoleHomeTemplate({
  id: "release_ops_role_home",
  sections: [
    { key: "readFirst", id: "coordinator_read_first", stableSlug: "read-first", title: "Read First" },
    { key: "roleContract", id: "coordinator_role_contract", stableSlug: "role-contract", title: "Role Contract" }
  ] as const
});

const sharedEntrypointTemplate = defineSharedEntrypointTemplate({
  id: "release_ops_shared_entrypoint",
  sections: [{ key: "releaseOrder", id: "shared_release_order", stableSlug: "read-order", title: "Release Order" }] as const
});

const workflowOwnerTemplate = defineWorkflowOwnerTemplate({
  id: "release_ops_workflow_owner",
  sections: [{ key: "releaseShape", id: "workflow_release_shape", stableSlug: "release-shape", title: "Release Shape" }] as const
});

const gateTemplate = defineGateTemplate({
  id: "release_ops_release_gate",
  sections: [{ key: "finalChecks", id: "gate_final_checks", stableSlug: "final-checks", title: "Final Checks" }] as const
});

const howToTemplate = defineHowToTemplate({
  id: "release_ops_release_protocol",
  sections: [{ key: "protocol", id: "how_to_protocol", stableSlug: "protocol", title: "Protocol" }] as const
});

export const surfaceDocumentParts = [
  roleHomeTemplate.document({
    surfaceId: "coordinator_home",
    runtimePath: "paperclip_home/agents/coordinator/AGENTS.md",
    roleId: "coordinator"
  }),
  sharedEntrypointTemplate.document({
    surfaceId: "release_ops_readme",
    runtimePath: "paperclip_home/project_homes/release_ops/shared/README.md",
    title: "Release Ops Shared Doctrine",
    intro: [
      { kind: "paragraph", text: "This folder is the shared doctrine home for the Release Ops setup." },
      { kind: "paragraph", text: "Start here, then open the one surface that owns your current release question." }
    ],
    sections: {
      releaseOrder: {
        documentsTo: "release_readiness_step"
      }
    }
  }),
  workflowOwnerTemplate.document({
    surfaceId: "release_workflow_surface",
    runtimePath: "paperclip_home/project_homes/release_ops/shared/workflows/AUTHORITATIVE_RELEASE_OPS_WORKFLOW.md",
    title: "Release Ops Workflow",
    intro: [
      { kind: "paragraph", text: "This file owns the top-level Release Ops workflow." },
      { kind: "paragraph", text: "Use it for release order, owner routing, and final handoff expectations." }
    ],
    workflowStepId: "release_readiness_step",
    surfaceDocumentsTo: []
  }),
  gateTemplate.document({
    surfaceId: "release_gate_surface",
    runtimePath: "paperclip_home/project_homes/release_ops/shared/gates/RELEASE_READINESS_GATE.md",
    reviewGateId: "release_readiness_gate",
    title: "Release Readiness Gate"
  }),
  howToTemplate.document({
    surfaceId: "release_how_to_surface",
    runtimePath: "paperclip_home/project_homes/release_ops/shared/runbooks/RELEASE_PROTOCOL.md",
    referenceId: "release_protocol_reference",
    title: "Release Protocol"
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
