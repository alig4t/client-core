import { z } from "zod/v3";
import type { FormFieldMetadata } from "../forms/FieldFormTypes";
import type { EntityDefinition, EntityDefinitionOverrides } from "./types";
const condition = z
  .object({
    field: z.string().min(1),
    operator: z.enum(["eq", "ne", "in", "truthy"]).optional(),
    value: z.unknown().optional(),
  })
  .strict();
const identifier = z
  .string()
  .regex(/^[A-Za-z_][A-Za-z0-9_]*$/)
  .refine(
    (value) => !["__proto__", "constructor", "prototype"].includes(value),
  );
const path = z
  .string()
  .startsWith("/")
  .refine(
    (value) => !value.includes("..") && !value.includes("?"),
    "Path must be absolute and cannot contain traversal or query parameters",
  );
export const fieldMetadataSchema = z
  .object({
    label: z.string().min(1),
    type: z.enum([
      "text",
      "email",
      "password",
      "number",
      "long",
      "double",
      "bigDecimal",
      "bigDecimalField",
      "date",
      "datetime-local",
      "instant",
      "textarea",
      "select",
      "checkbox",
      "boolean",
      "autocomplete",
      "hidden",
      "File",
      "object",
      "array",
    ]),
    dataType: z
      .enum([
        "string",
        "integer",
        "long",
        "double",
        "decimal",
        "boolean",
        "date",
        "datetime",
        "instant",
        "enum",
        "reference",
        "file",
        "object",
        "array",
      ])
      .optional(),
    widget: z.string().optional(),
    readPermission: z.string().optional(),
    writePermission: z.string().optional(),
    placeholder: z.string().optional(),
    required: z.boolean().optional(),
    unique: z.boolean().optional(),
    indexed: z.boolean().optional(),
    nullable: z.boolean().optional(),
    disabled: z.boolean().optional(),
    readOnly: z.boolean().optional(),
    writeOnly: z.boolean().optional(),
    create: z.boolean().optional(),
    edit: z.boolean().optional(),
    list: z.boolean().optional(),
    detail: z.boolean().optional(),
    hidden: z.boolean().optional(),
    searchable: z.boolean().optional(),
    sortable: z.boolean().optional(),
    order: z.number().optional(),
    group: z.string().optional(),
    section: z.string().optional(),
    tab: z.string().optional(),
    defaultValue: z.unknown().optional(),
    displayField: z.string().optional(),
    options: z
      .array(
        z.object({
          value: z.union([z.string(), z.number()]),
          label: z.string(),
        }),
      )
      .optional(),
    autocompleteConfig: z
      .object({
        model: z.string(),
        displayField: z.string(),
        searchFields: z.array(z.string()).optional(),
      })
      .optional(),
    relation: z
      .object({
        entity: z.string().min(1),
        endpoint: path.optional(),
        displayField: z.string().min(1),
        multiple: z.boolean().optional(),
        valueMode: z.enum(["id", "object"]).optional(),
        lookupFilters: z.record(z.string()).optional(),
        allowCreate: z.boolean().optional(),
      })
      .strict()
      .optional(),
    multiple: z.boolean().optional(),
    valueMode: z.enum(["id", "object"]).optional(),
    min: z.union([z.string(), z.number()]).optional(),
    max: z.union([z.string(), z.number()]).optional(),
    minLength: z.number().int().nonnegative().optional(),
    maxLength: z.number().int().nonnegative().optional(),
    pattern: z
      .string()
      .refine((value) => {
        try {
          new RegExp(value);
          return true;
        } catch {
          return false;
        }
      }, "Invalid regular expression")
      .optional(),
    step: z.union([z.string(), z.number()]).optional(),
    rows: z.number().int().positive().optional(),
    trueLabel: z.string().optional(),
    falseLabel: z.string().optional(),
    maxFileSize: z.number().positive().optional(),
    accept: z.array(z.string()).optional(),
    numericEncoding: z.enum(["string", "number"]).optional(),
    visibleWhen: condition.optional(),
    requiredWhen: condition.optional(),
    disabledWhen: condition.optional(),
    fields: z
      .record(z.lazy((): z.ZodType<FormFieldMetadata> => fieldMetadataSchema))
      .optional(),
  })
  .strict();
export const routingSchema = z
  .object({
    basePath: path,
    menuLabel: z.string().optional(),
    menuIcon: identifier.optional(),
    menuParent: path.optional(),
    showInMenu: z.boolean().optional(),
    menuOrder: z.number().optional(),
  })
  .strict();
export const operationSchema = z
  .object({
    path: z
      .string()
      .refine(
        (value) => !value.includes("..") && !value.includes("?"),
        "Invalid operation path",
      )
      .optional(),
    method: z.enum(["get", "post", "put", "patch", "delete"]).optional(),
  })
  .strict();
export const operationsSchema = z
  .object({
    list: operationSchema.optional(),
    detail: operationSchema.optional(),
    create: operationSchema.optional(),
    update: operationSchema.optional(),
    delete: operationSchema.optional(),
  })
  .strict();
export const entityDefinitionSchema = z
  .object({
    schemaVersion: z.literal(1),
    name: identifier,
    endpoint: path,
    displayName: z.string().min(1),
    pluralDisplayName: z.string().min(1),
    displayField: identifier,
    idType: z.enum(["number", "string"]).optional(),
    fields: z.record(identifier, fieldMetadataSchema),
    routing: routingSchema.optional(),
    operations: operationsSchema.optional(),
    permissions: z
      .object({
        read: z.string().optional(),
        create: z.string().optional(),
        update: z.string().optional(),
        delete: z.string().optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine((definition, context) => {
    if (
      definition.displayField !== "id" &&
      !definition.fields[definition.displayField]
    )
      context.addIssue({
        code: "custom",
        path: ["displayField"],
        message: "Display field does not exist",
      });
    for (const [name, field] of Object.entries(definition.fields)) {
      if (
        field.minLength !== undefined &&
        field.maxLength !== undefined &&
        field.minLength > field.maxLength
      )
        context.addIssue({
          code: "custom",
          path: ["fields", name],
          message: "minLength exceeds maxLength",
        });
      for (const condition of [
        field.visibleWhen,
        field.requiredWhen,
        field.disabledWhen,
      ])
        if (condition && !definition.fields[condition.field.split(".")[0]])
          context.addIssue({
            code: "custom",
            path: ["fields", name],
            message: "Unknown condition field: " + condition.field,
          });
    }
  });
export function extendEntityDefinition(
  base: EntityDefinition,
  overrides: EntityDefinitionOverrides,
): EntityDefinition {
  const fields: Record<string, FormFieldMetadata> = { ...base.fields };
  for (const [name, patch] of Object.entries(overrides.fields ?? {}))
    fields[name] = { ...fields[name], ...patch };
  return entityDefinitionSchema.parse({
    ...base,
    ...overrides,
    fields,
    permissions: { ...base.permissions, ...overrides.permissions },
    operations: { ...base.operations, ...overrides.operations },
  });
}
