// src/components/display/RowContainer.tsx

import type { FC, ReactNode } from "react";
import { useCore } from "../../../entity/CoreProvider";

interface RowContainerProps {
  children: ReactNode;
  /** Defines the number of columns in the grid layout on larger screens. Default is 3. */
  numberOfColumns?: 1 | 2 | 3 | 4;
}

/**
 * A container to wrap DisplayField components, applying a responsive grid layout.
 */
export const RowContainer: FC<RowContainerProps> = ({
  children,
  numberOfColumns = 3,
}) => {
  const { direction } = useCore();
  const gridClass = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
  }[numberOfColumns];

  return (
    <dl dir={direction} className={`grid grid-cols-1 ${gridClass} gap-4`}>
      {children}
    </dl>
  );
};
