// src/forms/FieldTypes.ts

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "date"               // Date only: yyyy-MM-dd
  | "datetime-local"     // Date + Time without timezone (for localDateTime and dateField)
  | "textarea"
  | "select"
  | "checkbox"           // For boolean in form
  | "boolean"            // For display in table or readonly (e.g., true/false or yes/no)
  | "autocomplete"
  | "hidden";

// Select or autocomplete options
export interface SelectOption {
  value: string | number;
  label: string;
}

// For autocomplete fields that refer to another model
export interface AutocompleteFieldConfig {
  model: string; // Target model name (e.g., "UserModel")
  displayField: string; // Field used for display (e.g., "username")
  searchFields?: string[]; // Fields used in search
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
  // For select, radio, autocomplete types
  options?: SelectOption[];

  // For advanced autocomplete (when referring to another model)
  autocompleteConfig?: AutocompleteFieldConfig;

  // For number and datetime
  min?: string | number;
  max?: string | number;
  step?: string | number; // e.g., "0.01" for decimals

  // For textarea
  rows?: number;

  // For boolean (display in table)
  trueLabel?: string;  // Default: "Yes"
  falseLabel?: string; // Default: "No"
}