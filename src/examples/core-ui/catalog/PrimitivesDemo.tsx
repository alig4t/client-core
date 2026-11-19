import { useState } from "react";
import { Check, Plus, Save } from "lucide-react";
import { Button, Field, Input } from "../../../core/ui";
import LegacyButton from "../../../core/components/general/button/Button";
import ButtonPanel from "../../../core/components/general/button/ButtonPanel";
import { CoreProvider } from "../../../core/entity/CoreProvider";
import { Example, Message, type DemoProps } from "./shared";

export function PrimitivesDemo({ id, language }: DemoProps) {
  const fa = language === "fa";
  const [message, setMessage] = useState("");
  const action = () => setMessage(fa ? "دکمه کلیک شد" : "Button clicked");
  if (id === "button")
    return (
      <>
        {(["solid", "outline", "ghost", "link"] as const).map((appearance) => (
          <Example
            key={appearance}
            props={`appearance="${appearance}" · tone="primary | neutral | success | danger"`}
          >
            <div className="catalog-row">
              {(["primary", "neutral", "success", "danger"] as const).map(
                (tone) => (
                  <Button
                    key={tone}
                    tone={tone}
                    appearance={appearance}
                    onClick={action}
                  >
                    {fa
                      ? {
                          primary: "اصلی",
                          neutral: "خنثی",
                          success: "موفق",
                          danger: "خطر",
                        }[tone]
                      : tone}
                  </Button>
                ),
              )}
            </div>
          </Example>
        ))}
        <Example props={'size="sm | md | lg"'}>
          <div className="catalog-row">
            {(["sm", "md", "lg"] as const).map((size) => (
              <Button key={size} size={size} onClick={action}>
                {fa ? { sm: "کوچک", md: "معمولی", lg: "بزرگ" }[size] : size}
              </Button>
            ))}
          </div>
        </Example>
        <Example props="disabled · loading · loadingLabel · startIcon · badge=0">
          <div className="catalog-row">
            <Button disabled>{fa ? "غیرفعال" : "Disabled"}</Button>
            <Button loading loadingLabel={fa ? "در حال ذخیره" : "Saving"} />
            <Button startIcon={<Plus size={16} />} badge={0} onClick={action}>
              {fa ? "افزودن" : "Add"}
            </Button>
          </div>
        </Example>
        <Example
          props={
            'className="rounded-full" · classNames={{ icon, label }} · style · aria-label · onClick'
          }
        >
          <Button
            startIcon={<Check />}
            className="rounded-full"
            classNames={{ icon: "text-amber-400", label: "font-bold" }}
            style={{ borderWidth: 2 }}
            onClick={action}
          >
            {fa ? "سفارشی‌سازی نمونه" : "Instance customization"}
          </Button>
        </Example>
        <Example props={'type="submit | reset | button" · form · name · value'}>
          <form
            className="catalog-row"
            onSubmit={(event) => {
              event.preventDefault();
              action();
            }}
          >
            <Input
              aria-label={fa ? "ورودی فرم دکمه" : "Button form input"}
              defaultValue={fa ? "مقدار اولیه" : "Initial value"}
              className="max-w-56"
            />
            <Button type="submit" startIcon={<Save size={16} />}>
              {fa ? "ارسال" : "Submit"}
            </Button>
            <Button type="reset" tone="neutral">
              {fa ? "بازنشانی" : "Reset"}
            </Button>
          </form>
        </Example>
        <Message>{message}</Message>
      </>
    );
  if (id === "legacy-button")
    return (
      <>
        <Example
          props={
            'variant="primary | secondary | cancel | success | danger" · icon · badgeCount'
          }
        >
          <div className="catalog-row">
            {(
              ["primary", "secondary", "cancel", "success", "danger"] as const
            ).map((variant) => (
              <LegacyButton
                key={variant}
                variant={variant}
                icon={Plus}
                badgeCount={2}
                onClick={action}
              >
                {variant}
              </LegacyButton>
            ))}
          </div>
        </Example>
        <Example props={'permission="allowed | denied" · loading'}>
          <CoreProvider
            value={{ can: (permission) => permission !== "catalog.denied" }}
          >
            <div className="catalog-row">
              <LegacyButton permission="catalog.allowed" onClick={action}>
                {fa ? "مجاز" : "Allowed"}
              </LegacyButton>
              <LegacyButton permission="catalog.denied">Hidden</LegacyButton>
              <LegacyButton loading />
            </div>
          </CoreProvider>
        </Example>
        <Message>{message}</Message>
      </>
    );
  if (id === "button-panel")
    return (
      <>
        {(["start", "center", "end"] as const).map((align) => (
          <Example key={align} props={`align="${align}" · className`}>
            <ButtonPanel align={align} className="border p-3">
              <Button onClick={action}>{fa ? "ذخیره" : "Save"}</Button>
              <Button tone="neutral" onClick={action}>
                {fa ? "انصراف" : "Cancel"}
              </Button>
            </ButtonPanel>
          </Example>
        ))}
        <Message>{message}</Message>
      </>
    );
  if (id === "input")
    return (
      <>
        <Example
          props={
            'type="text | email | password | number | date" · placeholder · defaultValue'
          }
        >
          <div className="catalog-grid">
            {["text", "email", "password", "number", "date"].map((type) => (
              <Field key={type} label={type}>
                {(control) => (
                  <Input
                    {...control}
                    type={type}
                    placeholder={fa ? "مقدار را بنویسید" : "Enter a value"}
                  />
                )}
              </Field>
            ))}
          </div>
        </Example>
        <Example props={'controlSize="sm | md | lg" · size=20'}>
          <div className="catalog-grid">
            {(["sm", "md", "lg"] as const).map((controlSize) => (
              <Input
                key={controlSize}
                controlSize={controlSize}
                size={20}
                aria-label={controlSize}
                placeholder={controlSize}
              />
            ))}
          </div>
        </Example>
        <Example props="disabled · readOnly · required · aria-invalid · classNames.root">
          <div className="catalog-grid">
            <Input
              disabled
              value={fa ? "غیرفعال" : "Disabled"}
              aria-label="disabled"
            />
            <Input
              readOnly
              value={fa ? "فقط خواندنی" : "Read only"}
              aria-label="readOnly"
            />
            <Input
              required
              aria-invalid
              aria-label="invalid"
              placeholder={fa ? "خطای ورودی" : "Invalid input"}
            />
            <Input
              classNames={{ root: "rounded-full border-2" }}
              placeholder={fa ? "ظاهر سفارشی" : "Custom appearance"}
              aria-label="custom input"
            />
          </div>
        </Example>
      </>
    );
  return (
    <>
      <Example props="label · description · required">
        <Field
          label={fa ? "عنوان" : "Title"}
          description={fa ? "توضیحات کمکی فیلد" : "Helpful field description"}
          required
        >
          {(control) => <Input {...control} />}
        </Field>
      </Example>
      <Example props="error · controlId · id · classNames">
        <Field
          id="catalog-field-wrapper"
          controlId="catalog-explicit-control"
          label={fa ? "فیلد دارای خطا" : "Invalid field"}
          description={
            fa
              ? "با label و خطا پیوند دارد"
              : "Linked label, description and error"
          }
          error={fa ? "وارد کردن مقدار الزامی است" : "A value is required"}
          classNames={{ label: "font-bold", root: "max-w-lg" }}
        >
          {(control) => <Input {...control} />}
        </Field>
      </Example>
    </>
  );
}
