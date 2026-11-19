import { useMemo, useState } from "react";
import { Toaster } from "sonner";
import {
  Button,
  Field,
  Input,
  ThemeScope,
  CoreUIProvider,
  type Direction,
} from "../../../core/ui";
import { CoreProvider } from "../../../core/entity/CoreProvider";
import { brands } from "../themes";
import type { BrandName } from "../messages";
import { catalogEntries, categories, type Category } from "./entries";
import { createUploads } from "./fixtures";
import "./catalog.css";

export function Catalog({
  language,
  direction,
  mode,
}: {
  language: "fa" | "en";
  direction: Direction;
  mode: "light" | "dark";
}) {
  const fa = language === "fa";
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [brandName, setBrandName] = useState<BrandName>("default");
  const uploads = useMemo(createUploads, []);
  const brand = brands.find((item) => item.name === brandName)!;
  const query = search.trim().toLocaleLowerCase();
  const entries = catalogEntries.filter(
    (entry) =>
      (category === "all" || entry.category === category) &&
      `${entry.name} ${entry.description.fa} ${entry.description.en} ${entry.props}`
        .toLocaleLowerCase()
        .includes(query),
  );
  return (
    <section
      role="tabpanel"
      id="catalog-panel"
      aria-labelledby="view-catalog"
      data-testid="component-catalog"
    >
      <div className="catalog-toolbar">
        <Field
          label={fa ? "جستجوی کامپوننت یا prop" : "Search components or props"}
        >
          {(control) => (
            <Input
              {...control}
              data-testid="catalog-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                fa
                  ? "مثلاً Accordion، اسکلتون یا disabled"
                  : "For example Accordion, skeleton or disabled"
              }
            />
          )}
        </Field>
        <label className="catalog-brand">
          {fa ? "طراحی نمونه‌ها" : "Example design"}
          <select
            data-testid="catalog-brand"
            value={brandName}
            onChange={(event) => setBrandName(event.target.value as BrandName)}
          >
            {brands.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <nav
        className="catalog-categories"
        aria-label={fa ? "دسته‌بندی کامپوننت‌ها" : "Component categories"}
      >
        <Button
          tone="neutral"
          size="sm"
          appearance={category === "all" ? "solid" : "ghost"}
          aria-pressed={category === "all"}
          onClick={() => setCategory("all")}
        >
          {fa ? "همه" : "All"} ({catalogEntries.length})
        </Button>
        {(
          Object.entries(categories) as [Category, { fa: string; en: string }][]
        ).map(([key, label]) => (
          <Button
            key={key}
            data-testid={`category-${key}`}
            tone="neutral"
            size="sm"
            appearance={category === key ? "solid" : "ghost"}
            aria-pressed={category === key}
            onClick={() => setCategory(key)}
          >
            {label[language]} (
            {catalogEntries.filter((entry) => entry.category === key).length})
          </Button>
        ))}
      </nav>
      <p className="catalog-intro">
        {fa
          ? "هر کارت، کامپوننت واقعی را با propهای نوشته‌شده نمایش می‌دهد. نمونه‌ها با داده و فایل محلی کار می‌کنند."
          : "Each card renders the real component with the displayed props. Data and file examples run locally."}{" "}
        <span data-testid="catalog-count">
          {entries.length} / {catalogEntries.length}
        </span>
      </p>
      <CoreProvider
        value={{
          can: (permission) => permission !== "catalog.denied",
          locale: fa ? "fa-IR" : "en-US",
          direction,
          calendar: fa ? "persian" : "gregorian",
          uploads,
        }}
      >
        <CoreUIProvider value={brand.ui}>
          <ThemeScope
            data-testid="catalog-scope"
            className={`core-catalog ${mode === "dark" ? "dark" : ""}`}
            dir={direction}
            mode={mode}
            tokens={{
              ...brand.tokens,
              ...(mode === "dark" ? brand.darkTokens : {}),
            }}
          >
            <div className="catalog-cards">
              {entries.map((entry) => {
                const Demo = entry.Component;
                return (
                  <article
                    key={`${entry.id}-${language}`}
                    id={`component-${entry.id}`}
                    data-testid={`example-${entry.id}`}
                    className="catalog-card"
                    aria-labelledby={`title-${entry.id}`}
                  >
                    <header className="catalog-card-header">
                      <span className="catalog-category">
                        {categories[entry.category][language]}
                      </span>
                      <h2 id={`title-${entry.id}`} dir="ltr">
                        {entry.name}
                      </h2>
                      <p>{entry.description[language]}</p>
                      <p className="catalog-api" dir="ltr">
                        {entry.props}
                      </p>
                    </header>
                    <Demo
                      id={entry.id}
                      language={language}
                      direction={direction}
                    />
                    <details className="catalog-source">
                      <summary>
                        {fa
                          ? "مسیر سورس و نام‌های سازگار"
                          : "Source and compatibility paths"}
                      </summary>
                      <code dir="ltr">{entry.source}</code>
                      {entry.aliases?.map((alias) => (
                        <code key={alias} dir="ltr">
                          {alias}
                        </code>
                      ))}
                    </details>
                  </article>
                );
              })}
            </div>
            {entries.length === 0 && (
              <p className="catalog-empty">
                {fa
                  ? "کامپوننتی مطابق جستجو پیدا نشد."
                  : "No matching components."}
              </p>
            )}
            <Toaster theme={mode} dir={direction} position="bottom-center" />
          </ThemeScope>
        </CoreUIProvider>
      </CoreProvider>
    </section>
  );
}
