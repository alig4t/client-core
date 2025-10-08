// src/components/permissions/TablePlaceholder.tsx

import React from 'react';
import Spinner from '@/components/general/Spinner';

interface TablePlaceholderProps {
  /**
   * تعداد ردیف‌های اسکلتی که نمایش داده می‌شود.
   * @default 5
   */
  rowCount?: number;
}

const TablePlaceholder: React.FC<TablePlaceholderProps> = ({ rowCount = 5 }) => {
  return (
    <div dir="rtl" className="p-6 bg-white rounded-lg border border-gray-200 relative overflow-hidden">
      {/* این div برای محو کردن و نمایش اسکلت در پس‌زمینه است */}
      <div className="opacity-80">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-9 w-48 bg-gray-200 rounded-md animate-pulse"></div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 w-1/6"><div className="h-4 bg-gray-300 rounded animate-pulse"></div></th>
                <th className="px-6 py-3 w-2/5"><div className="h-4 bg-gray-300 rounded animate-pulse"></div></th>
                <th className="px-6 py-3 w-2/5"><div className="h-4 bg-gray-300 rounded animate-pulse"></div></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.from({ length: 3 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-300 rounded animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-300 rounded animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-300 rounded animate-pulse"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Placeholder for Pagination */}
        <div className="flex items-center justify-between mt-4">
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Spinner Overlay */}
      <div className="absolute inset-0 bg-white/5 bg-opacity-50 flex items-center justify-center">
        <Spinner />
      </div>
    </div>
  );
};

export default TablePlaceholder;