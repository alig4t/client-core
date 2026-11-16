import { useCore } from "../../../entity/CoreProvider";
import type { FC, ReactNode } from "react";

export const PageWrapper: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const { direction } = useCore();
  return (
    <div
      dir={direction}
      className={`sm:p-8 max-w-[1800px] font-sans ${className}`}
    >
      {children}
    </div>
  );
};
