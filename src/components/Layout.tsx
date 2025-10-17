// src/components/Layout.tsx

import AppSidebar from "@/components/app-sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import SubSidebar from "./SubSidebar";

export default function Layout() {
  return (
    <div className="flex bg-muted/40 dark:bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        {/* حذف پس‌زمینه از main تا از پس‌زمینه والد ارث‌بری کند */}
        <main className="flex flex-col md:flex-row flex-wrap min-h-[calc(100dvh-64px)] bg-[var(--background)]">
          <SubSidebar />
          {/* افزایش padding برای فضای بیشتر */}
          <div className="flex-1 p-4 sm:p-6 bg-pattern">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
