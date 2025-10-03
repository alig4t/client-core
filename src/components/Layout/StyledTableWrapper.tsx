import React from "react";

interface StyledTableWrapperProps {
  title: string;
  children: React.ReactNode;
}

/**
 * A wrapper component that provides a styled container for tables,
 * matching the design with a distinct title section.
 */
const StyledTableWrapper: React.FC<StyledTableWrapperProps> = ({
  title,
  children,
}) => {
  return (
    <div className="bg-[var(--card)] text-[var(--foreground)] rounded-sm border border-[var(--border)] shadow-sm my-3">
      {/* بخش عنوان جدول */}
      <div className="p-6 border-b  border-[var(--border)]">
        <h3 className="font-semibold text-lg tracking-tight">{title}</h3>
      </div>
      {/* محتوای جدول (که از children می‌آید) */}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default StyledTableWrapper;
