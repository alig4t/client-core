// src/pages/RegisterPage.tsx

import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { register as registerService } from "@/services/authService"; // تغییر نام برای جلوگیری از تداخل
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { FormWrapper } from "@/components/shared/FormWrapper";
import { toast } from "sonner";
import AuthLayout from "@/components/AuthLayout";
import SubmitButton from "@/components/SubmitButton";

// Schema برای اعتبارسنجی فرم ثبت‌نام
const registerSchema = z
  .object({
    name: z.string().min(3, "نام حداقل باید ۳ کاراکتر باشد"),
    email: z.string().email("ایمیل معتبر وارد کنید"),
    password: z.string().min(6, "رمز عبور حداقل باید ۶ کاراکتر باشد"),
    confirmPassword: z
      .string()
      .min(6, "تکرار رمز عبور حداقل باید ۶ کاراکتر باشد"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمزهای عبور با یکدیگر مطابقت ندارند",
    path: ["confirmPassword"], // نمایش خطا زیر فیلد تکرار رمز عبور
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// کامپوننت فیلدهای فرم
function RegisterFormFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterFormData>();

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="name">نام</Label>
        <Input
          id="name"
          type="text"
          placeholder="نام خود را وارد کنید"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">ایمیل</Label>
        <Input
          id="email"
          type="email"
          placeholder="ایمیل خود را وارد کنید"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">رمز عبور</Label>
        <Input
          id="password"
          type="password"
          placeholder="رمز عبور را وارد کنید"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="رمز عبور را تکرار کنید"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
    </>
  );
}

// کامپوننت اصلی صفحه ثبت‌نام
export default function RegisterPage() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      registerService({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    onSuccess: () => {
      toast("ثبت‌نام موفقیت آمیز بود", {
        description:
          "حساب کاربری شما با موفقیت ایجاد شد. به صفحه ورود منتقل می‌شوید.",
        position: "bottom-left",
      });
      setTimeout(() => {
        navigate("/login"); // هدایت به صفحه لاگین پس از ثبت‌نام موفق
      }, 2000);
    },
    onError: (error: any) => {
      toast.error("ثبت‌نام ناموفق بود", {
        // به سادگی از error.message استفاده می‌کنیم که در interceptor آماده شده
        description: error.message || "لطفاً اطلاعات وارد شده را بررسی کنید.",
        position: "bottom-left",
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(data);
  };

  return (
    <AuthLayout>
      <CardContent className="py-8 px-6 space-y-5">
        <h2 className="text-xl font-bold text-center">ایجاد حساب کاربری</h2>
        <p className="text-sm text-gray-600 text-center mb-2 dark:!text-zinc-400">
          برای استفاده از امکانات، ثبت نام کنید
        </p>

        <FormWrapper schema={registerSchema} onSubmit={onSubmit}>
          <div className="space-y-4">
            <RegisterFormFields />

            <SubmitButton
              disabled={mutation.isPending}
              type="submit"
              className="mt-8"
            >
              <>{mutation.isPending ? "در حال ایجاد حساب..." : "ثبت نام"}</>
            </SubmitButton>
          </div>
        </FormWrapper>

        <p className="text-sm text-center text-gray-500 mt-4">
          حساب کاربری دارید؟{" "}
          <Link
            to="/login"
            className="text-sky-600 hover:underline dark:!text-red-700"
          >
            وارد شوید
          </Link>
        </p>
      </CardContent>
    </AuthLayout>
  );
}
