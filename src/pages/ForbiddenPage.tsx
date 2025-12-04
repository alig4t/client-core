// src/pages/ForbiddenPage.tsx
import React from 'react';
import { Link } from "react-router-dom";
import { FiAlertOctagon } from "react-icons/fi"; // Alert icon for visual appeal

const ForbiddenPage: React.FC = () => {
  return (
    // Main Container: Full centering on page
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12 transition-colors duration-500">

      {/* Content Container: Modern card-like design */}
      <div className="w-full max-w-xl p-10 sm:p-16 text-center bg-white dark:bg-gray-800 rounded-3xl shadow-2xl transition-all duration-300">

        {/* Large and prominent alert icon */}
        <div className="flex justify-center mb-6">
          {/* Using indigo/red theme color for attention */}
          <FiAlertOctagon className="w-20 h-20 text-red-600 dark:text-red-400 opacity-80" />
        </div>

        {/* Error code (optional but useful) */}
        <p className="text-sm font-semibold uppercase tracking-widest text-red-600 dark:text-red-400 mb-2">
          خطای ۴۰۳
        </p>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          دسترسی ممنوع!
        </h1>

        {/* Explanatory message */}
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          شما مجوز لازم برای دسترسی به این منبع یا بخش از پلتفرم را ندارید. لطفاً برای دسترسی، با مدیر سیستم تماس بگیرید.
        </p>

        {/* Call to Action (CTA) button */}
        <div className="mt-10">
          <Link
            to="/dashboard"
            // Button with modern style and indigo color
            className="inline-flex items-center justify-center px-8 py-3 font-semibold text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-[1.02] duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            بازگشت به داشبورد
          </Link>
        </div>

        {/* Contact link (optional) */}
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