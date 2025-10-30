import axios, { AxiosError, type AxiosResponse } from "axios";
import { API_BASE_URL } from "@/config/api";
import NProgress from "nprogress";
import { toast } from "sonner";

// --- Type Definitions ---
// interface ApiResponse<T = any> {
//   type: 'data' | 'error';
//   status: number;
//   data: T;
// }
export interface ApiResponse<T = any> {
  type: 'data' | 'error';
  status: number;
  data: T;
  meta?: {
    totalItems: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
    isLastPage?: boolean;
  };
  timestamp?: string;
}

interface ApiErrorData {
  data?: string;
  message?: string;
}

// --- Axios Instance ---
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "accept-language": "fa",
  },
});

// --- Progress Bar Management ---
let requestCount = 0;
const startProgress = () => {
  if (requestCount === 0) NProgress.start();
  requestCount++;
};
const stopProgress = () => {
  requestCount--;
  if (requestCount <= 0) {
    NProgress.done();
    requestCount = 0;
  }
};

// --- Request Interceptor ---
api.interceptors.request.use(
  (config) => {
    startProgress();
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    stopProgress();
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
api.interceptors.response.use(
  // Cast to any to allow returning ApiResponse instead of AxiosResponse
  ((response: AxiosResponse<ApiResponse>) => {
    stopProgress();
     if (response.config.responseType === 'blob') {
      return response; // کل response را برگردان
    }
    const responseData = response.data;
    if (responseData && responseData.type === 'error' && responseData.status >= 400) {
      const errorMessage = (responseData.data as string) || 'خطایی از سمت سرور رخ داده است.';
      const error = new AxiosError(errorMessage, String(responseData.status), response.config, response.request, response);
      error.message = errorMessage;
      return Promise.reject(error);
    }

    console.log(responseData)
    // Return the full ApiResponse (with data + meta preserved)
    return responseData;
  }) as any,
  (error: AxiosError<ApiErrorData>) => {
    stopProgress();

    if (!error.response) {
      toast.error("خطای شبکه", {
        description: "اتصال به سرور برقرار نشد. لطفاً اینترنت خود را بررسی کنید.",
        position: "bottom-left",
      });
      return Promise.reject(error);
    }
    
    const responseData = error.response.data;
    let errorMessage = "یک خطای پیش‌بینی نشده رخ داده است.";

    if (responseData) {
      if (typeof responseData.data === 'string') errorMessage = responseData.data;
      else if (typeof responseData.message === 'string') errorMessage = responseData.message;
    }
    
    error.message = errorMessage;
    
    if (error.response.status === 401) {
        localStorage.removeItem("token");
        if (window.location.pathname !== '/login') {
            toast.error("نشست شما منقضی شده", {
                description: "لطفاً دوباره وارد شوید.",
                position: "bottom-left",
            });
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        }
    }

    return Promise.reject(error);
  }
);