// src/components/permissions/ViewPagePlaceholder.tsx

import React from 'react';
import Spinner from '@/core/components/general/Spinner';

interface ViewPagePlaceholderProps {
  /**
   * Number of display fields to simulate in the grid.
   * @default 16
   */
  fieldCount?: number;
}

const ViewPagePlaceholder: React.FC<ViewPagePlaceholderProps> = ({ fieldCount = 16 }) => {
  // Divide fields into rows of 3 (matches numberOfColumns={3})
  const rows = Math.ceil(fieldCount / 3);
  const fieldsPerRow = 3;

  return (
    <div dir="rtl" className="p-8 min-h-screen font-sans">
      {/* Breadcrumb Placeholder */}
      <div className="mb-4 flex items-center space-x-2 space-x-reverse">
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
        <div className="h-4 w-4 bg-gray-300 dark:bg-gray-500 rounded-full"></div>
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
      </div>

      {/* RecordDisplayLayout - Title & Actions */}
      <div className="bg-[var(--white)] rounded-lg border border-[var(--card-border)] shadow-md p-6 relative overflow-hidden">
        <div className="opacity-80">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            {/* Title */}
            <div className="h-7 w-48 sm:w-64 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-3 sm:mb-0"></div>
            {/* Action Button */}
            <div className="h-9 w-20 sm:w-24 bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse"></div>
          </div>

          {/* Display Fields Grid */}
          <div className="space-y-4">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array.from({ length: fieldsPerRow }).map((_, colIndex) => {
                  const fieldIndex = rowIndex * fieldsPerRow + colIndex;
                  if (fieldIndex >= fieldCount) return null;

                  return (
                    <div key={colIndex} className="space-y-2">
                      {/* Label */}
                      <div className="h-3 w-20 sm:w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                      {/* Value */}
                      <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Spinner Overlay */}
        <div className="absolute inset-0 bg-white/5 bg-opacity-50 flex items-center justify-center">
          <Spinner />
        </div>
      </div>
    </div>
  );
};

export default ViewPagePlaceholder;