import type { FormFieldMetadata } from "../forms/FieldFormTypes";
export function generateZodSchemaCode(meta: {
  fields: Record<string, FormFieldMetadata>;
}): string {
  return (
    "const schema = buildFieldsSchema(" +
    JSON.stringify(meta.fields, null, 2) +
    ', "create");'
  );
}
