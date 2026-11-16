import { useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Checkbox } from "../components/form/Checkbox";
import { DateInput } from "../components/form/DateInput";
import { FormAutoComplete } from "../components/form/FormAutoComplete";
import FormInput from "../components/form/FormInput";
import { FormSelect } from "../components/form/FormSelect";
import { FormUploader } from "../components/form/FormUpload";
import { useCore } from "../entity/CoreProvider";
import { dataTypeOf, matchesCondition } from "../entity/fields";
import type { EntityRecord } from "../entity/types";
import { BaseService } from "../service/BaseService";
import type { FormFieldMetadata } from "./FieldFormTypes";
function scopedValues(
  values: Record<string, unknown>,
  name: string,
): Record<string, unknown> {
  return (
    name
      .split(".")
      .slice(0, -1)
      .reduce<Record<string, unknown>>(
        (current, part) => current?.[part] as Record<string, unknown>,
        values,
      ) ?? {}
  );
}

export function DynamicFields({
  fields,
  prefix = "",
}: {
  fields: Record<string, FormFieldMetadata>;
  prefix?: string;
}) {
  const tabs = [
    ...new Set(
      Object.values(fields).flatMap((field) => (field.tab ? [field.tab] : [])),
    ),
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const sorted = Object.entries(fields).sort(
    (a, b) => (a[1].order ?? 0) - (b[1].order ?? 0),
  );
  const visible = sorted.filter(
    ([, field]) => !field.tab || field.tab === activeTab,
  );
  const groups = [
    ...new Set(visible.map(([, field]) => field.section ?? field.group ?? "")),
  ];
  return (
    <div className="space-y-4">
      {tabs.length > 0 && (
        <div role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className="p-2"
            >
              {tab}
            </button>
          ))}
        </div>
      )}
      {groups.map((group) => (
        <fieldset key={group} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {group && <legend>{group}</legend>}
          {visible
            .filter(
              ([, field]) => (field.section ?? field.group ?? "") === group,
            )
            .map(([name, meta]) => (
              <DynamicField key={name} name={prefix + name} meta={meta} />
            ))}
        </fieldset>
      ))}
    </div>
  );
}
function NestedArray({
  name,
  meta,
  disabled,
}: {
  name: string;
  meta: FormFieldMetadata;
  disabled: boolean;
}) {
  const { control } = useFormContext();
  const array = useFieldArray({ control, name });
  return (
    <fieldset disabled={disabled} className="md:col-span-2 border p-3">
      <legend>{meta.label}</legend>
      {array.fields.map((item, index) => (
        <div key={item.id}>
          <DynamicFields
            fields={meta.fields ?? {}}
            prefix={name + "." + index + "."}
          />
          <button type="button" onClick={() => array.remove(index)}>
            حذف ردیف
          </button>
        </div>
      ))}
      <button type="button" onClick={() => array.append({})}>
        افزودن ردیف
      </button>
    </fieldset>
  );
}
function RelationField({
  name,
  meta,
  disabled,
}: {
  name: string;
  meta: FormFieldMetadata;
  disabled: boolean;
}) {
  const { lookups } = useCore();
  const values = useWatch() as Record<string, unknown>;
  const relation = meta.relation;
  const service = useMemo(
    () =>
      lookups?.[relation?.entity ?? ""] ??
      new BaseService<EntityRecord>(
        relation?.endpoint ??
          "/" +
            (
              relation?.entity ??
              meta.autocompleteConfig?.model ??
              ""
            ).toLowerCase(),
      ),
    [lookups, relation, meta.autocompleteConfig?.model],
  );
  const scope = scopedValues(values, name);
  const filters = Object.fromEntries(
    Object.entries(relation?.lookupFilters ?? {}).map(([filter, source]) => [
      filter,
      source
        .split(".")
        .reduce<unknown>(
          (current, part) =>
            current && typeof current === "object"
              ? (current as Record<string, unknown>)[part]
              : undefined,
          scope,
        ),
    ]),
  );
  return (
    <FormAutoComplete<EntityRecord>
      name={name}
      label={meta.label}
      service={service}
      valueKey="id"
      labelKey={relation?.displayField ?? meta.displayField ?? "id"}
      multi={relation?.multiple ?? meta.multiple}
      valueMode={relation?.valueMode ?? "object"}
      extraFilters={filters}
      disabled={disabled}
    />
  );
}
export function DynamicField({
  name,
  meta,
}: {
  name: string;
  meta: FormFieldMetadata;
}) {
  const { widgets, can } = useCore();
  const { register } = useFormContext();
  const rootValues = useWatch() as Record<string, unknown>;
  const values = scopedValues(rootValues, name);
  const disabled = Boolean(
    meta.disabled ||
    meta.readOnly ||
    !can(meta.writePermission) ||
    (meta.disabledWhen && matchesCondition(meta.disabledWhen, values)),
  );
  const kind = dataTypeOf(meta);
  if (
    meta.hidden ||
    !can(meta.readPermission) ||
    !matchesCondition(meta.visibleWhen, values)
  )
    return null;
  const Custom = widgets?.[meta.widget ?? meta.type];
  if (Custom) return <Custom name={name} meta={meta} disabled={disabled} />;
  if (kind === "object")
    return (
      <fieldset disabled={disabled} className="md:col-span-2 border p-3">
        <legend>{meta.label}</legend>
        <DynamicFields fields={meta.fields ?? {}} prefix={name + "."} />
      </fieldset>
    );
  if (kind === "array")
    return <NestedArray name={name} meta={meta} disabled={disabled} />;
  if (kind === "reference")
    return <RelationField name={name} meta={meta} disabled={disabled} />;
  if (kind === "file")
    return (
      <FormUploader
        name={name}
        label={meta.label}
        multiple={meta.multiple}
        valueMode={meta.valueMode}
        maxFileSize={meta.maxFileSize}
        accept={meta.accept}
        disabled={disabled}
      />
    );
  if (kind === "boolean")
    return <Checkbox name={name} label={meta.label} disabled={disabled} />;
  if (kind === "enum")
    return (
      <FormSelect
        name={name}
        label={meta.label}
        options={meta.options ?? []}
        multi={meta.multiple}
        disabled={disabled}
      />
    );
  if (kind === "date" || kind === "datetime" || kind === "instant")
    return (
      <DateInput
        name={name}
        label={meta.label}
        kind={kind}
        disabled={disabled}
      />
    );
  if (meta.type === "hidden")
    return <input type="hidden" {...register(name)} />;
  const inputType =
    kind === "integer"
      ? "number"
      : kind === "long"
        ? "long"
        : kind === "double"
          ? "double"
          : kind === "decimal"
            ? "bigDecimal"
            : meta.type === "email" || meta.type === "password"
              ? meta.type
              : "text";
  return (
    <FormInput
      name={name}
      label={meta.label}
      placeholder={meta.placeholder}
      type={inputType}
      multiline={meta.type === "textarea"}
      rows={meta.rows}
      maxLength={meta.maxLength}
      disabled={disabled}
    />
  );
}
