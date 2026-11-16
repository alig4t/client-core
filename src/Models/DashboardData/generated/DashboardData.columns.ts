export const DashboardDataTableColumns: {
  name: string;
  label: string;
  sortable: boolean;
}[] = [
  { name: "frequencyCount", label: "تعداد تکرار", sortable: true },
  { name: "lastMatchedAt", label: "آخرین تطابق", sortable: true },
];
export const DashboardDataTableHeaders = DashboardDataTableColumns.map(
  (column) => column.label,
);
