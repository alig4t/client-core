// src/components/Sidebar/Sidebar.tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { mainMenu } from "@/router/menuUtils";
import { LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname.substring(1).split("/")[0];

  return (
    <TooltipProvider>
      <div className="h-auto w-16 min-w-16 bg-gray-900 flex flex-col items-center py-4">
        <div className="mb-6">
          <LayoutDashboard size={28} className="text-white" />
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent w-full flex flex-col items-center gap-4 custom-scrollbar">
          {mainMenu.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link to={item.path}>
                  <div
                    className={`text-white hover:bg-gray-800 p-2 rounded-lg cursor-pointer
                    ${
                      "/" + currentPath === item.path
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
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;
