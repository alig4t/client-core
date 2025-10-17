
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