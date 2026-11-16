export const ComprehensiveEntityTableColumns: {
  name: string;
  label: string;
  sortable: boolean;
}[] = [
  { name: "stringField", label: "رشته", sortable: true },
  { name: "integerField", label: "عدد صحیح", sortable: true },
  { name: "longField", label: "عدد بلند", sortable: true },
  { name: "doubleField", label: "عدد اعشاری", sortable: true },
  { name: "bigDecimalField", label: "عدد دقیق (BigDecimal)", sortable: true },
  { name: "booleanField", label: "بولین", sortable: true },
  { name: "dateField", label: "تاریخ و زمان (UTC)", sortable: true },
  { name: "localDateField", label: "تاریخ (بدون زمان)", sortable: false },
  { name: "localDateTimeField", label: "تاریخ و زمان محلی", sortable: false },
  { name: "enumField", label: "گزینه‌ها", sortable: false },
  { name: "uniqueField", label: "فیلد یکتا", sortable: false },
  { name: "indexedField", label: "فیلد ایندکس‌شده", sortable: false },
];
export const ComprehensiveEntityTableHeaders =
  ComprehensiveEntityTableColumns.map((column) => column.label);
