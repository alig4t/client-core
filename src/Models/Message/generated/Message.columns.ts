export const MessageTableColumns: {
  name: string;
  label: string;
  sortable: boolean;
}[] = [
  { name: "platformMessageId", label: "شناسه پیام پلتفرم", sortable: true },
  { name: "text", label: "متن پیام", sortable: false },
  { name: "sentAt", label: "زمان ارسال", sortable: true },
  { name: "senderId", label: "شناسه فرستنده", sortable: true },
  { name: "senderUsername", label: "نام کاربری فرستنده", sortable: true },
];
export const MessageTableHeaders = MessageTableColumns.map(
  (column) => column.label,
);
