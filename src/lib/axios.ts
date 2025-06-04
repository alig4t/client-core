import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import NProgress from "nprogress";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "accept-language": "fa",
  },
});

// یک شمارنده برای اینکه وقتی چند درخواست هم‌زمان داریم، فقط موقع آخرین درخواست nprogress قطع بشه
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

// Interceptors
api.interceptors.request.use(
  (config) => {
    startProgress();
    return config;
  },
  (error) => {
    stopProgress();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    stopProgress();
    return response;
  },
  (error) => {
    stopProgress();
    return Promise.reject(error);
  }
);
