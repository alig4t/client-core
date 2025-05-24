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
    <aside className="w-60 bg-white dark:bg-gray-900 border-l border-r border-gray-200 dark:border-gray-600  py-4 px-2">
      <ul className="space-y-1">
        {loading
          ? Array.from({ length: menuItems.length }).map((_, idx) => (
              <li key={idx} className="flex mb-4 gap-4 pr-2 pl-4 items-center">
                <div className="w-7 h-6 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
                <div className="h-6 flex-auto bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              </li>
            ))
          : menuItems.map((item, idx) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={idx}>
                  <Link
                    to={item.href}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                      ${
                        isActive
                          ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:!text-white"
                          : "text-gray-600 hover:bg-gray-50 dark:!text-gray-300 dark:hover:bg-gray-800"
                      }`}
                  >
                    <span
                      className={`text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white`}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1 text-right">{item.label}</span>
                  </Link>
                </li>
              );
            })}
      </ul>
    </aside>
  );
};

export default SubSidebar;
