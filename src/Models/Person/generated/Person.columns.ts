export const PersonTableColumns: {
  name: string;
  label: string;
  sortable: boolean;
}[] = [
  { name: "firstName", label: "نام", sortable: true },
  { name: "lastName", label: "نام خانوادگی", sortable: true },
  { name: "nationalId", label: "کد ملی", sortable: false },
  { name: "birthDate", label: "تاریخ تولد", sortable: false },
];
export const PersonTableHeaders = PersonTableColumns.map(
  (column) => column.label,
);
