import { useEffect, useMemo, useState } from "react";
import { z } from "zod/v3";
import {
  Button,
  CoreUIProvider,
  Field,
  Input,
  Table,
  ThemeScope,
} from "../../core/ui";
import type { Direction } from "../../core/ui";
import { brands } from "./themes";
import { Catalog } from "./catalog/Catalog";
import LegacyButton from "../../core/components/general/button/Button";
import Modal from "../../core/components/general/modal/Modal";
import FormInput from "../../core/components/form/FormInput";
import { FormWrapper } from "../../core/components/form/FormWrapper";
import { FormAutoComplete } from "../../core/components/form/FormAutoComplete";
import {
  referenceMessages,
  referenceLookups,
  type BrandName,
  type ReferenceMessages,
} from "./messages";

function BrandExample({
  name,
  copy,
  language,
}: {
  name: BrandName;
  copy: ReferenceMessages;
  language: "fa" | "en";
}) {
  const [open, setOpen] = useState(false);
  const [nested, setNested] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [saved, setSaved] = useState("");
  const schema = useMemo(
    () =>
      z.object({
        title: z.string().min(1, copy.titleRequired),
        amount: z.string(),
        category: z.unknown(),
      }),
    [copy.titleRequired],
  );
  return (
    <div className="min-w-0 space-y-5">
      <h2 className="text-xl font-bold">{copy.brands[name]}</h2>
      <div className="font-mono" data-testid="mono">
        {copy.mono}
      </div>
      <Field
        label={copy.independentInput}
        description={copy.independentDescription}
      >
        {(control) => <Input {...control} readOnly value={copy.readOnly} />}
      </Field>
      <FormWrapper
        schema={schema}
        defaultValues={{
          title: "",
          amount: "9007199254740993",
          category: null,
        }}
        onSubmit={(values) => setSaved(values.title)}
      >
        <div className="space-y-4">
          <FormInput
            name="title"
            label={copy.title}
            description={copy.titleDescription}
            classNames={{ input: "border-0" }}
          />
          <FormInput
            name="amount"
            label={copy.preciseLong}
            type="long"
            dir="ltr"
          />
          <FormAutoComplete
            name="category"
            label={copy.category}
            placeholder={copy.categoryPlaceholder}
            service={referenceLookups[language]}
            labelKey="name"
            valueKey="id"
            debounceTime={1}
          />
          <LegacyButton type="submit">{copy.save}</LegacyButton>
          <output aria-live="polite">
            {saved ? copy.saved.replace("{title}", saved) : ""}
          </output>
        </div>
      </FormWrapper>
      <div className="flex flex-wrap gap-2">
        <Button data-testid="project-button" onClick={() => setOpen(true)}>
          {copy.openDialog}
        </Button>
        <Button
          className="rounded-full"
          classNames={{ label: "font-bold" }}
          data-testid="instance-button"
        >
          {copy.instanceOverride}
        </Button>
        <Button disabled>{copy.disabled}</Button>
        <Button tone="success">{copy.success}</Button>
        <Button tone="danger">{copy.danger}</Button>
        <Button loading loadingLabel={copy.loading}>
          {copy.pending}
        </Button>
        <Button onClick={() => setEmpty((value) => !value)}>
          {copy.toggleEmpty}
        </Button>
      </div>
      <Table
        caption={copy.tableCaptions[name]}
        header={
          <>
            <th scope="col">{copy.name}</th>
            <th scope="col">{copy.state}</th>
          </>
        }
        empty={empty}
        columnCount={2}
        emptyContent={copy.empty}
      >
        <tr>
          <td>{copy.longContent}</td>
          <td>{copy.ready}</td>
        </tr>
      </Table>
      <Modal
        isOpen={open}
        onDismiss={() => setOpen(false)}
        title={copy.dialogTitles[name]}
        closeLabel={copy.closeDialog}
        description={copy.dialogDescription}
        classNames={{ description: "mb-4" }}
      >
        <div className="space-y-4">
          <FormInput standalone name="dialog-title" label={copy.dialogTitle} />
          <div
            data-testid="dialog-actions"
            className="flex flex-wrap items-center justify-end gap-3"
          >
            <Button onClick={() => setNested(true)}>{copy.openNested}</Button>
            <Button onClick={() => setOpen(false)}>{copy.done}</Button>
          </div>
        </div>
        <Modal
          isOpen={nested}
          onDismiss={() => setNested(false)}
          title={copy.nestedTitle}
          closeLabel={copy.closeNested}
        >
          <Button onClick={() => setNested(false)}>{copy.finishNested}</Button>
        </Modal>
      </Modal>
    </div>
  );
}

/** Development reference, intentionally separate from product routes and bundles. */
export function ReferencePage() {
  const [view, setView] = useState<"catalog" | "brands">("catalog");
  const [direction, setDirection] = useState<Direction>("rtl");
  const [mode, setMode] = useState<"light" | "dark">("light");
  const language = direction === "rtl" ? "fa" : "en";
  const locale = language === "fa" ? "fa-IR" : "en-US";
  const copy = referenceMessages[language];
  useEffect(() => {
    const root = document.documentElement;
    const previous = { dir: root.dir, lang: root.lang, title: document.title };
    root.dir = direction;
    root.lang = locale;
    document.title = copy.pageTitle;
    return () => {
      root.dir = previous.dir;
      root.lang = previous.lang;
      document.title = previous.title;
    };
  }, [direction, locale, copy.pageTitle]);
  return (
    <CoreUIProvider value={{ direction, locale }}>
      <main dir={direction} lang={locale} className="p-4 sm:p-8 space-y-6">
        <h1 className="text-2xl font-bold">{copy.pageTitle}</h1>
        <p>{copy.pageDescription}</p>
        <div className="flex flex-wrap items-center gap-4">
          <Button data-testid="root-theme-button">{copy.rootTheme}</Button>
          <label>
            {copy.direction}{" "}
            <select
              data-testid="direction-select"
              aria-label={copy.direction}
              value={direction}
              onChange={(event) =>
                setDirection(event.target.value as Direction)
              }
            >
              <option value="rtl">{copy.rtl}</option>
              <option value="ltr">{copy.ltr}</option>
            </select>
          </label>
          <label>
            {copy.theme}{" "}
            <select
              data-testid="theme-select"
              aria-label={copy.theme}
              value={mode}
              onChange={(event) =>
                setMode(event.target.value as "light" | "dark")
              }
            >
              <option value="light">{copy.light}</option>
              <option value="dark">{copy.dark}</option>
            </select>
          </label>
        </div>
        <div
          role="tablist"
          aria-label={language === "fa" ? "بخش‌های نمونه" : "Example sections"}
          className="flex flex-wrap gap-3"
        >
          <Button
            id="view-catalog"
            data-testid="view-catalog"
            role="tab"
            aria-controls="catalog-panel"
            aria-selected={view === "catalog"}
            appearance={view === "catalog" ? "solid" : "outline"}
            onClick={() => setView("catalog")}
          >
            {language === "fa" ? "کاتالوگ همهٔ کامپوننت‌ها" : "All components"}
          </Button>
          <Button
            id="view-brands"
            data-testid="view-brands"
            role="tab"
            aria-controls="brands-panel"
            aria-selected={view === "brands"}
            appearance={view === "brands" ? "solid" : "outline"}
            onClick={() => setView("brands")}
          >
            {language === "fa" ? "مقایسهٔ سه برند" : "Compare three brands"}
          </Button>
        </div>
        {view === "catalog" ? (
          <Catalog language={language} direction={direction} mode={mode} />
        ) : (
          <section
            role="tabpanel"
            id="brands-panel"
            aria-labelledby="view-brands"
            className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start"
          >
            {brands.map((brand) => (
              <CoreUIProvider key={brand.name} value={brand.ui}>
                <ThemeScope
                  data-testid={`scope-${brand.name}`}
                  mode={mode}
                  dir={direction}
                  tokens={{
                    ...brand.tokens,
                    ...(mode === "dark" ? brand.darkTokens : {}),
                  }}
                  className="min-w-0 border rounded-lg p-5 bg-[var(--core-surface)]"
                >
                  <BrandExample
                    name={brand.name}
                    copy={copy}
                    language={language}
                  />
                </ThemeScope>
              </CoreUIProvider>
            ))}
          </section>
        )}
      </main>
    </CoreUIProvider>
  );
}
