// src/pages/Login.tsx
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { replace, useNavigate } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/stores/AuthContext";
import { FormWrapper } from "@/components/shared/FormWrapper";
import ErrorFormText from "@/core/components/form/ErrorFormText";
import { APP_LOGO_SMALL_BLUE } from "@/constants/images";
import { Link } from "react-router-dom";
import UserService from "@/Models/User/UserService";

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
          className="block text-sm font-medium text-gray-700 text-right mb-1"
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
          className="block text-sm font-medium text-gray-700 text-right mb-1"
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

export default function LoginPage({
  inModal,
  switchModal,
  onClose, // Add prop to close modal
}: {
  inModal: boolean;
  switchModal: () => void;
  onClose?: () => void; // New prop to close modal
}) {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

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

      if (inModal && onClose) {
        onClose(); // Close modal
      }
      setTimeout(() => {
        navigate("/dashboard", { replace: true }); // Immediate redirect to dashboard
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

  if (inModal) {
    return (
      <div className="w-full max-w-sm sm:max-w-md p-8 space-y-6 rounded-2xl">
        <FormWrapper
          schema={loginSchema}
          onSubmit={onSubmit}
          className="space-y-5"
        >
          <LoginFormFields />
          <button
            disabled={mutation.isPending}
            type="submit"
            className="w-full px-4 py-3 font-bold text-white mt-4 bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-indigo-400 transition-all transform hover:scale-[1.01] duration-300"
          >
            {mutation.isPending ? "در حال بررسی..." : "تایید و ادامه"}
          </button>
        </FormWrapper>

        <p className="text-xs text-center text-gray-400">
          ورود شما به منزله قبول{" "}
          <a href="#" className="font-semibold text-purple-600 hover:underline">
            قوانین و مقررات
          </a>{" "}
          رایانوین است.
        </p>

        <div className="pt-4 text-center">
          <p className="text-gray-500 text-[11px]">
            هنوز حساب کاربری نساخته‌اید؟{" "}
            <span
              onClick={switchModal}
              className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              ایجاد حساب کاربری
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen sm:bg-gray-50">
      <div className="w-full max-w-sm sm:max-w-md p-8 space-y-6 bg-white sm:shadow-xl rounded-2xl">
        <a
          href="#"
          className="-m-1.5 p-1.5 mb-2 gap-1 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
        >
          <img
            src={APP_LOGO_SMALL_BLUE}
            className="w-20 h-20 opacity-90 hover:opacity-100 transition-all"
          />
        </a>

        <div className="text-center">
          <h1 className="!text-3xl font-bold text-[var(--primary-text)] mb-2">
            ورود به پنل مدیریت
          </h1>
        </div>

        <FormWrapper
          schema={loginSchema}
          onSubmit={onSubmit}
          className="space-y-5"
        >
          <LoginFormFields />
          <button
            disabled={mutation.isPending}
            type="submit"
            className="w-full px-4 py-3 font-bold text-white mt-4 bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-indigo-400 transition-all transform hover:scale-[1.01] duration-300"
          >
            {mutation.isPending ? "در حال بررسی..." : "تایید و ادامه"}
          </button>
        </FormWrapper>

        <p className="text-xs text-center text-gray-400">
          ورود شما به منزله قبول{" "}
          <a href="#" className="font-semibold text-purple-600 hover:underline">
            قوانین و مقررات
          </a>{" "}
          رایانوین است.
        </p>

        <div className="pt-4 text-center">
          <p className="text-gray-500 text-[11px]">
            هنوز حساب کاربری نساخته‌اید؟{" "}
            <Link
              to="/register"
              className="font-semibold text-purple-600 hover:text-purple-700 hover:underline"
            >
              ایجاد حساب کاربری
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
