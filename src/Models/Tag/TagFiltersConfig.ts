import type { FilterField } from "@/core/forms/Filter";


export const tagFiltersConfig: FilterField[] = [
  {
    name: "tagName",
    label: "نام تگ",
    type: "text",
    filterKey: "name_like",
  },
  {
    name: "fromDate",
    label: "از تاریخ ایجاد",
    type: "date",
    filterKey: "createdAt_ge",
  },
  {
    name: "toDate",
    label: "تا تاریخ ایجاد",
    type: "date",
    filterKey: "createdAt_le",
  },
];