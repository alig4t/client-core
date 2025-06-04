import { MoonIcon, SunIcon } from "lucide-react";
import { Card } from "./ui/card";
import { useState, type ReactElement } from "react";

interface AuthLayoutProps {
  children: ReactElement;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex flex-col min-h-screen bg-layout">
      <div className="h-12 w-full flex items-center justify-end pe-3 sticky ">
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
      </div>
      <div
        className="flex flex-grow mb-4 items-center justify-center bg-layout text-right px-4"
        dir="rtl"
      >
        <Card className="w-full max-w-sm bg-layout-content rounded-xl shadow-lg ">
          {children}
        </Card>
      </div>
    </div>
  );
}
