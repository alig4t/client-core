import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button, Field, Input } from "../../../core/ui";
import {
  CoreProvider,
  type WidgetProps,
} from "../../../core/entity/CoreProvider";
import { DynamicField, DynamicFields } from "../../../core/forms/DynamicField";
import DynamicFilterForm from "../../../core/forms/DynamicFilterForm";
import type { FormFieldMetadata } from "../../../core/forms/FieldFormTypes";
import { FormWrapper } from "../../../core/components/form/FormWrapper";
import { Example, FormValues, Message, type DemoProps } from "./shared";

function CustomWidget({ name, meta, disabled }: WidgetProps) {
  const { register } = useFormContext();
  return (
    <Field label={meta.label}>
      {(control) => (
        <Input
          {...control}
          {...register(name)}
          disabled={disabled}
          className="rounded-full border-2"
        />
      )}
    </Field>
  );
}
export function DynamicDemo({ id, language }: DemoProps) {
  const fa = language === "fa";
  const [message, setMessage] = useState("");
  const fields = useMemo<Record<string, FormFieldMetadata>>(
    () => ({
      "catalog-dynamic-title": {
        type: "text",
        label: fa ? "عنوان" : "Title",
        required: true,
        section: fa ? "اطلاعات اصلی" : "Basic information",
      },
      "catalog-dynamic-enabled": {
        type: "checkbox",
        label: fa ? "نمایش جزئیات بیشتر" : "Show more details",
      },
      "catalog-dynamic-conditional": {
        type: "text",
        label: fa ? "فیلد شرطی" : "Conditional field",
        visibleWhen: { field: "catalog-dynamic-enabled", operator: "truthy" },
      },
      "catalog-dynamic-select": {
        type: "select",
        label: fa ? "وضعیت" : "Status",
        options: [
          { value: 0, label: fa ? "پیش‌نویس" : "Draft" },
          { value: 1, label: fa ? "منتشرشده" : "Published" },
        ],
      },
      "catalog-dynamic-long": {
        type: "long",
        dataType: "long",
        label: fa ? "عدد بزرگ دقیق" : "Precise long",
      },
      "catalog-dynamic-readonly": {
        type: "text",
        label: fa ? "فقط خواندنی" : "Read only",
        readOnly: true,
      },
      "catalog-dynamic-widget": {
        type: "text",
        widget: "catalog-custom",
        label: fa ? "widget سفارشی" : "Custom widget",
      },
      "catalog-dynamic-object": {
        type: "object",
        label: fa ? "شیء تو‌در‌تو" : "Nested object",
        fields: { city: { type: "text", label: fa ? "شهر" : "City" } },
        tab: fa ? "جزئیات" : "Details",
      },
      "catalog-dynamic-array": {
        type: "array",
        label: fa ? "ردیف‌های تکرارشونده" : "Repeated rows",
        fields: { text: { type: "text", label: fa ? "متن ردیف" : "Row text" } },
        tab: fa ? "جزئیات" : "Details",
      },
    }),
    [fa],
  );
  if (id === "dynamic-filter")
    return (
      <Example props="fields(text, date, select) · filterKey · options · onApplyFilters">
        <DynamicFilterForm
          fields={[
            {
              name: "title",
              type: "text",
              label: fa ? "عنوان" : "Title",
              filterKey: "title_like",
            },
            {
              name: "date",
              type: "date",
              label: fa ? "تاریخ" : "Date",
              filterKey: "date_ge",
            },
            {
              name: "status",
              type: "select",
              label: fa ? "وضعیت" : "Status",
              filterKey: "status_eq",
              options: [
                { value: "active", label: fa ? "فعال" : "Active" },
                { value: "draft", label: fa ? "پیش‌نویس" : "Draft" },
              ],
            },
          ]}
          onApplyFilters={(values) => setMessage(JSON.stringify(values))}
        />
        <Message>{message}</Message>
      </Example>
    );
  return (
    <CoreProvider value={{ widgets: { "catalog-custom": CustomWidget } }}>
      <FormWrapper
        defaultValues={{
          "catalog-dynamic-enabled": true,
          "catalog-dynamic-select": 0,
          "catalog-dynamic-long": "9007199254740993",
          "catalog-dynamic-readonly": "core",
          "catalog-dynamic-object": { city: fa ? "تهران" : "Tehran" },
          "catalog-dynamic-array": [{ text: fa ? "ردیف اول" : "First row" }],
        }}
        onSubmit={(values) => setMessage(JSON.stringify(values))}
      >
        <Example
          props={
            id === "dynamic-field"
              ? "name · meta(type, label, readOnly, visibleWhen, widget, options)"
              : "fields · section · tab · nested object/array · order"
          }
        >
          {id === "dynamic-field" ? (
            <div className="catalog-grid">
              {Object.entries(fields)
                .filter(([, meta]) => !meta.tab)
                .map(([name, meta]) => (
                  <DynamicField key={name} name={name} meta={meta} />
                ))}
            </div>
          ) : (
            <DynamicFields fields={fields} />
          )}
        </Example>
        <Button type="submit">
          {fa ? "ارسال فرم پویا" : "Submit dynamic form"}
        </Button>
        <FormValues language={language} />
        <Message>{message}</Message>
      </FormWrapper>
    </CoreProvider>
  );
}
