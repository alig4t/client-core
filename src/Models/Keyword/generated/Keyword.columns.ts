export const KeywordTableColumns: {
  name: string;
  label: string;
  sortable: boolean;
}[] = [{ name: "keywordText", label: "متن کلمه کلیدی", sortable: true }];
export const KeywordTableHeaders = KeywordTableColumns.map(
  (column) => column.label,
);
