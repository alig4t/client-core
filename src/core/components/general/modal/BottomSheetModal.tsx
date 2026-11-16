import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// --- BottomSheetModal Props ---
interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string; // Optional custom class for the sheet itself
}

/**
 * A modern, animated, and responsive bottom sheet modal.
 * Slides up from the bottom and is full-width on mobile,
 * and a centered card on desktop.
 */
const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className = "",
}) => {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

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

  // --- Accessibility & Escape Key ---
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      sheetRef.current?.focus();
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

  return (
    // --- Backdrop Overlay ---
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "sheet-title" : undefined}
      className={`
        fixed inset-0 z-50 flex items-end justify-center bg-black
        transition-opacity duration-300 ease-in-out
        ${isAnimatingIn ? "bg-opacity-60" : "bg-opacity-0"}
      `}
      onClick={onClose} // Close on overlay click
    >
      {/* --- Sheet Content --- */}
      <div
        ref={sheetRef}
        tabIndex={-1}
        className={`
          bg-white dark:bg-gray-800 w-full rounded-t-2xl shadow-2xl
          flex flex-col max-h-[85vh]
          sm:max-w-lg sm:rounded-2xl sm:mb-4
          transition-transform duration-300 ease-in-out
          ${isAnimatingIn ? "translate-y-0" : "translate-y-full"}
          ${className}
        `}
        onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
      >
        {/* --- Header (Grip bar, Title, Close Button) --- */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
          {/* Grip Bar */}
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-3" />

          <div className="flex justify-between items-center">
            {title ? (
              <h3
                id="sheet-title"
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                {title}
              </h3>
            ) : (
              <div />
            )}{" "}
            {/* Placeholder to keep close button aligned right */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              aria-label="بستن"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* --- Scrollable Body --- */}
        <div className="flex-grow p-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// USAGE
// --- ✨ DEMO APPLICATION ✨ ---
// An example of how to use the BottomSheetModal component.

// const App: React.FC = () => {
//   const [isSheetOpen, setIsSheetOpen] = useState(false);

//   // Helper for generating dummy content
//   const generateDummyContent = (count: number) => {
//     return Array.from({ length: count }, (_, i) => (
//       <p key={i} className="mb-2 text-gray-700 dark:text-gray-300 leading-relaxed">
//         This is scrollable content row #{i + 1}. Lorem ipsum dolor sit amet,
//         consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//       </p>
//     ));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8 font-sans">
//       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
//         Bottom Sheet Modal Demo
//       </h1>
//       <div className="space-y-4 text-center">
//         <p className="text-gray-700 dark:text-gray-300">
//           Click the button to open the bottom sheet.
//         </p>
//         <button
//           onClick={() => setIsSheetOpen(true)}
//           className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-colors"
//         >
//           Open Bottom Sheet
//         </button>
//       </div>

//       {/* --- Bottom Sheet Modal Instance --- */}
//       <BottomSheetModal
//         isOpen={isSheetOpen}
//         onClose={() => setIsSheetOpen(false)}
//         title="Filter Options"
//       >
//         <div className="flex flex-col gap-4">
//           <p className="font-medium text-gray-800 dark:text-white">Sort By</p>
//           <div className="flex flex-col gap-2">
//             <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
//               <input type="radio" name="sort" className="form-radio text-purple-600" />
//               Relevance
//             </label>
//             <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
//               <input type="radio" name="sort" className="form-radio text-purple-600" />
//               Newest
//             </label>
//             <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
//               <input type="radio" name="sort" className="form-radio text-purple-600" />
//       Price (Low to High)
//             </label>
//           </div>

//           <p className="font-medium text-gray-800 dark:text-white mt-4">Dummy Scrollable Content</p>
//           {/* Add lots of content to test scrolling */}
//           {generateDummyContent(15)}

//            <button
//             onClick={() => setIsSheetOpen(false)}
//             className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-colors mt-4"
//           >
//             Apply Filters
//           </button>
//         </div>
//       </BottomSheetModal>
//     </div>
//   );
// };

// export default App;
export default BottomSheetModal;
