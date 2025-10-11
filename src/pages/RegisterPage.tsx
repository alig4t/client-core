import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { register as registerService } from "@/services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { SOCIAL_MEDIA_LOGO } from "@/assets/icons"; // فرض شده لوگو از اینجا وارد می‌شود
import { FormWrapper } from "@/components/shared/FormWrapper";
import { ErrorFormText } from "@/components/form/ErrorFormText";

// --- Schema برای اعتبارسنجی فرم ثبت‌نام ---
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.name && <ErrorFormText msg={errors.name.message} />}
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.username && <ErrorFormText msg={errors.username.message} />}
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.password && <ErrorFormText msg={errors.password.message} />}
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.confirmPassword && (
          <ErrorFormText msg={errors.confirmPassword.message} />
        )}
      </div>
    </>
  );
}

// --- Main Register Page Component with new style ---
export default function RegisterPage() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      registerService({
        name: data.name,
        username: data.username,
        password: data.password,
      }),
    onSuccess: () => {
      toast.success("ثبت‌نام موفقیت آمیز بود", {
        description: "حساب کاربری شما ایجاد شد. به صفحه ورود منتقل می‌شوید.",
        position: "bottom-left",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    },
    onError: (error: any) => {
      toast.error("ثبت‌نام ناموفق بود", {
        description: error?.message || "لطفاً اطلاعات وارد شده را بررسی کنید.",
        position: "bottom-left",
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(data);
  };

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
          <h1 className="!text-3xl font-bold text-gray-800 mb-2">
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
            className="w-full px-4 py-3 mt-4 font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-purple-300 transition-colors duration-300"
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
