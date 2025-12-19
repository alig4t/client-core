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
            className={`relative mx-auto bg-[var(--card-bg)] border border-[var(--card-border)] shadow-lg flex flex-col transform transition-all overflow-hidden ${
              mobileBottomSheet
                ? "w-full sm:w-full sm:max-w-lg rounded-t-2xl sm:rounded-lg max-h-[95vh] sm:max-h-[85vh]"
                : "w-full max-w-lg rounded-lg max-h-[95vh]"
            }`}
            variants={mobileBottomSheet ? mobileBottomSheetVariants : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-primary)] flex-shrink-0">
              {/* Grip Bar (Mobile Only) */}
              {mobileBottomSheet && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-[var(--border-secondary)] rounded-full sm:hidden" />
              )}
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {title}
              </h2>
              <button
                onClick={onDismiss}
                className="p-2 rounded-lg text-[var(--color-primary)] hover:bg-[var(--bg-tertiary)] transition-colors duration-200"
                aria-label="بستن مودال"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto scrollbar-thin">
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
