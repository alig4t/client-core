import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { AttachmentModel } from "./AttachmentModel";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";

export const attachmentModelMeta = createModelMeta<
  AttachmentModel,
  FormFieldMetadata
>(
  {
    path: {
      label: "مسیر فایل",
      type: "text",
      placeholder: "مسیر ذخیره‌سازی فایل",
      sortable: true,
      required: true,
    },

    size: {
      label: "حجم فایل (بایت)",
      type: "number",
      sortable: true,
      required: true,
    },

    type: {
      label: "نوع فایل",
      type: "select",
      options: [
        { value: "IMAGE", label: "تصویر" },
        { value: "VIDEO", label: "ویدیو" },
        { value: "FILE", label: "فایل" },
      ],
      sortable: true,
      required: true,
    },

    mimeType: {
      label: "Mime Type",
      type: "text",
      placeholder: "مثلاً image/png",
      sortable: false,
      required: true,
    },

    extension: {
      label: "پسوند فایل",
      type: "text",
      placeholder: "مثلاً png",
      sortable: false,
      required: true,
    },

    hash: {
      label: "هش فایل",
      type: "text",
      placeholder: "هش یکتا",
      sortable: false,
      required: true,
    },

    scope: {
      label: "سطح دسترسی",
      type: "select",
      options: [
        { value: "PRIVATE", label: "خصوصی" },
        { value: "PUBLIC", label: "عمومی" },
      ],
      sortable: true,
      required: true,
    },

    createdAt: {
      label: "تاریخ ایجاد",
      type: "datetime-local",
      sortable: true,
    },

    updatedAt: {
      label: "تاریخ ویرایش",
      type: "datetime-local",
      sortable: true,
    },
  },
  GET_AUTOCOMPLETE_DISPLAY_FIELD(),
  GET_DISPLAY_NAME(),
  GET_PLURAL_DISPLAY_NAME(),
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof AttachmentModel {
  return "path";
}

function GET_DISPLAY_NAME(): string {
  return "پیوست";
}

function GET_PLURAL_DISPLAY_NAME(): string {
  return "پیوست‌ها";
}
