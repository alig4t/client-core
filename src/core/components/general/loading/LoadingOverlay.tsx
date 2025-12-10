// components/LoadingOverlay.tsx
import { useLoading } from "@/stores/LoadingContext";
import LoadingSpinner from "./LoadingSpinner";

export default function LoadingOverlay() {
  const { isLoading, message } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900 transition-colors duration-500">
      <LoadingSpinner message={message} />
    </div>
  );
}
