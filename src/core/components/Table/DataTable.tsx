import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import type { Option } from "../../forms/OptionUtils";
import type { EntityId } from "../../service/contracts";
import { Checkbox } from "../form/Checkbox";
import { Select } from "../form/Select";
import TableErrorState from "../general/TableErrorState";
export const THEAD = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <th
    scope="col"
    className={"px-4 py-3 text-center whitespace-nowrap " + className}
  >
    {children}
  </th>
);
export const TBODY = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <td className={"px-4 py-3 text-center whitespace-nowrap " + className}>
    {children}
  </td>
);
export interface TableProps<T> {
  data: T[];
  header: ReactNode;
  renderRow: (
    item: T,
    index: number,
    selected: boolean,
    toggle: () => void,
  ) => ReactNode;
  title?: string;
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  sortValue: string;
  sortOptions: Option[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (sort: string) => void;
  onSelectionChange?: (ids: EntityId[]) => void;
  dataIdKey: keyof T;
  isFetching?: boolean;
  onDeleteSelected?: (ids: EntityId[]) => void;
  isRowSelectable?: (item: T) => boolean;
}
export default function Table<T extends object>({
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
  onSelectionChange,
  dataIdKey,
  isFetching,
  onDeleteSelected,
  isRowSelectable,
}: TableProps<T>) {
  const [selected, setSelected] = useState<EntityId[]>([]);
  useEffect(() => {
    setSelected([]);
  }, [data]);
  useEffect(() => {
    onSelectionChange?.(selected);
  }, [selected, onSelectionChange]);
  const selectable = data.filter((item) => isRowSelectable?.(item) ?? true);
  const toggle = (id: EntityId) => {
    if (selectable.some((item) => item[dataIdKey] === id))
      setSelected((values) =>
        values.includes(id)
          ? values.filter((value) => value !== id)
          : [...values, id],
      );
  };
  const all =
    selectable.length > 0 &&
    selectable.every((item) => selected.includes(item[dataIdKey] as EntityId));
  return (
    <div
      className="w-full border rounded-lg p-4 bg-[var(--card-bg)]"
      aria-busy={isFetching}
    >
      <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
        <h2>{title}</h2>
        <div className="flex flex-wrap gap-2">
          {onDeleteSelected && selected.length > 0 && (
            <button
              type="button"
              onClick={() => onDeleteSelected(selected)}
              className="text-red-600"
            >
              حذف انتخاب‌شده‌ها ({selected.length})
            </button>
          )}
          {sortOptions.length > 0 && (
            <Select
              options={sortOptions}
              value={sortValue}
              onChange={(value) => onSortChange(String(value))}
              minilabel="مرتب‌سازی"
            />
          )}
          <Select
            options={[5, 10, 20, 50].map((value) => ({
              value,
              label: String(value),
            }))}
            value={pageSize}
            onChange={(value) => onPageSizeChange(Number(value))}
            minilabel="تعداد در صفحه"
          />
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              {onSelectionChange && (
                <th>
                  <Checkbox
                    name="select-all"
                    standalone
                    hideLabel
                    aria-label="انتخاب همه ردیف‌ها"
                    checked={all}
                    onChange={(checked) =>
                      setSelected(
                        checked
                          ? selectable.map(
                              (item) => item[dataIdKey] as EntityId,
                            )
                          : [],
                      )
                    }
                  />
                </th>
              )}
              {header}
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((item, index) => {
                const id = item[dataIdKey] as EntityId;
                return (
                  <tr key={id} className="border-t">
                    {onSelectionChange && (
                      <td>
                        <Checkbox
                          name={"select-" + id}
                          standalone
                          hideLabel
                          aria-label={"انتخاب ردیف " + id}
                          checked={selected.includes(id)}
                          disabled={!(isRowSelectable?.(item) ?? true)}
                          onChange={() => toggle(id)}
                        />
                      </td>
                    )}
                    {renderRow(item, index, selected.includes(id), () =>
                      toggle(id),
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={100} className="text-center p-6">
                  داده‌ای یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex gap-3 items-center justify-between mt-4">
        <span>{totalItems} رکورد</span>
        <button
          type="button"
          disabled={page <= 0 || Boolean(isFetching)}
          onClick={() => onPageChange(page - 1)}
        >
          قبلی
        </button>
        <span>
          صفحه {totalPages ? page + 1 : 0} از {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages - 1 || Boolean(isFetching)}
          onClick={() => onPageChange(page + 1)}
        >
          بعدی
        </button>
      </div>
    </div>
  );
}
export interface PaginatedFetchParams<TFilters> {
  page: number;
  size: number;
  sort: string;
  filters?: TFilters;
  signal?: AbortSignal;
}
export interface PaginatedFetchResult<T> {
  data: T[];
  meta?: {
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
    pageSize?: number;
    isLastPage?: boolean;
  };
}
export type PaginatedTableProps<T, TFilters = Record<string, unknown>> = Pick<
  TableProps<T>,
  | "header"
  | "renderRow"
  | "title"
  | "sortOptions"
  | "dataIdKey"
  | "onSelectionChange"
> & {
  queryKey: string;
  fetchPage: (
    params: PaginatedFetchParams<TFilters>,
  ) => Promise<PaginatedFetchResult<T>>;
  filters?: TFilters;
  defaultPageSize?: number;
  defaultSort?: string;
  onDeleteSelected?: (ids: EntityId[]) => void;
};
export function PaginatedDataTable<
  T extends object,
  TFilters = Record<string, unknown>,
>({
  queryKey,
  fetchPage,
  filters,
  defaultPageSize = 10,
  defaultSort = "",
  ...props
}: PaginatedTableProps<T, TFilters>) {
  const [page, setPage] = useState(0),
    [size, setSize] = useState(defaultPageSize),
    [sort, setSort] = useState(defaultSort);
  useEffect(() => setPage(0), [filters]);
  const query = useQuery({
    queryKey: [queryKey, page, size, sort, filters],
    queryFn: ({ signal }) => fetchPage({ page, size, sort, filters, signal }),
    placeholderData: keepPreviousData,
  });
  const totalPages = query.data?.meta?.totalPages ?? 0;
  useEffect(() => {
    if (
      query.data &&
      !query.isPlaceholderData &&
      page > 0 &&
      page >= totalPages
    )
      setPage(Math.max(0, totalPages - 1));
  }, [query.data, query.isPlaceholderData, page, totalPages]);
  if (query.isPending) return <p role="status">در حال دریافت…</p>;
  if (query.isError)
    return (
      <TableErrorState
        message={query.error.message}
        onRetry={() => query.refetch()}
      />
    );
  return (
    <Table
      {...props}
      data={query.data.data}
      page={page}
      pageSize={size}
      sortValue={sort}
      totalPages={totalPages}
      totalItems={query.data.meta?.totalItems ?? query.data.data.length}
      onPageChange={setPage}
      onPageSizeChange={(value) => {
        setSize(value);
        setPage(0);
      }}
      onSortChange={(value) => {
        setSort(value);
        setPage(0);
      }}
      isFetching={query.isFetching}
    />
  );
}
