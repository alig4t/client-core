// src/pages/ForbiddenPage.tsx
import React from 'react';
import { Link } from "react-router-dom";
import { FiAlertOctagon } from "react-icons/fi"; // آیکون هشدار برای جذابیت بصری

const ForbiddenPage: React.FC = () => {
  return (
    // Container اصلی: مرکزیت کامل در صفحه
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12 transition-colors duration-500">
      
      {/* Container محتوا: طراحی مدرن و کارت مانند */}
      <div className="w-full max-w-xl p-10 sm:p-16 text-center bg-white dark:bg-gray-800 rounded-3xl shadow-2xl transition-all duration-300">
        
        {/* آیکون هشدار بزرگ و برجسته */}
        <div className="flex justify-center mb-6">
          {/* استفاده از رنگ تم نیلی/قرمز برای جلب توجه */}
          <FiAlertOctagon className="w-20 h-20 text-red-600 dark:text-red-400 opacity-80" />
        </div>

        {/* کد خطا (اختیاری اما مفید) */}
        <p className="text-sm font-semibold uppercase tracking-widest text-red-600 dark:text-red-400 mb-2">
          خطای ۴۰۳
        </p>

        {/* عنوان اصلی */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          دسترسی ممنوع!
        </h1>

        {/* پیام توضیحی */}
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          شما مجوز لازم برای دسترسی به این منبع یا بخش از پلتفرم را ندارید. لطفاً برای دسترسی، با مدیر سیستم تماس بگیرید.
        </p>

        {/* دکمه فراخوانی به عمل (CTA) */}
        <div className="mt-10">
          <Link
            to="/dashboard"
            // دکمه با استایل مدرن و رنگ نیلی
            className="inline-flex items-center justify-center px-8 py-3 font-semibold text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-[1.02] duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            بازگشت به داشبورد
          </Link>
        </div>
        
        {/* لینک تماس (اختیاری) */}
        <div className="mt-6">
          <a
            href="mailto:support@socialmon.com"
            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            گزارش مشکل یا تماس با پشتیبانی
          </a>
        </div>

      </div>
    </div>
  );
};

export default ForbiddenPage;