import { XMLParser, XMLValidator } from "fast-xml-parser";
import { readFileSync } from "node:fs";
import { z } from "zod/v3";
import type { Entity } from "../types/EntityTypes.js";
const name = z
  .string()
  .regex(/^[A-Za-z_][A-Za-z0-9_]*$/)
  .refine(
    (value) => !["__proto__", "prototype", "constructor"].includes(value),
  );
const bool = z
  .preprocess(
    (value) => (value === "true" ? true : value === "false" ? false : value),
    z.boolean(),
  )
  .optional()
  .default(false);
const number = z
  .preprocess(
    (value) => (typeof value === "string" ? Number(value) : value),
    z.number().finite(),
  )
  .optional();
const field = z.object({
  name,
  type: z.enum([
    "STRING",
    "INTEGER",
    "LONG",
    "DOUBLE",
    "BIG_DECIMAL",
    "BOOLEAN",
    "DATE",
    "LOCAL_DATE",
    "LOCAL_DATE_TIME",
    "ENUM",
  ]),
  required: bool,
  unique: bool,
  searchable: bool,
  indexed: bool,
  maxLength: number,
  minLength: number,
  min: z.union([z.string(), z.number()]).optional(),
  max: z.union([z.string(), z.number()]).optional(),
  pattern: z.string().optional(),
  enums: z.array(z.object({ name, value: z.string() })).optional(),
});
const relationship = z.object({
  name,
  relationshipType: z.enum([
    "ONE_TO_ONE",
    "ONE_TO_MANY",
    "MANY_TO_ONE",
    "MANY_TO_MANY",
  ]),
  relatedEntityName: name,
  joinColumnName: z.string().optional(),
  joinTableName: z.string().optional(),
  required: bool,
  unique: bool,
  fetch: z.enum(["LAZY", "EAGER"]).optional(),
  mappedBy: z.string().optional(),
  coreUser: bool,
  document: bool,
});
const schema = z
  .object({
    name,
    tableName: z.string().optional(),
    generate: bool,
    fields: z.array(field),
    relationships: z.array(relationship),
  })
  .superRefine((entity, context) => {
    const names = new Set<string>();
    for (const item of [...entity.fields, ...entity.relationships]) {
      if (names.has(item.name))
        context.addIssue({
          code: "custom",
          message: "Duplicate field: " + item.name,
        });
      names.add(item.name);
    }
    for (const item of entity.fields)
      if (item.type === "ENUM" && !item.enums?.length)
        context.addIssue({
          code: "custom",
          message: "Enum values missing: " + item.name,
        });
  });
const array = (value: unknown): Record<string, unknown>[] =>
  value === undefined
    ? []
    : ((Array.isArray(value) ? value : [value]) as Record<string, unknown>[]);
export class XmlEntityParser {
  private parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    parseTagValue: false,
    parseAttributeValue: false,
    trimValues: true,
  });
  parseFile(path: string): Entity {
    return this.parse(readFileSync(path, "utf8"));
  }
  parse(content: string): Entity {
    content = content.trimStart();
    const valid = XMLValidator.validate(content);
    if (valid !== true) throw new Error("Invalid XML: " + valid.err.msg);
    const root = this.parser.parse(content).entity as
      | Record<string, unknown>
      | undefined;
    if (!root) throw new Error("Invalid XML: no entity root");
    const fields = root.fields as Record<string, unknown> | undefined,
      relationships = root.relationships as Record<string, unknown> | undefined;
    return schema.parse({
      ...root,
      fields: array(fields?.field).map((value) => ({
        ...value,
        enums: value.enums
          ? array((value.enums as Record<string, unknown>).enum).map(
              (item) => ({ ...item, value: String(item.value ?? item.name) }),
            )
          : undefined,
      })),
      relationships: array(relationships?.relationship).map((value) => ({
        ...value,
        name: value.name ?? value.relationshipName,
      })),
    });
  }
}
