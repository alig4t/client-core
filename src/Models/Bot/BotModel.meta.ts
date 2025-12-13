import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { BotModel } from "./BotModel";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";

export const botModelMeta = createModelMeta<BotModel, FormFieldMetadata>(
  {
    token: {
      label: "توکن",
      placeholder: "توکن ربات را وارد کنید",
      sortable: true,
      required: true,
    },
    status: {
      label: "وضعیت",
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
  },
  GET_AUTOCOMPLETE_DISPLAY_FIELD(),
  GET_DISPLAY_NAME(),
  GET_PLURAL_DISPLAY_NAME()
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof BotModel {
  return "token";
}

function GET_DISPLAY_NAME(): string {
  return "ربات";
}

function GET_PLURAL_DISPLAY_NAME(): string {
  return "ربات‌ها";
}
