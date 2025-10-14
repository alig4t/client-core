// src/components/permission/PermissionTable.tsx

import React, { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import type { PermissionModel } from "@/Models/Permission/PermissionModel";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import type { PagedResponse } from "../BaseService";
import PermissionService from "./PermissionService";
import Spinner from "@/components/general/Spinner";
import ErrorMessage from "@/components/general/ErrorMessage";
import TablePlaceholder from "@/components/Layout/TablePlaceholder";
import TableErrorState from "@/components/Layout/TableErrorState";
import Select, { type Option } from "@/components/form/Select";
import { GEORGIAN_TO_JALALI } from "@/core/forms/DateUtils";
import { Checkbox } from "@/components/form/Checkbox";

interface PermissionTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: number[]) => void; // برای ارتباط با والد
}

const PermissionTable: React.FC<PermissionTableProps> = ({
  filters,
  onSelectionChange,
}) => {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("showName,asc");
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // ✅ مدیریت انتخاب‌ها

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["permission", page, pageSize, sort, filters],
    queryFn: () =>
      PermissionService.getAll({ page, size: pageSize, sort, filters }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const pageData = data?.data ?? [];
  const meta = data?.meta;

  const currentPage = meta?.currentPage ?? 0;
  const totalItems = meta?.totalItems ?? 0;
  const totalPages = meta?.totalPages ?? 0;

  // --- مدیریت انتخاب‌ها ---
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === pageData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pageData.map((p) => p.id));
    }
  };

  // ارسال لیست انتخاب‌شده‌ها به والد (اختیاری)
  React.useEffect(() => {
    onSelectionChange?.(selectedIds);
  }, [selectedIds, onSelectionChange]);

  // --- گزینه‌ها ---
  const sortOptions: Option[] = [
    { label: "تاریخ ایجاد (صعودی)", value: "createdAt,asc" },
    { label: "تاریخ ایجاد (نزولی)", value: "createdAt,desc" },
    { label: "نام نمایشی (صعودی)", value: "showName,asc" },
    { label: "نام نمایشی (نزولی)", value: "showName,desc" },
    { label: "نام سیستمی (صعودی)", value: "name,asc" },
    { label: "نام سیستمی (نزولی)", value: "name,desc" },
  ];

  const sizeOptions: Option[] = [
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
  ];

  if (isLoading) return <TablePlaceholder rowCount={pageSize} />;
  if (isError) {
    return <TableErrorState message={(error as Error).message} onRetry={refetch} />;
  }

  return (
    <div
      dir="rtl"
      className={`p-6 bg-white rounded-lg border border-gray-200 transition-opacity ${isFetching ? "opacity-50" : "opacity-100"}`}
    >
      {/* دکمه عملیاتی (فقط وقتی چیزی انتخاب شده) */}
      {selectedIds.length > 0 && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg flex justify-between items-center">
          <span className="text-sm text-purple-700">
            {selectedIds.length} مورد انتخاب شده
          </span>
          <div className="space-x-2 space-x-reverse">
            <button
              onClick={() => {
                // مثلاً حذف
                console.log("حذف:", selectedIds);
                setSelectedIds([]);
              }}
              className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              حذف انتخاب‌ شده‌ها
            </button>
            {/* می‌توانید دکمه‌های دیگر اضافه کنید */}
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center mb-4 w-full">
        <h2 className="text-lg font-semibold flex-1">لیست دسترسی‌ها</h2>
        <div className="max-w-2/3 flex gap-2 items-center">
        {/* {selectedIds.length > 0 && (<button
              onClick={() => {
                // مثلاً حذف
                console.log("حذف:", selectedIds);
                setSelectedIds([]);
              }}
              className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 min-w-48"
            >
              حذف انتخاب‌ شده‌ها
            </button>)} */}

          <Select
            className="min-w-[120px]"
            options={sortOptions}
            onChange={(e) => setSort(e.target.value)}
            value={sort}
          />
          <Select
          className="max-w-[120px]"
            value={pageSize}
            options={sizeOptions}
            onChange={(e) => setPageSize(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* ستون چک‌باکس */}
              <th className="px-4 py-3 text-center w-12">
                {/* <Checkbox
                  checked={selectedIds.length === pageData.length && pageData.length > 0}
                  onChange={toggleSelectAll}
                /> */}
              </th>
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pageData.length > 0 ? (
              pageData.map((permission) => (
                <tr key={permission.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-center">
                  <Checkbox
                    name={`row-${permission.id}`}
                    standalone
                    hideLabel
                    checked={selectedIds.includes(permission.id)}
                    onChange={() => toggleSelect(permission.id)}
                  />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{permission.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{permission.showName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{permission.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {GEORGIAN_TO_JALALI(permission.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  داده‌ای یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
          className="px-4 py-2 text-sm border rounded-md disabled:opacity-50"
        >
          قبلی
        </button>
        <span>صفحه {currentPage + 1} از {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={currentPage >= totalPages - 1}
          className="px-4 py-2 text-sm border rounded-md disabled:opacity-50"
        >
          بعدی
        </button>
      </div>
    </div>
  );
};

export default PermissionTable;