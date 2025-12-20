import { ChevronLeft, Home } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

// --- ✨ NEW: Reusable Breadcrumb Component ---
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * A modern, reusable breadcrumb component with a home icon.
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`inline-flex flex-wrap justify-start items-center gap-2 px-4 py-2.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm text-sm ${className}`}
    >
      {items.map((item, index) => {
        const isCurrentPage = index === items.length - 1;
        const isFirst = index === 0;
        const displayIcon = isFirst ? <Home size={15} className="mb-px" /> : null;

        return (
          <React.Fragment key={index}>
            {/* Separator Icon */}
            {index > 0 && (
              <ChevronLeft size={16} className="text-slate-400 dark:text-slate-500" />
            )}

            {/* Link or Text Item */}
            <Link
              to={item.href || '#'}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-200
                ${isCurrentPage
                  ? "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"}
                ${isCurrentPage ? 'pointer-events-none' : ''}
              `}
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {displayIcon}
              <span>{item.label}</span>
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb