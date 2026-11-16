export const ChannelTableColumns: {
  name: string;
  label: string;
  sortable: boolean;
}[] = [
  { name: "channelName", label: "نام کانال", sortable: true },
  { name: "channelIdentifier", label: "شناسه کانال", sortable: true },
  { name: "status", label: "وضعیت", sortable: true },
];
export const ChannelTableHeaders = ChannelTableColumns.map(
  (column) => column.label,
);
