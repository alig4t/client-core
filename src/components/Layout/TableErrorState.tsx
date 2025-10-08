// src/components/permissions/TableErrorState.tsx

import React from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

interface TableErrorStateProps {
  message: string;
  onRetry: () => void;
  colSpan?: number; // برای اینکه کامپوننت برای جداول دیگر هم قابل استفاده باشد
}

const TableErrorState: React.FC<TableErrorStateProps> = ({
  message,
  onRetry,
  colSpan = 3,
}) => {
  return (
    <div dir="rtl" className="p-6 bg-white rounded-lg border border-red-200">
      {/* جایگاه خالی برای عنوان و فیلتر مرتب‌سازی */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-5 w-32 bg-red-50 rounded"></div>
        <div className="h-8 w-48 bg-red-50 rounded-md"></div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* هدر جدول با رنگ قرمز کم‌رنگ */}
          <thead className="bg-red-50">
            <tr>
              {/* این th ها فقط برای حفظ ساختار و ارتفاع هدر هستند */}
              <th className="px-6 py-4" colSpan={colSpan}></th>
            </tr>
          </thead>

          {/* بدنه جدول که پیام خطا را در وسط نمایش می‌دهد */}
          <tbody>
            <tr>
              <td colSpan={colSpan} className="py-16 text-center">
                {/* محتوای پیام خطا */}
                <div className="flex flex-col items-center justify-center">
                  <div className="flex-shrink-0 p-3 bg-red-100 rounded-full">
                    <AlertTriangle
                      className="w-8 h-8 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-800">
                    اوه، مشکلی پیش آمد!
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 max-w-md mx-auto">
                    {message ||
                      "متاسفانه در برقراری ارتباط با سرور مشکلی رخ داده است."}
                  </p>
                  <div className="mt-5">
                    <button
                      onClick={onRetry}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 transition-all duration-150 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <RotateCw className="w-4 h-4 ml-2" />
                      تلاش مجدد
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* جایگاه خالی برای دکمه‌های صفحه‌بندی */}
      <div className="flex items-center justify-between mt-4">
        <div className="h-8 w-16 bg-red-50 rounded"></div>
        <div className="h-4 w-24 bg-red-50 rounded"></div>
        <div className="h-8 w-16 bg-red-50 rounded"></div>
      </div>
    </div>
  );
};

export default TableErrorState;
