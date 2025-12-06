// src/components/general/ConfirmationModal.tsx

import React from "react";
// فرض می‌کنیم ModalAnimation در یک مسیر قابل دسترسی است

import Button from "../Button/Button";
import { AlertTriangle } from "lucide-react";
import ModalAnimation from "./Modal";

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
          <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />

          <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            انصراف
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "در حال حذف..." : "حذف کن"}
          </Button>
        </div>
      </div>
    </ModalAnimation>
  );
};

export default ConfirmationModal;
