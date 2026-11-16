import { buildFieldsSchema } from "../entity/fields";
import type { FormFieldMetadata } from "./FieldFormTypes";
export function buildZodSchemaFromMeta<
  TModel extends object,
  TFieldMeta extends FormFieldMetadata,
>(meta: { fields: { [K in keyof TModel]?: TFieldMeta } }) {
  return buildFieldsSchema(
    meta.fields as Record<string, FormFieldMetadata>,
    "create",
  );
}
