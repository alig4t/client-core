import React, { useEffect } from "react";
import ReactDOM from "react-dom"; // ✅ 1. ایمپورت کردن ReactDOM
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { FiX } from "react-icons/fi";

interface ModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  title: string;
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

interface ModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  title: string;
}

// ... (Variants بدون تغییر)

const ModalAnimation = ({ isOpen, onDismiss, children, title }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" // اضافه کردن پدینگ برای موبایل
        >
          {/* Backdrop (افزایش تیرگی) */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm" // bg-black/70 و backdrop-blur-sm
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onDismiss}
          />

          {/* Modal Panel (استایل مدرن) */}
          <motion.div
            dir="rtl"
            className="relative mx-auto w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col max-h-[95vh] transform transition-all overflow-hidden" // rounded-3xl و shadow-2xl
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Header (استایل تمیزتر) */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                {title}
              </h2>
              <button
                onClick={onDismiss}
                // دکمه بستن با رنگ تم و افکت هاور جذاب
                className="p-2 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-gray-700 transition-colors"
                aria-label="بستن مودال"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Content (بدون تغییر عمده - scrollbar-thin نیاز به پلاگین Tailwind دارد) */}
            <div
              className="p-6 flex-1 overflow-y-auto 
                          scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-900 scrollbar-thumb-rounded-full"
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // استفاده از پورتال
  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root")!
  );
};

export default ModalAnimation;
