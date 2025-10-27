// src/pages/LandingPage.tsx

import React from "react";
import Navbar from "./HomeNavbar";
import SocialMonitoringAnimation from "./SocialMonitoringAnimation";

const LandingPage: React.FC = () => {
  // تنظیمات ارتفاع: ارتفاع Navbar تقریباً 5rem است.
  const heroContentHeightClass = "min-h-[calc(100vh-5rem)]";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-y-auto">
      {/* Navbar */}
      <Navbar />
    
      {/* Hero Section */}
      <main className="relative isolate pt-[5rem] min-h-screen">
        {/* پس‌زمینه با گرادیان و افکت‌های نوری */}
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

        {/* محتوای اصلی Hero با تنظیم ارتفاع کامل */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            // تنظیم ارتفاع دقیقاً به اندازه باقیمانده صفحه و چینش محتوا در مرکز عمودی
            className={`flex items-center justify-center ${heroContentHeightClass}`}
          >
            <div className="flex flex-col lg:flex-row items-center gap-16 w-full py-16">
              {/* بخش متن و CTA (سمت راست) */}
              <div className="lg:w-1/2 text-center lg:text-right z-10">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl leading-tight">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {import.meta.env.VITE_APP_TITLE}:
                  </span>{" "}
                  مدیریت پیام‌رسان‌ها،{" "}
                  <span className="block text-gray-900 dark:text-white mt-2">
                    تحلیل و پایش فوری.
                  </span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  پلتفرم جامع پایش شبکه‌های اجتماعی. تمام پیام‌ها، کانال‌ها و
                  کلیدواژه‌ها را در یک داشبورد زیبا مدیریت و تحلیل کنید.
                </p>
                <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                  <a
                    href="/signup"
                    className="rounded-full bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-indigo-500 transition-all transform hover:scale-105"
                  >
                    شروع کنید
                  </a>
                  <a
                    href="#features"
                    className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    بیشتر بدانید <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>

              {/* بخش SVG متحرک (سمت چپ) */}
              <div className="lg:w-1/2 flex justify-center z-10">
                <div className="w-full max-w-lg mx-auto h-96">
                  <SocialMonitoringAnimation width="100%" height="100%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* این یک Placeholder برای بخش‌های بعدی است تا مطمئن شوید اسکرول در صورت نیاز فعال می‌شود */}
      <section
        id="features"
        className="py-24 bg-gray-50 dark:bg-gray-800 text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          ویژگی‌ها و امکانات پلتفرم
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          اینجا محتوای بخش‌های بعدی قرار می‌گیرد.
        </p>
      </section>
    </div>
  );
};

export default LandingPage;
