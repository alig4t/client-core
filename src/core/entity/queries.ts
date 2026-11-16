import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BaseService, ServerSideParams } from "../service/BaseService";
import type { EntityId } from "../service/contracts";
export const entityKeys = {
  all: (name: string) => ["entity", name] as const,
  lists: (name: string) => ["entity", name, "list"] as const,
  list: (name: string, params: unknown) =>
    ["entity", name, "list", params] as const,
  detail: (name: string, id: EntityId) =>
    ["entity", name, "detail", String(id)] as const,
};
export function useEntityList<T>(
  name: string,
  service: Pick<BaseService<T>, "getAll">,
  params: ServerSideParams<T>,
  enabled = true,
) {
  return useQuery({
    queryKey: entityKeys.list(name, params),
    queryFn: ({ signal }) => service.getAll({ ...params, signal }),
    refetchOnWindowFocus: false,
    enabled,
  });
}
export function useEntityDetail<T>(
  name: string,
  service: Pick<BaseService<T>, "getById">,
  id: EntityId | undefined,
) {
  return useQuery({
    queryKey: entityKeys.detail(name, id ?? ""),
    queryFn: ({ signal }) => service.getById(id!, { signal }),
    enabled: id !== undefined,
  });
}
export function useEntityMutations<T, TCreate, TUpdate>(
  name: string,
  service: BaseService<T, TCreate, TUpdate>,
) {
  const client = useQueryClient();
  const refresh = () =>
    client.invalidateQueries({ queryKey: entityKeys.all(name) });
  return {
    create: useMutation({
      mutationFn: (values: TCreate) => service.create(values),
      onSuccess: refresh,
    }),
    update: useMutation({
      mutationFn: ({ id, values }: { id: EntityId; values: TUpdate }) =>
        service.update(id, values),
      onSuccess: refresh,
    }),
    remove: useMutation({
      mutationFn: (ids: EntityId[]) => service.deleteMany(ids),
      onSettled: refresh,
    }),
  };
}
