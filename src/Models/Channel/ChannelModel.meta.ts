import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { ChannelModel } from "./ChannelModel";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";

export const ChannelModelMeta = createModelMeta<ChannelModel, FormFieldMetadata>(
  {
    channelName: {
      label: "نام کانال",
      type: "text",
      placeholder: "نام کانال را وارد کنید",
      sortable: true,
      required: true,
    },
    channelIdentifier: {
      label: "شناسه کانال",
      type: "text",
      placeholder: "شناسه یکتا کانال",
      sortable: true,
      required: true,
    },
    status: {
      label: "وضعیت",
      type: "select",
      sortable: true,
      required: true,
      options: [
        { value: "ACTIVE", label: "فعال" },
        { value: "INACTIVE", label: "غیرفعال" },
      ],
    },
    platform: {
      label: "پلتفرم",
      type: "autocomplete",
      displayField: "platformName",
      sortable: false,
      required: true,
    },
    bots: {
      label: "ربات‌ها",
      type: "autocomplete",
      displayField: "token",
      sortable: false,
    },
  },
  GET_AUTOCOMPLETE_DISPLAY_FIELD(),
  GET_DISPLAY_NAME(),
  GET_PLURAL_DISPLAY_NAME()
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof ChannelModel {
  return "channelName";
}

function GET_DISPLAY_NAME(): string {
  return "کانال";
}

function GET_PLURAL_DISPLAY_NAME(): string {
  return "کانال‌ها";
}
