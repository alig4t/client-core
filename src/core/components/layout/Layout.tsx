// src/components/Layout.tsx

import AppSidebar from "@/components/app-sidebar";
import Navbar from "../../../components/Navbar";
import { Outlet } from "react-router-dom";
import SubSidebar from "../../../components/SubSidebar";
import { LoadingProvider } from "@/contexts/LoadingContext";
import LoadingOverlay from "@/core/components/general/LoadingOverlay";

export default function Layout() {
  return (
    <LoadingProvider>
      <div className="flex bg-muted/40 dark:bg-background w-full mx-auto">
        <LoadingOverlay />
        <AppSidebar />
        <div className="flex-1 flex flex-col responsive-max"
          // style={{ maxWidth: 'calc(100% - 64px)' }}
        >
          <Navbar />
          {/* Remove background from main to inherit from parent background */}
          <main className="flex flex-col lg:flex-row min-h-[calc(100dvh-64px)] bg-[var(--background)]">
            <SubSidebar />
            {/* Increase padding for more space */}
            <div className="flex-1 min-w-0 w-full">
              {/* p-4 sm:p-6 bg-pattern */}
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </LoadingProvider>
  );
}
