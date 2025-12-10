// src/contexts/LoadingContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from "react";

interface LoadingContextType {
  isLoading: boolean;
  message: string;
  openWaitDialog: (message?: string) => void;
  closeWaitDialog: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("لطفاً منتظر بمانید...");

  const openWaitDialog = (customMessage?: string) => {
    setMessage(customMessage || "لطفاً منتظر بمانید...");
    setIsLoading(true);
  };

  const closeWaitDialog = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        message,
        openWaitDialog,
        closeWaitDialog,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use loading context
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
