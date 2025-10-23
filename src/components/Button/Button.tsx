// components/Button.tsx
import React from "react";
import Spinner from "../general/Spinner";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "cancel" | "success";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
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
};

const Button = ({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  loading = false,
  onClick,
  className = "",
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  const baseClasses =
    "inline-flex items-center px-4 py-2 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300 disabled:cursor-not-allowed";

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
      {!loading && children}
    </button>
  );
};

export default Button;
