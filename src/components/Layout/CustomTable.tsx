import React from "react";
import { FiChevronUp } from "react-icons/fi";
import { IoCarSportOutline } from "react-icons/io5";

// Define types for columns and component properties
export interface Column {
  key: string;
  label: string;
  flex?: number;
}

// Use a Generic Type for data
// Each data item must have a unique identifier
interface TableProps<T extends { id: number | string }> {
  title: string;
  columns: Column[];
  data: T[];
  renderCell: (item: T, key: string) => React.ReactNode;
}

// Define the component as a Generic Function Component
const CustomTable = <T extends { id: number | string }>({
  title,
  columns,
  data,
  renderCell,
}: TableProps<T>) => {
  return (
    // Use theme variables for background and text color
    <div className="w-full mx-auto p-4 sm:p-6 rounded-lg bg-card text-card-foreground border shadow-sm">
      {/* Table Title Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-x-3">
          <span className="text-muted-foreground">
            <IoCarSportOutline fontSize={24} />
          </span>
          <h2 className="font-bold text-lg">{title}</h2>
        </div>
        <button className="text-muted-foreground">
          <FiChevronUp />
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Column Headers */}
          <div className="flex w-full text-right text-sm text-muted-foreground border-b pb-3">
            {columns.map((col) => (
              <div
                key={col.key}
                style={{ flex: col.flex || 1 }}
                className="px-2"
              >
                {col.label}
              </div>
            ))}
          </div>

          {/* Data Rows */}
          <div>
            {data.length > 0 ? (
              data.map((item) => (
                <div
                  key={item.id}
                  className="flex w-full items-center text-right text-sm py-4 border-b last:border-b-0"
                >
                  {columns.map((col) => (
                    <div
                      key={`${item.id}-${col.key}`}
                      style={{ flex: col.flex || 1 }}
                      className="px-2"
                    >
                      {renderCell(item, col.key)}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                هیچ داده‌ای برای نمایش وجود ندارد.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
