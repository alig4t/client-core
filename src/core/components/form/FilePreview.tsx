// components/FilePreview.tsx
import React, { useState, useEffect, useRef } from "react";
import { Loader2, X, Eye, FileText, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import AttachmentService from "@/Models/Attachment/AttachmentService";

// 🚨 Assuming this service is available.

interface FilePreviewProps {
  fileId: number;
  className?: string;
  // ⬅️ 'full' size added
  previewSize?: "sm" | "md" | "lg" | "full";
  isDocument?: boolean;
}

// --- Variants for Framer Motion animation ---
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const modalContentVariants: Variants = {
  // ⬅️ Entry animation from bottom to top
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 200 },
  },
  // ⬅️ Exit animation upwards
  exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } },
};

const FilePreview: React.FC<FilePreviewProps> = ({
  fileId,
  className = "",
  previewSize = "md",
  isDocument = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const objectUrlRef = useRef<string | null>(null);

  // ⬅️ Define sizes, including full mode
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-28 h-28",
    lg: "w-40 h-40",
    full: "w-full h-96", // Full width and fixed height
  };

  // --- Manage fetching and loading (guaranteeing exit from loading) ---
  useEffect(() => {
    if (!fileId) {
      setIsLoading(false);
      setError("شناسه فایل نامعتبر است");
      return;
    }
    const abortController = new AbortController();
    const fetchPreview = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await AttachmentService.getToken(fileId);
        if (abortController.signal.aborted) return;
        const blob = await AttachmentService.downloadAsBlob(token);
        if (abortController.signal.aborted) return;
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
        }
        const objectUrl = URL.createObjectURL(blob);
        objectUrlRef.current = objectUrl;
        setPreviewUrl(objectUrl);
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error("Failed to load file preview", err);
          setError("بارگیری پیش‌نمایش شکست خورد.");
          setPreviewUrl(null);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };
    fetchPreview();
    return () => {
      abortController.abort();
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [fileId]);

  // --- Modal management functions ---
  const openModal = () => {
    if ((previewUrl || isDocument) && !isModalOpen) {
      setIsModalOpen(true);
      // Add a new state to history
      window.history.pushState({ modalOpen: true }, "");
    }
  };

  const closeModal = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
      // If it was our last state, pop it (optional)
      if (window.history.state?.modalOpen) {
        window.history.back(); // or history.go(-1)
      }
    }
  };

  // Handle back button
  useEffect(() => {
    const handlePopState = () => {
      if (isModalOpen) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isModalOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  const renderDocumentPlaceholder = (showOverlay: boolean) => (
    <div
      className={`${sizeClasses[previewSize]} flex flex-col items-center justify-center 
                  bg-gray-50 dark:bg-gray-700/50 rounded-xl 
                  border border-dashed border-gray-300 dark:border-gray-600 
                  transition-all duration-300 p-2 relative`}
    >
      <FileText className="h-8 w-8 text-indigo-500 dark:text-indigo-400 mb-1" />
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
        سند
      </span>
      {showOverlay && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[1px]">
          <Eye className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* 🖼️ Thumbnail Preview */}
      <div
        // ⬅️ w-full condition for parent container
        className={`${className} ${previewSize === "full" ? "w-full" : "inline-block"} cursor-pointer group relative 
                    transition-transform duration-300 hover:scale-[1.02] ${previewSize !== "full" ? "p-0.5" : "p-0"}`}
        onClick={openModal}
        role="button"
        aria-label="مشاهده فایل"
      >
        {isLoading ? (
          <div
            className={`${sizeClasses[previewSize]} flex items-center justify-center 
                          bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner`}
          >
            <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
          </div>
        ) : error ? (
          <div
            className={`${sizeClasses[previewSize]} flex flex-col items-center justify-center text-center 
                          bg-red-50 dark:bg-red-900/20 rounded-xl 
                          border-2 border-red-200 dark:border-red-800 
                          p-1`}
          >
            <AlertTriangle className="h-6 w-6 text-red-600 mb-1" />
            <span className="text-xs text-red-700 dark:text-red-300 font-semibold">
              خطا
            </span>
          </div>
        ) : previewUrl ? (
          <div className="relative overflow-hidden rounded-xl shadow-md transition-shadow duration-300 group-hover:shadow-lg">
            {isDocument ? (
              renderDocumentPlaceholder(true)
            ) : (
              <>
                <img
                  src={previewUrl}
                  alt="پیش‌نمایش فایل"
                  // ⬅️ Use object-cover to fill Thumbnail
                  className={`${sizeClasses[previewSize]} object-cover 
                              rounded-xl border border-gray-200 dark:border-gray-700 
                              transition-opacity duration-300 group-hover:opacity-80`}
                  onError={() => {
                    setError("تصویر بارگیری نشد");
                    setPreviewUrl(null);
                  }}
                />
                <div
                  className="absolute inset-0 
                                bg-black/0 group-hover:bg-black/20 
                                dark:group-hover:bg-black/40 
                                rounded-xl transition-all duration-300 
                                flex items-center justify-center 
                                opacity-0 group-hover:opacity-100 backdrop-blur-[1px]"
                >
                  <Eye
                    className="h-6 w-6 text-white 
                                 transform scale-75 group-hover:scale-100 transition-transform duration-300"
                  />
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* 🖥️ Fullscreen Modal with Framer Motion animation */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeModal}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="مشاهده فایل کامل"
            tabIndex={-1}
          >
            {/* ⬅️ Animated content container */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative max-w-full max-h-full"
            >
              {/* ⬅️ Close button in top-left corner (inside image frame) */}
              <button
                onClick={closeModal}
                className="absolute top-4 left-4 z-10 p-2 
                           bg-white/10 backdrop-blur-md rounded-full text-white 
                           hover:bg-red-500 hover:text-white transition shadow-xl 
                           ring-1 ring-white/30 focus:outline-none focus:ring-4 focus:ring-red-400"
                aria-label="بستن پیش‌نمایش"
              >
                <X size={28} />
              </button>

              {isDocument ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center max-w-md">
                  <FileText className="w-10 h-10 text-indigo-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    پیش‌نمایش سند
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    برای اسناد، پیش‌نمایش کامل در این نما پشتیبانی نمی‌شود.
                  </p>
                </div>
              ) : (
                <img
                  src={previewUrl!}
                  alt="پیش‌نمایش کامل"
                  // ⬅️ Keep object-contain and max-h/w limits to display full image in actual size (no overflow)
                  className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl border-4 border-gray-700/50"
                  onError={(e) => {
                    console.error("Full image failed to load", e);
                    setError("تصویر کامل بارگیری نشد");
                    closeModal();
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilePreview;
