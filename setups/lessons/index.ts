import { defineSetup } from "paperzod";

import { artifacts } from "./artifacts.ts";
import { links } from "./links.ts";
import { references } from "./references.ts";
import { roles } from "./roles.ts";
import { surfaces, surfaceSections } from "./surfaces.ts";
import { generatedTargets } from "./targets.ts";
import { packetContracts, reviewGates, workflowSteps } from "./workflow.ts";

const lessonsSetup = defineSetup({
  id: "lessons",
  name: "Lessons",
  description: "The canonical Lessons proving setup for the full doctrine requirement set.",
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

export default lessonsSetup;
