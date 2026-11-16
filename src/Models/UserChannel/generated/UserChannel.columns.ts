export const UserChannelTableColumns: {
  name: string;
  label: string;
  sortable: boolean;
}[] = [{ name: "role", label: "نقش", sortable: true }];
export const UserChannelTableHeaders = UserChannelTableColumns.map(
  (column) => column.label,
);
