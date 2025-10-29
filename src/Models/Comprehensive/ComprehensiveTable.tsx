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
import OptionUtils, {
  buildSortOptions,
  type Option,
} from "@/core/forms/OptionUtils";
import Table, { TBODY, THEAD } from "@/core/components/Table/DataTable";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";
import { Eye, Pencil } from "lucide-react";
import { createMessages } from "@/core/forms/MessageUtils";
import { PageWrapper } from "@/components/Layout/PageWrapper";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Link } from "react-router-dom";
import LinkView from "@/components/general/LinkView";
import { VIEWNAME } from "@/router/ViewName";

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
      <TBODY className="text-center">
        <Checkbox
          name={`row-${comprehensive.id}`}
          standalone
          hideLabel
          checked={isSelected}
          onChange={toggleSelect}
        />
      </TBODY>
      {/* Data Columns */}
      <TBODY>{comprehensive.id}</TBODY>
      <TBODY>{comprehensive.stringField}</TBODY>
      <TBODY>{comprehensive.integerField}</TBODY>
      <TBODY>{comprehensive.longField}</TBODY>
      <TBODY>{comprehensive.doubleField}</TBODY>
      <TBODY>{comprehensive.bigDecimalField}</TBODY>
      <TBODY>{comprehensive.booleanField ? "بله" : "خیر"}</TBODY>
      <TBODY>{comprehensive.dateField}</TBODY>
      <TBODY>{comprehensive.localDateField}</TBODY>
      <TBODY>{comprehensive.localDateTimeField}</TBODY>
      <TBODY>
        {OptionUtils.GET_BOOLEAN_OPTION(comprehensive.booleanField)}
      </TBODY>
      <TBODY>{comprehensive.uniqueField}</TBODY>
      <TBODY>{comprehensive.indexedField}</TBODY>
      <TBODY>
        <LinkView
          viewName={VIEWNAME.COMPREHENSIVE_DISPLAY}
          id={comprehensive.oneToOneUser?.id}
          label={comprehensive.oneToOneUser?.username}
        />
      </TBODY>
      <TBODY>{comprehensive.manyToOneChannel.channelName}</TBODY>
      <TBODY>{DateUtil.GEORGIAN_TO_JALALI(comprehensive.createdAt)}</TBODY>
      <TBODY>{DateUtil.GEORGIAN_TO_JALALI(comprehensive.updatedAt)}</TBODY>

      <TBODY className="flex">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              // onClick={() => handleViewDetails(comprehensive.id)}
              className="!p-1 text-gray-400 rounded-full group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200"
              aria-label={`View details for ${comprehensive.stringField}`}
            >
              <Pencil size={16} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            <p>ویرایش</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={'/dashboard/portal/comprehensive/' + comprehensive.id} className="!p-1 text-gray-400 rounded-full group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200">

              <Eye size={20} />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={10}>

            <p>مشاهده</p>

          </TooltipContent>
        </Tooltip>
      </TBODY>
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
          <THEAD>{comprehensiveModelMeta.fields.id.label}</THEAD>
          <THEAD>{comprehensiveModelMeta.fields.stringField.label}</THEAD>
          <THEAD>{comprehensiveModelMeta.fields.integerField.label}</THEAD>
          <THEAD>{comprehensiveModelMeta.fields.longField.label}</THEAD>
          <THEAD>{comprehensiveModelMeta.fields.doubleField.label}</THEAD>
          <THEAD>{comprehensiveModelMeta.fields.bigDecimalField.label}</THEAD>
          <THEAD>{comprehensiveModelMeta.fields.booleanField.label}</THEAD>
          <THEAD>{comprehensiveModelMeta.fields.dateField.label}</THEAD>
          <THEAD>{comprehensiveModelMeta.fields.localDateField.label}</THEAD>
          <THEAD>
            {comprehensiveModelMeta.fields.localDateTimeField.label}
          </THEAD>
          <THEAD>{comprehensiveModelMeta.fields.enumField.label}</THEAD>
          <THEAD>{comprehensiveModelMeta.fields.uniqueField.label}</THEAD>
          <THEAD>{comprehensiveModelMeta.fields.indexedField.label}</THEAD>
          <THEAD>{comprehensiveModelMeta.fields.oneToOneUser.label}</THEAD>
          <THEAD>{comprehensiveModelMeta.fields.manyToOneChannel.label}</THEAD>
          <THEAD>{comprehensiveModelMeta.fields.createdAt.label}</THEAD>
          <THEAD>{comprehensiveModelMeta.fields.updatedAt.label}</THEAD>
          <THEAD>عملیات</THEAD>
        </>
      }
      renderRow={renderPermissionRow}
      title={comprehensiveModelMeta.messages.list.title}
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
