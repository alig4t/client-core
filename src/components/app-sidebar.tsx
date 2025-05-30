import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { mainMenu } from "@/constants/menu";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname.substring(1).split("/")[0];

  return (
    <TooltipProvider>
      <div className="fixed right-0 top-0 h-screen w-16 bg-gray-900 flex flex-col items-center py-4">
        {/* 🔹 لوگو بالا */}
        <div className="mb-6">
          <LayoutDashboard size={28} className="text-white" />
        </div>

        {/* 🔹 بخش اسکرول‌پذیر آیتم‌ها */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent w-full flex flex-col items-center gap-4 custom-scrollbar">
          {mainMenu.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link to={item.href}>
                  <div
                    className={`text-white hover:bg-gray-800 p-2 rounded-lg cursor-pointer
                    ${
                      "/" + currentPath === item.href
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
