import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../index.css";
import { ReferencePage } from "./ReferencePage";
import { configureRoutes } from "../../core/router/RouteUtils";

// Only the development entry owns this local router fixture.
configureRoutes([{ name: "catalog.detail", path: "/catalog/:id" }]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReferencePage />
  </StrictMode>,
);
