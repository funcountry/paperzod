import { defineSetup, defineSetupModule } from "paperzod";

import { artifacts } from "./artifacts.ts";
import { links } from "./links.ts";
import { references } from "./references.ts";
import { roles } from "./roles.ts";
import { surfaces, surfaceSections } from "./surfaces.ts";
import { generatedTargets } from "./targets.ts";
import { packetContracts, reviewGates, workflowSteps } from "./workflow.ts";

const editorialSetup = defineSetupModule({
  setup: defineSetup({
    id: "editorial",
    name: "Editorial",
    description: "The canonical public editorial proving setup for the full doctrine requirement set.",
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
    { kind: "root", path: "paperclip_home/project_homes/editorial" },
    { kind: "file", path: "paperclip_home/agents/brief_researcher/AGENTS.md" },
    { kind: "file", path: "paperclip_home/agents/story_architect/AGENTS.md" }
  ]
});

export default editorialSetup;
