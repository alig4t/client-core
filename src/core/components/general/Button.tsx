// components/Button.tsx
import React from "react";
import { Loader2, type LucideIcon } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "cancel"
  | "success"
  | "danger";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: LucideIcon; // آیکون اختیاری از lucide-react
  badgeCount?: number;
};

export const variantClasses = {
  primary:
    "bg-purple-600 text-white shadow-md hover:bg-purple-700 focus:ring-purple-500 disabled:bg-purple-300",
  success:
    "bg-green-600 text-white shadow-md hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300",
  secondary:
    "border bg-gray-100 border-gray-300 !text-gray-600 dark:text-gray-400 hover:!bg-gray-200 hover:!text-gray-600 focus:ring-gray-500",
  cancel:
    "border border-gray-300 text-gray-700 dark:text-gray-400 hover:bg-gray-100 hover:!text-gray-700 focus:ring-gray-500",
  danger:
    "bg-rose-600 text-white shadow-md hover:bg-rose-700 focus:ring-rose-500 disabled:bg-rose-300",
};

// کلاس‌های مربوط به badge بر اساس variant دکمه
export const badgeVariantClasses: Record<ButtonVariant, string> = {
  primary: "bg-purple-100 text-purple-800",
  success: "bg-green-100 text-green-800",
  secondary: "bg-gray-100 text-gray-800",
  cancel: "bg-gray-100 text-gray-800",
  danger: "bg-rose-100 text-rose-800",
};

const Button = ({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  icon: Icon, // توجه به نام‌گذاری با حرف بزرگ
  badgeCount,
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  const baseClasses =
    "inline-flex items-center px-4 py-2 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300 disabled:cursor-not-allowed";

  // استفاده از کلاس badge متناسب با variant
  const badgeClasses = `mr-2 text-xs font-bold px-2 pb-[2px] pt-[3px] rounded-full ${
    badgeVariantClasses[variant] || "bg-zinc-200 text-gray-800"
  }`;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {loading && (
        <>
          <div className="flex justify-center items-center ml-4">
            <Loader2 size={16} className={`animate-spin text-purple-600`} />
          </div>
          در حال پردازش...
        </>
      )}
      {!loading && (
        <>
          {Icon && <Icon size={16} className="ml-2" />}
          {children}
          {badgeCount !== undefined && (
            <span className={badgeClasses}>{badgeCount}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
