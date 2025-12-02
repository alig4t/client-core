import type { FormFieldMetadata } from "./FieldFormTypes";

export interface Option {
  value: string | number;
  label: string;
}

export const YES_OR_NO_OPTIONS: Option[] = [
  { value: 1, label: "بله" },
  { value: 0, label: "نه" },
];

export const GET_BOOLEAN_OPTION = (value: boolean): string => {
  return YES_OR_NO_OPTIONS.find((option) => option.value === Number(value))?.label || "";
}



export const PAGE_SIZE_OPTIONS: Option[] = [
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
];


/**
 * Automatically build sort options based on model metadata
 */
export function buildSortOptions<
  TModel extends Record<string, any>,
  TFieldMeta extends FormFieldMetadata
>(
  modelMeta: {
    fields: {
      [K in keyof TModel]?: TFieldMeta;
    };
  }
): Option[] {
  const options: Option[] = [];

  // Convert Object.keys to keyof TModel and filter
  (Object.keys(modelMeta.fields) as Array<keyof typeof modelMeta.fields>)
    .filter((key): key is keyof TModel => {
      const meta = modelMeta.fields[key];
      return meta != null && meta.sortable === true;
    })
    .forEach((key) => {
      const meta = modelMeta.fields[key]!;
      const label = meta.label || String(key);
      const fieldKey = String(key);

      options.push(
        { label: `${label} (صعودی)`, value: `${fieldKey},asc` },
        { label: `${label} (نزولی)`, value: `${fieldKey},desc` }
      );
    });

  return options;
}

const OptionUtils = {
  YES_OR_NO_OPTIONS,
  GET_BOOLEAN_OPTION,
  PAGE_SIZE_OPTIONS,
  buildSortOptions
}

export default OptionUtils;
