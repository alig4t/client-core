import type { ReactNode } from "react";
import { useWatch } from "react-hook-form";
import type { Direction } from "../../../core/ui";

export interface DemoProps {
  id: string;
  language: "fa" | "en";
  direction: Direction;
}
export function Example({
  props,
  children,
}: {
  props: string;
  children: ReactNode;
}) {
  return (
    <div className="catalog-example">
      <code className="catalog-props" dir="ltr">
        {props}
      </code>
      <div className="catalog-example-content">{children}</div>
    </div>
  );
}
export function PreviewFrame({ children }: { children: ReactNode }) {
  return <div className="catalog-preview-frame">{children}</div>;
}
export function FormValues({ language }: { language: DemoProps["language"] }) {
  const values = useWatch();
  return (
    <details className="catalog-values">
      <summary>
        {language === "fa" ? "مقدار فعلی فرم" : "Current form values"}
      </summary>
      <pre dir="ltr">{JSON.stringify(values, null, 2)}</pre>
    </details>
  );
}
export function Message({ children }: { children: ReactNode }) {
  return (
    <output className="catalog-message" aria-live="polite">
      {children}
    </output>
  );
}
