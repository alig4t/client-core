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
      className={`flex flex-wrap justify-start items-center gap-2 text-sm text-[var(--text-secondary)] ${className}`}
    >
      {items.map((item, index) => {
        const isCurrentPage = index === items.length - 1;
        // Show Home icon only if it's the first item
        const isFirst = index === 0;
        const displayIcon = isFirst ? <Home size={14} className="mb-px" /> : null;

        return (
          <React.Fragment key={index}>
            {/* Separator Icon */}
            {index > 0 && (
              <ChevronLeft size={16} className="text-[var(--text-tertiary)]" />
            )}

            {/* Link or Text Item */}
            <Link
              to={item.href || '#'}
              className={`flex items-center gap-1.5 transition-colors duration-200
                ${isCurrentPage
                  ? "text-[var(--text-primary)] font-medium" // Current page style
                  : "hover:text-[var(--color-primary)]"} // Link style
                ${isCurrentPage ? 'pointer-events-none' : ''} // Disable click on current page
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