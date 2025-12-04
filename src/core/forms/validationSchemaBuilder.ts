// src/utils/schemaBuilder.ts
import { z } from "zod";
import type { ZodTypeAny, ZodRawShape } from "zod";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";

export function buildZodSchemaFromMeta<
  TModel extends Record<string, any>,
  TFieldMeta extends FormFieldMetadata
>(
  modelMeta: {
    fields: { [K in keyof TModel]?: TFieldMeta };
  }
) {
  const shape: ZodRawShape = {};

  for (const [key, fieldMeta] of Object.entries(modelMeta.fields)) {
    if (!fieldMeta?.required) continue;

    if (fieldMeta.type === "boolean") {
      shape[key] = z.boolean();
    } else {
      shape[key] = z.string().nonempty(`${fieldMeta.label} را وارد نمایید`);
    }
  }

  return z.object(shape);
}