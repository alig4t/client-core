import React from "react";
import { AlertTriangle, CircleAlert, RotateCw } from "lucide-react";

interface TableErrorStateProps {
  message: string;
  onRetry: () => void;
  colSpan?: number; // To make the component usable for other tables as well
}

const TableErrorState: React.FC<TableErrorStateProps> = ({
  message,
  onRetry,
  colSpan = 3,
}) => {
  return (
    <div dir="rtl" className="p-6 bg-[var(--white)] rounded-lg border border-rose-200 dark:border-rose-300">
      {/* Placeholder for title and sort filter */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-5 w-8 sm:w-32 bg-red-50 dark:bg-rose-200 rounded"></div>
        <div className="h-8 w-8 sm:w-48 bg-red-50 dark:bg-rose-200 rounded-md"></div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* Table header with light red color */}
          <thead className="bg-red-50 dark:bg-rose-200">
            <tr>
              {/* These ths are only to maintain header structure and height */}
              <th className="px-6 py-4" colSpan={colSpan}></th>
            </tr>
          </thead>

          {/* Table body displaying error message in the center */}
          <tbody>
            <tr>
              <td colSpan={colSpan} className="py-16 text-center">
                {/* Error message content */}
                <div className="flex flex-col items-center justify-center">
                  <div className="flex-shrink-0 p-3 bg-red-100 rounded-full">
                    <CircleAlert
                      className="w-8 h-8 text-red-500 dark:text-red-300"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-300">
                    اوه، مشکلی پیش آمد!
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 max-w-md mx-auto dark:text-slate-500">
                    {message ||
                      "متاسفانه در برقراری ارتباط با سرور مشکلی رخ داده است."}
                  </p>
                  <div className="mt-5">
                    <button
                      onClick={onRetry}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 dark:text-red-500 transition-all duration-150 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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

      {/* Placeholder for pagination buttons */}
      <div className="flex items-center justify-between mt-4">
        <div className="h-8 w-4 sm:w-16 bg-red-50 dark:bg-red-200 rounded"></div>
        <div className="h-4 w-4 sm:w-24 bg-red-50 dark:bg-red-200 rounded"></div>
        <div className="h-8 w-4 sm:w-16 bg-red-50 dark:bg-red-200 rounded"></div>
      </div>
    </div>
  );
};

export default TableErrorState;
