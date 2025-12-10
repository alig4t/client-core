// src/components/LazyFallback.tsx
import React from "react";
import LoadingSpinner from "@/core/components/general/loading/LoadingSpinner";

const LazyFallbackElement: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      <LoadingSpinner />
    </div>
  );
};

export default LazyFallbackElement;
