import { useRef } from "react";
import * as Primitive from "@radix-ui/react-dialog";
import { cn } from "../utils/classNames";
import { resolveProps, useCoreUI } from "./configuration";
import type { DialogProps } from "./types";

export function DialogBase({
  open,
  onOpenChange,
  title,
  description,
  closeLabel = "بستن مودال",
  mobileBottomSheet,
  portalContainer,
  children,
  className,
  classNames,
  dir,
  lang,
  ...props
}: DialogProps) {
  const ui = useCoreUI();
  const previousFocus = useRef<HTMLElement | null>(null);
  const container = portalContainer ?? ui.portalContainer;
  return (
    <Primitive.Root open={open} onOpenChange={onOpenChange}>
      {container !== null && (
        <Primitive.Portal
          container={
            container ??
            (typeof document === "undefined"
              ? undefined
              : (document.getElementById("modal-root") ?? undefined))
          }
        >
          <Primitive.Overlay
            data-core-component="DialogOverlay"
            className={cn("core-dialog-overlay", classNames?.overlay)}
          />
          <Primitive.Content
            {...props}
            dir={dir ?? ui.direction}
            lang={lang ?? ui.locale}
            data-core-component="Dialog"
            data-slot="root"
            data-bottom-sheet={mobileBottomSheet || undefined}
            {...(!description && !props["aria-describedby"]
              ? { "aria-describedby": undefined }
              : {})}
            onOpenAutoFocus={() => {
              previousFocus.current =
                document.activeElement as HTMLElement | null;
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              if (previousFocus.current?.isConnected)
                previousFocus.current.focus();
            }}
            className={cn("core-dialog", classNames?.root, className)}
          >
            <div
              data-slot="header"
              className={cn("core-dialog-header", classNames?.header)}
            >
              <Primitive.Title
                data-slot="title"
                className={cn("core-dialog-title", classNames?.title)}
              >
                {title}
              </Primitive.Title>
              <Primitive.Close
                type="button"
                aria-label={closeLabel}
                data-slot="close"
                className={cn("core-dialog-close", classNames?.close)}
              >
                ×
              </Primitive.Close>
            </div>
            {description && (
              <Primitive.Description
                data-slot="description"
                className={classNames?.description}
              >
                {description}
              </Primitive.Description>
            )}
            <div data-slot="content" className={classNames?.content}>
              {children}
            </div>
          </Primitive.Content>
        </Primitive.Portal>
      )}
    </Primitive.Root>
  );
}
export function Dialog(props: DialogProps) {
  const ui = useCoreUI();
  const View = ui.registry.Dialog ?? DialogBase;
  return <View {...resolveProps(ui.components.Dialog, props)} />;
}
