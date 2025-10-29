// src/components/ViewNameLink.tsx
import { routeConfig } from "@/router/Routes";
import type { ViewName } from "@/router/ViewName";
import React from "react";
import { useNavigate } from "react-router-dom";


interface ViewNameLinkProps {
  viewName: ViewName;
  id?: string | number;
  label: string;
  className?: string;
  disabled?: boolean;
}

const LinkView: React.FC<ViewNameLinkProps> = ({
  viewName,
  id,
  label,
  className = "",
  disabled = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;

    // پیدا کردن مسیر مربوط به viewName
    const route = routeConfig.find((r) => r.name === viewName);
    if (!route) {
      console.error(`No route found for viewName: ${viewName}`);
      return;
    }

    let path = route.path;

    // جایگزینی :id با مقدار واقعی
    if (id !== undefined && path.includes("/:id")) {
      path = path.replace("/:id", `/${id}`);
    }

    navigate(path);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`text-blue-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed ${className}`}
    >
      {label}
    </button>
  );
};

export default LinkView;