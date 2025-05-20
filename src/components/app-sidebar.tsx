import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Home, User, Settings, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const items = [
    { icon: <Home size={24} />, label: "خانه", href: "/" },
    { icon: <User size={24} />, label: "پروفایل", href: "/profile" },
    { icon: <Settings size={24} />, label: "تنظیمات", href: "/settings" },
    // 👇 آیتم‌های بیشتر برای تست اسکرول
    { icon: <Home size={24} />, label: "داشبورد", href: "/dashboard" },
    { icon: <User size={24} />, label: "کاربران", href: "/users" },
    { icon: <Settings size={24} />, label: "پیکربندی", href: "/config" },
    { icon: <Home size={24} />, label: "آمار", href: "/stats" },
    { icon: <User size={24} />, label: "حساب من", href: "/account" },
    { icon: <Settings size={24} />, label: "امنیت", href: "/security" },
  ];

  return (
    <TooltipProvider>
      <div className="fixed right-0 top-0 h-screen w-16 bg-gray-900 flex flex-col items-center py-4">
        {/* 🔹 لوگو بالا */}
        <div className="mb-6">
          <LayoutDashboard size={28} className="text-white" />
        </div>

        {/* 🔹 بخش اسکرول‌پذیر آیتم‌ها */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent w-full flex flex-col items-center gap-4 custom-scrollbar">
          {items.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link to={item.href}>
                  <div className="text-white hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
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
