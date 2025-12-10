// components/NavLink.tsx
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import {
  Eye,
  Pencil,
  CheckCircle,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import type { ViewName } from "@/router/ViewName";
import { getViewPath } from "@/core/router/RouteUtils";


type Permission = string;

type NavLinkVariant = "display" | "edit" | "accept" | "delete";

type NavLinkProps = {
  variant: NavLinkVariant;
  permission: Permission;
  viewName: ViewName;
  idParam: number | string;
  icon?: LucideIcon;
  label?: string;
  tooltipSide?: "left" | "right" | "top" | "bottom";
  className?: string;
  onClick?: () => void;
};

const iconButtonStyle =
  "!p-1 text-gray-400 rounded-full group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200";

const getVariantConfig = (
  variant: NavLinkVariant
): { icon: LucideIcon; label: string } => {
  switch (variant) {
    case "display":
      return {
        icon: Eye,
        label: "مشاهده",
      };
    case "edit":
      return {
        icon: Pencil,
        label: "ویرایش",
      };
    case "accept":
      return {
        icon: CheckCircle,
        label: "تایید",
      };
    case "delete":
      return {
        icon: Trash2,
        label: "حذف",
      };
    default:
      return {
        icon: Eye,
        label: "مشاهده",
      };
  }
};

const NavLink: React.FC<NavLinkProps> = ({
  variant,
  permission,
  viewName,
  idParam,
  icon,
  label,
  tooltipSide = "bottom",
  className = "",
  onClick,
}) => {

  const hasPermission = true;

  if (!hasPermission) {
    return null;
  }

  const { icon: defaultIcon, label: defaultLabel } = getVariantConfig(variant);

  const ResolvedIcon = icon || defaultIcon;
  const resolvedLabel = label || defaultLabel;

  const linkPath = getViewPath(viewName, idParam);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={linkPath}
          onClick={onClick}
          className={`${iconButtonStyle} ${className}`}
        >
          <ResolvedIcon size={20} />
        </Link>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide} sideOffset={10}>
        <p>{resolvedLabel}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default NavLink;
