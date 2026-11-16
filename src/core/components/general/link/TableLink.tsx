import { useCore } from "@/core/entity/CoreProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { Link } from "react-router-dom";

const iconButtonStyle =
  "!p-1 text-gray-400 rounded-full group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200";

const TableLink: React.FC<{
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  tooltipText?: string;
  tooltipSide?: "left" | "right" | "top" | "bottom";
  permission?: string;
}> = ({
  to,
  onClick,
  children,
  className = "",
  tooltipText = "مشاهده",
  tooltipSide = "bottom",
  permission,
}) => {
  const { can: hasPermission } = useCore();

  if (permission && !hasPermission(permission)) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {to ? (
          <Link className={`${iconButtonStyle} ${className}`} to={to}>
            {children}
          </Link>
        ) : (
          <button
            className={`${iconButtonStyle}  ${className}`}
            onClick={onClick}
          >
            {children}
          </button>
        )}
      </TooltipTrigger>

      <TooltipContent side={tooltipSide} sideOffset={10}>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TableLink;
