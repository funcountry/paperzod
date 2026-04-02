import { compileAndEmitSetup } from "../index.js";
import { createAdapterFromArgs, formatDiagnostic, hasFlag, loadSetupInput } from "./shared.js";

export async function runCompileCommand(setupPath: string, args: string[]): Promise<number> {
  const input = await loadSetupInput(setupPath);
  const adapter = createAdapterFromArgs(args);
  const write = hasFlag(args, "--write");
  const compiled = await compileAndEmitSetup(input, adapter, { write });

  if (!compiled.success) {
    for (const diagnostic of compiled.diagnostics) {
      console.error(formatDiagnostic(diagnostic));
      console.error("");
    }
    return 1;
  }

  console.log(`COMPILED ${compiled.data.setup.setup.id}`);
  console.log(`mode=${write ? "write" : "dry-run"}`);
  for (const file of compiled.data.emit.files) {
    console.log(`${file.status} ${file.documentId} ${file.path}`);
  }

  return 0;
}
