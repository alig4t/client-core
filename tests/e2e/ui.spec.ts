import { expect, test, type Page } from "@playwright/test";

const scenarios = [
  { direction: "rtl", mode: "light", width: 390 },
  { direction: "ltr", mode: "light", width: 1280 },
  { direction: "rtl", mode: "dark", width: 1280 },
  { direction: "ltr", mode: "dark", width: 390 },
] as const;

const labels = {
  rtl: {
    title: "عنوان",
    independentInput: "ورودی مستقل",
    disabled: "غیرفعال",
    loading: "در حال پردازش",
    category: "دسته‌بندی",
    open: "باز کردن مودال",
    close: "بستن مودال",
    done: "تمام",
    openNested: "باز کردن مودال تو‌در‌تو",
    dialogs: {
      default: "مودال پیش‌فرض",
      ocean: "مودال اقیانوس",
      paper: "مودال کاغذی",
    },
  },
  ltr: {
    title: "Title",
    independentInput: "Independent input",
    disabled: "Disabled",
    loading: "Loading",
    category: "Category",
    open: "Open dialog",
    close: "Close dialog",
    done: "Done",
    openNested: "Open nested dialog",
    dialogs: {
      default: "default dialog",
      ocean: "ocean dialog",
      paper: "paper dialog",
    },
  },
};

for (const { direction, mode, width } of scenarios) {
  test(`project and instance design, portal and keyboard: ${direction}/${mode}/${width}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openBrandComparison(page);
    await page.getByTestId("direction-select").selectOption(direction);
    await page.getByTestId("theme-select").selectOption(mode);
    const text = labels[direction];
    await expect(page.locator("html")).toHaveAttribute("dir", direction);
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      direction === "rtl" ? "fa-IR" : "en-US",
    );
    const backgrounds =
      mode === "light"
        ? {
            default: "rgb(255, 255, 255)",
            ocean: "rgb(240, 253, 250)",
            paper: "rgb(255, 255, 255)",
          }
        : {
            default: "rgb(31, 41, 55)",
            ocean: "rgb(4, 47, 46)",
            paper: "rgb(31, 41, 55)",
          };

    for (const [brand, radius] of [
      ["default", "8px"],
      ["ocean", "14px"],
      ["paper", "0px"],
    ] as const) {
      const scope = page.getByTestId(`scope-${brand}`);
      await expect(scope).toHaveAttribute("dir", direction);
      await expect(scope.getByTestId("project-button")).toHaveCSS(
        "border-radius",
        radius,
      );
      expect(
        await scope
          .getByTestId("instance-button")
          .evaluate((element) =>
            parseFloat(getComputedStyle(element).borderRadius),
          ),
      ).toBeGreaterThan(1000);
      await expect(scope.getByLabel(text.title, { exact: true })).toHaveCSS(
        "border-top-width",
        "0px",
      );
      await expect(scope.getByLabel(text.independentInput)).toHaveAttribute(
        "readonly",
        "",
      );
      await expect(
        scope.getByRole("button", { name: text.disabled, exact: true }),
      ).toBeDisabled();
      await expect(
        scope.getByRole("button", { name: text.loading, exact: true }),
      ).toBeDisabled();
      await expect(scope.getByTestId("mono")).toHaveCSS(
        "font-family",
        /monospace/,
      );
      await expect(
        scope.getByRole("combobox", { name: text.category, exact: true }),
      ).toBeVisible();
      expect(
        await scope.evaluate(
          (element) => element.scrollWidth <= element.clientWidth + 1,
        ),
      ).toBe(true);

      const open = scope.getByRole("button", {
        name: text.open,
        exact: true,
      });
      await open.click();
      const dialog = page.getByRole("dialog", {
        name: text.dialogs[brand],
        exact: true,
      });
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute("dir", direction);
      await expect(dialog).toHaveAttribute(
        "lang",
        direction === "rtl" ? "fa-IR" : "en-US",
      );
      await expect(dialog).toHaveCSS("background-color", backgrounds[brand]);
      await expect(dialog).toHaveCSS("border-radius", radius);
      expect(
        await dialog.evaluate((element) =>
          element
            .closest("[data-core-portal]")
            ?.closest("[data-testid]")
            ?.getAttribute("data-testid"),
        ),
      ).toBe(`scope-${brand}`);
      const bounds = await dialog.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
      const nestedButton = await dialog
        .getByRole("button", { name: text.openNested, exact: true })
        .boundingBox();
      const doneButton = await dialog
        .getByRole("button", { name: text.done, exact: true })
        .boundingBox();
      const horizontalGap = Math.max(
        0,
        nestedButton!.x - doneButton!.x - doneButton!.width,
        doneButton!.x - nestedButton!.x - nestedButton!.width,
      );
      const verticalGap = Math.max(
        0,
        nestedButton!.y - doneButton!.y - doneButton!.height,
        doneButton!.y - nestedButton!.y - nestedButton!.height,
      );
      expect(Math.max(horizontalGap, verticalGap)).toBeGreaterThanOrEqual(11);
      await expect(dialog.getByTestId("dialog-actions")).toHaveCSS(
        "display",
        "flex",
      );
      await expect(
        dialog.getByRole("button", { name: text.close, exact: true }),
      ).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expect(
        dialog.getByRole("button", { name: text.done, exact: true }),
      ).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(
        dialog.getByRole("button", { name: text.close, exact: true }),
      ).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(open).toBeFocused();
    }
    await page.screenshot({
      path: testInfo.outputPath("reference.png"),
      fullPage: true,
    });
  });
}

test("nested dialogs dismiss only the top layer and restore focus and scroll", async ({
  page,
}) => {
  await openBrandComparison(page);
  const scope = page.getByTestId("scope-ocean");
  const open = scope.getByRole("button", {
    name: "باز کردن مودال",
    exact: true,
  });
  await open.click();
  const outer = page.getByRole("dialog", {
    name: "مودال اقیانوس",
    exact: true,
  });
  const nestedTrigger = outer.getByRole("button", {
    name: "باز کردن مودال تو‌در‌تو",
    exact: true,
  });
  await nestedTrigger.click();
  const nested = page.getByRole("dialog", {
    name: "مودال تو‌در‌تو",
    exact: true,
  });
  await expect(nested).toBeVisible();
  await expect(nested).toHaveCSS("background-color", "rgb(240, 253, 250)");
  await page.keyboard.press("Shift+Tab");
  await expect(
    nested.getByRole("button", { name: "بستن و بازگشت", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(nested).toBeHidden();
  await expect(outer).toBeVisible();
  await expect(nestedTrigger).toBeFocused();
  await expect(page.locator("body")).toHaveAttribute("data-scroll-locked", "1");
  await page.keyboard.press("Escape");
  await expect(outer).toBeHidden();
  await expect(open).toBeFocused();
  await expect(page.locator("body")).not.toHaveAttribute("data-scroll-locked");
});

for (const direction of ["rtl", "ltr"] as const) {
  test(`shared form preserves validation focus, precise numbers, autocomplete and empty tables: ${direction}`, async ({
    page,
  }) => {
    await openBrandComparison(page);
    await page.getByTestId("direction-select").selectOption(direction);
    const text = labels[direction];
    const form =
      direction === "rtl"
        ? {
            save: "ذخیره",
            error: "وارد کردن عنوان الزامی است",
            amount: "عدد صحیح بزرگ",
            value: "رکورد جدید",
            option: "مهندسی",
            saved: "ذخیره شد: رکورد جدید",
            toggle: "تغییر حالت جدول",
            empty: "رکوردی وجود ندارد",
            ready: "آماده",
          }
        : {
            save: "Save",
            error: "Title is required",
            amount: "Precise long",
            value: "New record",
            option: "Engineering",
            saved: "Saved: New record",
            toggle: "Toggle empty",
            empty: "No records",
            ready: "Ready",
          };
    const scope = page.getByTestId("scope-paper");
    await scope.getByRole("button", { name: form.save, exact: true }).click();
    await expect(scope.getByRole("alert")).toHaveText(form.error);
    await expect(scope.getByLabel(text.title, { exact: true })).toBeFocused();
    await expect(scope.getByLabel(form.amount)).toHaveValue("9007199254740993");
    await scope.getByLabel(text.title, { exact: true }).fill(form.value);
    await scope
      .getByRole("combobox", { name: text.category, exact: true })
      .click();
    await scope.getByRole("option", { name: form.option, exact: true }).click();
    await scope.getByRole("button", { name: form.save, exact: true }).click();
    await expect(scope.getByRole("status")).toHaveText(form.saved);
    await scope.getByRole("button", { name: form.toggle, exact: true }).click();
    await expect(scope.getByRole("table")).toContainText(form.empty);
    await scope.getByRole("button", { name: form.toggle, exact: true }).click();
    await expect(scope.getByRole("table")).toContainText(form.ready);
  });
}

test("default active button tones retain readable contrast in both modes", async ({
  page,
}) => {
  await openBrandComparison(page);
  await page.getByTestId("direction-select").selectOption("ltr");
  for (const mode of ["light", "dark"]) {
    await page.getByTestId("theme-select").selectOption(mode);
    for (const name of ["Open dialog", "Success", "Danger"]) {
      const button = page
        .getByTestId("scope-default")
        .getByRole("button", { name, exact: true });
      for (const hover of [false, true]) {
        if (hover) await button.hover();
        else await page.mouse.move(0, 0);
        // Wait for the design's color transition before measuring active colors.
        await expect
          .poll(async () =>
            button.evaluate((element) => {
              const style = getComputedStyle(element);
              const luminance = (color: string) => {
                const rgb = color
                  .match(/[\d.]+/g)!
                  .slice(0, 3)
                  .map(Number)
                  .map((channel) => {
                    const value = channel / 255;
                    return value <= 0.04045
                      ? value / 12.92
                      : ((value + 0.055) / 1.055) ** 2.4;
                  });
                return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
              };
              const bg = luminance(style.backgroundColor),
                fg = luminance(style.color);
              return (Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05);
            }),
          )
          .toBeGreaterThanOrEqual(4.5);
      }
    }
  }
});

test("document dark defaults and a local light scope resolve independently", async ({
  page,
}) => {
  await openBrandComparison(page);
  const rootButton = page.getByTestId("root-theme-button");
  await expect(rootButton).toHaveCSS("background-color", "rgb(79, 70, 229)");
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await expect(rootButton).toHaveCSS("background-color", "rgb(165, 180, 252)");
  await expect(
    page.getByTestId("scope-default").getByTestId("project-button"),
  ).toHaveCSS("background-color", "rgb(79, 70, 229)");
  await page.evaluate(() => document.documentElement.classList.remove("dark"));
  await expect(rootButton).toHaveCSS("background-color", "rgb(79, 70, 229)");
});

async function openBrandComparison(page: Page) {
  await page.goto("/__core-ui.html");
  await page.getByTestId("view-brands").click();
}
