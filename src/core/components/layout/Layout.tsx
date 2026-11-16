import type { ReactNode } from "react";
export default function Layout({
  children,
  header,
  sidebar,
  subSidebar,
}: {
  children: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  subSidebar?: ReactNode;
}) {
  return (
    <div className="flex bg-muted/40 dark:bg-background w-full mx-auto">
      {sidebar}
      <div className="flex-1 flex flex-col responsive-max">
        {header}
        <main className="flex flex-col lg:flex-row min-h-[calc(100dvh-64px)] bg-[var(--background)]">
          {subSidebar}
          <div className="flex-1 min-w-0 w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
