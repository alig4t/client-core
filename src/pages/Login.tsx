import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/stores/AuthContext";
import { SOCIAL_MEDIA_LOGO } from "@/assets/icons";
import { Link } from "react-router-dom";
import { FormWrapper } from "@/components/shared/FormWrapper";
import ErrorFormText from "@/core/components/form/ErrorFormText";

// --- Schema and Type unchanged ---
const loginSchema = z.object({
  username: z.string().nonempty("نام کاربری را وارد نمایید"),
  password: z.string().nonempty("رمز عبور را وارد نمایید"),
  // .min(6, "رمز عبور حداقل باید ۶ کاراکتر باشد"),
});
type LoginFormData = z.infer<typeof loginSchema>;

// --- Form Fields Component with new style ---
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

// --- Main Login Page Component with new style ---
export default function LoginPage({
  inModal,
  switchModal,
}: {
  inModal: boolean;
  switchModal: () => void;
}) {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  // const methods = useForm<LoginFormData>({
  //   resolver: zodResolver(loginSchema),
  // });

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => login(data),
    onSuccess: (data) => {
      // Your server response should include accessToken and refreshToken
      // authLogin(data.data.token);

      console.log("Data received on success:", data);
      // authLogin(data.token);
      const token = data.data.token;
      const user = data.data.user;

      // Pass both to the login function

      toast.success("ورود موفقیت آمیز بود", {
        description: "خوش آمدید! در حال انتقال به داشبورد...",
        position: "bottom-left",
      });
      setTimeout(() => {
        authLogin(token, user);
        navigate("/dashboard");
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
      <div className="w-full max-w-sm sm:max-w-md  p-8 space-y-6  rounded-2xl">
        <FormWrapper
          schema={loginSchema}
          onSubmit={onSubmit}
          className="space-y-5"
        >
          {/* <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6"> */}
          <LoginFormFields />
          <button
            disabled={mutation.isPending}
            type="submit"
            className="w-full px-4 py-3 font-bold text-white mt-4 bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-indigo-400 transition-all transform hover:scale-[1.01] duration-300"
          >
            {mutation.isPending ? "در حال بررسی..." : "تایید و ادامه"}
          </button>
          {/* </form> */}
        </FormWrapper>

        {/* Rules section */}
        <p className="text-xs text-center text-gray-400">
          ورود شما به منزله قبول{" "}
          <a href="#" className="font-semibold text-purple-600 hover:underline">
            قوانین و مقررات
          </a>{" "}
          رایانوین است.
        </p>

        <div className="pt-4 text-center">
          <p className=" text-gray-500  text-[11px]">
            هنوز حساب کاربری نساخته‌اید؟{" "}
            <span
              onClick={() => {
                switchModal();
              }}
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
      <div className="w-full max-w-sm sm:max-w-md  p-8 space-y-6 bg-white sm:shadow-xl rounded-2xl">
        <div className="flex justify-center">
          <img
            src={`data:image/png;base64,${SOCIAL_MEDIA_LOGO}`}
            alt="Logo"
            className=""
          />
          {/* <svg className="w-40 h-auto" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="50" y="30" fontFamily="Arial, sans-serif" fontSize="24" fill="#5A2E8E" fontWeight="bold">رایا نوین</text>
            </svg> */}
        </div>

        {/* Title section */}
        <div className="text-center">
          <h1 className="!text-3xl font-bold text-[var(--primary-text)] mb-2">
            ورود به پنل مدیریت
          </h1>
          {/* <p className="mt-2 text-sm text-gray-500">ایمیل و رمز عبور خود را وارد کنید</p> */}
        </div>

        {/* Form section */}
        <FormWrapper
          schema={loginSchema}
          onSubmit={onSubmit}
          className="space-y-5"
        >
          {/* <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6"> */}
          <LoginFormFields />
          <button
            disabled={mutation.isPending}
            type="submit"
            className="w-full px-4 py-3 font-bold text-white mt-4 bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-indigo-400 transition-all transform hover:scale-[1.01] duration-300"
          >
            {mutation.isPending ? "در حال بررسی..." : "تایید و ادامه"}
          </button>
          {/* </form> */}
        </FormWrapper>

        {/* Rules section */}
        <p className="text-xs text-center text-gray-400">
          ورود شما به منزله قبول{" "}
          <a href="#" className="font-semibold text-purple-600 hover:underline">
            قوانین و مقررات
          </a>{" "}
          رایانوین است.
        </p>

        <div className="pt-4 text-center">
          <p className=" text-gray-500  text-[11px]">
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
