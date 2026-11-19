// components/Button.tsx
import type { LucideIcon } from "lucide-react";
import { useCore } from "../../../entity/CoreProvider";
import { Button as CoreButton } from "../../../ui/Button";
import type { ButtonProps as CoreButtonProps } from "../../../ui/types";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "cancel"
  | "success"
  | "danger";

export interface ButtonProps extends CoreButtonProps {
  variant?: ButtonVariant;
  icon?: LucideIcon; // آیکون اختیاری از lucide-react
  badgeCount?: number;
  permission?: string;
}

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
  variant,
  icon: Icon, // توجه به نام‌گذاری با حرف بزرگ
  badgeCount,
  permission,
  ...props
}: ButtonProps) => {
  const { can } = useCore();
  if (!can(permission)) return null;
  return (
    <CoreButton
      tone={
        variant === "cancel" || variant === "secondary" ? "neutral" : variant
      }
      appearance={variant === "cancel" ? "outline" : undefined}
      startIcon={Icon ? <Icon size={16} /> : undefined}
      badge={badgeCount}
      {...props}
    >
      {children}
    </CoreButton>
  );
};

export default Button;
