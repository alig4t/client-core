import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./stores/AuthContext";
import CoreSetup from "./CoreSetup";
import { configureApi } from "./core/service/Axios";
import { API_BASE_URL } from "./config/api";
import { ErrorBoundary } from "./core/entity/ErrorBoundary";
configureApi({
  baseURL: API_BASE_URL,
  token: () => localStorage.getItem("token"),
  onUnauthorized: () => window.dispatchEvent(new Event("core:unauthorized")),
});
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "*",
    element: (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CoreSetup>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
            <div id="modal-root" />
          </CoreSetup>
        </AuthProvider>
      </QueryClientProvider>
    ),
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
