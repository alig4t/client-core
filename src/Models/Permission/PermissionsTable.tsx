import React, { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import type { PermissionModel } from "@/Models/Permission/PermissionModel";
import type { DynamicFilters } from "@/core/FilterForm/DynamicFilterForm";
import type { PagedResponse } from "../BaseService";
import PermissionService from "./PermissionService";
import Spinner from "@/components/general/Spinner";
import ErrorMessage from "@/components/general/ErrorMessage";
import TablePlaceholder from "@/components/Layout/TablePlaceholder";
import TableErrorState from "@/components/Layout/TableErrorState";
import Select, { type Option } from "@/components/form/Select";

const PermissionsTable: React.FC<{ filters: DynamicFilters }> = ({
  filters,
}) => {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("showName,asc");
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["permissions", page, pageSize, sort, filters],
    queryFn: () =>
      PermissionService.getAll({ page, size: pageSize, sort, filters }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    retry: false,
  });

  console.log(data);

  if (isLoading) return <TablePlaceholder rowCount={pageSize} />;

  // if (isError) return <ErrorMessage message={(error as Error).message} onRetry={refetch} />;

  if (isError) {
    return (
      <TableErrorState message={(error as Error).message} onRetry={refetch} />
    );
  }

  const pageData = data?.data ?? [];
  const meta = data?.meta;
  console.log(meta);
  // const { totalItems,totalPages,pageSize,currentPage,isLastPage} = meta

  const currentPage = meta?.currentPage ?? 0;
  const totalItems = meta?.totalItems ?? 0;
  const totalPages = meta?.totalPages ?? 0;
  const isLastPage = meta && "isLastPage" in meta ? meta.isLastPage : false;

  const sortOptions: Option[] = [
    { label: "تاریخ ایجاد (صعودی)", value: "createdAt,asc" },
    { label: "تاریخ ایجاد (نزولی)", value: "createdAt,desc" },
    { label: "نام نمایشی (صعودی)", value: "showName,asc" },
    { label: "نام نمایشی (نزولی)", value: "showName,desc" },
    { label: "نام سیستمی (صعودی)", value: "name,asc" },
    { label: "نام سیستمی (نزولی)", value: "name,desc" },
  ];

  return (
    <div
      dir="rtl"
      className={`p-6 bg-white rounded-lg border border-gray-200 transition-opacity ${isFetching ? "opacity-50" : "opacity-100"}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex-1">لیست دسترسی‌ها</h2>
        <Select
          className="max-w-1/2 lg:max-w-1/4"
          key={"sort"}
          options={sortOptions}
          onChange={(e) => setSort(e.target.value)}
          value={sort}
        />
        
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                نام نمایشی
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                نام سیستمی
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pageData.length > 0 ? (
              pageData.map((permission) => (
                <tr key={permission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {permission.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {permission.showName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {permission.name}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-10 text-gray-500">
                  داده‌ای یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
          className="px-4 py-2 text-sm border rounded-md disabled:opacity-50"
        >
          قبلی
        </button>
        <span>
          صفحه {currentPage + 1} از {totalPages}
        </span>
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

export default PermissionsTable;
