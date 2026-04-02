import type { ArtifactInput } from "paperzod";

export const artifacts = [
  {
    id: "release_readiness_packet",
    name: "RELEASE_READINESS.md",
    artifactClass: "required",
    runtimePath: "_authoring/RELEASE_READINESS.md"
  },
  {
    id: "release_protocol_standard",
    name: "Release Protocol Standard",
    artifactClass: "reference"
  }
] satisfies ArtifactInput[];
