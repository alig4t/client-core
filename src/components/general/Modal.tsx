import { X } from "lucide-react";
import { useEffect, useRef } from "react";

// --- Modal Props ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string; // Optional custom class for the modal content div
}

/**
 * A modern, animated, and accessible modal component.
 * Supports different sizes, close on overlay click, and Escape key press.
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // --- Accessibility & Close on Escape Key ---
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
      // Focus on the modal for accessibility when it opens
      modalRef.current?.focus(); 
    } else {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = ""; // Restore background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // --- Size Classes ---
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full w-[calc(100%-2rem)]", // Full width with some padding
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    // --- Backdrop Overlay ---
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose} // Close when clicking on the backdrop
    >
      {/* --- Modal Content Area --- */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1} // Make div focusable but not part of tab order initially
        className={`
          relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col
          max-h-[90vh] overflow-hidden transform
          ${sizeClasses[size]} w-full
          animate-scaleInUp transition-all duration-300 ease-out
          ${className}
        `}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* --- Modal Header (Optional Title & Close Button) --- */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          {title && (
            <h3 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors ml-auto"
            aria-label="بستن"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- Modal Body (Scrollable Content) --- */}
        <div className="p-4 flex-grow overflow-y-auto text-gray-700 dark:text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};



// USAGE
// --- ✨ DEMO APPLICATION ✨ ---
// A simple example of how to use the Modal component with different sizes.

// const App: React.FC = () => {
//   const [isModalSmOpen, setIsModalSmOpen] = useState(false);
//   const [isModalMdOpen, setIsModalMdOpen] = useState(false);
//   const [isModalLgOpen, setIsModalLgOpen] = useState(false);
//   const [isModalXlOpen, setIsModalXlOpen] = useState(false);
//   const [isModalFullOpen, setIsModalFullOpen] = useState(false);

//   // Helper for generating dummy content
//   const generateDummyContent = (count: number) => {
//     return Array.from({ length: count }, (_, i) => (
//       <p key={i} className="mb-2 text-gray-700 dark:text-gray-300 leading-relaxed">
//         This is some dummy content for the modal to show scrollability. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. {i % 5 === 0 && <strong className="text-purple-600 dark:text-purple-400">Important point here.</strong>}
//       </p>
//     ));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8 font-sans">
//       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
//         Modal Component Demo
//       </h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <button
//           onClick={() => setIsModalSmOpen(true)}
//           className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-colors"
//         >
//           Open Small Modal (sm)
//         </button>
//         <button
//           onClick={() => setIsModalMdOpen(true)}
//           className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
//         >
//           Open Medium Modal (md)
//         </button>
//         <button
//           onClick={() => setIsModalLgOpen(true)}
//           className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-colors"
//         >
//           Open Large Modal (lg)
//         </button>
//         <button
//           onClick={() => setIsModalXlOpen(true)}
//           className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition-colors"
//         >
//           Open Extra Large Modal (xl)
//         </button>
//          <button
//           onClick={() => setIsModalFullOpen(true)}
//           className="bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-700 transition-colors"
//         >
//           Open Full Width Modal
//         </button>
//       </div>

//       {/* Small Modal */}
//       <Modal
//         isOpen={isModalSmOpen}
//         onClose={() => setIsModalSmOpen(false)}
//         title="Small Modal"
//         size="sm"
//       >
//         <p>This is a small modal. It's great for quick confirmations or short messages.</p>
//       </Modal>

//       {/* Medium Modal */}
//       <Modal
//         isOpen={isModalMdOpen}
//         onClose={() => setIsModalMdOpen(false)}
//         title="Medium Modal"
//         size="md"
//       >
//         <p>
//           This is a medium-sized modal. It can accommodate a bit more content without feeling
//           overwhelming.
//         </p>
//         {generateDummyContent(3)}
//       </Modal>

//       {/* Large Modal */}
//       <Modal
//         isOpen={isModalLgOpen}
//         onClose={() => setIsModalLgOpen(false)}
//         title="Large Modal with More Content"
//         size="lg"
//       >
//         <p className="mb-4">
//           This large modal is suitable for forms or detailed information. Notice how the content
//           area becomes scrollable if there's too much text.
//         </p>
//         {generateDummyContent(10)}
//       </Modal>

//       {/* Extra Large Modal */}
//       <Modal
//         isOpen={isModalXlOpen}
//         onClose={() => setIsModalXlOpen(false)}
//         title="Extra Large Modal"
//         size="xl"
//       >
//         <p className="mb-4">
//           This extra-large modal can hold even more complex layouts or large forms.
//         </p>
//          {generateDummyContent(15)}
//       </Modal>

//        {/* Full Width Modal */}
//       <Modal
//         isOpen={isModalFullOpen}
//         onClose={() => setIsModalFullOpen(false)}
//         title="Full Width Modal"
//         size="full"
//       >
//         <p className="mb-4">
//           This modal spans almost the entire width of the viewport, useful for dashboards or very wide content.
//         </p>
//          {generateDummyContent(20)}
//       </Modal>
//     </div>
//   );
// };

// export default App;