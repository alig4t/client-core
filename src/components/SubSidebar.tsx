import { Link, useLocation } from "react-router-dom";
import { subMenus } from "@/constants/menu";
import { useEffect, useState } from "react";

const SubSidebar = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // پیدا کردن کلید مرتبط (مثلاً /settings)
  const matchedKey = Object.keys(subMenus).find((prefix) =>
    location.pathname.startsWith(prefix)
  );

  const menuItems = matchedKey ? subMenus[matchedKey] : [];

  // زمانی که مسیر تغییر کنه، دوباره لودینگ اجرا میشه
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [matchedKey]);

  // اگر هیچ زیرمنویی پیدا نشد، اصلاً چیزی نشون نده
  if (!matchedKey) return null;

  return (
    <aside className="w-full  md:w-60 bg-[var(--background)] dark:bg-gray-900 border-l border-r border-gray-200 dark:border-gray-600 py-8 md:py-4 px-6 md:px-2">
      <ul
        className="
      grid grid-cols-3 sm:grid-cols-4 gap-3 
      md:block md:space-y-1 w-full transition-all"
      >
        {loading
          ? Array.from({ length: menuItems.length }).map((_, idx) => (
              <li
                key={idx}
                className="flex flex-col md:flex-row items-center justify-center gap-2 md:mb-3 md:px-2"
              >
                <div className="w-7 h-6 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
                <div className="w-12 h-3 md:h-5 md:flex-auto bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              </li>
            ))
          : menuItems.map((item, idx) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={idx}>
                  <Link
                    to={item.href}
                    className={`
                  group flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3 p-4 md:p-2 rounded-lg text-[12px] md:text-sm font-medium shadow-sm md:shadow-none
                  ${
                    isActive
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                  >
                    <span className="text-lg text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white">
                      {item.icon}
                    </span>
                    <span className="text-center md:text-right min-h-[36px] md:min-h-0 flex items-center dark:text-zinc-200">
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
