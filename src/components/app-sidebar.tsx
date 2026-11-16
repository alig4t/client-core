// src/components/Sidebar/Sidebar.tsx
import {
Tooltip,
TooltipContent,
TooltipProvider,
TooltipTrigger,
} from "@/components/ui/tooltip";
import { getMainMenu } from "@/router/menuUtils";
import { useAuth } from "@/stores/AuthContext";
import { LayoutDashboard } from "lucide-react";
import { Link,useLocation } from "react-router-dom";

const Sidebar = () => {
  const { hasPermission } = useAuth();
  const location = useLocation();

  // Extract first part of current path (e.g. from "/dashboard/profile" -> "dashboard")
  const currentBase = location.pathname.split("/")[2] || "";

  const menuItems = getMainMenu().filter((item) => {
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }
    return true;
  });

  return (
    <TooltipProvider>
      <div className="h-auto hidden w-16 min-w-16 bg-gray-900 sm:flex flex-col items-center py-4">
        <div className="mb-6">
          <Link to="/">
            <LayoutDashboard size={28} className="text-white" />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent w-full flex flex-col items-center gap-4 custom-scrollbar">
          {menuItems.map((item, index) => {
            // Extract first part of item path
            const itemBase = item.path.split("/")[2] || "";
            const isActive = currentBase === itemBase;

            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link to={item.path} aria-label={item.label}>
                    <div
                      className={`text-white hover:bg-gray-800 p-2 rounded-lg cursor-pointer
                        ${isActive
                          ? "bg-[#9eaecd70] text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }
                      `}
                    >
                      {item.icon}
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={10}>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;
