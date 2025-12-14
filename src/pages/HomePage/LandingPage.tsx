// src/pages/LandingPage.tsx

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/stores/AuthContext";
import ErrorFormText from "@/core/components/form/ErrorFormText";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import UserService from "@/Models/User/UserService";
import Navbar from "./HomeNavbar";
import { MoonIcon, SunIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const loginSchema = z.object({
  username: z.string().nonempty("نام کاربری را وارد نمایید"),
  password: z.string().nonempty("رمز عبور را وارد نمایید"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginFormFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<LoginFormData>();

  return (
    <div className="space-y-5">
      <div className="w-full group">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right mb-2 transition-colors duration-700"
        >
          نام کاربری
        </label>
        <input
          id="username"
          type="text"
          placeholder="نام کاربری خود را وارد کنید"
          {...register("username")}
          className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-cyan-500/20 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-right focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/30 dark:focus:ring-cyan-500/20 transition-all duration-700 hover:border-cyan-400 dark:hover:border-cyan-500/30"
        />
        {errors.username && (
          <ErrorFormText msg={errors.username.message as string} />
        )}
      </div>

      <div className="w-full group">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right mb-2 transition-colors duration-700"
        >
          رمز عبور
        </label>
        <input
          id="password"
          type="password"
          placeholder="رمز عبور خود را وارد کنید"
          {...register("password")}
          className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-cyan-500/20 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-right focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/30 dark:focus:ring-cyan-500/20 transition-all duration-700 hover:border-cyan-400 dark:hover:border-cyan-500/30"
        />
        {errors.password && (
          <ErrorFormText msg={errors.password.message as string} />
        )}
      </div>
    </div>
  );
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    // Ensure dark class is applied on mount based on state
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => UserService.login(data),
    onSuccess: (data) => {
      const token = data.data.token;
      const user = data.data.user;

      if (!token || !user) {
        throw new Error("Invalid login response: token or user missing");
      }

      authLogin(token, user);
      toast.success("ورود موفقیت آمیز بود", {
        description: "خوش آمدید! در حال انتقال به داشبورد...",
        position: "bottom-left",
      });

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    },
    onError: (error: any) => {
      toast.error("ورود ناموفق بود", {
        description:
          error?.message || "نام کاربری یا رمز عبور شما صحیح نمی‌باشد.",
        position: "bottom-left",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-950 text-slate-900 dark:text-white overflow-hidden relative transition-colors duration-500">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-400/30 dark:bg-cyan-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
      </div>

      {/* Navbar */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Dark Mode Toggle Button */}
      <div className="fixed top-20 left-6 z-50">
        <div
          className="flex items-center justify-center w-12 h-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 dark:border-cyan-500/20 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-white dark:hover:bg-slate-800/90 hover:border-cyan-500/50 dark:hover:border-cyan-500/40 shadow-lg shadow-cyan-500/20 dark:shadow-cyan-500/10"
          onClick={toggleDarkMode}
        >
          <AnimatePresence mode="wait" initial={false}>
            {darkMode ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <SunIcon className="h-5 w-5 text-yellow-500" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <MoonIcon className="h-5 w-5 text-slate-700" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Side - Content */}
            <div className="space-y-8 text-right order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 dark:bg-cyan-500/10 border border-cyan-500/40 dark:border-cyan-500/20 backdrop-blur-sm">
                <span className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-cyan-700 dark:text-cyan-300 font-medium">پلتفرم پایش و تحلیل</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="block text-slate-900 dark:text-white mb-3">
                  مدیریت هوشمند
                </span>
                <span className="block bg-gradient-to-l from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
                  شبکه‌های اجتماعی
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                تمام پیام‌رسان‌ها، کانال‌ها و کلیدواژه‌های خود را در یک داشبورد
                قدرتمند پایش و تحلیل کنید. دسترسی لحظه‌ای به اطلاعات حیاتی.
              </p>

              {/* Features List */}
              <div className="space-y-4 pt-4">
                {[
                  { icon: "📊", text: "تحلیل داده‌های لحظه‌ای" },
                  { icon: "🔍", text: "جستجوی پیشرفته در محتوا" },
                  { icon: "⚡", text: "رابط کاربری سریع و کارآمد" },
                  { icon: "🛡️", text: "امنیت و حریم خصوصی" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 text-slate-700 dark:text-slate-300 group hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{feature.icon}</span>
                    <span className="text-base font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {[
                  { value: "99.9%", label: "آپتایم" },
                  { value: "24/7", label: "پشتیبانی" },
                  { value: "1M+", label: "پیام روزانه" },
                ].map((stat, index) => (
                  <div key={index} className="text-center lg:text-right">
                    <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-l from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Login Card */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                {/* Glowing effect container */}
                <div className="relative group">
                  {/* Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-25 dark:opacity-20 group-hover:opacity-35 dark:group-hover:opacity-30 transition-all duration-700"></div>

                  {/* Card */}
                  <div className="relative bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 dark:border-cyan-500/20 rounded-2xl p-8 shadow-2xl transition-all duration-700">
                    {/* Login Header */}
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-700">
                        ورود به پنل مدیریت
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-700">
                        اطلاعات خود را وارد نمایید
                      </p>
                    </div>

                    {/* Login Form */}
                    <FormWrapper
                      schema={loginSchema}
                      onSubmit={onSubmit}
                      className="space-y-6"
                    >
                      <LoginFormFields />

                      <button
                        disabled={mutation.isPending}
                        type="submit"
                        className="w-full px-6 py-4 font-bold text-white mt-6 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:from-slate-500 disabled:to-slate-600 dark:disabled:from-slate-600 dark:disabled:to-slate-700 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-700 transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {mutation.isPending ? (
                          <span className="flex items-center justify-center gap-3">
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            در حال احراز هویت...
                          </span>
                        ) : (
                          "ورود به داشبورد"
                        )}
                      </button>
                    </FormWrapper>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 transition-colors duration-700">
                      <p className="text-xs text-center text-slate-500 dark:text-slate-500 transition-colors duration-700">
                        با ورود به سیستم،{" "}
                        <a
                          href="#"
                          className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors duration-700 font-medium"
                        >
                          شرایط و قوانین
                        </a>{" "}
                        استفاده را می‌پذیرید
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-500 text-sm transition-colors duration-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>اتصال امن و رمزگذاری شده</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-500/40 dark:bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0.6;
          }
          90% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
