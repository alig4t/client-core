import { useMemo, useRef, useState } from "react";
import { useFormContext, type UseFormReturn } from "react-hook-form";
import { z } from "zod/v3";
import { Button } from "../../../core/ui";
import FormInput, {
  type FormInputType,
} from "../../../core/components/form/FormInput";
import SearchInput from "../../../core/components/form/Input";
import Label from "../../../core/components/form/Label";
import ErrorFormText from "../../../core/components/form/ErrorFormText";
import { Checkbox } from "../../../core/components/form/Checkbox";
import { Select } from "../../../core/components/form/Select";
import { FormSelect } from "../../../core/components/form/FormSelect";
import { FormAutoComplete } from "../../../core/components/form/FormAutoComplete";
import CustomDatePicker from "../../../core/components/form/CustomDatePicker";
import { DateInput } from "../../../core/components/form/DateInput";
import { FormUploader } from "../../../core/components/form/FormUpload";
import { FormUploader as Base64Uploader } from "../../../core/components/form/FormUpload_Base64";
import FilePreview from "../../../core/components/form/FilePreview";
import { FormWrapper } from "../../../core/components/form/FormWrapper";
import { CoreProvider } from "../../../core/entity/CoreProvider";
import type { ServerSideParams } from "../../../core/service/BaseService";
import type { EntityId } from "../../../core/service/contracts";
import { DateObject, type Value } from "react-multi-date-picker";
import { Example, FormValues, Message, type DemoProps } from "./shared";
import { delay } from "./fixtures";

function ValidationControls({
  name,
  language,
}: {
  name: string;
  language: DemoProps["language"];
}) {
  const { setError, clearErrors } = useFormContext();
  return (
    <div className="catalog-row">
      <Button
        tone="danger"
        appearance="outline"
        onClick={() =>
          setError(name, {
            message:
              language === "fa"
                ? "پیام خطای نمونه"
                : "Example validation error",
          })
        }
      >
        {language === "fa" ? "نمایش خطای فیلد" : "Show field error"}
      </Button>
      <Button tone="neutral" onClick={() => clearErrors()}>
        {language === "fa" ? "پاک کردن خطاها" : "Clear errors"}
      </Button>
    </div>
  );
}
function AutocompleteExamples({ language }: Pick<DemoProps, "language">) {
  const fa = language === "fa";
  const [state, setState] = useState("ready");
  const service = useMemo(() => {
    const records = [
      { id: 1, name: fa ? "مهندسی" : "Engineering" },
      { id: 2, name: fa ? "طراحی" : "Design" },
      { id: 3, name: fa ? "پشتیبانی" : "Support" },
    ];
    return {
      async getAll(params: ServerSideParams = {}) {
        await delay(state === "slow" ? 1800 : 180, params.signal);
        if (state === "error")
          throw new Error(
            fa ? "خطای نمونهٔ دریافت گزینه‌ها" : "Example lookup error",
          );
        const search = String(params.filters?.name_like ?? "").toLowerCase();
        return {
          data:
            state === "empty"
              ? []
              : records.filter((record) =>
                  record.name.toLowerCase().includes(search),
                ),
          meta: { totalPages: state === "empty" ? 0 : 1 },
        };
      },
      async getById(id: EntityId) {
        return records.find((record) => record.id === Number(id))!;
      },
    };
  }, [fa, state]);
  return (
    <>
      <label className="catalog-row">
        {fa ? "وضعیت سرویس محلی" : "Local lookup state"}
        <select
          aria-label={fa ? "وضعیت گزینه‌ها" : "Lookup state"}
          value={state}
          onChange={(event) => setState(event.target.value)}
        >
          {["ready", "empty", "slow", "error"].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <Example props={'valueMode="id" · debounceTime=150 · extraFilters'}>
        <FormAutoComplete<{ id: number; name: string }>
          name="catalog-ac-id"
          label={fa ? "انتخاب شناسه" : "Select ID"}
          service={service}
          labelKey="name"
          valueKey="id"
          valueMode="id"
          debounceTime={150}
          extraFilters={{ state }}
          placeholder={fa ? "جستجو و انتخاب" : "Search and select"}
        />
      </Example>
      <Example props={'multi · valueMode="object" · disabled'}>
        <div className="catalog-grid">
          <FormAutoComplete<{ id: number; name: string }>
            name="catalog-ac-multi"
            label={fa ? "انتخاب چندتایی" : "Multiple selection"}
            service={service}
            labelKey="name"
            valueKey="id"
            multi
            extraFilters={{ state }}
          />
          <FormAutoComplete<{ id: number; name: string }>
            name="catalog-ac-disabled"
            label={fa ? "انتخاب غیرفعال" : "Disabled lookup"}
            service={service}
            labelKey="name"
            valueKey="id"
            disabled
          />
        </div>
      </Example>
      <ValidationControls name="catalog-ac-id" language={language} />
    </>
  );
}
function DatePickerExamples({ language }: Pick<DemoProps, "language">) {
  const fa = language === "fa";
  const [value, setValue] = useState<Value>(new DateObject("2026-11-19"));
  return (
    <div className="catalog-grid">
      {(["persian", "gregorian"] as const).map((calendar) => (
        <CoreProvider key={calendar} value={{ calendar }}>
          <Example
            props={`calendar="${calendar}" · value · onChange · withTime`}
          >
            <CustomDatePicker
              name={`catalog-picker-${calendar}`}
              value={value}
              onChange={setValue}
              placeholder={fa ? "انتخاب تاریخ و ساعت" : "Select date and time"}
              withTime
            />
          </Example>
        </CoreProvider>
      ))}
      <Example props="disabled">
        <CustomDatePicker
          name="catalog-picker-disabled"
          value={value}
          onChange={setValue}
          placeholder={fa ? "غیرفعال" : "Disabled"}
          disabled
        />
      </Example>
      <Example props="value=null · withTime=false">
        <CustomDatePicker
          name="catalog-picker-empty"
          value={null}
          onChange={setValue}
          placeholder={fa ? "تاریخ خالی" : "Empty date"}
        />
      </Example>
    </div>
  );
}
function FormLifecycle({ language }: Pick<DemoProps, "language">) {
  const fa = language === "fa";
  const [record, setRecord] = useState(1);
  const [saved, setSaved] = useState("");
  const methods = useRef<UseFormReturn<{ title: string }> | null>(null);
  return (
    <>
      <div className="catalog-row">
        <Button onClick={() => setRecord((value) => value + 1)}>
          {fa ? "تغییر رکورد و reset فرم" : "Change record and reset form"}
        </Button>
        <span>{record}</span>
      </div>
      <FormWrapper
        recordKey={record}
        defaultValues={{ title: `${fa ? "رکورد" : "Record"} ${record}` }}
        schema={z.object({
          title: z
            .string()
            .min(
              2,
              fa ? "حداقل دو حرف وارد کنید" : "Enter at least two characters",
            ),
        })}
        onFormReady={(value) => {
          methods.current = value;
        }}
        onSubmit={async (values) => {
          await delay(600);
          setSaved(values.title);
        }}
      >
        <FormInput name="title" label={fa ? "عنوان رکورد" : "Record title"} />
        <div className="catalog-row">
          <Button type="submit">
            {fa ? "ذخیره با تأخیر" : "Save with delay"}
          </Button>
          <Button
            tone="danger"
            appearance="outline"
            onClick={() =>
              methods.current?.setError("title", {
                message: fa
                  ? "این عنوان تکراری است"
                  : "This title already exists",
              })
            }
          >
            {fa ? "خطای سرور" : "Server error"}
          </Button>
        </div>
        <FormValues language={language} />
      </FormWrapper>
      <Message>{saved}</Message>
    </>
  );
}

export function FormsDemo({ id, language }: DemoProps) {
  const fa = language === "fa";
  const [selected, setSelected] = useState<string | number>(0);
  const [message, setMessage] = useState("");
  const [dateValues, setDateValues] = useState({
    date: "2026-11-19",
    datetime: "2026-11-19T12:30:00",
    instant: "2026-11-19T09:00:00Z",
  });
  const options = [
    { value: 0, label: fa ? "گزینهٔ صفر" : "Option zero" },
    { value: 1, label: fa ? "گزینهٔ یک" : "Option one" },
    { value: 2, label: fa ? "گزینهٔ دو" : "Option two" },
  ];
  if (id === "form-wrapper")
    return (
      <Example props="schema · defaultValues · recordKey · onFormReady · async onSubmit · className">
        <FormLifecycle language={language} />
      </Example>
    );
  if (id === "label")
    return (
      <Example props="children">
        <Label>{fa ? "برچسب مستقل قدیمی" : "Legacy standalone label"}</Label>
      </Example>
    );
  if (id === "error-text")
    return (
      <Example props="msg">
        <ErrorFormText
          msg={
            fa ? "پیام خطای قابل نمایش زیر فیلد" : "A field validation message"
          }
        />
      </Example>
    );
  if (id === "search-input")
    return (
      <Example props="placeholder · value/defaultValue · disabled · onChange · className">
        <div className="catalog-grid">
          <SearchInput
            placeholder={fa ? "جستجوی نمونه" : "Search sample"}
            onChange={(event) => setMessage(event.target.value)}
          />
          <SearchInput
            disabled
            placeholder={fa ? "جستجوی غیرفعال" : "Disabled search"}
          />
          <SearchInput
            className="rounded-full"
            defaultValue="core"
            placeholder="Search"
          />
        </div>
        <Message>{message}</Message>
      </Example>
    );
  if (id === "form-input")
    return (
      <>
        <Example
          props={
            'standalone · type="text | email | password | number | long | float | double | bigDecimal | date | datetime-local"'
          }
        >
          <div className="catalog-grid">
            {(
              [
                "text",
                "email",
                "password",
                "number",
                "long",
                "float",
                "double",
                "bigDecimal",
                "date",
                "datetime-local",
              ] as FormInputType[]
            ).map((type) => (
              <FormInput
                key={type}
                standalone
                name={`catalog-input-${type}`}
                label={type}
                type={type}
                defaultValue={
                  type === "long"
                    ? "9007199254740993"
                    : type === "bigDecimal"
                      ? "12345.67890123456789"
                      : undefined
                }
              />
            ))}
          </div>
        </Example>
        <Example props="multiline · rows=3 | 6 · maxLength · description">
          <div className="catalog-grid">
            <FormInput
              standalone
              name="catalog-multiline-3"
              label={fa ? "متن چندخطی" : "Multiline text"}
              multiline
              rows={3}
              maxLength={120}
              description={fa ? "حداکثر ۱۲۰ کاراکتر" : "Up to 120 characters"}
            />
            <FormInput
              standalone
              name="catalog-multiline-6"
              label={fa ? "شش سطر" : "Six rows"}
              multiline
              rows={6}
            />
          </div>
        </Example>
        <Example props="disabled · readOnly · onValueChange · classNames.input">
          <div className="catalog-grid">
            <FormInput
              standalone
              name="catalog-disabled-text"
              label={fa ? "غیرفعال" : "Disabled"}
              disabled
              defaultValue="core"
            />
            <FormInput
              standalone
              name="catalog-readonly-text"
              label={fa ? "فقط خواندنی" : "Read only"}
              readOnly
              defaultValue="core"
            />
            <FormInput
              standalone
              name="catalog-custom-text"
              label={fa ? "تغییر مقدار" : "Value change"}
              onValueChange={setMessage}
              classNames={{ input: "rounded-full border-2" }}
            />
          </div>
          <Message>{message}</Message>
        </Example>
      </>
    );
  if (id === "select")
    return (
      <>
        <Example props="options · value=0 · onChange · minilabel">
          <Select
            options={options}
            value={selected}
            onChange={setSelected}
            minilabel={fa ? "انتخاب عدد" : "Select number"}
          />
          <Message>{String(selected)}</Message>
        </Example>
        <Example props="label · placeholder · className">
          <Select
            options={options}
            onChange={setSelected}
            placeholder={fa ? "یک گزینه انتخاب کنید" : "Choose an option"}
            label={fa ? "بدون مقدار اولیه" : "No initial value"}
            className="max-w-sm"
          />
        </Example>
      </>
    );
  if (id === "custom-date") return <DatePickerExamples language={language} />;
  if (id === "date-input")
    return (
      <>
        <Example
          props={
            'standalone · kind="date | datetime | instant" · onValueChange'
          }
        >
          <div className="catalog-grid">
            {(["date", "datetime", "instant"] as const).map((kind) => (
              <DateInput
                key={kind}
                standalone
                kind={kind}
                name={`catalog-date-${kind}`}
                label={kind}
                onValueChange={(value) => {
                  setDateValues((previous) => ({ ...previous, [kind]: value }));
                  setMessage(value);
                }}
                value={dateValues[kind]}
              />
            ))}
          </div>
          <Message>{message}</Message>
        </Example>
        <Example props="disabled · className · placeholder">
          <DateInput
            standalone
            name="catalog-disabled-date"
            label={fa ? "تاریخ غیرفعال" : "Disabled date"}
            disabled
            placeholder={fa ? "غیرفعال" : "Disabled"}
            className="max-w-sm"
          />
        </Example>
      </>
    );
  if (id === "file-preview")
    return (
      <>
        <Example props={'fileId="image" · previewSize="sm | md | lg"'}>
          <div className="catalog-row">
            {(["sm", "md", "lg"] as const).map((previewSize) => (
              <FilePreview
                key={previewSize}
                fileId="image"
                previewSize={previewSize}
              />
            ))}
          </div>
        </Example>
        <Example props="fileId=document | error | pending | null · className">
          <div className="catalog-row">
            <FilePreview fileId="document" />
            <FilePreview fileId="error" />
            <FilePreview fileId="pending" />
            <FilePreview fileId={null} />
          </div>
        </Example>
      </>
    );
  return (
    <FormWrapper
      defaultValues={{
        "catalog-check-rhf": true,
        "catalog-select": 0,
        "catalog-multi-select": [0, 2],
        "catalog-disabled-select": 1,
        "catalog-ac-id": null,
        "catalog-ac-multi": [],
        "catalog-upload-one": null,
        "catalog-upload-many": [],
        "catalog-base64": null,
      }}
      onSubmit={(values) => setMessage(JSON.stringify(values))}
    >
      {id === "checkbox" && (
        <>
          <Example props="standalone · defaultChecked · checked · onChange">
            <div className="catalog-grid">
              <Checkbox
                standalone
                name="catalog-check-default"
                label={fa ? "انتخاب‌نشده" : "Unchecked"}
              />
              <Checkbox
                standalone
                name="catalog-check-true"
                label={fa ? "انتخاب‌شده" : "Checked"}
                defaultChecked
              />
              <Checkbox
                standalone
                name="catalog-check-disabled"
                label={fa ? "غیرفعال" : "Disabled"}
                disabled
                defaultChecked
              />
              <Checkbox
                standalone
                name="catalog-check-hidden"
                hideLabel
                aria-label={fa ? "بدون برچسب دیداری" : "No visible label"}
              />
            </div>
          </Example>
          <Example props="RHF · name · label">
            <Checkbox
              name="catalog-check-rhf"
              label={fa ? "متصل به فرم" : "Connected to form"}
            />
          </Example>
          <ValidationControls name="catalog-check-rhf" language={language} />
        </>
      )}
      {id === "form-select" && (
        <>
          <Example props="options · name · label · placeholder">
            <FormSelect
              name="catalog-select"
              label={fa ? "انتخاب تک‌گزینه‌ای" : "Single selection"}
              options={options}
            />
          </Example>
          <Example props="multi · disabled · minilabel · className">
            <div className="catalog-grid">
              <FormSelect
                name="catalog-multi-select"
                label={fa ? "انتخاب چندگزینه‌ای" : "Multiple selection"}
                options={options}
                multi
              />
              <FormSelect
                name="catalog-disabled-select"
                minilabel={fa ? "غیرفعال" : "Disabled"}
                options={options}
                disabled
                className="opacity-60"
              />
            </div>
          </Example>
          <ValidationControls name="catalog-select" language={language} />
        </>
      )}
      {id === "autocomplete" && <AutocompleteExamples language={language} />}
      {id === "upload" && (
        <>
          <Example
            props={'multiple=false · valueMode="id" · accept · maxFileSize'}
          >
            <FormUploader
              name="catalog-upload-one"
              label={
                fa ? "فایل تکی؛ حداکثر یک مگابایت" : "Single file; up to 1 MB"
              }
              accept={["image/*", "text/plain", "application/pdf"]}
              maxFileSize={1024 * 1024}
            />
          </Example>
          <Example props={'multiple · valueMode="object"'}>
            <FormUploader
              name="catalog-upload-many"
              label={
                fa ? "چند فایل با اطلاعات کامل" : "Multiple files with metadata"
              }
              multiple
              valueMode="object"
              accept={["image/*", "text/plain"]}
            />
          </Example>
          <Example props="disabled">
            <FormUploader
              name="catalog-upload-disabled"
              label={fa ? "آپلود غیرفعال" : "Disabled upload"}
              disabled
            />
          </Example>
        </>
      )}
      {id === "upload-base64" && (
        <Example props="name · label · className · image / empty / drag and drop">
          <Base64Uploader
            name="catalog-base64"
            label={fa ? "تصویر محلی به‌صورت Base64" : "Local image as Base64"}
            className="max-w-lg"
          />
        </Example>
      )}
      <FormValues language={language} />
      <Message>{message}</Message>
    </FormWrapper>
  );
}
