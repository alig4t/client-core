import axios,{AxiosError} from "axios";
import type { AxiosResponse } from "axios";
import { API_BASE_URL } from "@/config/api";
import NProgress from "nprogress";
import { toast } from "sonner";

// ساخت یک نمونه از axios با تنظیمات پایه
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "accept-language": "fa",
  },
});

// --- مدیریت نوار پیشرفت (Progress Bar) ---
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

// --- رهگیر درخواست‌ها (Request Interceptor) ---
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

// --- رهگیر پاسخ‌ها (Response Interceptor) ---
api.interceptors.response.use(
  // ۱. این تابع برای پاسخ‌های موفق (کد 2xx) اجرا می‌شود
  (response: AxiosResponse) => {
    stopProgress();
    const responseData = response.data;

    // اگر سرور با کد 200 یک خطا برگردانده بود، آن را به عنوان خطا 처리 می‌کنیم
    if (responseData && responseData.type === 'error' && responseData.status >= 400) {
      const error = new AxiosError(
        responseData.data || 'خطایی رخ داده است',
        String(responseData.status),
        response.config,
        response.request,
        response
      );
      error.message = responseData.data || 'خطایی رخ داده است';
      return Promise.reject(error);
    }

    // ✨ بهبود اصلی: باز کردن پوسته‌ی پاسخ‌های موفق ✨
    // اگر پاسخ ساختار موفق مورد انتظار ما را داشت، فقط دیتای اصلی داخل آن را برمی‌گردانیم
    if (responseData && responseData.type === 'data' && typeof responseData.data !== 'undefined') {
      return responseData.data;
    }

    // به عنوان فال‌بک، اگر ساختار متفاوتی وجود داشت، کل بدنه دیتا را برمی‌گردانیم
    return responseData;
  },

  // ۲. این تابع برای پاسخ‌های ناموفق (غیر 2xx) اجرا می‌شود
  (error: AxiosError) => {
    stopProgress();

    // مدیریت خطای شبکه
    if (!error.response) {
      toast.error("خطای شبکه", {
        description: "اتصال به سرور برقرار نشد. لطفاً اینترنت خود را بررسی کنید.",
        position: "bottom-left",
      });
      return Promise.reject(error);
    }

    // استخراج پیام خطا از پاسخ سرور
    const responseData = error.response.data as any;
    let errorMessage = "یک خطای پیش‌بینی نشده رخ داده است.";

    if (responseData) {
      if (typeof responseData.data === 'string') errorMessage = responseData.data;
      else if (typeof responseData.message === 'string') errorMessage = responseData.message;
    }
    
    // قرار دادن پیام خطا در آبجکت error تا در useMutation قابل دسترس باشد
    error.message = errorMessage;
    
    // مدیریت خطای 401 (عدم احراز هویت)
    if (error.response.status === 401) {
        localStorage.removeItem("token");
        // برای جلوگیری از loop، چک می‌کنیم که در صفحه لاگین نباشیم
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
            toast.error("نشست شما منقضی شده", {
                description: "لطفاً دوباره وارد شوید.",
                position: "bottom-left",
            });
        }
    }

    return Promise.reject(error);
  }
);