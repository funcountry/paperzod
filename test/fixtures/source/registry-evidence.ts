import { defineSetup } from "../../../src/source/index.js";

const registryEvidenceSeed = defineSetup({
  id: "registry_evidence_render",
  name: "Registry Evidence Render",
  registries: [
    {
      id: "publish_result",
      name: "Publish Result",
      entries: [
        { id: "approved", label: "Approved" },
        { id: "revise", label: "Revise" }
      ]
    }
  ],
  artifacts: [
    {
      id: "authority_note",
      name: "Authority Note",
      artifactClass: "required",
      runtimePath: "generated/AUTHORITY_NOTE.md",
      evidence: {
        requiredArtifactIds: ["review_receipt"],
        requiredClaims: [
          {
            id: "publish_decision",
            label: "Publish decision",
            description: "Record the final release call before work moves on.",
            allowedValue: {
              registryId: "publish_result",
              entryId: "approved"
            }
          }
        ]
      }
    },
    {
      id: "review_receipt",
      name: "Review Receipt",
      artifactClass: "support"
    }
  ],
  surfaces: [
    {
      id: "shared_evidence_surface",
      surfaceClass: "shared_entrypoint",
      runtimePath: "paperclip_home/project_homes/evidence_registry/shared/README.md",
      title: "Evidence Registry Fixture"
    }
  ],
  surfaceSections: [
    {
      id: "evidence_contract",
      surfaceId: "shared_evidence_surface",
      stableSlug: "evidence-contract",
      title: "Evidence Contract"
    }
  ],
  generatedTargets: [
    {
      id: "evidence_target",
      path: "paperclip_home/project_homes/evidence_registry/shared/README.md",
      sourceIds: ["authority_note"],
      sectionId: "evidence_contract"
    }
  ],
  links: [{ id: "documents_authority_note", kind: "documents", from: "evidence_contract", to: "authority_note" }]
});

export default registryEvidenceSeed;
