// src/models/modelMetaUtils.ts

import type { FormFieldMetadata } from "../forms/fieldTypes";

export const baseModelMeta = {
  fields: {
    id: {
      label: "شناسه",
      type: "text",
      sortable: true,
    },
    createdAt: {
      label: "تاریخ ایجاد",
      type: "date",
      sortable: true,
    },
    updatedAt: {
      label: "تاریخ بروزرسانی",
      type: "date",
      sortable: true,
    },
  },
} as const;

// Generic function to create model metadata
export function createModelMeta<T extends Record<string, any>, M extends FormFieldMetadata = FormFieldMetadata>(
  specificFields: { [K in keyof T]?: M },
  displayField: keyof T
) {
  return {
    fields: {
      ...(baseModelMeta.fields as Record<keyof T, M>),
      ...specificFields,
    },
    displayField,
  };
}