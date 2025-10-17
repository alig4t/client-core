
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
    },
    integerField: {
      label: "عدد صحیح",
      type: "number",
      placeholder: "مثلاً 42",
      sortable: true,
    },
    longField: {
      label: "عدد بلند",
      type: "number",
      placeholder: "مثلاً 9007199254740991",
      sortable: true,
    },
    doubleField: {
      label: "عدد اعشاری",
      type: "number",
      placeholder: "مثلاً 3.14",
      sortable: true,
    },
    bigDecimalField: {
      label: "عدد دقیق (BigDecimal)",
      type: "number", // یا "text" اگر به صورت رشته مدیریت می‌شود
      placeholder: "مثلاً 123.456789",
      sortable: true,
    },
    booleanField: {
      label: "بولین",
      type: "boolean",
      sortable: true,
    },
    dateField: {
      label: "تاریخ و زمان (UTC)",
      type: "datetime-local",
      sortable: true,
    },
    localDateField: {
      label: "تاریخ (بدون زمان)",
      type: "date",
      sortable: true,
    },
    localDateTimeField: {
      label: "تاریخ و زمان محلی",
      type: "datetime-local",
      sortable: true,
    },
    enumField: {
      label: "گزینه‌ها",
      type: "select",
      options: [
        { value: "OPTION_A", label: "گزینه A" },
        { value: "OPTION_B", label: "گزینه B" },
        // سایر گزینه‌ها را اضافه کن
      ],
      sortable: true,
    },
    uniqueField: {
      label: "فیلد یکتا",
      type: "text",
      placeholder: "مقدار یکتا",
      sortable: true,
    },
    indexedField: {
      label: "فیلد ایندکس‌شده",
      type: "text",
      placeholder: "مقدار ایندکس‌شده",
      sortable: true,
    },
    // نکته: فیلدهای رابطه‌ای (مثل oneToOneUser) معمولاً در فرم‌های مستقیم به صورت object نمایش داده نمی‌شوند.
    // بلکه با autocomplete یا select نمایش داده می‌شوند. اما اگر بخواهی metadata براشون بذاری:
    oneToOneUser: {
      label: "کاربر مرتبط",
      type: "autocomplete",
      displayField: "username", // فیلدی که در autocomplete نمایش داده می‌شود
      sortable: false, // معمولاً رابطه‌ها در لیست قابل sort نیستند (مگر با join)
    },
    manyToOneChannel: {
      label: "کانال مرتبط",
      type: "autocomplete",
      displayField: "channelName",
      sortable: false,
    },
  },
  "stringField" // فیلد نمایشی برای autocomplete و نمایش عمومی
);