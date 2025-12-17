import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { ChannelModel } from "./ChannelModel";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";

export const channelModelMeta = createModelMeta<ChannelModel, FormFieldMetadata>({
  channelName: {
    label: "نام کانال",
    type: "text",
    placeholder: "مثلاً کانال اطلاع‌رسانی",
    sortable: true,
    required: true,
  },
  channelIdentifier: {
    label: "شناسه کانال",
    type: "text",
    placeholder: "مثلاً @channelId",
    sortable: true,
    required: true,
  },
  status: {
    label: "وضعیت",
    type: "select",
    options: [
      { value: "ACTIVE", label: "فعال" },
      { value: "INACTIVE", label: "غیرفعال" },
    ],
    sortable: true,
    required: true,
  },
  platform: {
    label: "پلتفرم",
    type: "autocomplete",
    displayField: "platformName",
    sortable: false,
  },
}, GET_AUTOCOMPLETE_DISPLAY_FIELD(), GET_DISPLAY_NAME(), GET_PLURAL_DISPLAY_NAME());

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof ChannelModel {
  return "channelName";
}

function GET_DISPLAY_NAME(): string {
  return "کانال";
}

function GET_PLURAL_DISPLAY_NAME(): string {
  return "کانال‌ها";
}