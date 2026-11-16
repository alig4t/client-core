import { fieldMetadataSchema } from "../../src/core/entity/definitionSchema";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { z } from "zod/v3";
import type { GeneratorConfig } from "./types/EntityTypes.js";
const schema = z
  .object({
    paths: z
      .object({
        entityDefinitions: z.string(),
        outputBase: z.string(),
        coreComponents: z.string(),
        menuConfig: z.string(),
        routerOutput: z.string().optional(),
        projectRoot: z.string().optional(),
      })
      .strict(),
    generation: z
      .object({
        formatWithPrettier: z.boolean(),
        generateRoutes: z.boolean(),
        generatePermissions: z.boolean(),
        overwriteExisting: z.boolean(),
        typecheck: z.boolean().default(true),
      })
      .strict(),
    coreEntities: z.record(
      z
        .object({
          isCore: z.boolean(),
          importPath: z.string().optional(),
          servicePath: z.string().optional(),
          skipImport: z.boolean().optional(),
          endpoint: z.string().optional(),
          displayField: z.string().optional(),
        })
        .strict(),
    ),
    templates: z.record(z.string()),
    fieldTypeMapping: z.record(z.enum(["string", "number", "boolean"])),
    formTypeMapping: z.record(z.string()),
  })
  .strict()
  .superRefine((config, context) => {
    const fixed: Record<string, string> = {
      STRING: "string",
      INTEGER: "number",
      DOUBLE: "number",
      BOOLEAN: "boolean",
      DATE: "string",
      LOCAL_DATE: "string",
      LOCAL_DATE_TIME: "string",
      ENUM: "string",
    };
    for (const type of [...Object.keys(fixed), "LONG", "BIG_DECIMAL"]) {
      const mapped = config.fieldTypeMapping[type];
      if (
        !mapped ||
        (fixed[type]
          ? mapped !== fixed[type]
          : !["string", "number"].includes(mapped))
      )
        context.addIssue({
          code: "custom",
          path: ["fieldTypeMapping", type],
          message: "Incompatible data type mapping",
        });
      if (
        !fieldMetadataSchema.safeParse({
          label: "Field",
          type: config.formTypeMapping[type],
        }).success
      )
        context.addIssue({
          code: "custom",
          path: ["formTypeMapping", type],
          message: "Missing or unsupported widget type",
        });
    }
  });
export function loadConfig(
  configPath = resolve(process.cwd(), "config.json"),
): GeneratorConfig {
  const path = resolve(configPath);
  return {
    ...schema.parse(JSON.parse(readFileSync(path, "utf8"))),
    baseDir: dirname(path),
  } as GeneratorConfig;
}
export function isCoreEntity(name: string, config: GeneratorConfig) {
  return config.coreEntities[name]?.isCore === true;
}
export function getCoreEntityInfo(name: string, config: GeneratorConfig) {
  return config.coreEntities[name];
}
export function resolvePathFromGenerator(
  path: string,
  config: GeneratorConfig,
) {
  return resolve(config.baseDir ?? process.cwd(), path);
}
