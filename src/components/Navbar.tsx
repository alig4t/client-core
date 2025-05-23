import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="w-full h-16 bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between px-4">
      {/* Title (Right) */}
      <h3 className="text-sm font-bold text-gray-800 dark:text-white">
        پنل مدیریت
      </h3>

      {/* Upgrade Button */}
      <div className="flex gap-2">
        <Button variant="secondary" className="text-sm">
          ارتقای حساب
        </Button>

        <Button variant="outline" className="text-sm">
          پشتیبانی
        </Button>
      </div>
      {/* Dark Mode Toggle */}

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="text-gray-700 dark:text-gray-200"
        >
          <Moon className="h-5 w-5" />
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src="https://i.pravatar.cc/40"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                علی رضایی
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 text-right">
            <div className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700">
              <img
                src="https://i.pravatar.cc/40"
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col items-end">
                <p className="font-medium">علی رضایی</p>
                <p className="text-xs text-gray-500">ali@email.com</p>
              </div>
            </div>
            <div className="flex justify-between px-3 py-2 text-sm">
              <DropdownMenuItem className="text-blue-600 hover:text-blue-800 cursor-pointer">
                تنظیمات
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 hover:text-red-800 cursor-pointer">
                خروج
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
