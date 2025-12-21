import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { DashboardDataModel } from "./DashboardDataModel";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";

export const dashboardDataModelMeta = createModelMeta<
  DashboardDataModel,
  FormFieldMetadata
>(
  {
    frequencyCount: {
      label: "تعداد تکرار",
      type: "number",
      placeholder: "تعداد",
      sortable: true,
      required: true,
    },
    lastMatchedAt: {
      label: "آخرین تطابق",
      type: "datetime-local",
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
    keyword: {
      label: "کلمه کلیدی",
      type: "autocomplete",
      displayField: "keywordText",
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

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof DashboardDataModel {
  return "frequencyCount";
}

function GET_DISPLAY_NAME(): string {
  return "داده داشبورد";
}

function GET_PLURAL_DISPLAY_NAME(): string {
  return "داده‌های داشبورد";
}
