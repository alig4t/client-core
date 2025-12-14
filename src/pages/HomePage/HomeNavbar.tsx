// src/components/Navbar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/stores/AuthContext";
import { APP_LOGO_SMALL_BLUE } from "@/constants/images";

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
        {user ? (
          <div className="flex lg:flex-1 lg:justify-end gap-3">
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
        ) : (
          <div className="lg:flex-1"></div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
