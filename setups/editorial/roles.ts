import type { RoleInput } from "paperzod";

export const roles = [
  {
    id: "brief_researcher",
    name: "Brief Researcher",
    purpose: "Define the editorial brief and produce the source packet the next lane can trust.",
    boundaries: ["Do not choose final publication copy.", "Do not silently collapse runtime bundle drift."]
  },
  {
    id: "story_architect",
    name: "Story Architect",
    purpose: "Turn the editorial brief into a concrete story outline for one publishable slot.",
    boundaries: ["Do not change locked upstream concepts.", "Do not invent downstream assets outside the accepted scope."]
  }
] satisfies RoleInput[];
