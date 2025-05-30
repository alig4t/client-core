// src/pages/LoginPage.tsx

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 text-right px-4"
      dir="rtl"
    >
      <Card className="w-full max-w-sm bg-white rounded-xl shadow-lg">
        <CardContent className="py-8 px-6 space-y-5">
          <h2 className="text-xl font-bold text-center">خوش آمدید</h2>
          <p className="text-sm text-gray-600 text-center mb-2">
            به پنل کاربری وارد شوید
          </p>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">ایمیل</Label>
            <Input
              id="email"
              type="email"
              placeholder="ایمیل خود را وارد کنید"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label htmlFor="password">رمز عبور</Label>
            <Input
              id="password"
              type="password"
              placeholder="رمز عبور را وارد کنید"
            />
          </div>

          {/* Submit */}
          {/* Submit */}
          <Button className="w-full text-gray-800 !bg-[#f9f9f9] ">ورود</Button>

          {/* Forgot */}
          <div className="text-sm text-center text-gray-500 mt-1">
            <a href="#" className="hover:underline">
              رمز عبور خود را فراموش کرده‌اید؟
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 mt-4 mb-2">
            <div className="flex-grow border-t border-gray-300" />
            <span className="text-sm text-gray-400">یا</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full flex justify-center items-center gap-2 !bg-[#f9f9f9]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              ورود با گوگل
            </Button>
            <Button
              variant="outline"
              className="w-full flex justify-center items-center gap-2 !bg-[#f9f9f9]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                shape-rendering="geometricPrecision"
                text-rendering="geometricPrecision"
                image-rendering="optimizeQuality"
                fill-rule="evenodd"
                clip-rule="evenodd"
                viewBox="0 0 509 509"
              >
                <g fill-rule="nonzero">
                  <path
                    fill="#0866FF"
                    d="M509 254.5C509 113.94 395.06 0 254.5 0S0 113.94 0 254.5C0 373.86 82.17 474 193.02 501.51V332.27h-52.48V254.5h52.48v-33.51c0-86.63 39.2-126.78 124.24-126.78 16.13 0 43.95 3.17 55.33 6.33v70.5c-6.01-.63-16.44-.95-29.4-.95-41.73 0-57.86 15.81-57.86 56.91v27.5h83.13l-14.28 77.77h-68.85v174.87C411.35 491.92 509 384.62 509 254.5z"
                  />
                  <path
                    fill="#fff"
                    d="M354.18 332.27l14.28-77.77h-83.13V227c0-41.1 16.13-56.91 57.86-56.91 12.96 0 23.39.32 29.4.95v-70.5c-11.38-3.16-39.2-6.33-55.33-6.33-85.04 0-124.24 40.16-124.24 126.78v33.51h-52.48v77.77h52.48v169.24c19.69 4.88 40.28 7.49 61.48 7.49 10.44 0 20.72-.64 30.83-1.86V332.27h68.85z"
                  />
                </g>
              </svg>
              ورود با فیسبوک
            </Button>
          </div>

          {/* Register */}
          <p className="text-sm text-center text-gray-500 mt-4">
            هنوز عضو نشده‌اید؟{" "}
            <a href="#" className="text-sky-600 hover:underline">
              ثبت نام کنید
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
