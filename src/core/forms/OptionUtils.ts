import type { FormFieldMetadata } from "./FieldFormTypes";

export interface Option {
    value: string | number;
    label: string;
}

export const YES_OR_NO_OPTIONS: Option[] = [
    { value: 1, label: "بله" },
    { value: 0, label: "نه" },
];

export const PAGE_SIZE_OPTIONS: Option[] = [
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
];


/**
 * ساخت خودکار گزینه‌های مرتب‌سازی بر اساس متادیتای مدل
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

  // Object.keys را به keyof TModel تبدیل می‌کنیم و فیلتر می‌زنیم
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
  PAGE_SIZE_OPTIONS,
  buildSortOptions
}

export default OptionUtils;
