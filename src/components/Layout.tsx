import AppSidebar from "@/components/app-sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import SubSidebar from "./SubSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col mr-16">
        {/* Navbar */}

        <Navbar />

        {/* Page Content */}
        <main className="flex bg-gray-100 min-h-dvh">
          <SubSidebar />
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
