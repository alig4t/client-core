// src/components/permissions/TablePlaceholder.tsx

import React from 'react';
import Spinner from '@/components/general/Spinner';

interface TablePlaceholderProps {
  /**
   * Number of skeleton rows to display.
   * @default 5
   */
  rowCount?: number;
}

const TablePlaceholder: React.FC<TablePlaceholderProps> = ({ rowCount = 5 }) => {
  return (
    <div dir="rtl" className="p-6 bg-[var(--white)] rounded-lg border border-[var(--border)] relative overflow-hidden">
      {/* This div is for blurring and showing the skeleton in the background */}
      <div className="opacity-80">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-16 sm:w-32  bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
          <div className="h-9 w-20 sm:w-48 bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse"></div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-[var(--white)]">
              <tr>
                <th className="px-6 py-3 w-1/2 sm:w-1/6"><div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-bounce"></div></th>
                <th className="px-6 py-3 w-2/3 sm:w-2/5"><div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-bounce"></div></th>
                <th className="px-6 py-3 w-2/3 sm:w-2/5"><div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-bounce"></div></th>
              </tr>
            </thead>
            <tbody className="bg-[var(--white)] divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 3 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-2 sm:px-6 py-4 "><div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-bounce"></div></td>
                  <td className="px-2 sm:px-6 py-4"><div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-bounce"></div></td>
                  <td className="px-2 sm:px-6 py-4"><div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-bounce"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Placeholder for Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="h-8 w-8 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-14 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 w-8 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Spinner Overlay */}
      <div className="absolute inset-0 bg-white/5 bg-opacity-50 flex items-center justify-center">
        {/* <Spinner /> */}
      </div>
    </div>
  );
};

export default TablePlaceholder;