// src/components/Table/Table.tsx

import React, { useState, useEffect, useMemo, type FC } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Checkbox } from "@/core/components/form/Checkbox";

import { PAGE_SIZE_OPTIONS, type Option } from "@/core/forms/OptionUtils";

import Button from "../../../components/Button/Button";
import { Select } from "../form/Select";
import { Trash2 } from "lucide-react";
import TablePlaceholder from "@/components/Layout/TablePlaceholder";
import TableErrorState from "@/components/Layout/TableErrorState";

export const THEAD: FC<{ className?: string; children: React.ReactNode }> = ({
  className = "",
  children,
}) => {
  return (
    <th
      className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center ${className}`}
    >
      {children}
    </th>
  );
};

export const TBODY: FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-center ${className}`}>
      {children}
    </td>
  );
};

// --- Types for Props ---
type RenderRowFunction<T> = (
  item: T,
  index: number,
  isSelected: boolean,
  toggleSelect: () => void
) => React.ReactNode;

interface TableProps<T> {
  // Data and Structure Definition
  data: T[];
  header: React.ReactNode;
  renderRow: RenderRowFunction<T>;
  title?: string;
  // Pagination & Sorting State
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  sortValue: string;
  // pageSizeOptions: Option[];
  sortOptions: Option[];

  // Handlers
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  onSortChange: (newSort: string) => void;

  // Selection: NOW OPTIONAL, CONTROLS SELECTION MODE
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  dataIdKey: keyof T;

  // Loading/Fetching State
  isFetching?: boolean;
}

/**
 * A highly reusable table component that controls pagination and selection.
 */
const Table = <T extends { [key: string]: any }>({
  data,
  header,
  renderRow,
  title,
  page,
  pageSize,
  totalPages,
  totalItems,
  sortValue,
  sortOptions,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onSelectionChange, // Can be undefined
  dataIdKey,
  isFetching = false,
}: TableProps<T>) => {
  // Determine if selection mode is active
  const isSelectionMode = !!onSelectionChange;

  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  // Reset selections when data changes (e.g., page or filter changes)
  useEffect(() => {
    if (isSelectionMode) {
      setSelectedIds([]);
    }
  }, [data, isSelectionMode]);

  // Notify parent of selection changes IF in selection mode
  useEffect(() => {
    if (isSelectionMode) {
      onSelectionChange(selectedIds);
    }
  }, [selectedIds, onSelectionChange, isSelectionMode]);

  // Get the IDs of the data currently visible on the page
  const currentPageIds = useMemo(
    () => data.map((item) => item[dataIdKey] as string | number),
    [data, dataIdKey]
  );

  // Check if all items on the current page are selected
  const allSelected =
    isSelectionMode &&
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.includes(id));

  // --- Selection Handlers ---

  const toggleSelect = (id: string | number) => {
    if (!isSelectionMode) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (!isSelectionMode) return;

    if (allSelected) {
      // Deselect all visible items
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      // Select all visible items not already selected
      const idsToSelect = currentPageIds.filter(
        (id) => !selectedIds.includes(id)
      );
      setSelectedIds((prev) => [...prev, ...idsToSelect]);
    }
  };

  // --- Pagination Render Logic (Omitted for brevity, remains unchanged) ---
  const renderPageButtons = () => {
    if (totalPages <= 1) return null;

    const maxVisiblePages = 4;
    let startPage = Math.max(0, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    const pages = [];

    // First page button
    if (startPage > 0) {
      pages.push(
        <button
          key={0}
          onClick={() => onPageChange(0)}
          className="px-2.5 py-1 text-xs border bg-gray-50 dark:bg-gray-700 border-gray-400 dark:border-gray-600 rounded-md hover:bg-gray-100"
        >
          1
        </button>
      );
      if (startPage > 1) {
        pages.push(
          <span
            key="start-ellipsis"
            className="px-2.5 py-1 text-xs bg-gray-50 dark:bg-transparent text-gray-500"
          >
            ...
          </span>
        );
      }
    }

    // Visible page buttons
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-2.5 py-1 text-xs border rounded-md ${
            i === page
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white dark:bg-gray-700 border-gray-400 dark:border-gray-600 hover:bg-gray-100"
          }`}
        >
          {i + 1}
        </button>
      );
    }

    // Last page button
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(
          <span
            key="end-ellipsis"
            className="px-2.5 py-1 text-xs text-gray-500"
          >
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages - 1}
          onClick={() => onPageChange(totalPages - 1)}
          className="px-2.5 bg-white dark:bg-gray-700 dark:border-gray-600 border-gray-200 py-1 text-xs border rounded-md hover:bg-gray-100"
        >
          {totalPages}
        </button>
      );
    }

    return <div className="flex flex-wrap gap-1 mx-4">{pages}</div>;
  };

  // --- Render ---

  return (
    <div
      dir="rtl"
      className={`p-6 bg-[var(--white)] rounded-lg border max-w-xs min-w-full sm:max-w-sm sm:min-w-full md:max-w-xl border-[var(--border)] transition-opacity ${isFetching ? "opacity-50" : "opacity-100"}`}
    >
      {/* Controls: Sort and Page Size (Unchanged) */}

      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center mb-4 w-full gap-y-3">
        <h2 className="text-lg text-[var(--primary-text)] font-semibold flex-1">
          {title}
        </h2>
        <div className="sm:max-w-2/3 flex  gap-2 items-center sm:items-end">
          {isSelectionMode && selectedIds.length > 0 && (
            <Button
              variant="danger"
              icon={Trash2}
              badgeCount={2}
              onClick={() => setSelectedIds([])}
            >
              حذف
            </Button>
          )}

          {/* {isSelectionMode && selectedIds.length > 0 && (
        <div className="mb-4 p-3 bg-purple-50 dark:bg-gray-950 rounded-lg flex justify-between items-center">
          <span className="text-sm text-purple-700">
            **{selectedIds.length}** مورد انتخاب شده
          </span>
          <div className="space-x-2 space-x-reverse">
            <Button
              variant="secondary"
              onClick={() => setSelectedIds([])}
              // className="px-2.5 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
            >
              حذف موارد انتخاب شده
            </Button>
          
          </div>
        </div>
      )} */}

          <Select
            minilabel="مرتب سازی براساس"
            className="min-w-[180px]"
            options={sortOptions}
            onChange={(value) => onSortChange(value as string)}
            value={sortValue}
          />

          <Select
            minilabel="تعداد در صفحه"
            className="min-w-[100px]"
            value={pageSize}
            options={PAGE_SIZE_OPTIONS}
            onChange={(value) => onPageSizeChange(Number(value))}
          />
        </div>
      </div>

      {/* Table Structure */}
      <div className="overflow-x-auto">
        <table className="divide-y min-w-full divide-gray-200">
          {/* THEAD */}
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr className="[&>th:first-child]:w-12">
              {/* 2. Checkbox Column (Only rendered if selection mode is active) */}
              {isSelectionMode && (
                <th className="px-4 py-3 text-center">
                  {/* <Checkbox 
                        checked={allSelected} 
                        onChange={toggleSelectAll} 
                        indeterminate={selectedIds.length > 0 && !allSelected}
                      /> */}
                </th>
              )}
              {/* Custom Headers passed as prop */}
              {header}
            </tr>
          </thead>

          {/* TBODY */}
          <tbody className="bg-[var(--white)] divide-y divide-gray-200 dark:divide-gray-700">
            {data.length > 0 ? (
              data.map((item, index) => {
                const id = item[dataIdKey] as string | number;
                const isSelected = selectedIds.includes(id);

                // Use a modified renderRow function that can skip the checkbox
                const rowContent = renderRow(
                  item,
                  index,
                  isSelected,
                  () => toggleSelect(id) // Pass the toggle handler
                );

                // Extract children from the returned row (<tr>)
                const children = React.Children.toArray(
                  (rowContent as any).props.children
                );

                return (
                  <tr
                    key={id}
                    // Apply selection styling if applicable
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800  text-[var(--muted-text)]  whitespace-nowrap ${isSelectionMode && isSelected ? "bg-gray-100 dark:bg-gray-950" : ""}`}
                  >
                    {/* 3. Checkbox TD (Only rendered if selection mode is active) */}
                    {isSelectionMode && (
                      <td className="px-4 py-4 text-center">
                        <Checkbox
                          name={`row-${id}`}
                          standalone
                          hideLabel
                          checked={isSelected}
                          onChange={() => toggleSelect(id)}
                        />
                      </td>
                    )}
                    {/* Render the rest of the columns */}
                    {children.slice(1)}
                  </tr>
                );
              })
            ) : (
              <tr>
                {/* Adjust colspan based on whether the checkbox column is included (+1 if included) */}
                <td
                  // colSpan={
                  //   React.Children.count(header) + (isSelectionMode ? 1 : 0)
                  // }
                  colSpan={100}
                  className="text-center py-10 text-gray-500"
                >
                  داده‌ای یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer (Unchanged) */}
      <div className="flex flex-wrap items-center justify-between mt-6 mb-2">
        <span className="text-sm text-gray-600 order-3 sm:order-1 w-full sm:w-auto mt-2 sm:mt-0 text-center sm:text-right">
          {totalItems} رکورد
        </span>

        <div className="flex gap-1 items-center justify-center order-2 mx-auto sm:mx-0">
          {totalPages > 0 && (
            <button
              onClick={() => onPageChange(Math.max(page - 1, 0))}
              disabled={page === 0}
              className="px-4 py-2 border-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-100"
            >
              قبلی
            </button>
          )}

          {renderPageButtons()}

          {totalPages > 0 && (
            <button
              onClick={() => onPageChange(Math.min(page + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 border-gray-500  dark:bg-gray-700 dark:hover:bg-gray-600 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-100"
            >
              بعدی
            </button>
          )}
        </div>
        {}
        <span className="text-sm text-gray-600 order-1 sm:order-3 w-full sm:w-auto mt-2 sm:mt-0 text-center sm:text-left">
          صفحه {totalPages > 0 ? page + 1 : 0} از {totalPages}
        </span>
      </div>
    </div>
  );
};

// --- Data Fetching Wrapper with Internal Pagination State ---
export interface PaginatedFetchParams<TFilters> {
  page: number;
  size: number;
  sort: string;
  filters?: TFilters;
}

export interface PaginatedFetchResult<TData> {
  data: TData[];
  meta?: {
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
    pageSize?: number;
    isLastPage?: boolean;
  };
}

type BasePaginatedTableProps<TData extends Record<string, any>> = Pick<
  TableProps<TData>,
  | "header"
  | "renderRow"
  | "title"
  | "sortOptions"
  | "dataIdKey"
  | "onSelectionChange"
>;

export interface PaginatedTableProps<
  TData extends Record<string, any>,
  TFilters = Record<string, any>
>
  extends BasePaginatedTableProps<TData> {
  queryKey: string;
  fetchPage: (
    params: PaginatedFetchParams<TFilters>
  ) => Promise<PaginatedFetchResult<TData>>;
  filters?: TFilters;
  defaultPageSize?: number;
  defaultSort?: string;
}

export const PaginatedDataTable = <
  TData extends Record<string, any>,
  TFilters = Record<string, any>
>({
  queryKey,
  fetchPage,
  filters,
  defaultPageSize = 10,
  defaultSort,
  ...tableProps
}: PaginatedTableProps<TData, TFilters>) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortValue, setSortValue] = useState<string>(
    defaultSort ?? String(tableProps.sortOptions[0]?.value ?? "")
  );

  useEffect(() => {
    setPage(0);
  }, [filters]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [queryKey, page, pageSize, sortValue, filters],
    queryFn: () =>
      fetchPage({ page, size: pageSize, sort: sortValue, filters }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const pageData = data?.data ?? [];
  const meta = data?.meta ?? {};
  const currentPage =
    typeof meta.currentPage === "number" ? meta.currentPage : page;
  const totalPages = meta.totalPages ?? 0;
  const totalItems = meta.totalItems ?? 0;
  const resolvedPageSize = meta.pageSize ?? pageSize;

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0);
  };

  const handleSortChange = (newSort: string) => {
    setSortValue(String(newSort));
    setPage(0);
  };

  if (isLoading) {
    return <TablePlaceholder rowCount={resolvedPageSize} />;
  }

  if (isError) {
    return (
      <TableErrorState message={(error as Error).message} onRetry={refetch} />
    );
  }

  return (
    <Table<TData>
      {...tableProps}
      data={pageData}
      dataIdKey={tableProps.dataIdKey}
      page={currentPage}
      pageSize={resolvedPageSize}
      totalPages={totalPages}
      totalItems={totalItems}
      sortValue={sortValue}
      onPageChange={setPage}
      onPageSizeChange={handlePageSizeChange}
      onSortChange={handleSortChange}
      isFetching={isFetching}
    />
  );
};

export default Table;
