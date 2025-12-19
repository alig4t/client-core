import type { FC, ReactElement } from "react";

export const PageWrapper: FC<{
  children: ReactElement[] | ReactElement;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div dir="rtl" className={`sm:p-8 max-w-[1800px] font-sans ${className}`}>
      {children}
    </div>
  );
};
