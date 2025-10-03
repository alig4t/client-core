// src/App.tsx

import { useRoutes } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/ui/sonner";
import GlobalLoaderProvider from "./components/GlobalLoaderProvider";
import { Routes } from "./router/Routes";

function App() {
  // استفاده از هوک useRoutes برای رندر کردن ساختار روت‌ها
  const element = useRoutes(Routes);

  return (
    <>
      <GlobalLoaderProvider />
      <Toaster />
      {element}
    </>
  );
}

export default App;
