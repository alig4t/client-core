// src/components/SubSidebar/SubSidebar.tsx
import { Link, useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import { getSubMenus } from "@/router/menuUtils";
import { useAuth } from "@/stores/AuthContext";
// import { subMenus } from "@/router/menuUtils";

const SubSidebar = () => {
  const location = useLocation();
  const { hasPermission } = useAuth();
  const [loading, setLoading] = useState(true);

  // دریافت تمام زیرمنوها (بدون فیلتر)
  const allSubMenus = getSubMenus();

  // پیدا کردن کلید والد مرتبط (مثلاً /dashboard/settings)
  const matchedKey = Object.keys(allSubMenus).find((prefix) =>
    location.pathname.startsWith(prefix)
  );

  // فیلتر کردن آیتم‌های زیرمنو بر اساس مجوز
  const menuItems = matchedKey
    ? allSubMenus[matchedKey].filter((item) => {
        // اگر آیتم مجوز نیاز دارد و کاربر آن را ندارد → نشان نده
        if (item.permission && !hasPermission(item.permission)) {
          return false;
        }
        return true;
      })
    : [];

  // مدیریت لودینگ
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(timer);
  }, [matchedKey]);

  // اگر هیچ زیرمنویی برای نمایش وجود ندارد، چیزی نشان نده
  if (!matchedKey || menuItems.length === 0) return null;

  return (
    <aside className="w-full lg:w-60 bg-[var(--background)] border-l border-r border-gray-200 dark:border-gray-600 py-8 lg:py-4 px-6 lg:px-2">
      <ul className="grid grid-cols-3 sm:grid-cols-4 gap-3 lg:block lg:space-y-1 w-full transition-all">
        {loading
          ? Array.from({ length: menuItems.length }).map((_, idx) => (
              <li
                key={idx}
                className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:mb-3 lg:px-2"
              >
                <div className="w-7 h-6 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
                <div className="w-12 h-3 lg:h-5 lg:flex-auto bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              </li>
            ))
          : menuItems.map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className={`
                  group flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-2 lg:gap-3 p-4 lg:p-2 rounded-lg text-[12px] lg:text-sm font-medium shadow-sm lg:shadow-none
                  ${
                    isActive
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                  >
                    <span className="text-lg text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white">
                      {item.icon}
                    </span>
                    <span className="text-center lg:text-right min-h-[36px] lg:min-h-0 flex items-center dark:text-zinc-200">
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
      </ul>
    </aside>
  );
};

export default SubSidebar;
