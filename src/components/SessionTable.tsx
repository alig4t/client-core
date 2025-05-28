import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const sessions = [
  {
    id: 1,
    browser: "Chrome",
    os: "Windows 10",
    ip: "۵.۱۱۶.۱۸۷.۷۳",
    date: "۴ اردیبهشت ۱۴۰۴",
    time: "۲۲:۴۴",
    current: true,
  },
];
const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export default function SessionTable() {
  return (
    <div
      className="  bg-white
    relative rounded-md border shadow-md border-gray-200 dark:border-gray-800 text-gray-700 dark:text-zinc-100  dark:bg-dark-background flex-1
    pb-4
    "
    >
      <h2 className="text-right text-lg font-bold p-4 border-b">
        نشست‌های فعال
      </h2>
      {/* <div className="overflow-x-auto pb-3">
        <table className="w-full text-sm text-right border-collapse">
          <thead className=" text-gray-700">
            <tr>
              <th className="py-2 pt-6 px-4">#</th>
              <th className="py-2 px-4  pt-6 leading-8">مرورگر</th>
              <th className="py-2 px-4  pt-6 leading-8">سیستم عامل</th>
              <th className="py-2 px-4  pt-6 leading-8">آدرس</th>
              <th className="py-2 px-4  pt-6 leading-8">تاریخ</th>
              <th className="py-2 px-4  pt-6 leading-8">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => (
              <tr key={session.id} className="border-t">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{session.browser}</td>
                <td className="py-2 px-4">{session.os}</td>
                <td className="py-2 px-4">{session.ip}</td>
                <td className="py-2 px-4">
                  {session.date} - {session.time}
                </td>
                <td className="py-2 px-4">
                  {session.current && (
                    <Button variant="outline" className="text-xs">
                      نشست فعلی
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
      <Table className="w-[95%] m-auto">
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="text-right text-gray-700 py-5 font-bold">
              Invoice
            </TableHead>
            <TableHead className="text-right text-gray-700  font-bold">
              Status
            </TableHead>
            <TableHead className="text-right text-gray-700   font-bold">
              Method
            </TableHead>
            <TableHead className="text-right text-gray-700  font-bold">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="text-right py-4">
                {invoice.invoice}
              </TableCell>
              <TableCell className="text-right">
                {invoice.paymentStatus}
              </TableCell>
              <TableCell className="text-right">
                {invoice.paymentMethod}
              </TableCell>
              <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
