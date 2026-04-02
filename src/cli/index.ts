#!/usr/bin/env node

import { runCompileCommand } from "./compile.js";
import { runDoctorCommand } from "./doctor.js";
import { formatUsage } from "./shared.js";
import { runValidateCommand } from "./validate.js";

async function main(argv: string[]): Promise<number> {
  const [command, setupPath, ...rest] = argv;

  if (!command || !setupPath) {
    console.error(formatUsage());
    return 1;
  }

  switch (command) {
    case "validate":
      return await runValidateCommand(setupPath);
    case "compile":
      return await runCompileCommand(setupPath, rest);
    case "doctor":
      return await runDoctorCommand(setupPath);
    default:
      console.error(formatUsage());
      return 1;
  }
}

main(process.argv.slice(2))
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  });
