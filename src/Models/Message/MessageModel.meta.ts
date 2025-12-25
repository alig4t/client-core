import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { MessageModel } from "./MessageModel";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";

export const MessageModelMeta = createModelMeta<MessageModel, FormFieldMetadata>(
  {
    platformMessageId: {
      label: "شناسه پیام پلتفرم",
      type: "text",
      placeholder: "شناسه یکتا پیام در پلتفرم",
      sortable: true,
      required: true,
    },
    text: {
      label: "متن پیام",
      type: "textarea",
      placeholder: "متن پیام را وارد کنید",
      sortable: false,
      required: false,
    },
    sentAt: {
      label: "زمان ارسال",
      type: "date",
      sortable: true,
      required: true,
    },
    senderId: {
      label: "شناسه فرستنده",
      type: "text",
      placeholder: "شناسه فرستنده",
      sortable: true,
      required: false,
    },
    senderUsername: {
      label: "نام کاربری فرستنده",
      type: "text",
      placeholder: "نام کاربری فرستنده",
      sortable: true,
      required: false,
    },
    channel: {
      label: "کانال",
      type: "autocomplete",
      displayField: "channelName",
      sortable: false,
      required: true,
    },
    keywords: {
      label: "کلمات کلیدی",
      type: "autocomplete",
      displayField: "keywordText",
      sortable: false,
    },
    attachments: {
      label: "پیوست‌ها",
      type: "autocomplete",
      displayField: "fileName",
      sortable: false,
    },
  },
  GET_AUTOCOMPLETE_DISPLAY_FIELD(),
  GET_DISPLAY_NAME(),
  GET_PLURAL_DISPLAY_NAME()
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof MessageModel {
  return "platformMessageId";
}

function GET_DISPLAY_NAME(): string {
  return "پیام";
}

function GET_PLURAL_DISPLAY_NAME(): string {
  return "پیام‌ها";
}
