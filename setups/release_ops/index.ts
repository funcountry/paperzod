import { defineSetup, defineSetupModule } from "paperzod";

import { artifacts } from "./artifacts.ts";
import { links } from "./links.ts";
import { references } from "./references.ts";
import { roles } from "./roles.ts";
import { surfaces, surfaceSections } from "./surfaces.ts";
import { generatedTargets } from "./targets.ts";
import { packetContracts, reviewGates, workflowSteps } from "./workflow.ts";

const releaseOpsSetup = defineSetupModule({
  setup: defineSetup({
    id: "release_ops",
    name: "Release Ops",
    description: "The canonical non-editorial proving setup for a different Paperclip workflow.",
    roles,
    workflowSteps,
    reviewGates,
    packetContracts,
    artifacts,
    surfaces,
    surfaceSections,
    references,
    generatedTargets,
    links
  }),
  outputOwnership: [
    { kind: "root", path: "paperclip_home/project_homes/release_ops" },
    { kind: "file", path: "paperclip_home/agents/coordinator/AGENTS.md" }
  ]
});

export default releaseOpsSetup;
