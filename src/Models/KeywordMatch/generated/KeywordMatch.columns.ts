export const KeywordMatchTableColumns: {
  name: string;
  label: string;
  sortable: boolean;
}[] = [{ name: "matchedAt", label: "زمان تطابق", sortable: true }];
export const KeywordMatchTableHeaders = KeywordMatchTableColumns.map(
  (column) => column.label,
);
