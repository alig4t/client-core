
import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { ComprehensiveModel } from "./ComprehensiveModel";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";



export const comprehensiveModelMeta = createModelMeta<ComprehensiveModel, FormFieldMetadata>(
  {
    stringField: {
      label: "رشته",
      type: "text",
      placeholder: "مقدار رشته‌ای را وارد کنید",
      sortable: true,
      required: true,
    },
    integerField: {
      label: "عدد صحیح",
      type: "number",
      placeholder: "مثلاً 42",
      sortable: true,
      required: true,
    },
    longField: {
      label: "عدد بلند",
      type: "number",
      placeholder: "مثلاً 9007199254740991",
      sortable: true,
      required: true,
    },
    doubleField: {
      label: "عدد اعشاری",
      type: "number",
      placeholder: "مثلاً 3.14",
      sortable: true,
      required: true,
    },
    bigDecimalField: {
      label: "عدد دقیق (BigDecimal)",
      type: "number", // or "text" if managed as string
      placeholder: "مثلاً 123.456789",
      sortable: true,
      required: true,
    },
    booleanField: {
      label: "بولین",
      type: "boolean",
      sortable: true,
      required: true,
    },
    dateField: {
      label: "تاریخ و زمان (UTC)",
      type: "datetime-local",
      sortable: true,
      required: true,
    },
    localDateField: {
      label: "تاریخ (بدون زمان)",
      type: "date",
      sortable: false,
      required: true,
    },
    localDateTimeField: {
      label: "تاریخ و زمان محلی",
      type: "datetime-local",
      sortable: false,
    },
    enumField: {
      label: "گزینه‌ها",
      type: "select",
      options: [
        { value: "OPTION_A", label: "گزینه A" },
        { value: "OPTION_B", label: "گزینه B" },
        // Add other options
      ],
      sortable: false,
      required: true,
    },
    uniqueField: {
      label: "فیلد یکتا",
      type: "text",
      placeholder: "مقدار یکتا",
      sortable: false,
    },
    indexedField: {
      label: "فیلد ایندکس‌شده",
      type: "text",
      placeholder: "مقدار ایندکس‌شده",
      sortable: false,
    },
    // Note: Relational fields (like oneToOneUser) are usually not displayed as object in direct forms.
    // Instead they are displayed with autocomplete or select. But if you want to put metadata for them:
    oneToOneUser: {
      label: "کاربر مرتبط",
      type: "autocomplete",
      displayField: "username", // Field displayed in autocomplete
      sortable: false, // Usually relations are not sortable in list (unless with join)
    },
    manyToOneChannel: {
      label: "کانال مرتبط",
      type: "autocomplete",
      displayField: "channelName",
      sortable: false,
    },
  },
  GET_AUTOCOMPLETE_DISPLAY_FIELD(),
  GET_DISPLAY_NAME(),
  GET_PLURAL_DISPLAY_NAME(),
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof ComprehensiveModel {
  return "stringField"
}

function GET_DISPLAY_NAME(): string {
  return "ترکیبی"
}

function GET_PLURAL_DISPLAY_NAME(): string {
  return "ترکیبی ها"
}


