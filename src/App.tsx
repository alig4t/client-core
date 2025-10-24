// src/App.tsx

import { useRoutes } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/ui/sonner";
import GlobalLoaderProvider from "./components/GlobalLoaderProvider";
import { appRoutes } from "@/router/index"; // ✅ import از src/routes/index.tsx

function App() {
  // استفاده از هوک useRoutes برای رندر کردن ساختار روت‌ها
  const element = useRoutes(appRoutes);

  return (
    <>
      <GlobalLoaderProvider />
      <Toaster />
      {element}
    </>
  );
}

export default App;
