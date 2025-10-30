import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

const TableLink: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  tooltipText?: string;
  tooltipSide?: "left" | "right" | "top" | "bottom";
}> = ({
  to,
  children,
  className = "",
  tooltipText = "مشاهده",
  tooltipSide = "bottom",
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          className={`!p-1 text-gray-400 rounded-full group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 ${className}`}
          to={to}
        >
          {children}
        </Link>
      </TooltipTrigger>

      <TooltipContent side={tooltipSide} sideOffset={10}>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TableLink;
