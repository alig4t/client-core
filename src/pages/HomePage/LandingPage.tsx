import type { User } from "@/stores/AuthContext";
import type { NavigateFunction } from "react-router-dom";
// src/pages/LandingPage.tsx

import ErrorFormText from "@/core/components/form/ErrorFormText";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import UserService from "@/Models/User/UserService";
import { useAuth } from "@/stores/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { Eye,EyeOff } from "lucide-react";
import React,{ useEffect,useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod/v3";
import Navbar from "./HomeNavbar";
import "./LandingPage.css";
import SocialMonitoringAnimation from "./SocialMonitoringAnimation";

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

   const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-5">
      <div className="w-full">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right mb-2"
        >
          نام کاربری
        </label>
        <input
          id="username"
          type="text"
          placeholder="نام کاربری خود را وارد کنید"
          {...register("username")}
          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-right focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
        />
        {errors.username && (
          <ErrorFormText msg={errors.username.message as string} />
        )}
      </div>


      <div className="w-full">
      <label
        htmlFor="password"
        className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-right mb-2"
      >
        رمز عبور
      </label>

      <div className="relative">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="رمز عبور خود را وارد کنید"
          {...register("password")}
          // className="w-full px-4 py-3 pr-12 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-right focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
       className="w-full px-4 pl-16 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-right focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
        
     />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500/70 hover:text-slate-700 transition-colors dark:hover:text-slate-300"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {errors.password && (
        <ErrorFormText msg={errors.password.message as string} />
      )}
    </div>

    </div>
  );
}

function LoggedInSection({ user, navigate }: { user: User | null; navigate: NavigateFunction }) {
  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="relative group">
        {/* Subtle glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-br from-green-400/20 via-emerald-400/20 to-teal-400/20 dark:from-transparent dark:via-transparent dark:to-transparent rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-all duration-500"></div>

        <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl dark:shadow-2xl dark:shadow-slate-950/50">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 dark:shadow-green-900/30 transform group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              خوش آمدید! 👋
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {user?.username || user?.name || 'کاربر گرامی'}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { label: 'کانال‌های فعال', value: '12', icon: '📱', gradient: 'from-blue-500 to-cyan-500' },
              { label: 'پیام‌های جدید', value: '847', icon: '💬', gradient: 'from-indigo-500 to-blue-500' },
              { label: 'کلیدواژه‌ها', value: '24', icon: '🔍', gradient: 'from-violet-500 to-indigo-500' },
              { label: 'گزارش‌ها', value: '8', icon: '📊', gradient: 'from-purple-500 to-pink-500' },
            ].map((stat, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-4 border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform duration-300"
              >
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-3xl`}></div>
                <div className="relative">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-6 py-3.5 font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 rounded-lg shadow-lg shadow-green-500/25 hover:shadow-green-500/40 dark:shadow-green-900/40 dark:hover:shadow-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              ورود به داشبورد
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-6 py-3 font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              مشاهده آمار و گزارش‌ها
            </button>
          </div>

          {/* Status Indicator */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600 dark:bg-green-500"></span>
              </span>
              <span className="text-slate-600 dark:text-slate-400">سیستم آنلاین و فعال</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        {[
          { icon: '⚡', label: 'پردازش سریع' },
          { icon: '🔒', label: 'امنیت بالا' },
          { icon: '📈', label: 'تحلیل هوشمند' },
        ].map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300"
          >
            <span className="text-2xl">{feature.icon}</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">{feature.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin, user, isAuthenticated } = useAuth();
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
  }, [darkMode]);

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
    onError: (error: Error) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 dark:from-blue-600/10 dark:to-cyan-600/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]"></div>

        {/* Floating Geometric Elements - Large */}
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-slow opacity-40 dark:opacity-25"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${15 + Math.random() * 15}s`,
            }}
          >
            {i % 5 === 0 ? (
              <div className="w-10 h-10 border-2 border-blue-400/40 dark:border-blue-500/25 rounded-lg rotate-45"></div>
            ) : i % 5 === 1 ? (
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 dark:from-indigo-500/15 dark:to-purple-500/15 rounded-full"></div>
            ) : i % 5 === 2 ? (
              <div className="w-6 h-6 bg-blue-400/50 dark:bg-blue-500/25 rounded-sm rotate-12"></div>
            ) : i % 5 === 3 ? (
              <div className="w-12 h-12 border-2 border-indigo-400/30 dark:border-indigo-500/20 rounded-full"></div>
            ) : (
              <div className="w-7 h-7 bg-gradient-to-br from-cyan-400/25 to-blue-400/25 dark:from-cyan-500/12 dark:to-blue-500/12 rounded-lg rotate-45"></div>
            )}
          </div>
        ))}

        {/* Floating Medium Shapes */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`med-${i}`}
            className="absolute animate-float-medium opacity-35 dark:opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${12 + Math.random() * 10}s`,
            }}
          >
            {i % 4 === 0 ? (
              <div className="w-5 h-5 border border-purple-400/40 dark:border-purple-500/25 rounded rotate-45"></div>
            ) : i % 4 === 1 ? (
              <div className="w-4 h-4 bg-gradient-to-br from-blue-300/30 to-indigo-300/30 dark:from-blue-600/15 dark:to-indigo-600/15 rounded-full"></div>
            ) : i % 4 === 2 ? (
              <div className="w-6 h-6 border-2 border-cyan-400/35 dark:border-cyan-500/20 rounded-full"></div>
            ) : (
              <div className="w-3 h-3 bg-indigo-400/45 dark:bg-indigo-500/25 rounded-sm rotate-12"></div>
            )}
          </div>
        ))}

        {/* Floating Dots - More */}
        {[...Array(50)].map((_, i) => (
          <div
            key={`dot-${i}`}
            className="absolute bg-blue-500/50 dark:bg-blue-400/35 rounded-full animate-float-drift"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          ></div>
        ))}

        {/* Floating Lines */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute animate-float-slow opacity-25 dark:opacity-15"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 7}s`,
              animationDuration: `${18 + Math.random() * 12}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent dark:from-transparent dark:via-blue-500/25 dark:to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Navbar */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />


      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 lg:gap-12 items-center">

            {/* Left Side - Content */}
            <div className="space-y-8 text-right order-1 lg:order-1 animate-fade-in-up">

   
              {/* Badge */}
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-200/50 dark:border-blue-500/20 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-500"></span>
                </span>
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">پلتفرم پایش و تحلیل</span>
              </div> */}

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-center lg:text-right text-4xl mt-4 lg:text-6xl font-bold leading-tight text-slate-900 dark:text-white">
                  مدیریت هوشمند
                  <span className="block bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 bg-clip-text text-transparent mt-2 animate-gradient">
                    شبکه‌های اجتماعی
                  </span>
                </h1>

                {/* Description */}
                <p className=" mx-auto text-center lg:text-right text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                  تمام پیام‌رسان‌ها، کانال‌ها و کلیدواژه‌های خود را در یک داشبورد
                  قدرتمند پایش و تحلیل کنید. دسترسی لحظه‌ای به اطلاعات حیاتی و آمار دقیق.
                </p>
              </div>

              {/* Features List */}
              {/* <div className="space-y-4">
                {[
                  { icon: "📊", text: "تحلیل داده‌های لحظه‌ای", gradient: "from-blue-500 to-cyan-500" },
                  { icon: "🔍", text: "جستجوی پیشرفته در محتوا", gradient: "from-indigo-500 to-blue-500" },
                  { icon: "⚡", text: "رابط کاربری سریع و کارآمد", gradient: "from-violet-500 to-indigo-500" },
                  { icon: "🛡️", text: "امنیت و حریم خصوصی", gradient: "from-purple-500 to-pink-500" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 text-slate-700 dark:text-slate-300 group animate-fade-in-right"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-[2px] transform group-hover:scale-110 transition-transform duration-300`}>
                      <div className="w-full h-full rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center">
                        <span className="text-xl">{feature.icon}</span>
                      </div>
                    </div>
                    <span className="text-base font-medium">{feature.text}</span>
                  </div>
                ))}
              </div> */}

              {/* Animation Section */}
              <div className="hidden lg:block pt-8">
                <div className="w-full relative group">
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/5 dark:via-indigo-500/5 dark:to-purple-500/5 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                  <div className="relative h-96">
                    <SocialMonitoringAnimation width="100%" height="100%" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Card or Logged In Section */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-center animate-fade-in-up animation-delay-200">
              {isAuthenticated ? (
                <LoggedInSection user={user} navigate={navigate} />
              ) : (
              <div className="w-full max-w-md">
                {/* Card */}
                <div className="relative group">
                  {/* Subtle glow effect - only in light mode */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 dark:from-transparent dark:via-transparent dark:to-transparent rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-all duration-500"></div>

                  <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl dark:shadow-2xl dark:shadow-slate-950/50">
                    {/* Login Header */}
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 transform group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        ورود به پنل مدیریت
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
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
                        className="w-full px-6 py-3.5 font-semibold text-white mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 dark:shadow-blue-900/40 dark:hover:shadow-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:from-slate-300 disabled:to-slate-400 disabled:text-slate-100 dark:disabled:from-slate-700 dark:disabled:to-slate-800 dark:disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
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
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                      <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                        با ورود به سیستم،{" "}
                        <a
                          href="#"
                          className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors font-medium underline-offset-2 hover:underline"
                        >
                          شرایط و قوانین
                        </a>{" "}
                        استفاده را می‌پذیرید
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>اتصال امن و رمزگذاری شده</span>
                </div>
              </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
