import { analyzeSetupInput, formatDiagnostic, loadSetupInput } from "./shared.js";

export async function runValidateCommand(setupPath: string): Promise<number> {
  const input = await loadSetupInput(setupPath);
  const result = analyzeSetupInput(input);

  if (!result.success) {
    for (const diagnostic of result.diagnostics) {
      console.error(formatDiagnostic(diagnostic));
      console.error("");
    }
    return 1;
  }

  console.log(`VALID ${result.data.setup.setup.id}`);
  console.log(`documents=${result.data.plan.documents.length} sections=${result.data.plan.sections.length}`);
  return 0;
}
