// src/components/Layout/LocalLoadingOverlay.tsx
import React from "react";
import LoadingSpinner from "@/core/components/general/loading/LoadingSpinner";

interface LocalLoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  fullScreen?: boolean;
}

const LocalLoadingOverlay: React.FC<LocalLoadingOverlayProps> = ({
  isLoading,
  message = "در حال بارگذاری...",
  fullScreen = false,
}) => {
  if (!isLoading) return null;

  return (
    <div
      className={`${
        fullScreen ? "fixed" : "absolute"
      } inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-500`}
    >
      <LoadingSpinner message={message} />
    </div>
  );
};

export default LocalLoadingOverlay;
