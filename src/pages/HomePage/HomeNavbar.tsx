// src/components/Navbar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/stores/AuthContext";
import { APP_LOGO_SMALL_BLUE } from "@/constants/images";
import { MoonIcon, SunIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/30 border-b border-slate-200 dark:border-cyan-500/10 transition-colors duration-500">
      <nav
        className="flex items-center justify-between p-4 lg:px-8 max-w-7xl mx-auto"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <a
            href="#"
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/30 dark:bg-cyan-500/20 blur-xl group-hover:bg-cyan-500/40 dark:group-hover:bg-cyan-500/30 transition-all duration-300 rounded-full"></div>
              <img
                src={APP_LOGO_SMALL_BLUE}
                className="w-10 h-10 relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                alt="Logo"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
              {import.meta.env.VITE_APP_TITLE}
            </span>
          </a>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle Button */}
          <div
            className="flex items-center justify-center w-10 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 dark:border-cyan-500/20 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-white dark:hover:bg-slate-800/90 hover:border-cyan-500/50 dark:hover:border-cyan-500/40 shadow-lg shadow-cyan-500/20 dark:shadow-cyan-500/10"
            onClick={toggleDarkMode}
          >
            <AnimatePresence mode="wait" initial={false}>
              {darkMode ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <SunIcon className="h-5 w-5 text-yellow-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <MoonIcon className="h-5 w-5 text-slate-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Actions */}
          {user ? (
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
              >
                پنل کاربری
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300"
              >
                خروج
              </button>
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
