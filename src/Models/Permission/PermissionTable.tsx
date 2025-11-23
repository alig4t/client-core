// src/components/permission/PermissionTableWrapper.tsx

import React from "react";

import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import PermissionService from "./PermissionService";
import DateUtil from "@/core/forms/DateUtils";
import { Checkbox } from "@/core/components/form/Checkbox";
import type { Option } from "@/core/forms/OptionUtils";
import { PaginatedDataTable } from "@/core/components/Table/DataTable";
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
  const fetchPermissionPage = ({
    page,
    size,
    sort,
    filters: currentFilters,
  }: {
    page: number;
    size: number;
    sort: string;
    filters?: DynamicFilters;
  }) =>
    PermissionService.getAll({
      page,
      size,
      sort,
      filters: currentFilters,
    });

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

  return (
    <PaginatedDataTable<Permission, DynamicFilters>
      dataIdKey="id"
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
      renderRow={renderPermissionRow}
      title="لیست دسترسی ها"
      sortOptions={sortOptions}
      queryKey="permission"
      fetchPage={fetchPermissionPage}
      filters={filters}
      defaultSort={sortOptions[2].value as string}
      defaultPageSize={10}
      onSelectionChange={(ids) => console.log(ids)}
    />
  );
};

export default PermissionTableWrapper;
