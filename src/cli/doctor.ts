import { analyzeSetupInput, extractSetupId, formatDoctorReport, loadSetupInput } from "./shared.js";

export async function runDoctorCommand(setupPath: string): Promise<number> {
  const input = await loadSetupInput(setupPath);
  const rendered = analyzeSetupInput(input);
  const setupId = extractSetupId(input);

  if (!rendered.success) {
    console.log(formatDoctorReport(setupId, rendered.diagnostics));
    return 1;
  }

  console.log(`Doctor report for ${setupId}`);
  console.log("");
  console.log("No diagnostics.");
  return 0;
}
