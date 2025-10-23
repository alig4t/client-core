// src/components/permission/PermissionTableWrapper.tsx

import React, { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import PermissionService from "./PermissionService";
import TablePlaceholder from "@/components/Layout/TablePlaceholder";
import TableErrorState from "@/components/Layout/TableErrorState";
import DateUtil, { GEORGIAN_TO_JALALI } from "@/core/forms/DateUtils";
import { Checkbox } from "@/core/components/form/Checkbox";
import type { Option } from "@/core/forms/OptionUtils";
import Table from "@/core/components/Table/DataTable";
import { Eye, Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the expected structure of a single permission item
interface Permission {
  id: number;
  name: string;
  showName: string;
  createdAt: string;
}

interface PermissionTableProps {
  filters: DynamicFilters;
  // onSelectionChange: (selectedIds: (string | number)[]) => void;
}

// ... (sortOptions and sizeOptions arrays remain the same)
const sortOptions: Option[] = [
  { label: "تاریخ ایجاد (صعودی)", value: "createdAt,asc" },
  { label: "تاریخ ایجاد (نزولی)", value: "createdAt,desc" },
  { label: "نام نمایشی (صعودی)", value: "showName,asc" },
  { label: "نام نمایشی (نزولی)", value: "showName,desc" },
  { label: "نام سیستمی (صعودی)", value: "name,asc" },
  { label: "نام سیستمی (نزولی)", value: "name,desc" },
];

const PermissionTableWrapper: React.FC<PermissionTableProps> = ({
  filters,
  // onSelectionChange,
}) => {
  // State for Table control (Managed by the Parent)
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState(sortOptions[2].value as string);
  const [pageSize, setPageSize] = useState<number>(10);

  // --- Data Fetching (tanstack/react-query) ---
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["permission", page, pageSize, sort, filters],
    queryFn: () =>
      PermissionService.getAll({ page, size: pageSize, sort, filters }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const pageData: Permission[] = data?.data ?? [];
  const meta = data?.meta;

  const currentPage = meta?.currentPage ?? 0;
  const totalItems = meta?.totalItems ?? 0;
  const totalPages = meta?.totalPages ?? 0;

  // --- Handlers ---
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPage(0);
  };

  // --- Row Renderer Function (Type-safe) ---
  const renderPermissionRow = (
    permission: Permission,
    _: number, // Index is not used here, so we name it '_'
    isSelected: boolean,
    toggleSelect: () => void
  ) => (
    <tr
      key={permission.id}
      className={`hover:bg-gray-50 whitespace-nowrap ${isSelected ? "bg-purple-50" : ""}`}
    >
      {/* Checkbox Column - Handled by the Table component */}
      <td className="px-4 py-4 text-center">
        <Checkbox
          name={`row-${permission.id}`}
          standalone
          hideLabel
          checked={isSelected}
          onChange={toggleSelect}
        />
      </td>
      {/* Data Columns */}
      <td className="px-6 py-4 whitespace-nowrap">{permission.id}</td>
      <td className="px-6 py-4 whitespace-nowrap">{permission.showName}</td>
      <td className="px-6 py-4 whitespace-nowrap">{permission.name}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {DateUtil.GEORGIAN_TO_JALALI(permission.createdAt)}
      </td>
      <td className="px-6 py-4 text-center flex gap-2 items-center whitespace-nowrap">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              // onClick={() => handleViewDetails(comprehensive.id)}
              className="!p-1 text-gray-400 rounded-full group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200"
              aria-label={`View details for ${permission.showName}`}
            >
              <Pencil size={16} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={10}>
            <p>ویرایش</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              // onClick={() => handleViewDetails(comprehensive.id)}
              className="!p-1 text-gray-400 rounded-full group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200"
              aria-label={`View details for ${permission.showName}`}
            >
              <Eye size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={10}>
            <p>مشاهده</p>
          </TooltipContent>
        </Tooltip>
      </td>
    </tr>
  );

  // --- Loading/Error States ---
  if (isLoading) return <TablePlaceholder rowCount={pageSize} />;
  if (isError) {
    return (
      <TableErrorState message={(error as Error).message} onRetry={refetch} />
    );
  }

  // --- Render ---
  return (
    <Table<Permission>
      // Data and Structure Props
      data={pageData}
      dataIdKey="id"
      // Pass Header THs as a prop (no need for a dummy component)
      header={
        <>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            ID
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            نام نمایشی
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            نام سیستمی
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            تاریخ ایجاد
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            عملیات
          </th>
        </>
      }
      // Pass Row Renderer as a direct, type-safe prop
      renderRow={renderPermissionRow}
      // State and Handlers (Unchanged)
      title="لیست دسترسی ها"
      page={currentPage}
      pageSize={pageSize}
      totalPages={totalPages}
      totalItems={totalItems}
      sortValue={sort}
      // pageSizeOptions={sizeOptions}
      sortOptions={sortOptions}
      onPageChange={setPage}
      onPageSizeChange={handlePageSizeChange}
      onSortChange={handleSortChange}
      onSelectionChange={(ids) => console.log(ids)}
      isFetching={isFetching}
    />
  );
};

export default PermissionTableWrapper;
