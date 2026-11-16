export const BotTableColumns: {
  name: string;
  label: string;
  sortable: boolean;
}[] = [
  { name: "token", label: "توکن", sortable: true },
  { name: "status", label: "وضعیت", sortable: true },
];
export const BotTableHeaders = BotTableColumns.map((column) => column.label);
