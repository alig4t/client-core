import yaml from "js-yaml";
import { readFileSync, existsSync } from "node:fs";
import { z } from "zod/v3";
import {
  fieldMetadataSchema,
  routingSchema,
  operationsSchema,
} from "../../../src/core/entity/definitionSchema";
import type { EntityMeta } from "../types/EntityTypes.js";
const field = (fieldMetadataSchema as unknown as z.AnyZodObject)
  .partial()
  .extend({ enums: z.record(z.string()).optional() })
  .strict()
  .transform((value) => {
    const { enums, ...rest } = value;
    return {
      ...rest,
      ...(enums
        ? {
            options: Object.entries(enums).map(([value, label]) => ({
              value,
              label,
            })),
          }
        : {}),
    };
  });
const metaSchema = z
  .object({
    displayName: z.string().min(1).optional(),
    displayNamePlural: z.string().min(1).optional(),
    autocompleteField: z.string().optional(),
    endpoint: z.string().startsWith("/").optional(),
    idType: z.enum(["number", "string"]).optional(),
    operations: (operationsSchema as unknown as z.ZodTypeAny).optional(),
    routing: (routingSchema as unknown as z.AnyZodObject).partial().optional(),
    fields: z.record(field).default({}),
    relationships: z.record(field).default({}),
  })
  .strict();
export class MetaParser {
  parseFile(path: string): EntityMeta | null {
    return existsSync(path) ? this.parse(readFileSync(path, "utf8")) : null;
  }
  parse(content: string): EntityMeta {
    return metaSchema.parse(yaml.load(content)) as EntityMeta;
  }
}
