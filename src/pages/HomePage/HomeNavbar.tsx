// src/components/Navbar.tsx

import React, { useState } from "react";
import ModalAnimation from "../../components/general/Modal";
import LoginPage from "../Login";
import RegisterPage from "../RegisterPage";

const navItems = [
  { name: "ویژگی‌ها", href: "#" },
  { name: "قیمت‌گذاری", href: "#" },
  { name: "درباره ما", href: "#" },
];

const Navbar: React.FC = () => {
  const [login, setLogin] = useState(false);
  const [signUp, setSignUp] = useState(false);

  const switchModal = () => {
    if (login) {
      setLogin(false);
      setTimeout(() => {
        setSignUp(true);
      }, 500);
    }
    if (signUp) {
      setSignUp(false);
      setTimeout(() => {
        setLogin(true);
      }, 500);
    }
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a
            href="#"
            className="-m-1.5 p-1.5 text-2xl font-bold text-indigo-600 dark:text-indigo-400"
          >
            رایانوین
          </a>
        </div>

        {/* آیتم‌های ناوبری (فقط برای دسکتاپ) */}
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

        {/* دکمه‌های ورود/ثبت‌نام */}
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
      </nav>
      {/* می‌توانید یک منوی موبایل (Mobile Menu) را نیز در اینجا اضافه کنید */}
      <ModalAnimation
        title={login ? "ورود" : "ثبت نام"}
        isOpen={login || signUp}
        onDismiss={() => {
          setLogin(false);
          setSignUp(false);
        }}
      >
        {login ? (
          <LoginPage inModal={true} switchModal={switchModal} />
        ) : (
          <RegisterPage inModal={true} switchModal={switchModal} />
        )}
      </ModalAnimation>
    </header>
  );
};

export default Navbar;
