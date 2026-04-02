import { defineSetup } from "paperzod";

import { artifacts } from "./artifacts.ts";
import { links } from "./links.ts";
import { references } from "./references.ts";
import { roles } from "./roles.ts";
import { surfaces, surfaceSections } from "./surfaces.ts";
import { generatedTargets } from "./targets.ts";
import { packetContracts, reviewGates, workflowSteps } from "./workflow.ts";

const coreDevSetup = defineSetup({
  id: "core_dev",
  name: "Core Dev",
  description: "The canonical non-Lessons proving setup for a different Paperclip workflow.",
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
});

export default coreDevSetup;
