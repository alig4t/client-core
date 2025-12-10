// src/components/permissions/CreatePagePlaceholder.tsx

import React from 'react';
import Spinner from '@/core/components/general/Spinner';

interface CreatePagePlaceholderProps {
  /**
   * Number of form rows to simulate.
   * @default 3
   */
  rowCount?: number;
}

const CreatePagePlaceholder: React.FC<CreatePagePlaceholderProps> = ({ rowCount = 3 }) => {
  return (
    <div dir="rtl" className="sm:p-8 min-h-screen font-sans">
      {/* Breadcrumb Placeholder */}
      <div className="mb-4 flex items-center space-x-2 space-x-reverse">
        <div className="h-4 w-16 sm:w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
        <div className="h-4 w-4 bg-gray-300 dark:bg-gray-500 rounded-full"></div>
        <div className="h-4 w-20 sm:w-28 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
      </div>

      {/* Page Header Placeholder */}
      <div className="mb-6">
        <div className="h-8 w-48 sm:w-64 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
      </div>

      {/* Form Card */}
      <div className="bg-[var(--white)] p-6 rounded-lg border border-[var(--card-border)] shadow-md max-w-2xl mx-auto relative overflow-hidden">
        {/* Overlay for blur/skeleton */}
        <div className="opacity-80 space-y-6">
          {/* RowContainer - 2 columns (rowCount * 2 fields) */}
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              </div>
            </div>
          ))}

          {/* RowContainer - 1 column (uploader) */}
          <div className="space-y-2">
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          </div>

          {/* RowContainer - 3 columns (last section) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 bg-gray-2 00 dark:bg-gray-600 rounded animate-pulse"></div>
              <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-1"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-28 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-28 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
          </div>

          {/* Button Panel */}
          <div className="flex justify-end space-x-3 gap-3 space-x-reverse pt-2">
            <div className="h-10 w-20 sm:w-24 bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse"></div>
            <div className="h-10 w-20 sm:w-24 bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse"></div>
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

export default CreatePagePlaceholder;