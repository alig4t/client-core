import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useCore } from "../../entity/CoreProvider";
import type { Option } from "../../forms/OptionUtils";
import type { BaseService } from "../../service/BaseService";
import { BulkOperationError, type EntityId } from "../../service/contracts";
import ConfirmationModal from "../general/modal/ConfirmationModal";
import {
  PaginatedDataTable,
  type PaginatedFetchParams,
  type PaginatedFetchResult,
} from "./DataTable";
export type RenderRowFunction<T> = (
  item: T,
  index: number,
  onDelete: (id: EntityId) => void,
) => ReactNode;
export interface BaseDataTableProps<
  T,
  TFilters extends Record<string, unknown> = Record<string, unknown>,
> {
  queryKey: string;
  service?: Pick<BaseService<T>, "getAll" | "deleteMany">;
  filters?: TFilters;
  defaultPageSize?: number;
  defaultSort?: string;
  header: ReactNode;
  renderRow: RenderRowFunction<T>;
  title?: string;
  sortOptions: Option[];
  dataIdKey?: keyof T;
  onSelectionChange?: (ids: EntityId[]) => void;
  enableDelete?: boolean;
  deletePermission?: string;
  customFetchFn?: (
    params: PaginatedFetchParams<TFilters>,
  ) => Promise<PaginatedFetchResult<T>>;
}
export default function BaseDataTable<
  T extends object,
  TFilters extends Record<string, unknown> = Record<string, unknown>,
>({
  service,
  queryKey,
  renderRow,
  dataIdKey = "id" as keyof T,
  enableDelete = true,
  deletePermission,
  customFetchFn,
  ...props
}: BaseDataTableProps<T, TFilters>) {
  const client = useQueryClient(),
    { can } = useCore();
  const [ids, setIds] = useState<EntityId[]>([]);
  const allowed = enableDelete && Boolean(service) && can(deletePermission);
  const mutation = useMutation({
    mutationFn: async (values: EntityId[]) => {
      if (!allowed || !service) throw new Error("اجازه حذف وجود ندارد");
      return service.deleteMany(values);
    },
    onSuccess: () => {
      setIds([]);
      toast.success("حذف انجام شد");
    },
    onError: (error) => {
      toast.error(error.message);
      if (error instanceof BulkOperationError)
        setIds(error.result.failed.map((item) => item.id));
    },
    onSettled: () => client.invalidateQueries({ queryKey: [queryKey] }),
  });
  const fetchPage = useCallback(
    (params: PaginatedFetchParams<TFilters>) => {
      if (customFetchFn) return customFetchFn(params);
      if (!service) throw new Error("سرویس فهرست مشخص نشده است");
      return service.getAll(params);
    },
    [service, customFetchFn],
  );
  return (
    <>
      <PaginatedDataTable
        {...props}
        queryKey={queryKey}
        dataIdKey={dataIdKey}
        fetchPage={fetchPage}
        defaultSort={props.defaultSort ?? "createdAt,desc"}
        renderRow={(item, index) =>
          renderRow(item, index, (id) => {
            if (allowed) setIds([id]);
          })
        }
        onDeleteSelected={allowed ? setIds : undefined}
        onSelectionChange={props.onSelectionChange}
      />
      <ConfirmationModal
        isOpen={ids.length > 0}
        onClose={() => {
          if (!mutation.isPending) setIds([]);
        }}
        onConfirm={() => mutation.mutate(ids)}
        title="تأیید حذف"
        message={"حذف " + ids.length + " مورد انجام شود؟"}
        isDeleting={mutation.isPending}
      />
    </>
  );
}
