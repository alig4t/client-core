// src/components/Navbar.tsx
import React from "react";

const navItems = [
  { name: "ویژگی‌ها", href: "#" },
  { name: "قیمت‌گذاری", href: "#" },
  { name: "درباره ما", href: "#" },
];

const Navbar: React.FC = () => {
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
            SocialMon
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
            href="/login"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            ورود <span aria-hidden="true">&larr;</span>
          </a>
          <a
            href="/signup"
            className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            ثبت‌نام
          </a>
        </div>
      </nav>
      {/* می‌توانید یک منوی موبایل (Mobile Menu) را نیز در اینجا اضافه کنید */}
    </header>
  );
};

export default Navbar;
