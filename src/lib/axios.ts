// src/lib/axios.ts

import axios, { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { API_BASE_URL } from "@/config/api";
import NProgress from "nprogress";
import { toast } from "sonner";

export const api = axios.create({
  // ... (تنظیمات اولیه بدون تغییر)
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "accept-language": "fa",
  },
});

// ... (کد مربوط به NProgress و Request Interceptor بدون تغییر)
let requestCount = 0;
const startProgress = () => { if (requestCount === 0) NProgress.start(); requestCount++; };
const stopProgress = () => { requestCount--; if (requestCount <= 0) { NProgress.done(); requestCount = 0; } };

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


// --- مهم‌ترین تغییر اینجاست ---
api.interceptors.response.use(
  // ۱. این تابع برای پاسخ‌های با کد 2xx اجرا می‌شود
  (response: AxiosResponse) => {
    stopProgress();
    const responseData = response.data;

    // چک می‌کنیم آیا بدنه پاسخ، ساختار یک خطا را دارد یا نه
    if (responseData && responseData.type === 'error' && responseData.status >= 400) {
      // اگر خطا بود، یک Promise رد شده (rejected) برمی‌گردانیم
      // این کار باعث می‌شود که .catch() یا onError در useMutation اجرا شود
      const error = new AxiosError(
        responseData.data || 'خطایی رخ داده است', // پیام خطا
        String(responseData.status), // کد خطا
        response.config,
        response.request,
        response
      );
      
      // پیام خطا را به آبجکت error اضافه می‌کنیم تا در کامپوننت قابل دسترس باشد
      error.message = responseData.data || 'خطایی رخ داده است';

      return Promise.reject(error);
    }

    // اگر ساختار خطا را نداشت، پاسخ موفقیت‌آمیز است
    return response;
  },

  // ۲. این تابع برای پاسخ‌های غیر 2xx اجرا می‌شود (بدون تغییر)
  (error: AxiosError) => {
    stopProgress();

    if (!error.response) {
      toast.error("خطای شبکه", {
        description: "اتصال به سرور برقرار نشد. لطفاً اینترنت خود را بررسی کنید.",
        position: "bottom-left",
      });
      return Promise.reject(error);
    }

    const responseData = error.response.data as any;
    let errorMessage = "یک خطای پیش‌بینی نشده رخ داده است.";

    if (responseData) {
      if (typeof responseData.data === 'string') errorMessage = responseData.data;
      else if (typeof responseData.message === 'string') errorMessage = responseData.message;
    }
    
    error.message = errorMessage;
    
    if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = '/login';
        toast.error("نشست شما منقضی شده", {
            description: "لطفاً دوباره وارد شوید.",
            position: "bottom-left",
        });
    }

    return Promise.reject(error);
  }
);