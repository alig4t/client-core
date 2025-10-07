import React, { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { TagModel } from "@/Models/Tag/TagModel";
import TagService from "./TagService";
import Spinner from "@/components/general/Spinner";
import ErrorMessage from "@/components/general/ErrorMessage";
import type { DynamicFilters } from "@/core/FilterForm/DynamicFilterForm";
import type { PagedResponse } from "../BaseService";

const TagsTable: React.FC<{ filters: DynamicFilters }> = ({ filters }) => {
  const [page, setPage] = useState(0); // Spring pages are 0-indexed
  const [sort, setSort] = useState("name,asc");
  const [pageSize, setPageSize] = useState(10);

  // useQuery now depends on page, sort, and filters.
  // When any of these change, it will refetch automatically.
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<
    PagedResponse<TagModel>
  >({
    // 3. نوع داده خروجی را مشخص کنید
    queryKey: ["tags", page, pageSize, sort, filters],
    queryFn: async () => {
      const response = await TagService.getAll({
        page,
        size: pageSize,
        sort,
        filters,
      });
      return response.data;
    },
    // 4. از placeholderData به جای keepPreviousData استفاده کنید
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <ErrorMessage
        message={
          error instanceof Error ? error.message : "An unknown error occurred"
        }
        onRetry={refetch}
      />
    );
  }

  const pageData = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div
      dir="rtl"
      className={`p-6 bg-white rounded-lg border border-gray-200 transition-opacity ${isFetching ? "opacity-50" : "opacity-100"}`}
    >
      {/* Table Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">لیست تگ‌ها</h2>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm"
        >
          <option value="name,asc">نام (صعودی)</option>
          <option value="name,desc">نام (نزولی)</option>
          <option value="id,desc">جدیدترین</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* ... Thead ... */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                نام تگ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pageData.length > 0 ? (
              pageData.map((tag: TagModel) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{tag.id}</td>
                  <td className="px-6 py-4">{tag.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center py-10 text-gray-500">
                  هیچ داده‌ای برای نمایش وجود ندارد.
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
          disabled={page === 0}
          className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50"
        >
          قبلی
        </button>
        <span className="text-sm">
          صفحه {page + 1} از {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50"
        >
          بعدی
        </button>
      </div>
    </div>
  );
};

export default TagsTable;
