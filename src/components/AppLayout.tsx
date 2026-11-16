import { Outlet } from "react-router-dom";
import AppSidebar from "./app-sidebar";
import Navbar from "./Navbar";
import SubSidebar from "./SubSidebar";
import Layout from "@/core/components/layout/Layout";
import LoadingOverlay from "@/core/components/general/loading/LoadingOverlay";
import { LoadingProvider } from "@/core/stores/LoadingContext";
export default function AppLayout() {
  return (
    <LoadingProvider>
      <LoadingOverlay />
      <Layout
        sidebar={<AppSidebar />}
        header={<Navbar />}
        subSidebar={<SubSidebar />}
      >
        <Outlet />
      </Layout>
    </LoadingProvider>
  );
}
