import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { KeywordModel } from "./KeywordModel";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";

export const keywordModelMeta = createModelMeta<KeywordModel, FormFieldMetadata>(
  {
    keywordText: {
      label: "متن کلمه کلیدی",
      placeholder: "کلمه کلیدی را وارد کنید",
      sortable: true,
      required: true,
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
    messages: {
      label: "پیام‌ها",
      type: "multiAutoComplete",
      displayField: "content",
      sortable: false,
    },
  },
  GET_AUTOCOMPLETE_DISPLAY_FIELD(),
  GET_DISPLAY_NAME(),
  GET_PLURAL_DISPLAY_NAME()
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof KeywordModel {
  return "keywordText";
}

function GET_DISPLAY_NAME(): string {
  return "کلمه کلیدی";
}

function GET_PLURAL_DISPLAY_NAME(): string {
  return "کلمات کلیدی";
}
