// components/LoadingOverlay.tsx
import { Loader } from "lucide-react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[9] flex flex-col items-center justify-center backdrop-blur-xs">
      <Loader className="animate-spin text-gray-600 text-4xl mb-4" />
      <p className="text-gray-600 text-sm font-medium">لطفاً منتظر بمانید...</p>
    </div>
  );
}
