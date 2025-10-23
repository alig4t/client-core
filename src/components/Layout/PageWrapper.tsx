import type { FC, ReactElement } from "react";

export const PageWrapper: FC<{
  children: ReactElement[] | ReactElement;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div dir="rtl" className={`p-4 sm:p-6 bg-pattern ${className}`}>
      {children}
    </div>
  );
};
