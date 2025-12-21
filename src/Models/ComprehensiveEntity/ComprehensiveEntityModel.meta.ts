import { createModelMeta } from "@/core/models/modelMetaUtils";
import type { ComprehensiveEntityModel } from "./ComprehensiveEntityModel";
import type { FormFieldMetadata } from "@/core/forms/FieldFormTypes";

export const comprehensiveEntityModelMeta = createModelMeta<
  ComprehensiveEntityModel,
  FormFieldMetadata
>(
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
      required: false,
    },
    longField: {
      label: "عدد بلند",
      type: "number",
      placeholder: "مثلاً 9007199254740991",
      sortable: true,
      required: false,
    },
    doubleField: {
      label: "عدد اعشاری",
      type: "number",
      placeholder: "مثلاً 3.14",
      sortable: true,
      required: false,
    },
    bigDecimalField: {
      label: "عدد دقیق (BigDecimal)",
      type: "text",
      placeholder: "مثلاً 123.456789",
      sortable: true,
      required: false,
    },
    booleanField: {
      label: "بولین",
      type: "boolean",
      sortable: true,
      required: false,
    },
    dateField: {
      label: "تاریخ و زمان (UTC)",
      type: "date",
      sortable: true,
      required: false,
    },
    localDateField: {
      label: "تاریخ (بدون زمان)",
      type: "date",
      sortable: false,
      required: false,
    },
    localDateTimeField: {
      label: "تاریخ و زمان محلی",
      type: "datetime-local",
      sortable: false,
      required: false,
    },
    enumField: {
      label: "گزینه‌ها",
      type: "select",
      sortable: false,
      required: false,
      options: [
        { value: "OPTION_A", label: "گزینه A" },
        { value: "OPTION_B", label: "گزینه B" },
      ],
    },
    uniqueField: {
      label: "فیلد یکتا",
      type: "text",
      placeholder: "مقدار یکتا",
      sortable: false,
      required: true,
    },
    indexedField: {
      label: "فیلد ایندکس‌شده",
      type: "text",
      placeholder: "مقدار ایندکس‌شده",
      sortable: false,
      required: false,
    },
    oneToOneUser: {
      label: "کاربر مرتبط",
      type: "autocomplete",
      displayField: "username",
      sortable: false,
      required: true,
    },
    manyToOneChannel: {
      label: "کانال مرتبط",
      type: "autocomplete",
      displayField: "channelName",
      sortable: false,
      required: true,
    },
    oneToManyKeywords: {
      label: "کلمات کلیدی",
      type: "autocomplete",
      displayField: "keyword",
      sortable: false,
    },
    manyToManyMessages: {
      label: "پیام‌ها",
      type: "autocomplete",
      displayField: "content",
      sortable: false,
    },
    attachments: {
      label: "پیوست‌ها",
      type: "File",
      displayField: "",
      sortable: false,
    },
  },
  GET_AUTOCOMPLETE_DISPLAY_FIELD(),
  GET_DISPLAY_NAME(),
  GET_PLURAL_DISPLAY_NAME()
);

function GET_AUTOCOMPLETE_DISPLAY_FIELD(): keyof ComprehensiveEntityModel {
  return "stringField";
}

function GET_DISPLAY_NAME(): string {
  return "ترکیبی";
}

function GET_PLURAL_DISPLAY_NAME(): string {
  return "ترکیبی‌ها";
}
