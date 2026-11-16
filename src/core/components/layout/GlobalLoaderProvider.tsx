// components/GlobalLoaderProvider.tsx
import { loadingStore } from "../../stores/loadingStore";
import { useEffect, useState } from "react";
import LoadingSpinner from "../general/loading/LoadingSpinner";

export default function GlobalLoaderProvider() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = loadingStore.subscribe(setVisible);
    return unsubscribe;
  }, []);

  return visible ? (
    <div className="fixed inset-0 z-[9999] bg-white/80">
      <LoadingSpinner />
    </div>
  ) : null;
}
