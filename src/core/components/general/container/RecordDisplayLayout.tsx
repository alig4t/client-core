// src/components/display/RecordDisplayLayout.tsx

import type { FC, ReactNode } from "react";

interface RecordDisplayLayoutProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  isFetching?: boolean;
}

/**
 * Provides the standard structure and styling for a model record display page.
 */
export const RecordDisplayLayout: FC<RecordDisplayLayoutProps> = ({
  title,
  children,
  actions,
  isFetching = false,
}) => {
  return (
    <div dir="rtl" className="p-8 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="!text-2xl font-bold text-[var(--primary-text)]">
          {title}
        </h1>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      {/* Main Content Card */}
      <div
        className={`bg-[var(--white)] p-6 rounded-xl border border-[var(--card-border)] shadow-lg max-w-4xl mx-auto transition-opacity duration-300 ${
          isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
};
