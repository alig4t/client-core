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

// Select or autocomplete options
export interface SelectOption {
  value: string | number;
  label: string;
}

// Extended metadata for form fields
export interface FormFieldMetadata {
  label: string;
  sortable?: boolean; // for table
  type: FieldType; // form field type
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[]; // for select, radio, autocomplete
  disabled?: boolean;
  // You can add later: min, max, step, rows, etc.
}