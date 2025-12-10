// src/components/Navbar.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ModalAnimation from "@/core/components/general/modal/Modal";

import { APP_LOGO_SMALL_BLUE } from "@/constants/images";
import LoginPage from "../Login";
import RegisterPage from "../RegisterPage";
import { useAuth } from "@/stores/AuthContext";

const navItems = [
  { name: "ویژگی‌ها", href: "#" },
  { name: "قیمت‌گذاری", href: "#" },
  { name: "درباره ما", href: "#" },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [login, setLogin] = useState(false);
  const [signUp, setSignUp] = useState(false);

  const switchModal = () => {
    if (login) {
      setLogin(false);
      setTimeout(() => setSignUp(true), 400);
    } else if (signUp) {
      setSignUp(false);
      setTimeout(() => setLogin(true), 400);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <a
            href="#"
            className="-m-1.5 p-1.5 gap-1 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
          >
            <img
              src={APP_LOGO_SMALL_BLUE}
              className="w-8 h-8 opacity-90 hover:opacity-100 transition-all"
            />
            {import.meta.env.VITE_APP_TITLE}
          </a>
        </div>

        {/* Navigation items */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* ✅ Right section: if not logged in */}
        {!user ? (
          <div className="lg:flex lg:flex-1 lg:justify-end space-x-4">
            <a
              onClick={(e) => {
                e.preventDefault();
                setLogin(true);
              }}
              className="text-sm font-semibold cursor-pointer leading-6 text-gray-900 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              ورود <span aria-hidden="true">&larr;</span>
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                setSignUp(true);
              }}
              className="rounded-full cursor-pointer bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              ثبت‌نام
            </a>
          </div>
        ) : (
          // ✅ If user is logged in
          <div className="lg:flex lg:flex-1 lg:justify-end space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              پنل کاربری
            </button>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-gray-900 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              خروج
            </button>
          </div>
        )}
      </nav>

      {/* Login / Register Modal */}
      <ModalAnimation
        title={login ? "ورود" : "ثبت نام"}
        isOpen={login || signUp}
        onDismiss={() => {
          setLogin(false);
          setSignUp(false);
        }}
      >
        {login ? (
          <LoginPage inModal switchModal={switchModal} />
        ) : (
          <RegisterPage inModal switchModal={switchModal} />
        )}
      </ModalAnimation>
    </header>
  );
};

export default Navbar;
