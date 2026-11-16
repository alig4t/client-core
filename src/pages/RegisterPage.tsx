import { useMutation } from "@tanstack/react-query";
import { z } from "zod/v3";

import UserService from "@/Models/User/UserService";
import { SOCIAL_MEDIA_LOGO } from "@/assets/icons"; // Assumed logo is imported from here
import ErrorFormText from "@/core/components/form/ErrorFormText";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import { useAuth } from "@/stores/AuthContext";
import { useFormContext } from "react-hook-form";
import { Link,useNavigate } from "react-router-dom";
import { toast } from "sonner";

// --- Schema for registration form validation ---
const registerSchema = z
  .object({
    name: z.string().min(3, "نام حداقل باید ۳ کاراکتر باشد"),
    username: z.string().nonempty("نام کاربری را وارد نمایید"),
    password: z.string().min(3, "رمز عبور حداقل باید 3 کاراکتر باشد"),
    confirmPassword: z
      .string()
      .min(3, "تکرار رمز عبور حداقل باید 3 کاراکتر باشد"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمزهای عبور با یکدیگر مطابقت ندارند",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// --- Form Fields Component with new style ---
function RegisterFormFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterFormData>();

  return (
    <>
      <div className="w-full">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 text-right mb-1"
        >
          نام
        </label>
        <input
          id="name"
          type="text"
          placeholder="نام خود را وارد کنید"
          {...register("name")}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        />
        {errors.name && <ErrorFormText msg={errors.name.message as string} />}
      </div>

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
          placeholder="یک رمز عبور قوی انتخاب کنید"
          {...register("password")}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        />
        {errors.password && (
          <ErrorFormText msg={errors.password.message as string} />
        )}
      </div>

      <div className="w-full">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 text-right mb-1"
        >
          تکرار رمز عبور
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="رمز عبور را دوباره وارد کنید"
          {...register("confirmPassword")}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        />
        {errors.confirmPassword && (
          <ErrorFormText msg={errors.confirmPassword.message as string} />
        )}
      </div>
    </>
  );
}

// --- Main Register Page Component with new style ---
export default function RegisterPage({
  inModal = false,
  switchModal = () => {},
  onClose,
}: {
  inModal?: boolean;
  switchModal?: () => void;
  onClose?: () => void;
} = {}) {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      UserService.register({
        name: data.name,
        username: data.username,
        password: data.password,
      }),
    onSuccess: (data) => {
      toast.success("ثبت‌نام موفقیت آمیز بود", {
        description: "حساب کاربری شما ایجاد شد. در حال انتقال به داشبورد.",
        position: "bottom-left",
      });
      const token = data.data.token;
      const user = data.data.user;
      authLogin(token, user);

      if (inModal && onClose) {
        console.log("onClose");
        onClose(); // Close modal
      }
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);

      // setTimeout(() => {
      //   if (inModal) {
      //     switchModal();
      //   } else {
      //     navigate("/login");
      //   }
      // }, 1500);
    },
    onError: (error: Error) => {
      toast.error("ثبت‌نام ناموفق بود", {
        description: error?.message || "لطفاً اطلاعات وارد شده را بررسی کنید.",
        position: "bottom-left",
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(data);
  };

  if (inModal) {
    return (
      <div className="w-full max-w-sm sm:max-w-[480px] p-6 pt-3 space-y-4 bg-white rounded-2xl">
        <FormWrapper
          schema={registerSchema}
          onSubmit={onSubmit}
          className="space-y-2"
        >
          <RegisterFormFields />
          <button
            disabled={mutation.isPending}
            type="submit"
            className="w-full px-4 py-3 font-bold text-white mt-4 bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-indigo-400 transition-all transform hover:scale-[1.01] duration-300"
          >
            {mutation.isPending ? "در حال ایجاد حساب..." : "ثبت نام"}
          </button>
        </FormWrapper>
        {/* </form> */}
        {/* </FormProvider> */}

        <p className="text-[11px] text-center text-gray-500">
          حساب کاربری دارید؟{" "}
          <span
            onClick={switchModal}
            className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            وارد شوید
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen sm:bg-gray-50 sm:py-12">
      <div className="w-full max-w-sm sm:max-w-[480px] p-8 space-y-6 bg-white sm:shadow-xl rounded-2xl">
        <div className="flex justify-center">
          <img
            src={`data:image/png;base64,${SOCIAL_MEDIA_LOGO}`}
            alt="Logo"
            className=""
          />
        </div>

        <div className="text-center">
          <h1 className="!text-3xl font-bold text-[var(--primary-text)] mb-2">
            ایجاد حساب کاربری
          </h1>
        </div>

        {/* <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6"> */}
        <FormWrapper
          schema={registerSchema}
          onSubmit={onSubmit}
          className="space-y-5"
        >
          <RegisterFormFields />
          <button
            disabled={mutation.isPending}
            type="submit"
            className="w-full px-4 py-3 font-bold text-white mt-4 bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-indigo-400 transition-all transform hover:scale-[1.01] duration-300"
          >
            {mutation.isPending ? "در حال ایجاد حساب..." : "ثبت نام"}
          </button>
        </FormWrapper>
        {/* </form> */}
        {/* </FormProvider> */}

        <p className="text-[11px] text-center text-gray-500">
          حساب کاربری دارید؟{" "}
          <Link
            to="/login"
            className="font-semibold text-purple-600 hover:underline"
          >
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  );
}
