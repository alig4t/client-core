import type { FC, ReactElement } from "react";

export const PageWrapper: FC<{ children: ReactElement[] | ReactElement }> = ({
  children,
}) => {
  return <div dir="rtl">{children}</div>;
};
