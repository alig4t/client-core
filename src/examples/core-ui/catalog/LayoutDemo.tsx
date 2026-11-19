import { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { Check } from "lucide-react";
import {
  Button,
  ButtonBase,
  CoreUIProvider,
  Dialog,
  Input,
  ThemeScope,
  type ButtonProps,
} from "../../../core/ui";
import { CoreProvider, useCore } from "../../../core/entity/CoreProvider";
import LegacyButton from "../../../core/components/general/button/Button";
import { PageWrapper } from "../../../core/components/general/container/PageWrapper";
import PageHeader from "../../../core/components/general/container/PageHeader";
import { RowContainer } from "../../../core/components/general/container/RowContainer";
import { RecordDisplayLayout } from "../../../core/components/general/container/RecordDisplayLayout";
import { DisplayField } from "../../../core/components/general/container/DisplayField";
import CreatePageFormWrapper from "../../../core/components/general/container/CreateFormWrapper";
import Layout from "../../../core/components/layout/Layout";
import PageTransition from "../../../core/components/general/animation/PageTransition";
import { Example, Message, PreviewFrame, type DemoProps } from "./shared";

function RegisteredButton(props: ButtonProps) {
  return (
    <ButtonBase
      {...props}
      startIcon={<Check size={16} />}
      className="rounded-full"
    />
  );
}
function RuntimeStatus() {
  const { locale, direction, calendar } = useCore();
  return (
    <code dir="ltr">
      {locale} / {direction} / {calendar}
    </code>
  );
}
function ScopeDialog({ language }: Pick<DemoProps, "language">) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {language === "fa" ? "مودال داخل تم" : "Dialog in this theme"}
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={language === "fa" ? "تم موضعی" : "Scoped theme"}
      >
        <p>
          {language === "fa"
            ? "پورتال همین تم را حفظ می‌کند."
            : "The portal retains this theme."}
        </p>
      </Dialog>
    </>
  );
}
export function LayoutDemo({ id, language, direction }: DemoProps) {
  const fa = language === "fa";
  const [count, setCount] = useState(0);
  const [allowed, setAllowed] = useState(true);
  const action = () => setCount((value) => value + 1);
  const sample = (
    <div className="border rounded-lg p-4 bg-[var(--core-surface-hover)]">
      {fa ? "محتوای نمونه" : "Sample content"}
    </div>
  );
  const fields = (
    <>
      <DisplayField
        label={fa ? "نام" : "Name"}
        value={fa ? "کاربر نمونه" : "Sample user"}
      />
      <DisplayField
        label={fa ? "وضعیت" : "Status"}
        value={fa ? "فعال" : "Active"}
      />
      <DisplayField label={fa ? "تعداد" : "Count"} value={0} />
    </>
  );
  if (id === "ui-provider")
    return (
      <>
        <Example props="components.Button.defaultProps · classNames · nested providers">
          <CoreUIProvider
            value={{
              components: {
                Button: {
                  defaultProps: { size: "sm", appearance: "outline" },
                  classNames: { label: "font-bold" },
                },
                Input: { className: "border-2" },
              },
            }}
          >
            <div className="catalog-row">
              <Button onClick={action}>
                {fa ? "تنظیم پروژه" : "Project default"}
              </Button>
              <CoreUIProvider
                value={{
                  components: { Button: { defaultProps: { size: "lg" } } },
                }}
              >
                <Button onClick={action}>
                  {fa ? "تنظیم صفحه" : "Page default"}
                </Button>
                <Button size="sm" className="rounded-full" onClick={action}>
                  {fa ? "تنظیم نمونه" : "Instance override"}
                </Button>
              </CoreUIProvider>
              <Input
                placeholder={
                  fa ? "ورودی با تنظیم پروژه" : "Project input styling"
                }
                aria-label="provider input"
              />
            </div>
          </CoreUIProvider>
        </Example>
        <Example props="registry.Button = ProjectButton">
          <CoreUIProvider value={{ registry: { Button: RegisteredButton } }}>
            <Button onClick={action}>
              {fa ? "ساختار جایگزین پروژه" : "Project replacement"}
            </Button>
          </CoreUIProvider>
        </Example>
        <Message>{count || ""}</Message>
      </>
    );
  if (id === "core-provider")
    return (
      <Example props="can · locale · calendar · direction · nested configuration">
        <label className="catalog-row">
          <input
            type="checkbox"
            checked={allowed}
            onChange={(event) => setAllowed(event.target.checked)}
          />
          {fa ? "اجازهٔ نمایش دکمه" : "Allow button visibility"}
        </label>
        <CoreProvider
          value={{
            can: () => allowed,
            locale: fa ? "fa-IR" : "en-US",
            direction,
            calendar: "gregorian",
          }}
        >
          <RuntimeStatus />
          <div className="catalog-row">
            <LegacyButton permission="catalog.demo">
              {fa ? "دکمهٔ محافظت‌شده" : "Protected button"}
            </LegacyButton>
          </div>
        </CoreProvider>
      </Example>
    );
  if (id === "theme-scope")
    return (
      <div className="catalog-grid">
        {(["light", "dark"] as const).map((mode) => (
          <Example
            key={mode}
            props={`mode="${mode}" · tokens · dir · lang · style`}
          >
            <ThemeScope
              mode={mode}
              dir={direction}
              lang={fa ? "fa-IR" : "en-US"}
              tokens={{
                "--core-action-bg": mode === "light" ? "#0f766e" : "#5eead4",
                "--core-action-fg": mode === "light" ? "#fff" : "#042f2e",
                "--core-action-hover": mode === "light" ? "#115e59" : "#99f6e4",
                "--core-radius": "1rem",
              }}
              className="border p-4 space-y-4 bg-[var(--core-surface)]"
            >
              <Input aria-label={`${mode} input`} placeholder={mode} />
              <ScopeDialog language={language} />
            </ThemeScope>
          </Example>
        ))}
      </div>
    );
  if (id === "page-transition")
    return (
      <>
        <Button onClick={action}>
          {fa ? "اجرای دوبارهٔ انیمیشن" : "Replay transition"}
        </Button>
        <Example props="children · className">
          <PageTransition key={count} className="border p-5 rounded-lg">
            {sample}
          </PageTransition>
        </Example>
      </>
    );
  if (id === "layout")
    return (
      <Example props="header · sidebar · subSidebar · children">
        <PreviewFrame>
          <Layout
            header={
              <header className="p-4 border-b">
                {fa ? "سربرگ" : "Header"}
              </header>
            }
            sidebar={
              <aside className="p-3 border-e w-20 shrink-0">
                {fa ? "منو" : "Menu"}
              </aside>
            }
            subSidebar={
              <aside className="p-3 border-e w-24 shrink-0">
                {fa ? "زیرمنو" : "Submenu"}
              </aside>
            }
          >
            {sample}
          </Layout>
        </PreviewFrame>
      </Example>
    );
  if (id === "page-wrapper")
    return (
      <Example props="children · className · inherited direction">
        <PageWrapper className="border rounded-lg">{sample}</PageWrapper>
      </Example>
    );
  if (id === "page-header")
    return (
      <>
        <Example props="title">
          <PageHeader title={fa ? "سربرگ ساده" : "Simple header"} />
        </Example>
        <Example props="actionButton(label, onClick, variant, permission) · className">
          <PageHeader
            title={fa ? "سربرگ با اقدام" : "Header with action"}
            actionButton={{
              label: fa ? "افزودن" : "Add",
              onClick: action,
              variant: "success",
              permission: "catalog.allowed",
            }}
            className="flex-wrap gap-3"
          />
        </Example>
        <Message>{count || ""}</Message>
      </>
    );
  if (id === "create-wrapper")
    return (
      <Example props="children">
        <CreatePageFormWrapper>{sample}</CreatePageFormWrapper>
      </Example>
    );
  return (
    <MemoryRouter>
      {id === "row-container" ? (
        <>
          {([1, 2, 3, 4] as const).map((numberOfColumns) => (
            <Example
              key={numberOfColumns}
              props={`numberOfColumns={${numberOfColumns}}`}
            >
              <RowContainer numberOfColumns={numberOfColumns}>
                {fields}
              </RowContainer>
            </Example>
          ))}
        </>
      ) : id === "display-field" ? (
        <Example props='label · value(null, 0, ReactNode) · link · colSpan=2 | "full"'>
          <RowContainer numberOfColumns={3}>
            <DisplayField label={fa ? "صفر" : "Zero"} value={0} />
            <DisplayField label={fa ? "خالی" : "Empty"} value={null} />
            <DisplayField
              label={fa ? "لینک" : "Link"}
              value={fa ? "مشاهدهٔ رکورد" : "View record"}
              link={{ to: "/catalog/1" }}
            />
            <DisplayField
              label={fa ? "دو ستون" : "Two columns"}
              value={sample}
              colSpan={2}
            />
            <DisplayField
              label={fa ? "عرض کامل" : "Full width"}
              value={fa ? "مقدار با عرض کامل" : "Full-width value"}
              colSpan="full"
            />
          </RowContainer>
        </Example>
      ) : (
        <>
          {[false, true].map((isFetching) => (
            <Example
              key={String(isFetching)}
              props={`title · actions · isFetching={${isFetching}}`}
            >
              <PreviewFrame>
                <RecordDisplayLayout
                  title={fa ? "جزئیات رکورد" : "Record details"}
                  isFetching={isFetching}
                  actions={
                    <Button onClick={action}>{fa ? "ویرایش" : "Edit"}</Button>
                  }
                >
                  <RowContainer numberOfColumns={2}>{fields}</RowContainer>
                </RecordDisplayLayout>
              </PreviewFrame>
            </Example>
          ))}
        </>
      )}
    </MemoryRouter>
  );
}
