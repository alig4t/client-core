#!/usr/bin/env node
import { Command } from "commander";
import { loadConfig } from "./config.js";
import { generate } from "./generate.js";
const program = new Command()
  .name("frontend-generator")
  .description("Generate typed entity modules and register them safely")
  .version("2.0.0");
interface Options {
  config: string;
  dryRun?: boolean;
  check?: boolean;
}
async function run(entity: string | undefined, options: Options) {
  try {
    const result = await generate(loadConfig(options.config), entity, options);
    console.log(JSON.stringify(result, null, 2));
    if (options.check && result.changed.length) process.exitCode = 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
for (const name of ["generate", "generate:all"]) {
  const command = program
    .command(name)
    .option("-c, --config <path>", "Generator configuration", "./config.json")
    .option("--dry-run", "Validate and show changed paths without writing")
    .option("--check", "Fail if generation would change any file");
  if (name === "generate")
    command
      .argument("<entity>")
      .action((entity: string, options: Options) => run(entity, options));
  else command.action((options: Options) => run(undefined, options));
}
await program.parseAsync();
