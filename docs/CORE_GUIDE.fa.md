# راهنمای core و جنریتور فرانت‌اند

این نسخه زنجیرهٔ تعریف موجودیت تا CRUD را در یک قرارداد مشترک اجرا می‌کند. ورودی عمومی core در `src/core/index.ts` و قرارداد موجودیت در `src/core/entity` است. برنامهٔ فعلی یک مصرف‌کنندهٔ این زیرساخت است؛ سرویس فایل، احراز هویت، layout و registry مسیرها از بیرون به core متصل می‌شوند.

## شروع و بررسی

محیط CI از Node.js 22 استفاده می‌کند. از ریشهٔ مخزن:

```bash
npm ci
npm --prefix generator ci
npm run generator:build
npm run generate:check
npm run dev
```

فرمان‌های کنترل کیفیت:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

برای آزمون مرورگر در محیط فاقد Chrome، ابتدا `npx playwright install chromium` را اجرا کنید. در ویندوز، تنظیم فعلی از Chrome نصب‌شده هم استفاده می‌کند. آزمون‌های مرورگر API را شبیه‌سازی می‌کنند؛ تطبیق با بک‌اند واقعی باید در محیط یکپارچهٔ محصول انجام شود.

## قرارداد موجودیت

`EntityDefinition` با `schemaVersion: 1` شامل endpoint، نوع شناسه، نام‌ها، فیلدها، مسیرها، مجوزها و تنظیم عملیات است. `entityDefinitionSchema` ورودی ساختاری را بررسی می‌کند. نمونه:

```ts
import { entityDefinitionSchema } from "@/core";

export const productDefinition = entityDefinitionSchema.parse({
  schemaVersion: 1,
  name: "Product",
  endpoint: "/products",
  displayName: "محصول",
  pluralDisplayName: "محصولات",
  displayField: "title",
  idType: "string",
  routing: { basePath: "/dashboard/products" },
  permissions: {
    read: "product:read",
    create: "product:create",
    update: "product:update",
    delete: "product:delete",
  },
  fields: {
    title: { label: "نام", type: "text", required: true, minLength: 3 },
    amount: { label: "قیمت", type: "bigDecimal", dataType: "decimal" },
    active: { label: "فعال", type: "boolean", defaultValue: false },
  },
});
```

`dataType` معنای داده را تعیین می‌کند؛ `type` و `widget` نحوهٔ ورود را تعیین می‌کنند. تغییر ظاهر یک فیلد نباید نوع DTO یا قواعد عددی آن را تغییر دهد. `fieldRegistry`، `buildEntitySchema`، `entityFromApi`، `entityToApi` و `formatFieldValue` مسیر مشترک اعتبارسنجی، تبدیل و نمایش هستند.

| قرارداد          | مقدار فرم و API                                                           |
| ---------------- | ------------------------------------------------------------------------- |
| integer / double | ورودی متنی به `number` معتبر تبدیل می‌شود؛ صفر حفظ می‌شود                 |
| long             | پیش‌فرض رشتهٔ عدد صحیح با بازهٔ signed 64-bit؛ بدون تبدیل ناامن به Number |
| decimal          | پیش‌فرض رشتهٔ اعشاری دقیق؛ محدودیت‌ها بدون گردکردن اعشار مقایسه می‌شوند   |
| boolean          | مقدار boolean؛ `false` مقدار معتبر است                                    |
| date             | `YYYY-MM-DD`، بدون تبدیل timezone                                         |
| datetime         | تاریخ و ساعت محلی، بدون offset                                            |
| instant          | ISO دارای timezone؛ انتخاب ساعت فعال است                                  |
| reference        | شناسه یا `{ id }` مطابق `relation.valueMode`؛ single یا multiple          |
| file             | شناسه یا `{ id }` مطابق `valueMode`؛ single یا multiple                   |

برای LONG و BIG_DECIMAL، بک‌اند باید رشتهٔ دقیق را بپذیرد و در پاسخ نیز دقت را حفظ کند. اگر API شما عدد JSON می‌خواهد، نگاشت جنریتور یا `numericEncoding: "number"` را صریح تنظیم کنید؛ LONG خارج از بازهٔ امن JavaScript در این حالت رد می‌شود. برای decimal عددی، محدودیت دقت Number برقرار است.

مقدار خالی فیلد اختیاری از payload حذف می‌شود؛ `nullable: true` مقدار `null` را حفظ می‌کند. `readOnly`، `create: false`، `edit: false` و فیلدهای مخفی یا غیرفعال شرطی از payload مربوط حذف می‌شوند. مدل پاسخ، CreateInput و UpdateInput در خروجی جنریتور جدا هستند. دادهٔ فرم در runtime از نوع `EntityInput` است و به DTO تبدیل می‌شود.

## فیلدهای ترکیبی و روابط

`type: "object"` و `type: "array"` با `fields` فرزندان، فرم‌های تو‌در‌تو و ردیف‌های قابل افزودن/حذف می‌سازند. قواعد حالت ایجاد/ویرایش و تبدیل روابط و فایل در تمام عمق ساختار اجرا می‌شوند. object/array برای دادهٔ متعلق به همان رکورد مناسب است؛ رابطهٔ معمول به موجودیت دیگر با autocomplete و reference ارسال می‌شود. برای گردش کار مستقل فرزندان می‌توان صفحه یا action اختصاصی اضافه کرد.

شرط‌های `visibleWhen`، `requiredWhen` و `disabledWhen` عملگرهای `eq`، `ne`، `in` و `truthy` دارند. مسیر `field` نسبت به object یا ردیف جاری خوانده می‌شود. `order` ترتیب فیلدها و `tab`، `section` و `group` چیدمان فرم را مشخص می‌کنند. `list` و `detail` مستقل از `sortable` هستند.

رابطه با `relation.entity`، `displayField`، `endpoint`، `multiple` و `valueMode` تعریف می‌شود. `lookupFilters` نام فیلتر API را به مسیر فیلد وابسته در فرم متصل می‌کند. مقدار اولیهٔ شناسه با `getById` lookup بازیابی می‌شود؛ درخواست قبلی جستجو با تغییر ورودی لغو یا بی‌اثر می‌شود. نمایش کامل relationهایی که API فقط شناسهٔ آن‌ها را می‌دهد، به lookup تزریقی نیاز دارد.

## اتصال به برنامه

`CoreProvider` تنظیمات زیر را می‌پذیرد:

- `can(permission, record?)` برای مجوز عمومی و محدودیت وابسته به رکورد؛ `readPermission` و `writePermission` برای فیلدها.
- `locale`، `direction` و `calendar` برای نمایش؛ مقدار پیش‌فرض فارسی، RTL و تقویم شمسی است.
- `uploads` با متد `upload` و متدهای اختیاری `preview/download`؛ لغو و پیشرفت بارگذاری پشتیبانی می‌شوند.
- `lookups` با نام موجودیت و متدهای `getAll/getById` برای انتخاب روابط.
- `widgets` برای اتصال کامپوننت اختصاصی به نام `widget`.

نمونهٔ اتصال واقعی برنامه در `src/CoreSetup.tsx` است. Provider داخلی lookupهای جنریتور را با lookupهای والد ادغام می‌کند. مجوزهای فرانت‌اند رفتار UI را کنترل می‌کنند؛ API باید مجوز و قواعد کسب‌وکار را مستقل اعمال کند.

بارگذاری فایل محدودیت اندازه، پسوند یا MIME اعلام‌شده را بررسی می‌کند، پیشرفت/لغو و خطای هر فایل را نشان می‌دهد و تا پایان upload اجازهٔ submit نمی‌دهد. اعتبارسنجی محتوای واقعی فایل باید در سرور انجام شود. حذف پیوست از فرم reference آن را حذف می‌کند؛ سیاست حذف فایل ذخیره‌شده متعلق به adapter و بک‌اند است.

`configureApi`، آدرس API، token، زبان و callback انقضای نشست را تنظیم می‌کند. `BaseService<Response, CreateInput, UpdateInput, Id>` پاسخ CRUD را یکدست باز می‌کند و `getAll` یک `Page<Response>` برمی‌گرداند. شکل‌های envelope پروژه، صفحهٔ Spring و آرایهٔ ساده پشتیبانی می‌شوند. برای شکل دیگر، `pageAdapter` سرویس را تزریق کنید.

```ts
const service = new BaseService<
  Product,
  ProductCreateInput,
  ProductUpdateInput
>("/products", undefined, {
  operations: { update: { path: "/v2/products/:id", method: "patch" } },
});
```

مسیر عملیات با `/` از ریشهٔ API و بدون `/` نسبت به endpoint سرویس محاسبه می‌شود. `:id` با encode جایگزین می‌شود. درخواست سفارشی زیرکلاس از `call({ method, path, body, query, signal })` استفاده می‌کند. `ApiError` شامل status و `fieldErrors` است؛ خطاهای فیلدی در FormWrapper به همان فیلد متصل می‌شوند. `BulkOperationError.result` موفق‌ها و شکست‌های حذف گروهی را جدا نگه می‌دارد.

`EntityForm`، `EntityList`، `EntityDetail` و `EntitySearch` صفحات مشترک هستند. فیلتر، sort و صفحه در URL باقی می‌مانند. `entityKeys` و hooks مشترک، تازه‌سازی کش پس از mutation را هماهنگ می‌کنند. کش هنگام ورود، خروج، تعویض حساب و انقضای نشست پاک می‌شود. فرم ویرایش مسیر جدا برای خطای دریافت و retry دارد؛ فرم کثیف از خروج ناخواسته محافظت می‌شود.

## تولید و سفارشی‌سازی

```bash
npm run generator:build
npm run generate -- Product --dry-run
npm run generate -- Product
npm run generate:all
npm run generate:check
```

XML معنای دامنه و YAML ظاهر و تنظیمات را تأمین می‌کند. مسیرهای config نسبت به خود فایل config resolve می‌شوند. فایل YAML اختیاری است و هر فیلد جداگانه با پیش‌فرض ادغام می‌شود. راهنمای قالب ورودی در [README جنریتور](../generator/README.md) است.

ساختار خروجی:

```text
src/Models/Product/
  generated/                   # تحت مالکیت جنریتور
    Product.definition.ts
    ProductModel.ts             # response / create / update
    ProductService.ts
    ProductPage.tsx             # اتصال به runtime
    ...
  Product.extension.ts          # توسعهٔ دستی
  ProductPage.tsx               # wrapper قابل جایگزینی
  ProductCreate.tsx
  Product.routes.tsx
  ...
```

فایل‌های `generated` را مستقیم ویرایش نکنید. manifest هش آن‌ها را نگه می‌دارد و در صورت تغییر دستی، بازتولید متوقف می‌شود. wrapperها و extensionها فقط اگر وجود نداشته باشند ساخته می‌شوند. ماژول‌های دارای گردش کار اختصاصی، مانند اتصال Channel و مدیریت دسترسی، wrapperهای قبلی خود را حفظ کرده‌اند.

در `definitionOverrides` می‌توان label، validation یا تنظیم فیلد را تغییر داد؛ `extendEntityDefinition` فیلدها را با حفظ قواعد قبلی ادغام و نتیجه را اعتبارسنجی می‌کند. در `entityExtension` می‌توان سرویس، transforms، action و renderer اختصاصی تزریق کرد:

```ts
export const definitionOverrides: EntityDefinitionOverrides = {
  fields: { title: { label: "عنوان محصول", minLength: 5 } },
};

export const entityExtension = {
  service: customProductService,
  // transforms: { fromApi, toCreate, toUpdate },
  // actions: [{ name, label, permission, visible, execute }],
  // renderField: (name, value, record) => ...,
};
```

برای کنترل کامل صفحه، wrapper ریشه را جایگزین کنید و از primitives عمومی core استفاده کنید. تغییر DTO یا شکل صفحه‌بندی باید همراه سرویس/transform مربوط باشد؛ cast کردن پاسخ قرارداد API را اصلاح نمی‌کند.

جنریتور ابتدا تمام ورودی‌ها، ارجاع‌ها، قالب‌ها و TypeScript خروجی را بررسی می‌کند، سپس تغییرات را می‌نویسد. نوشتن هر فایل با rename فایل موقت انجام می‌شود و خطای نوشتن باعث بازگرداندن فایل‌های قبلی می‌شود. `--dry-run` تغییری نمی‌نویسد؛ `--check` در صورت تفاوت exit code ناموفق می‌دهد. registry مسیر، viewname، مجوز و ورودی menu به‌صورت مرکزی به‌روز می‌شوند؛ menu مشترک، ورودی‌های دستی را حفظ می‌کند.

## دامنهٔ تأییدشده

آزمون‌های قرارداد، کنترل‌های فرم، دسترسی، جنریتور و مرورگر در `.github/workflows/verify.yml` روی PR و main اجرا می‌شوند. موجودیت مرجع `ComprehensiveEntity` کل مسیر اعداد دقیق، boolean، تاریخ، enum، روابط و فایل را مصرف می‌کند. تست‌های بک‌اند واقعی، مجوز سمت سرور، بررسی محتوای فایل و گردش کار اختصاصی محصول در این مخزن تأیید نشده‌اند.
