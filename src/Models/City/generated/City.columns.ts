export const CityTableColumns: {
  name: string;
  label: string;
  sortable: boolean;
}[] = [
  { name: "cityName", label: "نام شهر", sortable: true },
  { name: "country", label: "کشور", sortable: true },
];
export const CityTableHeaders = CityTableColumns.map((column) => column.label);
