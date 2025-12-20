// src/components/general/ConfirmationModal.tsx

import React from "react";
// فرض می‌کنیم ModalAnimation در یک مسیر قابل دسترسی است

import { AlertTriangle } from "lucide-react";
import ModalAnimation from "./Modal";
import Button from "@/core/components/general/button/Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isDeleting: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDeleting,
}) => {
  return (
    // استفاده از ModalAnimation به عنوان شل اصلی
    <ModalAnimation isOpen={isOpen} onDismiss={onClose} title={title} mobileBottomSheet={true}>
      {/* محتوای Confirmation */}
      <div dir="rtl" className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <AlertTriangle className="h-6 w-6 text-[var(--color-danger)] flex-shrink-0" />

          <p className="text-sm text-[var(--text-secondary)]">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-primary)]">
          <Button variant="cancel" onClick={onClose} disabled={isDeleting}>
            انصراف
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "در حال حذف..." : "حذف کن"}
          </Button>
        </div>
      </div>
    </ModalAnimation>
  );
};

export default ConfirmationModal;
