// Data type for Select options
export interface SelectOption {
  value: string | number;
  label: string;
}

// Definition of the structure of a field in the filter form
export interface FilterField {
  name: string; // Unique field identifier (for state)
  label: string; // Text displayed to the user
  type: 'text' | 'date' | 'select'; // Input type
  filterKey: string; // Key sent to the API (e.g., "name_like")
  options?: SelectOption[]; // Options for select type
}