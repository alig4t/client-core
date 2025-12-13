// src/pages/LandingPage.tsx

import React from "react";
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

  return (
    <>
      <div className="w-full">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-right mb-1"
        >
          نام کاربری
        </label>
        <input
          id="username"
          type="text"
          placeholder="مثلا aligh75"
          {...register("username")}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        />
        {errors.username && (
          <ErrorFormText msg={errors.username.message as string} />
        )}
      </div>

      <div className="w-full">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-right mb-1"
        >
          رمز عبور
        </label>
        <input
          id="password"
          type="password"
          placeholder="رمز عبور خود را وارد کنید"
          {...register("password")}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        />
        {errors.password && (
          <ErrorFormText msg={errors.password.message as string} />
        )}
      </div>
    </>
  );
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const heroContentHeightClass = "min-h-[calc(100vh-5rem)]";

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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-y-auto">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="relative isolate pt-[5rem] min-h-screen">
        {/* Background with gradient and light effects */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.1%, 28.1% 25.1%, 50.9% 10.9%, 60% 4.7%, 66.5% 35.8%, 74.1% 44.1%)",
            }}
          />
        </div>

        {/* Main Hero content with login form */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            className={`flex flex-col items-center justify-center ${heroContentHeightClass}`}
          >
            {/* Title and Description Section */}
            <div className="text-center z-10 mb-8 lg:mb-12 max-w-4xl">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
                <span className="text-indigo-600 dark:text-indigo-400">
                  {import.meta.env.VITE_APP_TITLE}:
                </span>{" "}
                مدیریت پیام‌رسان‌ها،{" "}
                <span className="block text-gray-900 dark:text-white mt-2">
                  تحلیل و پایش فوری.
                </span>
              </h1>
              <p className="mt-6 text-lg lg:text-xl leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                پلتفرم جامع پایش شبکه‌های اجتماعی. تمام پیام‌ها، کانال‌ها و
                کلیدواژه‌ها را در یک داشبورد زیبا مدیریت و تحلیل کنید.
              </p>
            </div>

            {/* Two Column Section: Animation + Login Form */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full">
              {/* Animated SVG section (Left side) */}
              <div className="lg:w-1/2 flex justify-center z-10 order-2 lg:order-1">
                <div className="w-full max-w-lg mx-auto h-96">
                  <SocialMonitoringAnimation width="100%" height="100%" />
                </div>
              </div>

              {/* Login Form Card (Right side) */}
              <div className="lg:w-1/2 flex justify-center z-10 order-1 lg:order-2">
                <div className="w-full max-w-md p-8 lg:p-10 space-y-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-700">
                  {/* Login Title Section */}
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      ورود به{" "}
                      <span className="text-indigo-600 dark:text-indigo-400">
                        داشبورد
                      </span>
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      لطفاً اطلاعات خود را وارد کنید
                    </p>
                  </div>

                  {/* Login Form */}
                  <FormWrapper
                    schema={loginSchema}
                    onSubmit={onSubmit}
                    className="space-y-5"
                  >
                    <LoginFormFields />

                    <button
                      disabled={mutation.isPending}
                      type="submit"
                      className="w-full px-4 py-3 font-bold text-white mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 disabled:from-indigo-400 disabled:to-purple-400 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] duration-300"
                    >
                      {mutation.isPending ? (
                        <span className="flex items-center justify-center gap-2">
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
                          در حال بررسی...
                        </span>
                      ) : (
                        "ورود به داشبورد"
                      )}
                    </button>
                  </FormWrapper>

                  {/* Terms text */}
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-4">
                    ورود شما به منزله قبول{" "}
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      قوانین و مقررات
                    </a>{" "}
                    است.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
