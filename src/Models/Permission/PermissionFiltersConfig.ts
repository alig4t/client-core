import type { FilterField } from "@/core/forms/Filter";


export const permissionFiltersConfig: FilterField[] = [
  {
    name: "showName",
    label: "نام نمایشی",
    type: "text",
    filterKey: "showName_like",
  },
  {
    name: "name",
    label: "نام سیستمی",
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