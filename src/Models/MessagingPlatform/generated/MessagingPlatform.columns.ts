export const MessagingPlatformTableColumns: {
  name: string;
  label: string;
  sortable: boolean;
}[] = [
  { name: "platformName", label: "نام پلتفرم", sortable: true },
  { name: "platformKey", label: "کلید پلتفرم", sortable: true },
  { name: "apiEndpoint", label: "آدرس API", sortable: false },
  { name: "authMethod", label: "روش احراز هویت", sortable: false },
];
export const MessagingPlatformTableHeaders = MessagingPlatformTableColumns.map(
  (column) => column.label,
);
