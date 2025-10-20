import type { ReactElement } from "react";

type Iprops = {
  children: ReactElement;
};

export default function Card({ children }: Iprops) {
  return (
    <div
      className="bg-card
      relative rounded-md border shadow-md border-[var(--border)] text-gray-700 dark:text-zinc-100 flex-1
      pb-4
      "
    >
      {children}
    </div>
  );
}
