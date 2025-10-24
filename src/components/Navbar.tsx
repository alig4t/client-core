import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  type FC,
} from "react";
import { Bell, MoonIcon, SunIcon, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/stores/AuthContext";
import Dropdown from "./general/DropDown";

// --- TypeScript Interfaces ---

/** Mock User interface based on usage in Navbar */
interface User {
  name: string;
  username: string;
}

interface CustomSeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

// Extend base button attributes for CustomButton
interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

interface NotificationItemProps {
  text: string;
  time: string;
}

// --- Custom Components & Logic ---

// 1. Custom Dropdown Component (Replaces DropdownMenu family)

// 2. Custom Separator (Replaces Shadcn Separator)
const CustomSeparator: FC<CustomSeparatorProps> = ({
  orientation = "horizontal",
  className = "",
}) => {
  if (orientation === "vertical") {
    return (
      <div
        className={`w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2 ${className}`}
        aria-hidden="true"
      ></div>
    );
  }
  return (
    <div className={`w-full h-px bg-gray-100 dark:bg-gray-700 ${className}`} />
  );
};

// 3. Custom Button (Replaces Shadcn Button)
const CustomButton: FC<CustomButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`!px-3 !py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// 4. Notification Item
const NotificationItem: FC<NotificationItemProps> = ({ text, time }) => (
  <div className="flex items-start justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
    <span className="text-sm text-[var(--primary-text)]">{text}</span>
    <span className="text-xs text-gray-400">{time}</span>
  </div>
);

// --- Main Navbar Component ---

const Navbar: FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  // Casting useAuth return for clarity, assuming a structure with user and logout
  const { user, logout } = useAuth() as {
    user: User | null;
    logout: () => void;
  };

  // Mock user details for a placeholder
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AU"; // AU for Anonymous User

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <div className="w-full h-16 bg-[var(--background)] border-b border-gray-300 dark:border-gray-700 flex items-center justify-end md:justify-between px-6">
      {/* Title (Right) */}
      <h3 className="text-lg font-bold text-[var(--primary-text)] hidden md:block">
        پنل مدیریت
      </h3>

      {/* Action Buttons (Center/Left) */}
      <div className="hidden md:flex gap-3">
        <CustomButton className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-zinc-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm">
          پشتیبانی
        </CustomButton>

        <CustomButton className="bg-[#c5226c] hover:bg-[#c11764] font-bold text-xs text-white shadow-sm shadow-[#c5226c]/40">
          ارتقای حساب
        </CustomButton>
      </div>

      {/* Controls: Notifications, Dark Mode, User Menu */}
      <div className="flex items-center gap-4">
        {/* 1. Notifications Dropdown */}
        <Dropdown
          trigger={
            <button className="relative text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-900 rounded-lg p-2.5 border border-transparent hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute  -top-2 p-0.5 pt-1 min-w-5 min-h-5 -right-1 bg-red-600 text-white text-[10px] font-semibold rounded-full flex items-center justify-center ring-2 ring-[var(--background)]">
                2
              </span>
            </button>
          }
          align="start" // Align notification menu to the right (start in RTL)
          className="ml-4"
        >
          <div className="py-2 text-right">
            <p className="text-center font-semibold text-sm p-2 text-[var(--primary-text)] border-b border-gray-100 dark:border-gray-700">
              اطلاع رسانی‌ها
            </p>
            <NotificationItem text="شما یک پیام جدید دارید" time="لخظاتی پیش" />
            <NotificationItem text="اکانت شما ارتقا یافت" time="2 ساعت پیش" />
            <NotificationItem text="هشدار امنیتی جدید" time="هفته گذشته" />
          </div>
        </Dropdown>

        {/* 2. Dark Mode Toggle */}
        <div
          className="flex items-center w-8 h-8 text-gray-700 dark:text-gray-100 justify-center cursor-pointer
            transition-all duration-300 hover:rotate-12 hover:scale-110"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-500" />
          ) : (
            <MoonIcon className="h-6 w-6 text-indigo-500" />
          )}
        </div>

        <CustomSeparator orientation="vertical" className="!h-6 mx-2" />

        {/* 3. User Dropdown (Elegant Placeholder) */}
        <Dropdown
          trigger={
            <div className="flex items-center gap-3 cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="text-sm font-medium text-[var(--primary-text)] hidden sm:block">
                {user?.name || "کاربر مهمان"}
              </span>
              {/* Custom Avatar Placeholder */}
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg ring-2 ring-purple-300 dark:ring-purple-700 shadow-md">
                {initials}
              </div>
            </div>
          }
          align="end"
          className="z-50"
        >
          {/* User Info Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xl ring-2 ring-purple-300 dark:ring-purple-700 flex-shrink-0">
              {initials}
            </div>
            <div className="flex flex-col items-end overflow-hidden">
              <p className="font-semibold text-base text-[var(--primary-text)] truncate w-full">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate w-full">
                {user?.username}
              </p>
            </div>
          </div>

          {/* User Actions Footer */}
          <div className="p-2 flex flex-col space-y-1">
            <button className="flex items-center gap-3 p-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full justify-end">
              <span className="flex-1 text-right">تنظیمات حساب</span>
              <Settings className="h-4 w-4 text-blue-500" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-2 text-sm text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 transition-colors w-full justify-end"
            >
              <span className="flex-1 text-right">خروج</span>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
