import { expect, test } from "@playwright/test";

test("catalog includes every registered component and can search by component, Persian text and prop", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const apiRequests: string[] = [];
  page.on("request", (request) => {
    if (
      new URL(request.url()).pathname.startsWith("/api/") ||
      request.url().includes("catalog-local-only")
    )
      apiRequests.push(request.url());
  });
  await page.goto("/__core-ui.html");
  await expect(page.getByTestId("catalog-count")).toHaveText("68 / 68");
  await expect(page.locator(".catalog-card")).toHaveCount(68);
  const duplicateIds = await page.evaluate(() => {
    const seen = new Set<string>();
    return Array.from(document.querySelectorAll<HTMLElement>("[id]"))
      .map((element) => element.id)
      .filter((id) => seen.has(id) || !seen.add(id));
  });
  expect(duplicateIds).toEqual([]);
  await page.getByTestId("catalog-search").fill("اسکلتون");
  await expect(page.getByTestId("example-skeleton")).toBeVisible();
  await page.getByTestId("catalog-search").fill("Accordion");
  await expect(page.locator(".catalog-card")).toHaveCount(1);
  const accordion = page.getByTestId("example-accordion");
  const trigger = accordion.getByRole("button", {
    name: "آکاردئون بسته؛ برای باز کردن کلیک کنید",
    exact: true,
  });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(
    accordion.getByText("این محتوای واقعی آکاردئون است.", { exact: true }),
  ).toBeVisible();
  await page.getByTestId("catalog-search").fill("previewSize");
  await expect(page.locator(".catalog-card")).toHaveCount(1);
  const images = page.getByTestId("example-file-preview").getByRole("img");
  await expect(images.first()).toBeVisible();
  await expect(images.nth(0)).toHaveCSS("width", "48px");
  await expect(images.nth(1)).toHaveCSS("width", "80px");
  await expect(images.nth(2)).toHaveCSS("width", "128px");
  expect(errors).toEqual([]);
  expect(apiRequests).toEqual([]);
});

test("catalog preserves direction, brand and loading examples on narrow screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/__core-ui.html");
  await page.getByTestId("category-feedback").click();
  await expect(page.locator(".catalog-card")).toHaveCount(12);
  await page.getByTestId("catalog-search").fill("Skeleton");
  const scope = page.getByTestId("catalog-scope");
  await page.getByTestId("catalog-brand").selectOption("ocean");
  await page.getByTestId("theme-select").selectOption("dark");
  await expect(scope).toHaveAttribute("dir", "rtl");
  await expect(page.getByTestId("example-skeleton")).toHaveCSS(
    "background-color",
    "rgb(4, 47, 46)",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    scope.locator('[data-core-component="Skeleton"]').first(),
  ).toHaveCSS("animation-name", "none");
  await page.getByTestId("direction-select").selectOption("ltr");
  await expect(scope).toHaveAttribute("dir", "ltr");
  await expect(scope).toHaveAttribute("lang", "en-US");
  expect(
    await scope.evaluate(
      (element) => element.scrollWidth <= element.clientWidth + 1,
    ),
  ).toBe(true);
  await page.getByTestId("catalog-search").fill("No such component 12345");
  await expect(
    page.getByText("No matching components.", { exact: true }),
  ).toBeVisible();
});

test("catalog upload, conditional fields, table states and dialog props are interactive", async ({
  page,
}) => {
  await page.goto("/__core-ui.html");
  const search = page.getByTestId("catalog-search");
  await search.fill("FormUploader");
  const upload = page.getByTestId("example-upload");
  await upload
    .getByLabel("فایل تکی؛ حداکثر یک مگابایت", { exact: true })
    .setInputFiles({
      name: "catalog.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("Local upload"),
    });
  await upload.getByText("مقدار فعلی فرم", { exact: true }).click();
  await expect(upload.locator("pre")).toContainText(
    '"catalog-upload-one": 100',
  );
  await search.fill("DynamicField");
  const dynamic = page.getByTestId("example-dynamic-field");
  await expect(dynamic.getByLabel("فیلد شرطی", { exact: true })).toBeVisible();
  await dynamic.getByLabel("نمایش جزئیات بیشتر", { exact: true }).uncheck();
  await expect(dynamic.getByLabel("فیلد شرطی", { exact: true })).toBeHidden();
  await search.fill("PaginatedDataTable");
  const table = page.getByTestId("example-paginated-table");
  await expect(table.getByRole("table")).toBeVisible();
  await table.getByLabel("paginated-table data state").selectOption("empty");
  await expect(table.getByRole("table")).toContainText("داده‌ای یافت نشد.");
  await table.getByLabel("paginated-table data state").selectOption("error");
  await expect(
    table.getByText("دریافت داده ناموفق بود / Could not load records", {
      exact: true,
    }),
  ).toBeVisible();
  await search.fill("Dialog");
  const dialogExample = page.getByTestId("example-dialog");
  await dialogExample
    .getByRole("button", { name: "پنجرهٔ عریض", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "پنجرهٔ نمونه",
    exact: true,
  });
  await expect(dialog).toHaveCSS("max-width", "768px");
  await expect(dialog).toHaveAttribute("dir", "rtl");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("form prop examples preserve precision, password visibility, selections and controlled dates", async ({
  page,
}) => {
  await page.goto("/__core-ui.html");
  const search = page.getByTestId("catalog-search");
  await search.fill("FormInput");
  const input = page.getByTestId("example-form-input");
  await expect(input.getByLabel("long", { exact: true })).toHaveValue(
    "9007199254740993",
  );
  await expect(input.getByLabel("bigDecimal", { exact: true })).toHaveValue(
    "12345.67890123456789",
  );
  await expect(input.getByLabel("password", { exact: true })).toHaveAttribute(
    "type",
    "password",
  );
  await input.getByRole("button", { name: "نمایش رمز", exact: true }).click();
  await expect(input.getByLabel("password", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await search.fill("FormSelect");
  const select = page.getByTestId("example-form-select");
  await expect(
    select.getByLabel("انتخاب تک‌گزینه‌ای", { exact: true }),
  ).toHaveValue("0");
  await select
    .getByLabel("انتخاب تک‌گزینه‌ای", { exact: true })
    .selectOption("2");
  await select.getByText("مقدار فعلی فرم", { exact: true }).click();
  await expect(select.locator("pre")).toContainText('"catalog-select": 2');
  await expect(select.getByLabel("غیرفعال", { exact: true })).toBeDisabled();
  await search.fill("Checkbox");
  const checkbox = page.getByTestId("example-checkbox");
  await expect(
    checkbox.getByLabel("انتخاب‌شده", { exact: true }),
  ).toBeChecked();
  await checkbox.getByLabel("انتخاب‌شده", { exact: true }).uncheck();
  await expect(
    checkbox.getByLabel("انتخاب‌شده", { exact: true }),
  ).not.toBeChecked();
  await search.fill("DateInput");
  const date = page.getByTestId("example-date-input");
  await date
    .getByRole("button", { name: "پاک کردن تاریخ", exact: true })
    .first()
    .click();
  await expect(date.getByLabel("date", { exact: true })).toHaveValue("");
});

test("navigation prop examples close menus, update steps and retain tooltip theme in LTR", async ({
  page,
}) => {
  await page.goto("/__core-ui.html");
  const search = page.getByTestId("catalog-search");
  await search.fill("Dropdown");
  const dropdown = page.getByTestId("example-dropdown");
  const trigger = dropdown
    .getByRole("button", { name: /^باز کردن منو/ })
    .first();
  await expect(
    dropdown.getByRole("button", { name: "انتخاب گزینه", exact: true }),
  ).toHaveCount(0);
  await trigger.click();
  await expect(
    dropdown.getByRole("button", { name: "انتخاب گزینه", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    dropdown.getByRole("button", { name: "انتخاب گزینه", exact: true }),
  ).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.getByTestId("direction-select").selectOption("ltr");
  await search.fill("Stepper");
  const stepper = page.getByTestId("example-stepper");
  await expect(stepper.getByRole("navigation").first()).toHaveAttribute(
    "dir",
    "ltr",
  );
  await stepper.getByRole("button", { name: "Next step", exact: true }).click();
  await expect(
    stepper.getByRole("navigation").first().locator('[aria-current="step"]'),
  ).toHaveAttribute("aria-label", /Confirm/);
  await search.fill("Tooltip");
  await page.getByTestId("catalog-brand").selectOption("ocean");
  await page
    .getByTestId("example-tooltip")
    .getByRole("button", { name: "top", exact: true })
    .hover();
  await expect(page.getByRole("tooltip")).toHaveText("Sample tooltip");
  await expect(page.locator('[data-slot="tooltip-content"]').first()).toHaveCSS(
    "background-color",
    "rgb(15, 118, 110)",
  );
});
