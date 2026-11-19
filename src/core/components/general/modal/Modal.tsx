import { Dialog } from "../../../ui/Dialog";
import type { DialogProps } from "../../../ui/types";

export interface ModalProps extends Omit<DialogProps, "open" | "onOpenChange"> {
  isOpen: boolean;
  onDismiss: () => void;
}

/** Compatibility entry; behavior and project customization come from shared UI. */
export default function Modal({ isOpen, onDismiss, ...props }: ModalProps) {
  return (
    <Dialog
      {...props}
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onDismiss();
      }}
    />
  );
}
