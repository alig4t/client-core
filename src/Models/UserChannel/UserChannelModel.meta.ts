import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { UserChannelModel } from "./UserChannelModel";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";

export const userChannelModelMeta = createModelMeta<UserChannelModel, FormFieldMetadata>(
  {
    role: {
      label: "نقش",
      sortable: true,
      required: true,
      options: [
        { value: "OWNER", label: "مالک" },
        { value: "MEMBER", label: "عضو" },
      ],
    },
    coreUser: {
      label: "کاربر",
      type: "autocomplete",
      displayField: "username",
      sortable: false,
      required: true,
    },
    channel: {
      label: "کانال",
      type: "autocomplete",
      displayField: "channelName",
      sortable: false,
      required: true,
    },
  },
  GET_AUTOCOMPLETE_DISPLAY_FIELD(),
  GET_DISPLAY_NAME(),
  GET_PLURAL_DISPLAY_NAME()
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof UserChannelModel {
  return "role";
}

function GET_DISPLAY_NAME(): string {
  return "کاربر-کانال";
}

function GET_PLURAL_DISPLAY_NAME(): string {
  return "کاربران-کانال";
}
