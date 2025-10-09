// src/forms/fieldTypes.ts

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "date"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "autocomplete";

// گزینه‌های select یا autocomplete
export interface SelectOption {
  value: string | number;
  label: string;
}

// متادیتای گسترش‌یافته برای فیلدهای فرم
export interface FormFieldMetadata {
  label: string;
  sortable?: boolean; // برای جدول
  type: FieldType; // نوع فیلد فرم
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[]; // برای select, radio, autocomplete
  disabled?: boolean;
  // می‌تونی بعداً اضافه کنی: min, max, step, rows, etc.
}