// src/App.tsx

import { useRoutes } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/ui/sonner";
import GlobalLoaderProvider from "./components/GlobalLoaderProvider";
import { appRoutes } from "@/router/index"; // ✅ import from src/routes/index.tsx

function App() {
  // Use useRoutes hook to render route structure
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
