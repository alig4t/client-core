export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "long"
  | "double"
  | "bigDecimal"
  | "bigDecimalField"
  | "date"
  | "datetime-local"
  | "instant"
  | "textarea"
  | "select"
  | "checkbox"
  | "boolean"
  | "autocomplete"
  | "hidden"
  | "File"
  | "object"
  | "array";
export type DataType =
  | "string"
  | "integer"
  | "long"
  | "double"
  | "decimal"
  | "boolean"
  | "date"
  | "datetime"
  | "instant"
  | "enum"
  | "reference"
  | "file"
  | "object"
  | "array";
export interface SelectOption {
  value: string | number;
  label: string;
}
export interface FieldCondition {
  field: string;
  operator?: "eq" | "ne" | "in" | "truthy";
  value?: unknown;
}
export interface AutocompleteFieldConfig {
  model: string;
  displayField: string;
  searchFields?: string[];
}
export interface RelationConfig {
  entity: string;
  endpoint?: string;
  displayField: string;
  multiple?: boolean;
  valueMode?: "id" | "object";
  lookupFilters?: Record<string, string>;
  allowCreate?: boolean;
}
export interface FormFieldMetadata {
  label: string;
  type: FieldType;
  widget?: string;
  readPermission?: string;
  writePermission?: string;
  dataType?: DataType;
  placeholder?: string;
  required?: boolean;
  unique?: boolean;
  indexed?: boolean;
  nullable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  create?: boolean;
  edit?: boolean;
  list?: boolean;
  detail?: boolean;
  hidden?: boolean;
  searchable?: boolean;
  sortable?: boolean;
  order?: number;
  group?: string;
  section?: string;
  tab?: string;
  defaultValue?: unknown;
  displayField?: string;
  options?: SelectOption[];
  autocompleteConfig?: AutocompleteFieldConfig;
  relation?: RelationConfig;
  multiple?: boolean;
  valueMode?: "id" | "object";
  min?: string | number;
  max?: string | number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  step?: string | number;
  rows?: number;
  trueLabel?: string;
  falseLabel?: string;
  maxFileSize?: number;
  accept?: string[];
  numericEncoding?: "string" | "number";
  visibleWhen?: FieldCondition;
  requiredWhen?: FieldCondition;
  disabledWhen?: FieldCondition;
  fields?: Record<string, FormFieldMetadata>;
}
