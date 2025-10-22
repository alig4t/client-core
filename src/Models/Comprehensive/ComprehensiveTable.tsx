// src/components/permission/PermissionTable.tsx

import React, { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";

import TablePlaceholder from "@/components/Layout/TablePlaceholder";
import TableErrorState from "@/components/Layout/TableErrorState";
import DateUtil from "@/core/forms/DateUtils";
import { Checkbox } from "@/core/components/form/Checkbox";
import type { ComprehensiveModel } from "./ComprehensiveModel";
import ComprehensiveService from "./ComprehensiveService";
import { buildSortOptions, type Option } from "@/core/forms/OptionUtils";
import Table from "@/core/components/Table/DataTable";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";
import { Eye } from "lucide-react";

interface ComprehensiveTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: number[]) => void; // برای ارتباط با والد
}

// const sortOptions: Option[] = [
//   { label: "تاریخ ایجاد (صعودی)", value: "createdAt,asc" },
//   { label: "تاریخ ایجاد (نزولی)", value: "createdAt,desc" },
//   { label: "رشته متنی (صعودی)", value: "stringField,asc" },
//   { label: "رشته متنی (نزولی)", value: "stringField,desc" },
//   { label: "رشته عددی (صعودی)", value: "integerField,asc" },
//   { label: "رشته عددی (نزولی)", value: "integerField,desc" },
// ];
const sortOptions: Option[] = buildSortOptions(comprehensiveModelMeta);

const ComprehensiveTableWrapper: React.FC<ComprehensiveTableProps> = ({
  filters,
  onSelectionChange,
}) => {
  // State for Table control (Managed by the Parent)
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("stringField,asc");
  const [pageSize, setPageSize] = useState<number>(10);

  // --- Data Fetching (tanstack/react-query) ---
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["comprehensive", page, pageSize, sort, filters],
    queryFn: () =>
      ComprehensiveService.getAll({ page, size: pageSize, sort, filters }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const pageData: ComprehensiveModel[] = data?.data ?? [];
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
    comprehensive: ComprehensiveModel,
    _: number, // Index is not used here, so we name it '_'
    isSelected: boolean,
    toggleSelect: () => void
  ) => (
    <tr
      key={comprehensive.id}
      className={`hover:bg-gray-50 whitespace-nowrap ${isSelected ? "bg-purple-50" : ""}`}
    >
      {/* Checkbox Column - Handled by the Table component */}
      <td className="px-4 py-4 text-center">
        <Checkbox
          name={`row-${comprehensive.id}`}
          standalone
          hideLabel
          checked={isSelected}
          onChange={toggleSelect}
        />
      </td>
      {/* Data Columns */}
      <td className="px-6 py-4 whitespace-nowrap">{comprehensive.id}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {comprehensive.stringField}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {comprehensive.integerField}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {DateUtil.GEORGIAN_TO_JALALI(comprehensive.createdAt)}
      </td>
      <td className="px-6 py-4 text-center whitespace-nowrap">
        <button
          // onClick={() => handleViewDetails(comprehensive.id)}
          className="p-2 text-gray-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200"
          aria-label={`View details for ${comprehensive.stringField}`}
        >
          <Eye size={20} />
        </button>
      </td>
    </tr>
  );

  if (isLoading) return <TablePlaceholder rowCount={pageSize} />;
  if (isError) {
    return (
      <TableErrorState message={(error as Error).message} onRetry={refetch} />
    );
  }

  return (
    <Table<ComprehensiveModel>
      data={pageData}
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
      title="لیست ترکیبی ها "
      page={currentPage}
      pageSize={pageSize}
      totalPages={totalPages}
      totalItems={totalItems}
      sortValue={sort}
      sortOptions={sortOptions}
      onPageChange={setPage}
      onPageSizeChange={handlePageSizeChange}
      onSortChange={handleSortChange}
      onSelectionChange={(ids) => console.log(ids)}
      isFetching={isFetching}
    />
  );
};

export default ComprehensiveTableWrapper;
