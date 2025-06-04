import AppSidebar from "@/components/app-sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import SubSidebar from "./SubSidebar";
import ProgressBar from "./ProgressBar";

export default function Layout() {
  return (
    <div className="flex justify-between">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex flex-col md:flex-row flex-wrap bg-gray-50 dark:bg-gray-800 min-h-[calc(100dvh-64px)]">
          <SubSidebar />
          <div className="flex-1 p-3">
            <Outlet />
            <ProgressBar />
          </div>
        </main>
      </div>
    </div>
  );
}
