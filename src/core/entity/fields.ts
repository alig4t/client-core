import { z, type ZodTypeAny } from "zod/v3";
import type {
  DataType,
  FieldCondition,
  FormFieldMetadata,
} from "../forms/FieldFormTypes";
import type { EntityDefinition, EntityInput } from "./types";

export function matchesCondition(
  condition: FieldCondition | undefined,
  values: EntityInput,
): boolean {
  if (!condition) return true;
  const value = condition.field
    .split(".")
    .reduce<unknown>(
      (current, part) =>
        current && typeof current === "object"
          ? (current as Record<string, unknown>)[part]
          : undefined,
      values,
    );
  switch (condition.operator ?? "eq") {
    case "truthy":
      return Boolean(value);
    case "ne":
      return value !== condition.value;
    case "in":
      return Array.isArray(condition.value) && condition.value.includes(value);
    default:
      return value === condition.value;
  }
}
export function dataTypeOf(field: FormFieldMetadata): DataType {
  if (field.dataType) return field.dataType;
  const types: Partial<Record<FormFieldMetadata["type"], DataType>> = {
    number: "integer",
    long: "long",
    double: "double",
    bigDecimal: "decimal",
    bigDecimalField: "decimal",
    boolean: "boolean",
    checkbox: "boolean",
    date: "date",
    "datetime-local": "datetime",
    instant: "instant",
    select: "enum",
    autocomplete: "reference",
    File: "file",
    object: "object",
    array: "array",
  };
  return types[field.type] ?? "string";
}
const textInput = (value: unknown) =>
  typeof value === "string" ? value.trim() : value;
const numericInput = (value: unknown) =>
  typeof value === "string" && value.trim() !== "" ? Number(value) : value;
const idSchema = z.union([z.string().min(1), z.number().finite().safe()]);
function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T00:00:00Z");
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
export const fieldRegistry: Record<
  DataType,
  (field: FormFieldMetadata, mode?: "create" | "edit") => ZodTypeAny
> = {
  string: (field) => {
    let schema = z.string();
    if (field.type === "email")
      schema = schema.email("ایمیل معتبر وارد نمایید");
    if (field.minLength !== undefined) schema = schema.min(field.minLength);
    if (field.maxLength !== undefined) schema = schema.max(field.maxLength);
    if (field.pattern)
      schema = schema.regex(
        new RegExp(field.pattern),
        "قالب مقدار نامعتبر است",
      );
    return schema;
  },
  integer: (field) => {
    let schema = z.number().finite().int().safe();
    if (field.min !== undefined) schema = schema.min(Number(field.min));
    if (field.max !== undefined) schema = schema.max(Number(field.max));
    return z.preprocess(numericInput, schema);
  },
  double: (field) => {
    let schema = z.number().finite();
    if (field.min !== undefined) schema = schema.min(Number(field.min));
    if (field.max !== undefined) schema = schema.max(Number(field.max));
    return z.preprocess(numericInput, schema);
  },
  long: (field) =>
    z
      .preprocess(
        (value) =>
          typeof value === "number" && Number.isSafeInteger(value)
            ? String(value)
            : textInput(value),
        z
          .string()
          .regex(/^-?\d+$/)
          .refine((value) => {
            try {
              const number = BigInt(value);
              return (
                number >= BigInt(field.min ?? "-9223372036854775808") &&
                number <= BigInt(field.max ?? "9223372036854775807")
              );
            } catch {
              return false;
            }
          }, "عدد صحیح خارج از بازه است")
          .refine(
            (value) =>
              field.numericEncoding !== "number" ||
              Number.isSafeInteger(Number(value)),
            "عدد خارج از دقت مجاز است",
          ),
      )
      .transform((value) =>
        field.numericEncoding === "number" ? Number(value) : value,
      ),
  decimal: (field) =>
    z
      .preprocess(
        (value) =>
          typeof value === "number" && Number.isFinite(value)
            ? String(value)
            : textInput(value),
        z
          .string()
          .regex(/^-?\d+(\.\d+)?$/, "عدد اعشاری معتبر وارد نمایید")
          .superRefine((value, context) => {
            if (!/^-?\d+(\.\d+)?$/.test(value)) return;
            if (
              field.min !== undefined &&
              compareDecimal(value, String(field.min)) < 0
            )
              context.addIssue({
                code: "custom",
                message: "مقدار کمتر از حد مجاز است",
              });
            if (
              field.max !== undefined &&
              compareDecimal(value, String(field.max)) > 0
            )
              context.addIssue({
                code: "custom",
                message: "مقدار بیشتر از حد مجاز است",
              });
          }),
      )
      .transform((value) =>
        field.numericEncoding === "number" ? Number(value) : value,
      ),
  boolean: () => z.boolean(),
  date: () => z.string().refine(validDate, "تاریخ معتبر وارد نمایید"),
  datetime: () =>
    z
      .string()
      .refine(
        (value) =>
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?$/.test(value) &&
          validDate(value.slice(0, 10)) &&
          Number(value.slice(11, 13)) < 24 &&
          Number(value.slice(14, 16)) < 60 &&
          (!value.slice(17, 19) || Number(value.slice(17, 19)) < 60),
        "تاریخ و زمان محلی معتبر وارد نمایید",
      ),
  instant: () => z.string().datetime({ offset: true }),
  enum: (field) => {
    const single = z
      .union([z.string(), z.number()])
      .refine(
        (value) =>
          field.options?.some((option) => option.value === value) ?? false,
        "گزینه معتبر انتخاب کنید",
      );
    return field.multiple ? z.array(single) : single;
  },
  reference: (field) => {
    const single =
      field.relation?.valueMode === "id"
        ? idSchema
        : z.object({ id: idSchema }).passthrough();
    return field.relation?.multiple || field.multiple
      ? z.array(single)
      : single;
  },
  file: (field) => {
    const single =
      field.valueMode === "object"
        ? z.object({ id: idSchema }).passthrough()
        : idSchema;
    return field.multiple ? z.array(single) : single;
  },
  object: (field, mode = "create") =>
    buildFieldsSchema(field.fields ?? {}, mode),
  array: (field, mode = "create") =>
    z.array(buildFieldsSchema(field.fields ?? {}, mode)),
};

function compareDecimal(left: string, right: string): number {
  const decimals = Math.max(
    left.split(".")[1]?.length ?? 0,
    right.split(".")[1]?.length ?? 0,
  );
  const scaled = (value: string) => {
    const [whole, fraction = ""] = value.split(".");
    return BigInt(whole + fraction.padEnd(decimals, "0"));
  };
  const a = scaled(left),
    b = scaled(right);
  return a < b ? -1 : a > b ? 1 : 0;
}
export function editableField(
  field: FormFieldMetadata,
  mode: "create" | "edit",
) {
  return !field.readOnly && !field.hidden && field[mode] !== false;
}
const empty = (value: unknown) =>
  value === undefined ||
  value === null ||
  (typeof value === "string" && !value.trim()) ||
  (Array.isArray(value) && value.length === 0);
export function buildFieldsSchema(
  fields: Record<string, FormFieldMetadata>,
  mode: "create" | "edit",
) {
  const shape: Record<string, ZodTypeAny> = {};
  for (const [name, field] of Object.entries(fields)) {
    if (!editableField(field, mode)) continue;
    let schema = fieldRegistry[dataTypeOf(field)](field, mode);
    if (field.nullable) schema = schema.nullable();
    shape[name] = z.preprocess(
      (value) =>
        value === "" || (value === null && !field.nullable) ? undefined : value,
      schema.optional(),
    );
  }
  return z
    .preprocess((input) => {
      if (!input || typeof input !== "object" || Array.isArray(input))
        return input;
      const values = input as EntityInput;
      return Object.fromEntries(
        Object.entries(values).filter(
          ([name]) =>
            fields[name] &&
            editableField(fields[name], mode) &&
            matchesCondition(fields[name].visibleWhen, values) &&
            !fields[name].disabled &&
            !(
              fields[name].disabledWhen &&
              matchesCondition(fields[name].disabledWhen, values)
            ),
        ),
      );
    }, z.object(shape))
    .superRefine((values, context) => {
      for (const [name, field] of Object.entries(fields)) {
        if (
          !editableField(field, mode) ||
          !matchesCondition(field.visibleWhen, values) ||
          field.disabled ||
          (field.disabledWhen && matchesCondition(field.disabledWhen, values))
        )
          continue;
        if (
          (field.required ||
            (field.requiredWhen &&
              matchesCondition(field.requiredWhen, values))) &&
          empty(values[name]) &&
          !(values[name] === null && field.nullable)
        )
          context.addIssue({
            code: "custom",
            path: [name],
            message: field.label + " را وارد نمایید",
          });
      }
    })
    .transform((values) =>
      Object.fromEntries(
        Object.entries(values).filter(
          ([name, value]) =>
            value !== undefined &&
            matchesCondition(fields[name]?.visibleWhen, values) &&
            !fields[name]?.disabled &&
            !(
              fields[name]?.disabledWhen &&
              matchesCondition(fields[name].disabledWhen, values)
            ),
        ),
      ),
    );
}
export const buildEntitySchema = (
  definition: EntityDefinition,
  mode: "create" | "edit" = "create",
) => buildFieldsSchema(definition.fields, mode);

export function defaultEntityValues(definition: EntityDefinition): EntityInput {
  return Object.fromEntries(
    Object.entries(definition.fields)
      .filter(
        ([, field]) =>
          field.defaultValue !== undefined || dataTypeOf(field) === "boolean",
      )
      .map(([name, field]) => [name, field.defaultValue ?? false]),
  );
}
export function entityToApi(
  definition: EntityDefinition,
  values: EntityInput,
  mode: "create" | "edit",
): EntityInput {
  const parsed = buildEntitySchema(definition, mode).parse(values);
  return mapFieldValues(definition.fields, parsed, true);
}
export function entityFromApi(
  definition: EntityDefinition,
  record: EntityInput,
): EntityInput {
  return mapFieldValues(definition.fields, record, false);
}
function mapFieldValues(
  fields: Record<string, FormFieldMetadata>,
  record: EntityInput,
  toApi: boolean,
): EntityInput {
  const result = { ...record };
  for (const [name, field] of Object.entries(fields)) {
    const kind = dataTypeOf(field),
      value = record[name];
    if (value === null || value === undefined) continue;
    if (kind === "object" || kind === "array") {
      const nested = (entry: unknown) =>
        mapFieldValues(field.fields ?? {}, entry as EntityInput, toApi);
      result[name] = Array.isArray(value) ? value.map(nested) : nested(value);
    } else if (kind === "reference" || kind === "file") {
      const idMode =
        kind === "reference"
          ? field.relation?.valueMode === "id"
          : field.valueMode !== "object";
      const reference = (entry: unknown) =>
        entry && typeof entry === "object"
          ? toApi
            ? { id: (entry as { id: unknown }).id }
            : idMode
              ? (entry as { id: unknown }).id
              : entry
          : entry;
      result[name] = Array.isArray(value)
        ? value.map(reference)
        : reference(value);
    }
  }
  return result;
}
export function formatFieldValue(
  value: unknown,
  field: FormFieldMetadata,
  locale = "fa-IR",
  calendar?: "persian" | "gregorian",
): string {
  if (value === null || value === undefined || value === "") return "—";
  const kind = dataTypeOf(field);
  if (kind === "boolean")
    return value ? (field.trueLabel ?? "بله") : (field.falseLabel ?? "خیر");
  if (kind === "enum") {
    const label = (entry: unknown) =>
      field.options?.find((option) => option.value === entry)?.label ??
      String(entry);
    return Array.isArray(value) ? value.map(label).join("، ") : label(value);
  }
  if (kind === "reference") {
    const label = (entry: unknown): string =>
      entry && typeof entry === "object"
        ? String(
            (entry as Record<string, unknown>)[
              field.relation?.displayField ?? field.displayField ?? "id"
            ] ??
              (entry as Record<string, unknown>).id ??
              "",
          )
        : String(entry);
    return Array.isArray(value) ? value.map(label).join("، ") : label(value);
  }
  if (kind === "date" || kind === "datetime" || kind === "instant") {
    const date = new Date(String(value) + (kind === "date" ? "T12:00:00" : ""));
    return Number.isNaN(date.getTime())
      ? String(value)
      : new Intl.DateTimeFormat(locale, {
          calendar,
          dateStyle: "medium",
          ...(kind === "date" ? {} : { timeStyle: "short" }),
        }).format(date);
  }
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}
