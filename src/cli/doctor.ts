import { analyzeSetupInput, formatDoctorReport, loadSetupInput } from "./shared.js";

export async function runDoctorCommand(setupPath: string): Promise<number> {
  const input = await loadSetupInput(setupPath);
  const rendered = analyzeSetupInput(input);
  const setupId =
    typeof input === "object" && input !== null && "id" in input && typeof input.id === "string" ? input.id : "unknown_setup";

  if (!rendered.success) {
    console.log(formatDoctorReport(setupId, rendered.diagnostics));
    return 1;
  }

  console.log(`Doctor report for ${setupId}`);
  console.log("");
  console.log("No diagnostics.");
  return 0;
}
