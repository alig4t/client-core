// src/core/models/modelMetaUtils.ts

import type { FormFieldMetadata } from "../forms/FieldFormTypes";
import { createMessages } from "../forms/MessageUtils";

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

/**
 * ساخت متادیتای کامل یک مدل شامل فیلدها، نام نمایشی و پیام‌های استاندارد
 */
export function createModelMeta<
  T extends Record<string, any>,
  M extends FormFieldMetadata = FormFieldMetadata
>(
  specificFields: { [K in keyof T]?: M },
  displayField: keyof T,
  displayName: string,
  pluralDisplayName: string
) {
  // ✅ پیام‌ها را یک‌بار در اینجا می‌سازیم
  const messages = createMessages(displayName, pluralDisplayName);

  return {
    fields: {
      // Type assertion برای ادغام base fields
      ...(baseModelMeta.fields as unknown as Record<keyof T, M>),
      ...specificFields,
    },
    displayField,
    displayName,
    pluralDisplayName,
    messages, // ✅ خروجی نهایی شامل پیام‌هاست
  };
}