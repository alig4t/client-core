import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { KeywordMatchModel } from "./KeywordMatchModel";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";

export const KeywordMatchModelMeta = createModelMeta<
  KeywordMatchModel,
  FormFieldMetadata
>(
  {
    matchedAt: {
      label: "زمان تطابق",
      type: "datetime-local",
      sortable: true,
      required: true,
    },
    messagingPlatform: {
      label: "پیام",
      type: "autocomplete",
      displayField: "platformName",
      sortable: false,
      required: true,
    },
    keyword: {
      label: "کلمه کلیدی",
      type: "autocomplete",
      displayField: "keywordText",
      sortable: false,
      required: true,
    },
    coreUser: {
      label: "کاربر",
      type: "autocomplete",
      displayField: "username",
      sortable: false,
      required: true,
    },
  },
  GET_AUTOCOMPLETE_DISPLAY_FIELD(),
  GET_DISPLAY_NAME(),
  GET_PLURAL_DISPLAY_NAME()
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof KeywordMatchModel {
  return "matchedAt";
}

function GET_DISPLAY_NAME(): string {
  return "تطابق کلمه کلیدی";
}

function GET_PLURAL_DISPLAY_NAME(): string {
  return "تطابق‌های کلمه کلیدی";
}
