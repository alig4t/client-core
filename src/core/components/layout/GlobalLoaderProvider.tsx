// components/GlobalLoaderProvider.tsx
import { useEffect, useState } from "react";
import LoadingOverlay from "../general/loading/LoadingOverlay";
import { loadingStore } from "@/stores/loadingStore";

export default function GlobalLoaderProvider() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = loadingStore.subscribe(setVisible);
    return unsubscribe;
  }, []);

  return visible ? <LoadingOverlay /> : null;
}
