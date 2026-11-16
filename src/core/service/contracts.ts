export type EntityId = string | number;
export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue | readonly QueryValue[]>;

export interface PageMeta {
  totalItems: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
  isLastPage?: boolean;
}

export interface ApiResponse<T = unknown> {
  type: "data" | "error";
  status: number;
  data: T;
  meta?: PageMeta;
  timestamp?: string;
}

export interface Page<T> {
  data: T[];
  meta: PageMeta;
}

export interface RequestOptions {
  method: "get" | "post" | "put" | "patch" | "delete";
  path?: string;
  body?: unknown;
  query?: QueryParams;
  signal?: AbortSignal;
}
export type ServiceOperationName =
  | "list"
  | "detail"
  | "create"
  | "update"
  | "delete";
export interface ServiceOperation {
  path?: string;
  method?: RequestOptions["method"];
}

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string>;
  readonly cause?: unknown;
  constructor(
    message: string,
    status = 0,
    fieldErrors: Record<string, string> = {},
    cause?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.cause = cause;
  }
}

export interface BulkDeleteResult {
  succeeded: EntityId[];
  failed: { id: EntityId; error: unknown }[];
}

export class BulkOperationError extends ApiError {
  readonly result: BulkDeleteResult;
  constructor(result: BulkDeleteResult) {
    super(
      `حذف ${result.failed.length} مورد ناموفق بود؛ ${result.succeeded.length} مورد حذف شد.`,
    );
    this.name = "BulkOperationError";
    this.result = result;
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function unwrapResponse<T>(
  payload: unknown,
  status: number,
): ApiResponse<T> {
  if (
    isRecord(payload) &&
    (payload.type === "data" || payload.type === "error") &&
    "data" in payload
  ) {
    if (payload.type === "error")
      throw parseApiError(payload, Number(payload.status) || status);
    return payload as unknown as ApiResponse<T>;
  }
  return { type: "data", status, data: payload as T };
}

export function parseApiError(
  payload: unknown,
  status = 0,
  cause?: unknown,
): ApiError {
  const record = isRecord(payload) ? payload : {};
  const fields: Record<string, string> = {};
  const detail = isRecord(record.data) ? record.data : {};
  const errors =
    record.fieldErrors ?? record.errors ?? detail.fieldErrors ?? detail.errors;
  if (isRecord(errors)) {
    for (const [key, value] of Object.entries(errors)) {
      if (typeof value === "string") fields[key] = value;
      else if (Array.isArray(value)) fields[key] = value.map(String).join("، ");
    }
  } else if (Array.isArray(errors)) {
    for (const error of errors) {
      if (
        isRecord(error) &&
        typeof error.field === "string" &&
        typeof error.message === "string"
      )
        fields[error.field] = error.message;
    }
  }
  const message =
    typeof record.message === "string"
      ? record.message
      : typeof record.data === "string"
        ? record.data
        : typeof detail.message === "string"
          ? detail.message
          : "خطا در ارتباط با سرور";
  return new ApiError(message, status, fields, cause);
}

export function normalizePage<T>(
  response: ApiResponse<
    | T[]
    | {
        content: T[];
        totalElements: number;
        totalPages: number;
        number: number;
        size: number;
      }
  >,
  page = 0,
  size = 10,
): Page<T> {
  if (!Array.isArray(response.data)) {
    const value = response.data;
    if (!isRecord(value) || !Array.isArray(value.content))
      throw new ApiError("پاسخ فهرست نامعتبر است");
    return {
      data: value.content as T[],
      meta: {
        totalItems: value.totalElements,
        totalPages: value.totalPages,
        currentPage: value.number,
        pageSize: value.size,
        isLastPage: value.number >= value.totalPages - 1,
      },
    };
  }
  return {
    data: response.meta
      ? response.data
      : response.data.slice(page * size, (page + 1) * size),
    meta: response.meta ?? {
      totalItems: response.data.length,
      totalPages: Math.ceil(response.data.length / size),
      pageSize: size,
      currentPage: page,
      isLastPage: (page + 1) * size >= response.data.length,
    },
  };
}

export function serializeQuery(query: QueryParams): URLSearchParams {
  const result = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item !== undefined && item !== null && item !== "")
        result.append(key, String(item));
    }
  }
  return result;
}
