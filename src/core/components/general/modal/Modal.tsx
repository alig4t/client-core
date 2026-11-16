import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
interface ModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  children: ReactNode;
  title: string;
  mobileBottomSheet?: boolean;
}
export default function Modal({
  isOpen,
  onDismiss,
  children,
  title,
  mobileBottomSheet,
}: ModalProps) {
  const panel = useRef<HTMLDivElement>(null),
    dismiss = useRef(onDismiss);
  const titleId = useId();
  useEffect(() => {
    dismiss.current = onDismiss;
  }, [onDismiss]);
  useEffect(() => {
    if (!isOpen) return;
    const active = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
        ) ?? [],
      );
    (focusable()[0] ?? panel.current)?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss.current();
      }
      if (event.key === "Tab") {
        const controls = focusable(),
          first = controls[0],
          last = controls[controls.length - 1];
        if (!first) {
          event.preventDefault();
          panel.current?.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = previousOverflow;
      active?.focus();
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return createPortal(
    <div
      className={
        "fixed inset-0 z-[1000] flex justify-center bg-black/40 p-4 " +
        (mobileBottomSheet ? "items-end sm:items-center" : "items-center")
      }
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onDismiss();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        dir="rtl"
        className="w-full max-w-lg max-h-[95vh] overflow-auto rounded-lg bg-[var(--card-bg)] p-5"
      >
        <div className="flex justify-between mb-4">
          <h2 id={titleId}>{title}</h2>
          <button type="button" onClick={onDismiss} aria-label="بستن مودال">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") ?? document.body,
  );
}
