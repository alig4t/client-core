import * as Primitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
  startOpen?: boolean;
}

export default function Accordion({
  title,
  children,
  startOpen = false,
}: AccordionProps) {
  return (
    <Primitive.Root
      type="single"
      collapsible
      defaultValue={startOpen ? "content" : undefined}
    >
      <Primitive.Item
        value="content"
        className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg mb-6 overflow-hidden"
      >
        <Primitive.Header>
          <Primitive.Trigger
            type="button"
            className="group w-full flex justify-between items-center gap-3 px-6 py-4 text-start bg-[var(--table-header-bg)] hover:bg-[var(--bg-tertiary)] border-b border-[var(--table-border)]"
          >
            <span className="text-base font-semibold text-[var(--text-primary)]">
              {title}
            </span>
            <ChevronDown
              aria-hidden="true"
              size={20}
              className="shrink-0 text-[var(--text-secondary)] transition-transform group-data-[state=open]:rotate-180"
            />
          </Primitive.Trigger>
        </Primitive.Header>
        <Primitive.Content className="bg-[var(--card-bg)] overflow-hidden">
          <div className="px-6 py-5 space-y-3">{children}</div>
        </Primitive.Content>
      </Primitive.Item>
    </Primitive.Root>
  );
}
