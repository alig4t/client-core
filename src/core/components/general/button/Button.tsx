// components/Button.tsx
import { Loader2, type LucideIcon } from "lucide-react";
import React from "react";
import { useCore } from "../../../entity/CoreProvider";

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
  permission?: string;
};

export const variantClasses = {
  primary:
    "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-hover)] focus:ring-[var(--border-focus)] border border-transparent disabled:opacity-50",
  success:
    "bg-[var(--button-success-bg)] text-[var(--button-success-text)] hover:bg-[var(--button-success-hover)] focus:ring-[var(--color-success)] border border-transparent disabled:opacity-50",
  secondary:
    "bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] border border-[var(--button-secondary-border)] hover:bg-[var(--button-secondary-hover)] focus:ring-[var(--border-secondary)]",
  cancel:
    "bg-transparent text-[var(--text-secondary)] border border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] focus:ring-[var(--border-secondary)]",
  danger:
    "bg-[var(--button-danger-bg)] text-[var(--button-danger-text)] hover:bg-[var(--button-danger-hover)] focus:ring-[var(--color-danger)] border border-transparent disabled:opacity-50",
};

// کلاس‌های مربوط به badge بر اساس variant دکمه
export const badgeVariantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
  success: "bg-[var(--color-success-light)] text-[var(--color-success)]",
  secondary: "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]",
  cancel: "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]",
  danger: "bg-[var(--color-danger-light)] text-[var(--color-danger)]",
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
  permission,
}: ButtonProps) => {
  const { can } = useCore();
  if (!can(permission)) return null;
  const isDisabled = disabled || loading;

  const baseClasses =
    "inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:cursor-not-allowed";

  // استفاده از کلاس badge متناسب با variant
  const badgeClasses = `mr-2 text-xs font-bold px-2 pb-[2px] pt-[3px] rounded-full ${
    badgeVariantClasses[variant] ||
    "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
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
            <Loader2 size={16} className="animate-spin" />
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
