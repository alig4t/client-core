import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, MoonIcon, SunIcon } from "lucide-react";
import { useState } from "react";
import { Separator } from "./ui/separator";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="w-full h-16 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 flex items-center justify-end md:justify-between px-4">
      {/* Title (Right) */}
      <h3 className="text-sm font-bold text-gray-800 dark:text-white hidden md:visible">
        پنل مدیریت
      </h3>

      {/* Upgrade Button */}
      <div className="hidden md:visible md:flex gap-2">
        <Button
          className=" !bg-white !border-0 !shadow-none
         !text-sm hover:!text-gray-900 transition !text-zinc-500 dark:text-gray-700"
        >
          پشتیبانی
        </Button>

        <Button className="!bg-[#c5226c] hover:!bg-[#c11764] !font-bold hover:!text-white !text-xs text-zinc-50">
          ارتقای حساب
        </Button>
      </div>

      {/* Dark Mode Toggle */}

      <div className="flex items-center gap-2 space-x-1">
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <button className="relative text-gray-700 dark:text-white !bg-gray-50 dark:!bg-gray-900 rounded-md p-2 border-gray-200 dark:hover:!border-gray-800">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 text-right">
            <DropdownMenuLabel className="text-center">
              اطلاع رسانی‌ها
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="flex items-start justify-between gap-2">
              <span className="text-sm">شما یک پیام جدید دارید</span>
              <span className="text-xs text-gray-300">لخظاتی پیش</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-start justify-between gap-2">
              <span className="text-sm">اکانت شما ارتقا یافت</span>
              <span className="text-xs text-gray-300">2 ساعت پیش</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-start justify-between gap-2">
              <span className="text-sm">هشدار امنیتی جدید</span>
              <span className="text-xs text-gray-300">هفته گذشته</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div
          className="flex items-center w-10 h-12 text-gray-700
           dark:text-gray-100 justify-center cursor-pointer
            transition-all duration-300 hover:rotate-12 hover:scale-110"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 transition-transform duration-300" />
          ) : (
            <MoonIcon className="h-6 w-6 transition-transform duration-300" />
          )}
        </div>

        <Separator
          orientation="vertical"
          className="!h-6 !text-gray-300 !mr-1 !ml-4"
        />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                علی رضایی
              </span>
              <img
                src="https://i.pravatar.cc/40"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
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
