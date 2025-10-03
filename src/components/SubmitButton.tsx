import type { ReactElement } from "react";
import { Button } from "./ui/button";

interface SubmitButtonProps {
  children: ReactElement | String;
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
  className?: string;
}
export default function SubmitButton({
  children,
  disabled = false,
  type = "button",
  className = "",
}: SubmitButtonProps) {
  return (
    <Button
      type={type}
      disabled={disabled}
      variant="outline"
      className={`w-full flex justify-center items-center gap-2 !bg-[#f9f9f9] text-gray-800
             dark:hover:!text-gray-900 dark:hover:!bg-zinc-200 !transition ${className}`}
    >
      {children}
    </Button>
  );
}
