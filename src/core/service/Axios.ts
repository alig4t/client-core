import axios, { type AxiosRequestConfig } from "axios";
import NProgress from "nprogress";
import {
  ApiError,
  parseApiError,
  unwrapResponse,
  type ApiResponse,
} from "./contracts";
export type { ApiResponse } from "./contracts";

interface ApiRuntime {
  baseURL: string;
  locale: string;
  token: () => string | null;
  onUnauthorized: () => void;
  onNetworkError?: (error: ApiError) => void;
}

let runtime: ApiRuntime = {
  baseURL: "/api",
  locale: "fa",
  token: () => null,
  onUnauthorized: () => {},
};

export function configureApi(options: Partial<ApiRuntime>) {
  runtime = { ...runtime, ...options };
}

export const axiosTransport = axios.create({ timeout: 30000 });
let activeRequests = 0;

async function request<T = unknown>(
  config: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  if (activeRequests++ === 0 && typeof document !== "undefined")
    NProgress.start();
  try {
    const token = runtime.token();
    const response = await axiosTransport.request({
      ...config,
      baseURL: config.baseURL ?? runtime.baseURL,
      headers: {
        "accept-language": runtime.locale,
        ...(token ? { Authorization: "Bearer " + token } : {}),
        ...config.headers,
      },
    });
    return unwrapResponse<T>(response.data, response.status);
  } catch (cause) {
    if (axios.isCancel(cause)) throw cause;
    const error =
      cause instanceof ApiError
        ? cause
        : axios.isAxiosError(cause)
          ? parseApiError(
              cause.response?.data,
              cause.response?.status ?? 0,
              cause,
            )
          : new ApiError(
              cause instanceof Error ? cause.message : "خطای پیش‌بینی‌نشده",
              0,
              {},
              cause,
            );
    if (error.status === 401) runtime.onUnauthorized();
    if (error.status === 0) runtime.onNetworkError?.(error);
    throw error;
  } finally {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0 && typeof document !== "undefined")
      NProgress.done();
  }
}

export const api = {
  request,
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, url, method: "get" }),
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => request<T>({ ...config, url, data, method: "post" }),
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => request<T>({ ...config, url, data, method: "put" }),
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => request<T>({ ...config, url, data, method: "patch" }),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, url, method: "delete" }),
};
