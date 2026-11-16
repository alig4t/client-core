import type { FilterOperator } from "../forms/FilterOperators";
import type { ServiceOperation, ServiceOperationName } from "./contracts";
export interface ServiceOptions<T> {
  operations?: Partial<Record<ServiceOperationName, ServiceOperation>>;
  pageAdapter?: (
    response: ApiResponse<unknown>,
    params: ServerSideParams<T>,
  ) => Page<T>;
}
import { api } from "./Axios";
import {
  BulkOperationError,
  normalizePage,
  serializeQuery,
  type ApiResponse,
  type BulkDeleteResult,
  type EntityId,
  type Page,
  type QueryParams,
  type RequestOptions,
} from "./contracts";

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
type FilterKeys<T> = {
  [K in keyof T]: `${string & K}_${FilterOperator}`;
}[keyof T];
export type Filters<T> = Partial<
  Record<FilterKeys<T> | `${string}_${FilterOperator}`, unknown>
>;
export interface ServerSideParams<T = Record<string, unknown>> {
  page?: number;
  size?: number;
  sort?: string;
  filters?: Filters<T>;
  signal?: AbortSignal;
}
export type ApiResponsePayload<T> = Page<T>;
export interface ServiceTransport {
  request<T>(config: {
    url: string;
    method: RequestOptions["method"];
    data?: unknown;
    params?: URLSearchParams;
    signal?: AbortSignal;
  }): Promise<ApiResponse<T>>;
}

export class BaseService<
  T,
  TCreate = Partial<T>,
  TUpdate = Partial<T>,
  TId extends EntityId = EntityId,
> {
  protected url: string;
  protected transport: ServiceTransport;
  protected options: ServiceOptions<T>;
  constructor(
    url: string,
    transport: ServiceTransport = api,
    options: ServiceOptions<T> = {},
  ) {
    this.url = url;
    this.transport = transport;
    this.options = options;
  }
  private operation(
    name: ServiceOperationName,
    method: RequestOptions["method"],
    path = "",
    id?: EntityId,
  ): RequestOptions {
    const operation = this.options.operations?.[name];
    return {
      method: operation?.method ?? method,
      path: (operation?.path ?? path).replace(
        /:id\b/g,
        encodeURIComponent(String(id)),
      ),
    };
  }

  protected async call<R = unknown>(options: RequestOptions): Promise<R> {
    return (await this.request<R>(options)).data;
  }

  protected request<R>(options: RequestOptions): Promise<ApiResponse<R>> {
    const suffix = options.path ? "/" + options.path.replace(/^\/+/, "") : "";
    return this.transport.request<R>({
      url: options.path?.startsWith("/")
        ? options.path
        : this.url.replace(/\/$/, "") + suffix,
      method: options.method,
      data: options.body,
      params: options.query ? serializeQuery(options.query) : undefined,
      signal: options.signal,
    });
  }

  async getAll(params: ServerSideParams<T> = {}): Promise<Page<T>> {
    const page = params.page ?? 0;
    const size = params.size ?? 10;
    const response = await this.request<T[] | PagedResponse<T>>({
      ...this.operation("list", "get"),
      query: {
        ...params.filters,
        page,
        size,
        sort: params.sort,
      } as QueryParams,
      signal: params.signal,
    });
    return this.options.pageAdapter
      ? this.options.pageAdapter(response, params)
      : normalizePage(response, page, size);
  }

  getById(id: TId, options?: { signal?: AbortSignal }): Promise<T> {
    return this.call<T>({
      ...this.operation("detail", "get", encodeURIComponent(String(id)), id),
      signal: options?.signal,
    });
  }

  create(data: TCreate): Promise<T> {
    return this.call<T>({ ...this.operation("create", "post"), body: data });
  }
  update(id: TId, data: TUpdate): Promise<T> {
    return this.call<T>({
      ...this.operation("update", "put", encodeURIComponent(String(id)), id),
      body: data,
    });
  }
  patch(id: TId, data: Partial<TUpdate>): Promise<T> {
    return this.call<T>({
      method: "patch",
      path: encodeURIComponent(String(id)),
      body: data,
    });
  }
  async delete(id: TId): Promise<void> {
    await this.call(
      this.operation("delete", "delete", encodeURIComponent(String(id)), id),
    );
  }

  async deleteMany(ids: TId[]): Promise<BulkDeleteResult> {
    const settled = await Promise.allSettled(ids.map((id) => this.delete(id)));
    const result: BulkDeleteResult = { succeeded: [], failed: [] };
    settled.forEach((entry, index) => {
      if (entry.status === "fulfilled") result.succeeded.push(ids[index]);
      else result.failed.push({ id: ids[index], error: entry.reason });
    });
    if (result.failed.length) throw new BulkOperationError(result);
    return result;
  }
}
