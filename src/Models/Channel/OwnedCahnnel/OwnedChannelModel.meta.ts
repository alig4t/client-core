import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { OwnedChannelModel } from "./OwnedChannelModel";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";

export const OwnedChannelModelMeta = createModelMeta<OwnedChannelModel, FormFieldMetadata>(
  {
    platformKey: {
      label: "کلید پلتفرم",
      type: "text",
      placeholder: "کلید پلتفرم",
      sortable: true,
      required: true,
    },
    provisionalIdentifier: {
      label: "شناسه موقت",
      type: "text",
      placeholder: "شناسه موقت کانال",
      sortable: true,
      required: false,
    },
    displayName: {
      label: "نام نمایشی",
      type: "text",
      placeholder: "نام نمایشی کانال",
      sortable: true,
      required: true,
    },
    channelId: {
      label: "شناسه کانال",
      type: "number",
      sortable: true,
      required: false,
    },
    channelTitle: {
      label: "عنوان کانال",
      type: "text",
      placeholder: "عنوان کانال",
      sortable: true,
      required: false,
    },
    platformName: {
      label: "نام پلتفرم",
      type: "text",
      placeholder: "نام پلتفرم",
      sortable: true,
      required: false,
    },
    ownerId: {
      label: "شناسه مالک",
      type: "number",
      sortable: true,
      required: true,
    },
    ownerName: {
      label: "نام مالک",
      type: "text",
      placeholder: "نام مالک کانال",
      sortable: true,
      required: false,
    },
    status: {
      label: "وضعیت",
      type: "select",
      sortable: true,
      required: true,
      options: [
        { value: "DRAFT", label: "پیش‌نویس" },
        { value: "PENDING", label: "در انتظار تایید" },
        { value: "APPROVED", label: "تایید شده" },
        { value: "REJECTED", label: "رد شده" },
      ],
    },
  },
  GET_AUTOCOMPLETE_DISPLAY_FIELD(),
  GET_DISPLAY_NAME(),
  GET_PLURAL_DISPLAY_NAME()
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof OwnedChannelModel {
  return "displayName";
}

function GET_DISPLAY_NAME(): string {
  return "کانال مالکیتی";
}

function GET_PLURAL_DISPLAY_NAME(): string {
  return "کانال‌های مالکیتی";
}
