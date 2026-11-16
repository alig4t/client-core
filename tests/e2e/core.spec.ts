import { test, expect, type Page } from "@playwright/test";
const base = "/dashboard/portal/comprehensive";
async function session(
  page: Page,
  operations = ["read", "create", "update", "delete"],
) {
  await page.addInitScript(
    (permissions) => {
      localStorage.setItem("token", "test-session-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: 1,
          name: "Tester",
          username: "tester",
          roles: [
            {
              id: 1,
              name: "test",
              permission: permissions.map((name, index) => ({
                id: index,
                name,
                showName: name,
              })),
            },
          ],
        }),
      );
    },
    operations.map((operation) => "comprehensiveentity:" + operation),
  );
}
async function backend(page: Page) {
  const writes: Record<string, unknown>[] = [];
  const records: Record<string, unknown>[] = [];
  await page.route("**/api/**", async (route) => {
    const request = route.request(),
      path = new URL(request.url()).pathname.replace(/^.*?\/api/, "");
    const fulfill = (data: unknown, status = 200, meta?: unknown) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify({
          type: status >= 400 ? "error" : "data",
          status,
          data,
          meta,
        }),
      });
    const meta = {
      totalItems: 2,
      totalPages: 1,
      currentPage: 0,
      pageSize: 10,
      isLastPage: true,
    };
    if (path === "/auth/users")
      return fulfill([{ id: 1, username: "tester" }], 200, meta);
    if (path === "/channel")
      return fulfill([{ id: 2, channelName: "Channel A" }], 200, meta);
    if (path === "/keyword")
      return fulfill(
        [
          { id: 3, keywordText: "Keyword A" },
          { id: 4, keywordText: "Keyword B" },
        ],
        200,
        meta,
      );
    if (path === "/messagingplatform")
      return fulfill([{ id: 5, platformName: "Platform A" }], 200, meta);
    if (path === "/document/upload")
      return fulfill({
        id: 77,
        mimeType: "application/pdf",
        name: "sample.pdf",
        size: 20,
      });
    if (path.startsWith("/document/token/")) return fulfill("document-token");
    if (path.startsWith("/document/stream/"))
      return route.fulfill({
        status: 200,
        contentType: "application/pdf",
        body: Buffer.from("%PDF-1.4 sample"),
      });
    if (path === "/comprehensiveentity" && request.method() === "POST") {
      const payload = request.postDataJSON() as Record<string, unknown>;
      if (payload.uniqueField === "duplicate")
        return route.fulfill({
          status: 422,
          contentType: "application/json",
          body: JSON.stringify({
            message: "ورودی نامعتبر است",
            fieldErrors: { uniqueField: "این مقدار قبلاً ثبت شده است" },
          }),
        });
      writes.push(payload);
      const record = {
        id: 42,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
        ...payload,
      };
      records.push(record);
      return fulfill(record, 201);
    }
    if (path === "/comprehensiveentity")
      return fulfill(records, 200, {
        ...meta,
        totalItems: records.length,
        totalPages: records.length ? 1 : 0,
      });
    if (path.startsWith("/comprehensiveentity/"))
      return fulfill("رکورد یافت نشد", 404);
    return fulfill([], 200, { ...meta, totalItems: 0, totalPages: 0 });
  });
  return writes;
}
async function requiredFields(page: Page, unique = "unique") {
  await page.getByLabel("رشته", { exact: true }).fill("Hello123");
  await page.getByLabel("فیلد یکتا", { exact: true }).fill(unique);
  await page
    .getByRole("combobox", { name: "کاربر مرتبط", exact: true })
    .click();
  await page.getByRole("option", { name: "tester", exact: true }).click();
  await page
    .getByRole("combobox", { name: "کانال مرتبط", exact: true })
    .click();
  await page.getByRole("option", { name: "Channel A", exact: true }).click();
}
test("unauthenticated users are redirected before protected UI loads", async ({
  page,
}) => {
  await backend(page);
  await page.goto(base + "/42/edit");
  await expect(page).toHaveURL(/\/login$/);
});
test("dynamic edit routes require update permission", async ({ page }) => {
  await session(page, ["read"]);
  await backend(page);
  await page.goto(base + "/42/edit");
  await expect(page.getByRole("heading", { name: /دسترسی/ })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "ذخیره", exact: true }),
  ).toHaveCount(0);
});
test("generated comprehensive form sends typed scalars, multi references and uploaded files", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await session(page);
  const writes = await backend(page);
  await page.goto(base + "/create");
  await requiredFields(page);
  await page.getByLabel("عدد صحیح", { exact: true }).fill("17");
  await page.getByLabel("عدد اعشاری", { exact: true }).fill("3.125");
  await page.getByLabel("عدد بلند", { exact: true }).fill("9007199254740993");
  await page
    .getByLabel("عدد دقیق (BigDecimal)", { exact: true })
    .fill("12345678901234567890.123456789");
  await page.getByLabel("گزینه‌ها", { exact: true }).selectOption("OPTION_A");
  await page
    .getByRole("combobox", { name: "کلمات کلیدی", exact: true })
    .click();
  await page.getByRole("option", { name: "Keyword A", exact: true }).click();
  await page.getByRole("option", { name: "Keyword B", exact: true }).click();
  await page.getByRole("heading", { name: "ایجاد ترکیبی" }).click();
  await page.getByLabel("پیوست‌ها", { exact: true }).setInputFiles({
    name: "sample.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 sample"),
  });
  await expect(page.getByText("دریافت فایل", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "ذخیره", exact: true }).click();
  await expect(page).toHaveURL(base);
  expect(writes).toHaveLength(1);
  expect(writes[0]).toMatchObject({
    integerField: 17,
    doubleField: 3.125,
    longField: "9007199254740993",
    bigDecimalField: "12345678901234567890.123456789",
    booleanField: false,
    oneToOneUser: { id: 1 },
    manyToOneChannel: { id: 2 },
    oneToManyKeywords: [{ id: 3 }, { id: 4 }],
    attachments: [{ id: 77 }],
    enumField: "OPTION_A",
  });
  expect(writes[0].oneToOneUser).not.toHaveProperty("username");
  await expect(
    page.getByRole("columnheader", { name: "فیلد یکتا", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("server validation errors appear next to the field and preserve inputs", async ({
  page,
}) => {
  await session(page);
  await backend(page);
  await page.goto(base + "/create");
  await requiredFields(page, "duplicate");
  await page.getByRole("button", { name: "ذخیره", exact: true }).click();
  await expect(
    page.getByText("این مقدار قبلاً ثبت شده است", { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("رشته", { exact: true })).toHaveValue(
    "Hello123",
  );
});
test("dirty form navigation can be cancelled", async ({ page }) => {
  await session(page);
  await backend(page);
  await page.goto(base + "/create");
  await page.getByLabel("رشته", { exact: true }).fill("Unsaved");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("link", { name: "خانه", exact: true }).first().click();
  await expect(page).toHaveURL(base + "/create");
  await expect(page.getByLabel("رشته", { exact: true })).toHaveValue("Unsaved");
  let confirmations = 0;
  page.on("dialog", async (dialog) => {
    confirmations++;
    await dialog.accept();
  });
  await page.getByRole("button", { name: "انصراف", exact: true }).click();
  await expect(page).toHaveURL(base);
  expect(confirmations).toBe(1);
});
