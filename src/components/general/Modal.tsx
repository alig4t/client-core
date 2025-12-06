// src/components/Layout/ModalAnimation.tsx

import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { FiX } from "react-icons/fi";

interface ModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  title: string;
  mobileBottomSheet?: boolean; // Enable bottom sheet on mobile
}

// Variants بدون تغییر باقی می‌مانند
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 200 },
  },
  exit: { opacity: 0, y: 30 },
};

const mobileBottomSheetVariants: Variants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 30, stiffness: 300 },
  },
  exit: { opacity: 0, y: "100%" },
};

const ModalAnimation = ({ isOpen, onDismiss, children, title, mobileBottomSheet = false }: ModalProps) => {
  // ⭐️ مدیریت وضعیت تاریخچه برای جلوگیری از برگشت به صفحه قبل
  useEffect(() => {
    let historyPushed = false;

    if (isOpen) {
      document.body.style.overflow = "hidden";

      // 1. اضافه کردن یک حالت (state) جدید به تاریخچه مرورگر
      history.pushState({ modal: true }, "");
      historyPushed = true;
    }

    // 2. هندلر برای رویداد PopState (فشار دادن دکمه Back)
    const handlePopState = (e: PopStateEvent) => {
      // اگر دکمه Back زده شد، history.back() اتفاق می‌افتد و ما باید مودال را ببندیم.
      // e.state?.modal بررسی می‌کند که آیا به state قبل از باز شدن مودال برگشته‌ایم یا خیر.
      if (isOpen && !e.state?.modal) {
        // اگر هنوز باز است و state مودال ندارد، مودال را ببند.
        onDismiss();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.body.style.overflow = "unset";

      // 3. هنگام بسته شدن با onDismiss (دکمه‌های داخلی):
      // اگر state را اضافه کرده‌ایم و هنوز باز است (یعنی با دکمه‌های داخلی بسته شده است)،
      // باید آن state را از تاریخچه حذف کنیم تا کاربر مجبور نباشد دوباره Back بزند.
      if (historyPushed && isOpen) {
        history.back();
      }
    };
  }, [isOpen, onDismiss]);
  // onDismiss باید در اینجا باشد تا هنگام بسته شدن با دکمه‌های داخلی، useEffect دوباره اجرا شود.

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className={`fixed inset-0 z-[1000] flex ${
            mobileBottomSheet
              ? "items-end sm:items-center justify-center sm:p-6"
              : "items-center justify-center p-4 sm:p-6"
          }`}
        >
          {/* Backdrop (پس زمینه روشن‌تر: bg-black/40) */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" // 💡 روشن‌تر شد
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onDismiss}
          />

          {/* Modal Panel */}
          <motion.div
            dir="rtl"
            className={`relative mx-auto bg-white dark:bg-gray-800 shadow-2xl flex flex-col transform transition-all overflow-hidden ${
              mobileBottomSheet
                ? "w-full sm:w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[95vh] sm:max-h-[85vh]"
                : "w-full max-w-lg rounded-3xl max-h-[95vh]"
            }`}
            variants={mobileBottomSheet ? mobileBottomSheetVariants : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit" // 💡 تغییر 'hidden' به 'exit' برای استفاده از انیمیشن خروج
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
              {/* Grip Bar (Mobile Only) */}
              {mobileBottomSheet && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full sm:hidden" />
              )}
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                {title}
              </h2>
              <button
                onClick={onDismiss}
                className="p-2 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-gray-700 transition-colors"
                aria-label="بستن مودال"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-900 scrollbar-thumb-rounded-full">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root")!
  );
};

export default ModalAnimation;
