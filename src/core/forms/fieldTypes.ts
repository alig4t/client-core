// src/forms/FieldTypes.ts

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "date"               // فقط تاریخ: yyyy-MM-dd
  | "datetime-local"     // تاریخ + زمان بدون تایم‌زون (برای localDateTime و dateField)
  | "textarea"
  | "select"
  | "checkbox"           // برای boolean در فرم
  | "boolean"            // برای نمایش در جدول یا readonly (مثلاً true/false یا بله/خیر)
  | "autocomplete"
  | "hidden";

// Select or autocomplete options
export interface SelectOption {
  value: string | number;
  label: string;
}

// برای فیلدهای autocomplete که به یک مدل دیگر اشاره می‌کنند
export interface AutocompleteFieldConfig {
  model: string; // نام مدل مقصد (مثلاً "UserModel")
  displayField: string; // فیلدی که برای نمایش استفاده می‌شود (مثلاً "username")
  searchFields?: string[]; // فیلدهایی که در جستجو استفاده می‌شوند
}

// Extended metadata for form fields
export interface FormFieldMetadata {
  label: string;
  sortable?: boolean; // for table
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  displayField?: string;
  // برای انواع select، radio، autocomplete
  options?: SelectOption[];

  // برای autocomplete پیشرفته (وقتی به مدل دیگری اشاره می‌کند)
  autocompleteConfig?: AutocompleteFieldConfig;

  // برای number و datetime
  min?: string | number;
  max?: string | number;
  step?: string | number; // مثلاً "0.01" برای اعشار

  // برای textarea
  rows?: number;

  // برای boolean (نمایش در جدول)
  trueLabel?: string;  // پیش‌فرض: "بله"
  falseLabel?: string; // پیش‌فرض: "خیر"
}