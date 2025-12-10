import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// --- Drawer Props ---
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  position?: "left" | "right";
  className?: string; // Optional custom class for the drawer panel
}

/**
 * A modern, animated drawer/sidenav component.
 * Supports both left and right positions, is RTL-aware,
 * and includes accessibility features.
 */
const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  title,
  position = "right",
  className = "",
}) => {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // --- Animation & Mount/Unmount Logic ---
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      // Short delay to allow mount before starting animation
      const timer = setTimeout(() => setIsAnimatingIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      // Is closing
      setIsAnimatingIn(false);
      // Wait for animation to finish before unmounting
      const timer = setTimeout(() => setIsMounted(false), 300); // Must match duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // --- Accessibility, Escape Key, & Scroll Lock ---
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Don't render if unmounted
  if (!isMounted) return null;

  // --- Dynamic Classes for Position & Animation ---
  const positionClasses =
    position === "right"
      ? "right-0"
      : "left-0";

  const transformClasses =
    position === "right"
      ? (isAnimatingIn ? "translate-x-0" : "translate-x-full")
      : (isAnimatingIn ? "translate-x-0" : "-translate-x-full");

  return (
    // --- Backdrop Overlay ---
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-40
        transition-opacity duration-300 ease-in-out
        ${isAnimatingIn ? "bg-black bg-opacity-60 backdrop-blur-sm" : "bg-opacity-0"}
      `}
      onClick={onClose} // Close on overlay click
    >
      {/* --- Drawer Panel --- */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className={`
          fixed top-0 bottom-0 z-50 w-full max-w-sm
          bg-white dark:bg-gray-800 shadow-2xl
          flex flex-col max-h-screen overflow-hidden
          transition-transform duration-300 ease-in-out
          ${positionClasses}
          ${transformClasses}
          ${className}
        `}
        onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
      >
        {/* --- Header (Title & Close Button) --- */}
        {/* The dir="rtl" on this div ensures header content is RTL-aligned */}
        <div dir="rtl" className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          {title && (
            <h3 id="drawer-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {/* This empty div ensures the 'X' button is pushed to the left in RTL */}
          {!title && <div />} 
          
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="بستن"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- Scrollable Body --- */}
        <div className="flex-grow p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};



// USAGE
// return (
//     // Your main app container with dir="rtl"
//     <div dir="rtl" className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8 font-sans">
//       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
//         نمایش کامپوننت Drawer
//       </h1>
//       <div className="flex gap-6">
//         <button
//           onClick={() => setIsRightDrawerOpen(true)}
//           className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-colors"
//         >
//           باز کردن از راست (پیش‌فرض)
//         </button>
//         <button
//           onClick={() => setIsLeftDrawerOpen(true)}
//           className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
//         >
//           باز کردن از چپ
//         </button>
//       </div>

//       {/* --- Drawer from the Right (default "start" in RTL) --- */}
//       <Drawer
//         isOpen={isRightDrawerOpen}
//         onClose={() => setIsRightDrawerOpen(false)}
//         title="منوی اصلی"
//         position="right"
//       >
//         <div className="flex flex-col gap-4">
//           <a href="#" className="block p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
//             داشبورد
//           </a>
//           <a href="#" className="block p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
//             پروفایل
//           </a>
//           <a href="#" className="block p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
//             تنظیمات
//           </a>
//           <p className="font-medium text-gray-800 dark:text-white mt-4">محتوای آزمایشی</p>
//           {generateDummyContent(15)}
//         </div>
//       </Drawer>

//       {/* --- Drawer from the Left (default "end" in RTL) --- */}
//       <Drawer
//         isOpen={isLeftDrawerOpen}
//         onClose={() => setIsLeftDrawerOpen(false)}
//         title="اطلاعیه‌ها"
//         position="left"
//       >
//          <div className="flex flex-col gap-4">
//           <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-500 rounded-r">
//             <p className="font-semibold text-blue-800 dark:text-blue-200">اطلاعیه جدید</p>
//             <p className="text-sm text-blue-700 dark:text-blue-300">یک بروزرسانی جدید در دسترس است.</p>
//           </div>
//            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-r-4 border-yellow-500 rounded-r">
//             <p className="font-semibold text-yellow-800 dark:text-yellow-200">اخطار</p>
//             <p className="text-sm text-yellow-700 dark:text-yellow-300">لطفا پروفایل خود را تکمیل کنید.</p>
//           </div>
//           {generateDummyContent(10)}
//         </div>
//       </Drawer>
//     </div>
//   );
// };