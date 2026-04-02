import type { RoleInput } from "paperzod";

export const roles = [
  {
    id: "section_dossier_engineer",
    name: "Section Dossier Engineer",
    purpose: "Define the section burden and produce the section dossier contract.",
    boundaries: ["Do not choose final lesson copy.", "Do not silently collapse runtime bundle drift."]
  },
  {
    id: "lessons_lesson_architect",
    name: "Lessons Lesson Architect",
    purpose: "Turn the section burden into a concrete lesson plan for one lesson slot.",
    boundaries: ["Do not change locked upstream concepts.", "Do not invent playables outside the accepted strategy."]
  }
] satisfies RoleInput[];
