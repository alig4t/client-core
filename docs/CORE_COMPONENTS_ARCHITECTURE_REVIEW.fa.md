# بررسی کامپوننت‌های core، سیستم طراحی و چندزبانگی

تاریخ بررسی: ۲۰۲۶/۱۱/۱۹

این گزارش وضعیت فعلی کد را بررسی می‌کند و مکمل بررسی تاریخی `CORE_READINESS_REVIEW.fa.md` است. دامنه شامل کامپوننت‌های `src/core`، runtime موجودیت‌ها، استایل‌های برنامه، راه‌اندازی Providerها، قرارداد متادیتا، قالب‌های جنریتور و تست‌هاست. در این بررسی کد اجرایی تغییر نکرده است. APIها و ساختارهایی که با عنوان «پیشنهادی» آمده‌اند هنوز پیاده‌سازی نشده‌اند.

## نتیجهٔ اصلی

core فعلی پایهٔ مناسبی برای CRUD مبتنی بر متادیتا دارد، اما هنوز یک کتابخانهٔ عمومی کامپوننت با سیستم طراحی قابل جایگزینی و پشتیبانی کامل از RTL/LTR و چندزبانگی نیست.

خواستهٔ موردنظر را می‌توان این‌گونه تعریف کرد: **core یک کتابخانهٔ نسخه‌دار با رفتار و API پایدار باشد؛ ظاهر پیش‌فرض کامل داشته باشد؛ هر پروژه بتواند طراحی عمومی، ظاهر یک نوع کامپوننت و ظاهر یک نمونه را بدون ویرایش core تغییر دهد.** این معماری شدنی است. ثابت‌بودن core در پروژه‌های مصرف‌کننده با توسعه و انتشار نسخه‌های جدید آن توسط تیم core سازگار است؛ ثابت‌بودن همیشگی پیاده‌سازی، امکان افزودن قابلیت و اصلاح اشکال را از بین می‌برد.

پیشنهاد اصلی، تکمیل قرارداد طراحی و توسعه‌پذیری پیش از افزایش زیاد تعداد کامپوننت‌هاست. وگرنه هر کامپوننت جدید، استایل‌ها، متن‌ها و فرض‌های جهت فعلی را تکثیر می‌کند.

## پایه‌های قابل استفادهٔ فعلی

- `CoreProvider` تنظیمات `locale`، `direction`، `calendar`، مجوز، lookup، upload و widget سفارشی دارد. [کد](../src/core/entity/CoreProvider.tsx)
- `EntityForm/List/Detail/Search`، تبدیل و اعتبارسنجی داده، فرم‌های تو‌در‌تو، روابط، فایل و extension موجودیت وجود دارند. [runtime](../src/core/entity/EntityPages.tsx)، [قرارداد](../src/core/entity/types.ts)
- برای رنگ‌ها و بخشی از اندازه‌ها CSS variable و حالت روشن/تیره تعریف شده است. [تم فعلی](../src/styles/theme.css)
- ابزار `cn` با `clsx` و `tailwind-merge` و وابستگی CVA موجودند؛ زیرساخت اولیهٔ یکپارچه‌سازی کلاس‌ها آماده است. [ابزار core](../src/core/utils/classNames.ts)
- Modal فعلی focus trap، Escape و بازگرداندن focus دارد؛ autocomplete لغو درخواست قدیمی، انتخاب چندتایی و بخشی از تعامل صفحه‌کلید را پیاده کرده است. این قابلیت‌ها باید حفظ و یکدست شوند.
- جداسازی فایل‌های generated از wrapper و extension و کنترل بازتولید انجام شده است؛ توسعهٔ سیستم طراحی و ترجمه می‌تواند از همین الگوی مالکیت فایل استفاده کند.

وجود این قابلیت‌ها به معنی اتصال آن‌ها به تمام کامپوننت‌ها نیست. مثلاً `widgets` فقط مسیر DynamicField را پوشش می‌دهد و registry عمومی برای جایگزینی Button، Dialog یا DataTable نیست.

## بررسی‌های اجرایی

| بررسی | نتیجهٔ اجرای این بررسی |
| --- | --- |
| `npm run typecheck` | موفق |
| `npm run lint` | موفق |
| `npm test` | ۵۲ تست در ۵ فایل موفق |
| `npm run test:e2e` | ۵ سناریوی مرورگر با API شبیه‌سازی‌شده موفق |
| `npm run build` | موفق؛ هشدارهای dependency و اندازهٔ chunk باقی است |
| `npm run generator:build` | موفق |
| `npm run generate:check` | موفق؛ بدون تغییر خروجی |
| بررسی مستقیم مرورگر | چند ناسازگاری طراحی، جهت و چیدمان بازتولید شد |

آزمون مستقیم با Chrome بدون رابط، Vite محلی، viewport برابر ۱۲۸۰×۹۰۰ و رندر کامپوننت‌های واقعی داخل `CoreProvider` با `locale: en-US`، `direction: ltr` و `calendar: gregorian` انجام شد:

| ورودی/سناریو | مشاهده |
| --- | --- |
| PageWrapper و سپس Modal و Stepper | PageWrapper برابر LTR بود؛ Modal و Stepper همچنان RTL بودند |
| تغییر locale در Provider | `html.lang` همچنان `fa` و `html.dir` همچنان `rtl` بود؛ متن loading دکمه فارسی ماند |
| Button با `className="rounded-full"` | border-radius محاسبه‌شده ۸px؛ قانون عمومی `button` غالب شد |
| یک `div` با `font-mono` | فونت محاسبه‌شده `IRANSansXFaNum`؛ قانون عمومی دارای `!important` غالب شد |
| FormInput با `className="border-0"` | کلاس به wrapper رسید؛ border ورودی همچنان ۱px بود |
| DisplayField با `colSpan={2}` | `grid-column: auto`؛ کلاس `sm:col-span-2` در CSS production نیز وجود نداشت |
| Dropdown بسته | محتوای opacity صفر همچنان `visibility: visible` داشت و دکمهٔ داخلی `tabIndex: 0` بود |
| Dropdown با `dir="ltr"` و `align="start"` | به راست متصل شد؛ محاسبهٔ alignment از جهت استفاده نمی‌کند |

این probeها آزمون کامل دسترس‌پذیری، تمام مرورگرها یا تمام طراحی‌های سفارشی نیستند. تست‌های موجود عمدتاً قرارداد داده و جریان CRUD را تأیید می‌کنند؛ یک تست تقویم میلادی هم وجود دارد، اما ماتریس طراحی/زبان/جهت و visual regression وجود ندارد.

## یافته‌ها و اولویت اصلاح

در این گزارش P0 یعنی پیش‌نیاز عرضهٔ core عمومی با خواسته‌های فعلی؛ الزاماً به معنی خراب‌بودن CRUD فارسی موجود نیست.

| اولویت | یافته و اثر | شاهد |
| --- | --- | --- |
| P0 | CSS عمومی برنامه بر API ظاهری کامپوننت‌ها غلبه می‌کند؛ override قابل پیش‌بینی نیست. فونت `div` اجباری، اندازه و گردی عمومی button و حذف عمومی outline وجود دارد. بعضی کنترل‌ها ring جدا دارند، اما همه ندارند. | `src/index.css:46`، `:55`، `:71`؛ probe مرورگر |
| P0 | جهت در چندین کامپوننت ثابت است؛ تغییر Provider برای تبدیل کل محصول کافی نیست. | `Modal.tsx:80`، `ConfirmationModal.tsx:31`، `Stepper.tsx:61`، `RowContainer.tsx:28`، `RecordDisplayLayout.tsx:22` و موارد دیگر |
| P0 | زیرساخت ترجمهٔ UI وجود ندارد. تنظیم locale در runtime عمدتاً به نمایش تاریخ محدود است؛ عنوان، loading، aria-label، validation، فیلتر و toast هنوز متن ثابت دارند. | `CoreProvider.tsx`، `EntityPages.tsx`، `Button.tsx:85`، `fields.ts:375`، `forms/MessageUtils.ts` |
| P0 | runtime صفحات از اجزای سیستم طراحی مشترک عبور نمی‌کند: submit در EntityForm یک button خام با `bg-purple-600` است؛ actionها و کنترل‌های دیگر نیز مسیرهای جدا دارند. تغییر Button به‌تنهایی همهٔ خروجی جنریتور را تغییر نمی‌دهد. | `EntityPages.tsx:78` و سایر actionهای همان فایل |
| P1 | توکن‌ها کامل و زنجیره‌ای نیستند. مثلاً `--color-primary` و `--button-primary-bg` جداگانه مقدار ثابت دارند؛ تغییر یکی دیگری را تضمین نمی‌کند. spacingها تعریف شده‌اند ولی بسیاری از کنترل‌ها `p-2`/`px-5` ثابت دارند. | `src/styles/theme.css:33`، `:62`، `:98`؛ Button/FormInput/DataTable |
| P1 | کنتراست متن سفید روی رنگ پیش‌فرض دکمه‌های روشن برای متن کوچک کافی نیست: primary حدود ۴٫۴۷، success حدود ۲٫۵۴ و danger حدود ۳٫۷۶ است. | محاسبه از توکن‌های واقعی `theme.css`؛ اندازهٔ متن Button برابر `text-sm` است |
| P1 | قرارداد عمومی استایل و props یکدست نیست. Button props بومی کامل و ref را عبور نمی‌دهد؛ Modal حتی `className` ندارد؛ FormInput کلاس را به wrapper می‌دهد؛ Input با spread می‌تواند کل کلاس پیش‌فرض را جایگزین کند. | Button، Modal، FormInput، Input |
| P1 | Select سفارشی، Dropdown و Tabs داخلی، رفتار یکپارچهٔ صفحه‌کلید و focus ندارند. Dropdown بسته فقط با opacity مخفی می‌شود؛ trigger آن wrapper کلیکی است. | `Select.tsx`، `DropDown.tsx`، `DynamicField.tsx:63` |
| P1 | Accordion بدون `type="button"` داخل فرم می‌تواند submit کند؛ `aria-expanded/controls` ندارد و محتوای بسته فقط ارتفاع صفر و `aria-hidden` می‌گیرد. بعضی دکمه‌های Stepper و TableLink نیز type صریح ندارند. | `Accordion.tsx:20`، `stepper/Stepper.tsx:90`، `link/TableLink.tsx` |
| P1 | Drawer و BottomSheet، برخلاف Modal، focus trap و بازگرداندن focus مشترک ندارند؛ overlayهای هم‌زمان مدیریت stack، scroll lock و پس‌زمینهٔ inert مشترک ندارند. | `drawer/Drawer.tsx`، `modal/BottomSheetModal.tsx`، `modal/Modal.tsx` |
| P1 | Label همواره به id برابر `name` اشاره می‌کند. اتصال `field.ref` در کنترل‌های RHF کامل نیست؛ بنابراین focus خودکار خطا قابل اتکا نیست. استفاده از خود نام فیلد به‌عنوان id نیز بین دو فرم تکراری collision می‌سازد. | `Label.tsx:7`، FormInput/FormSelect/Checkbox |
| P1 | `DisplayField.colSpan` کلاس Tailwind را پویا می‌سازد؛ بخشی از چیدمان اعلام‌شده واقعاً تولید نمی‌شود. | `DisplayField.tsx:31` و بررسی CSS production |
| P1 | زبان، تقویم و timezone مستقل نیستند. DatePicker براساس تقویم فقط locale فارسی یا انگلیسی انتخاب می‌کند؛ locale فعال نادیده گرفته می‌شود. timezone قابل تنظیم runtime هم وجود ندارد. | `CustomDatePicker.tsx:37`، `CoreProvider.tsx`، `fields.ts:366` |
| P2 | بعضی تنظیمات API اثری در UI ندارند: `FilePreview.previewSize` مصرف نمی‌شود؛ `maxVisible` بعضی selectها و `relation.allowCreate` نیز مسیر اجرایی کامل ندارند. | FilePreview، FormSelect، FormAutoComplete، DynamicField |
| P2 | طراحی پیش‌فرض بیرون از core است و export عمومی بیشتر معطوف به entity است. بستهٔ قابل نصب با export، CSS و قرارداد سازگاری مستقل هنوز تعریف نشده است. | `src/styles/theme.css`، `src/core/index.ts`، `package.json` |

نکتهٔ فنی: `@theme` فعلی عبارت خودارجاع `--color-primary: var(--color-primary)` دارد. در probe رنگ root معتبر بود، پس خرابی قطعی رنگ از آن نتیجه نمی‌گیرم؛ بااین‌حال این نگاشت باید هنگام استانداردسازی تم با نام‌های مستقل و نگاشت روشن جایگزین شود.

نسبت‌های کنتراست بالا از فرمول luminance رنگ‌های تعریف‌شده محاسبه شده‌اند، نه از نمونه‌برداری تصویر؛ مقدار گرد‌شده فقط برای گزارش است. برای متن معمولی فعال، معیار AA نسبت حداقل ۴٫۵ به ۱ می‌خواهد. این یافته دربارهٔ سه حالت فعال پیش‌فرض روشن است، نه تمام رنگ‌های پروژه یا کنترل غیرفعال. [توضیح رسمی W3C دربارهٔ کنتراست](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

`CustomDataTable` و مسیر قدیمی `general/Stepper` در وضعیت فعلی compatibility export هستند؛ نباید آن‌ها را دو پیاده‌سازی مستقل و نیازمند بازنویسی جدا حساب کرد.

## ارزیابی گروه‌های موجود

| گروه | وضعیت استفادهٔ فعلی | بهبود لازم برای core عمومی |
| --- | --- | --- |
| Button، ButtonPanel، PageHeader | چند variant و کنترل loading/permission دارند | اندازه، ظاهر solid/outline/ghost/link، IconButton، props/ref بومی، slot، label قابل ترجمه، استفاده در تمام runtime |
| Input، FormInput، Label، ErrorFormText | ورودی پایه، textarea و password موجود است | جداسازی Input واقعی و SearchField؛ Field مشترک؛ help/error/required؛ اتصال ref؛ کنترل مستقل و adapter فرم |
| Checkbox و FormSelect | false/zero و انتخاب چندتایی پوشش داده شده‌اند | theme و error مشترک؛ indeterminate برای checkbox؛ API مستقل از RHF؛ تصمیم روشن دربارهٔ select بومی و سفارشی |
| Select و FormAutoComplete | انتخاب و رابطهٔ async وجود دارد | primitive رفتاری مطمئن، disabled option/group، controlled open، clear، renderOption/renderValue، keyboard، portal و فهرست بزرگ |
| DateInput و CustomDatePicker | date/local datetime/instant و دو تقویم وجود دارد | locale مستقل، timezone برای instant، min/max و disabled date، time-only و range، استایل popup و keyboard |
| Upload و FilePreview | adapter، محدودیت فایل، progress و AbortController دارند | دکمهٔ cancel/retry و وضعیت هر فایل، dropzone، metadata و دانلود روشن، اندازهٔ preview مؤثر، slots؛ لغو داخلی معادل کنترل لغو در UI نیست |
| FormWrapper و DynamicFields | reset، خطای سرور، dirty guard، object/array و شرایط دارند | Field استاندارد، فرم افقی/عمودی/فشرده، چیدمان مبتنی بر عرض ظرف، registry نمایش/ورود و wizard |
| Table/BaseDataTable/EntityList | جدول سروری، sort، selection، pagination و action دارند | column definition مشترک، appearance/density، slots، pagination مستقل، نمایش/ترتیب/عرض ستون، sticky و virtualization اختیاری |
| Modal/Confirmation/Drawer/BottomSheet | overlayهای کاربردی با رفتار متفاوت | زیرساخت Dialog مشترک، start/end، focus و stack، container پورتال و طراحی scoped، controlled API و slots |
| Accordion/Stepper/Breadcrumb/Tooltip/Dropdown | نمونه‌های قابل استفاده وجود دارند | الگوهای accessible، controlled/uncontrolled، جهت و ترجمه، motion policy؛ Tooltip مبتنی بر Radix پایهٔ مناسبی است |
| Layout و containerها | Layout اسلات header/sidebar می‌گیرد؛ wrapperهای صفحه/نمایش موجودند | عرض/تراکم/spacing قابل تنظیم، direction ارثی، responsive داخل Drawer/Modal، جداسازی navigation برنامه از shell عمومی |
| Loading/error/placeholder و toast | Spinner/overlay و placeholder صفحه وجود دارند؛ Sonner در لایهٔ برنامه است | Skeleton/EmptyState/Alert/Progress مشترک، token یکسان، ترجمه و aria-live، wrapper عمومی Toast؛ این قابلیت‌ها همگی از صفر غایب نیستند |

## معماری پیشنهادی برای core ثابت و قابل سفارشی‌سازی

### ۱. لایه‌های مسئولیت

```text
contracts       تعریف موجودیت، نوع داده، validation و تبدیل API
behavior        state، تعامل، query و hooks قابل استفاده بدون ظاهر خاص
ui              کامپوننت‌ها، ظاهر پیش‌فرض، variantها و slotهای عمومی
entity-runtime  فرم، فهرست و جزئیات با استفاده از ui مشترک
project         theme، ترجمه، adapter، replacement و extension اختصاصی
generator       تولید تعریف و اتصال پروژه به API عمومی core
```

ابتدا این مرزها می‌توانند داخل همین مخزن باشند. انتشار به‌شکل `@org/core` با subpathهایی مانند `/ui`، `/entity` و `/styles.css` مرحلهٔ بعدی است؛ از ابتدا به monorepo بزرگ یا بستهٔ مستقل برای هر کامپوننت نیاز نیست. UI پایه باید بتواند بدون router، سرویس و Auth برنامه مصرف شود؛ وابستگی‌های CRUD در entry مربوط به entity باقی بمانند.

### ۲. سه سطح تغییر ظاهر، به‌علاوهٔ جایگزینی ساختار

| نیاز پروژه | مکان اعمال | مثال |
| --- | --- | --- |
| تغییر هویت طراحی تمام پروژه | theme و semantic tokens | رنگ برند، فونت، radius، تراکم و حالت تیره |
| تغییر همهٔ نمونه‌های یک کامپوننت | تنظیمات UI پروژه | تمام Buttonها کوچک‌تر یا تمام Dialogها با header متفاوت |
| تغییر فقط یک نمونه | props و کلاس slotهای همان نمونه | submit خاص، border جدول خاص، label متفاوت |
| تغییر markup یا رفتار ترکیبی | component registry یا wrapper پروژه | DatePicker اختصاصی یا فرم رابطهٔ کاملاً متفاوت |

رنگ و فونت پروژه باید از تغییر theme بیاید؛ تنظیم component برای تفاوت‌های مربوط به همان نوع کنترل باشد. تغییر ساختار کامل با token حل نمی‌شود و باید extension رسمی داشته باشد.

در resolution تنظیمات، ترتیب پیشنهادی «پیش‌فرض core → تنظیم پروژه → تنظیم صفحه/موجودیت → props همان نمونه» است. برای کلاس‌های Tailwind، `cn` در هر slot با همین ترتیب اجرا شود. ترتیب CSS نیز با layerهای مشخص و بدون `!important` در پیش‌فرض‌ها تعریف شود. صرف نوشتن className در انتهای یک رشته، تضمین‌کنندهٔ غلبه در cascade نیست.

### ۳. قرارداد توکن‌ها

توکن‌ها باید رنگ، foreground مناسب، border، focus، disabled، typography، spacing، اندازهٔ کنترل، radius، shadow، z-index و motion را پوشش دهند. رنگ brand باید همراه رنگ متن مناسب و حالت‌های hover/active تعریف شود؛ تغییر رنگ به‌تنهایی تضمین کنتراست نیست.

نام‌های اختصاصی مانند `--core-*` از برخورد با Tailwind و stylesheet پروژه جلوگیری می‌کنند. توکن‌های semantic مانند action/surface/text/status برای همهٔ اجزا مشترک باشند؛ توکن component فقط برای تفاوت خاص آن کنترل و با fallback به semantic استفاده شود.

نمونهٔ پیشنهادی، با resolve شدن fallback روی خود کامپوننت:

```css
/* core: default design */
@layer theme {
  :root {
    --core-action-bg: #6366f1;
    --core-action-fg: #ffffff;
    --core-radius: 0.5rem;
  }
}

@layer components {
  .core-button {
    background: var(--core-button-bg, var(--core-action-bg));
    color: var(--core-button-fg, var(--core-action-fg));
    border-radius: var(--core-button-radius, var(--core-radius));
  }
}

/* project: any component inside this scope uses the project brand */
@layer project {
  [data-brand="acme"] {
    --core-action-bg: #0f766e;
    --core-radius: 0.875rem;
  }
}

/* Tailwind v4 bridge */
@theme inline {
  --color-primary: var(--core-action-bg);
  --color-primary-foreground: var(--core-action-fg);
}
```

این فقط نمونهٔ قرارداد است؛ فایل واقعی باید stateها و dark mode را هم کامل کند. aliasهایی که روی root resolve می‌شوند می‌توانند override در scope فرزند را بی‌اثر کنند؛ fallback روی مصرف‌کننده یا تعریف alias در خود scope جلوی این مشکل را می‌گیرد. Tailwind برای ارجاع theme به متغیر دیگر، `@theme inline` را توضیح داده است. [مستندات رسمی theme](https://tailwindcss.com/docs/theme)

Tailwind و reset فقط در ورودی مشخص وارد شوند؛ فایل theme دوباره Tailwind را import نکند. قانون‌های عمومی `div/button` از حالت فعلی خارج شوند. ترتیب layerها مثلاً `theme, base, components, project, utilities` صریح باشد؛ theme پروژه و overrideهای dark با scope سازگار تعریف شوند. فونت از token و تنظیم زبان بیاید، نه `div { font-family: ... !important }`.

### ۴. API عمومی کامپوننت‌ها

- props بومی HTML، event واقعی، `aria-*`، `data-*` و ref برای کنترل پایه عبور داده شوند؛ React 19 فعلی برای این قرارداد مناسب است.
- `className` و `style` برای root؛ `classNames` برای slotهای مستند مثل input/label/error/icon/content؛ `slotProps` فقط برای کنترل‌هایی که به props داخلی نیاز دارند.
- `size`، `appearance` و tone معنایی هماهنگ؛ لازم نیست هر کامپوننت تمام حالت‌ها را داشته باشد، اما مفهوم مشترک باشد.
- برای کنترل‌های stateدار، controlled/uncontrolled روشن مانند `value/defaultValue/onValueChange` و `open/defaultOpen/onOpenChange`؛ نبود Provider فرم مانع استفاده از primitive نشود.
- Input/Select/Checkbox مستقل از RHF باشند و FormInput/FormSelect adapter همان کنترل‌ها باشند. `Field` مسئول label/help/error، id یکتا و اتصال aria باشد.
- slot و `data-state` عمومی به‌عنوان API نسخه‌دار مستند شوند؛ مصرف‌کننده به selectorهای داخلی و ترتیب DOM وابسته نشود.
- override عمومی Button/Dialog/DataTable باید در EntityPages و wrapperهای generated واقعاً مصرف شود؛ پوشاندن Provider دور دکمه‌های خام این هدف را محقق نمی‌کند.

نمونهٔ مصرف پیشنهادی برای تغییر یک نمونه:

```tsx
<Button
  appearance="outline"
  size="sm"
  className="w-full"
  classNames={{ icon: "size-4" }}
  aria-label={t("actions.save")}
>
  {t("actions.save")}
</Button>
```

برای تفاوت کاملاً ساختاری، registry تایپ‌شدهٔ UI در یک Provider مخصوص UI یا بخشی جدا از config اضافه شود. replacement باید قرارداد ref، props، accessibility و تم را رعایت کند. `unstyled` می‌تواند امکان پیشرفتهٔ بعدی باشد؛ مسیر پیش‌فرض باید همان طراحی کامل core باقی بماند.

### ۵. انتشار و مصرف پایدار

core به‌صورت dependency نسخه‌دار یا workspace package مصرف شود؛ فایل‌های آن در هر پروژه دستی ویرایش نشوند. export عمومی کامپوننت و type، CSS قابل import، peer dependencyها و نسخهٔ سازگار schema/generator مشخص شوند. migration و deprecation برای تغییر API لازم است.

اگر core به node_modules منتقل شود، Tailwind به‌صورت پیش‌فرض فایل‌های آن را اسکن نمی‌کند. یا CSS کامپایل‌شده همراه بسته منتشر شود، یا `@source` دقیق و مستند برای مصرف‌کننده ارائه شود. کلاس‌های متادیتا باید کامل و قابل اسکن باشند؛ `sm:col-span-${n}` با mapping ثابت یا CSS مناسب جایگزین شود. [مستندات رسمی اسکن کلاس‌ها](https://tailwindcss.com/docs/detecting-classes-in-source-files)

## RTL و LTR کامل

۱. یک مالک مشخص در لایهٔ برنامه، `html.lang` و `html.dir` را با زبان فعال هماهنگ کند. Providerهای تو‌در‌توی lookup نباید هرکدام document را تغییر دهند. جهت پیش‌فرض از پیکربندی زبان بیاید و override موضعی هم ممکن باشد.

۲. جهت صریح ثابت از کامپوننت‌های عمومی حذف یا با prop/context جایگزین شود. `text-start/end`، `ms/me`، `ps/pe`، `start/end` و border/radius منطقی جای موقعیت‌های وابسته به زبان را بگیرند. موقعیت واقعاً فیزیکی فقط وقتی API صریحاً چنین معنایی دارد حفظ شود. [راهنمای W3C برای جهت](https://www.w3.org/International/questions/qa-html-dir)، [خواص منطقی CSS](https://www.w3.org/TR/css-logical-1/)

۳. Drawer به‌طور پیش‌فرض `side="start"` یا `"end"` بگیرد. Dropdown/Popover موقعیت منطقی و collision داشته باشند؛ separator مسیر و فلش حرکت با جهت هماهنگ شوند. تمام آیکون‌ها نباید mirror شوند؛ فقط آیکون‌هایی که معنای جهت دارند.

۴. در بخش Radix، Direction Provider نیز وصل شود تا تعامل primitiveها با جهت هماهنگ باشد؛ فقط تغییر CSS یا `html.dir` جای این context را نمی‌گیرد. [Direction Provider رسمی](https://www.radix-ui.com/primitives/docs/utilities/direction-provider)

۵. portal به‌صورت ویژه بررسی شود: context React همراه portal می‌ماند، اما ارث‌بری CSS و جهت از DOM می‌آید. popup باید داخل portal root همان ThemeScope رندر شود یا theme/dir روی ریشهٔ portal به‌درستی اعمال شود. theme سفارشی داخل یک subtree نباید هنگام باز شدن Dialog از بین برود.

۶. email، URL، کد، شناسه و بعضی ورودی‌های عددی جهت مستقل لازم دارند؛ متن محتوایی می‌تواند `dir="auto"` یا `bdi` بگیرد. تغییر جهت کل فرم نباید خوانایی این داده‌ها را خراب کند.

۷. حالت موبایل، جدول عریض، keyboard افقی Tabs و Stepper، animation و reduced motion برای هر دو جهت بررسی شوند. پنهان‌کردن overflow کل body جای حل overflow کنترل‌ها را نمی‌گیرد.

## چندزبانگی واقعی

### پیشنهاد اتصال

برای این پروژه `i18next + react-i18next` انتخاب مناسبی است: namespaceهای جدا برای `core`، `validation` و موجودیت‌ها، بارگذاری تدریجی و تغییر زبان در runtime. تایپ کلیدها با امکانات TypeScript آن فعال شود؛ selector API برای منابع بزرگ گزینهٔ اختیاری است. core یک adapter کوچک ترجمه بگیرد تا منطق دامنه به singleton سراسری کتابخانه وابسته نشود. [namespace و hook رسمی](https://react.i18next.com/latest/usetranslation-hook)، [تایپ‌پذیری رسمی](https://www.i18next.com/overview/typescript)

تمام متن‌های عمومی، aria-labelها، پیام‌های loading/error/empty، toast، Dialog و validation وارد منابع ترجمه شوند. رشتهٔ کامل ترجمه شود؛ کنار هم گذاشتن «ایجاد» و نام موجودیت یا افزودن «ها/s» برای همهٔ زبان‌ها مناسب نیست. شمارنده‌ها با `count` و قواعد plural زبان تولید شوند. [جمع‌بندی زبانی در i18next](https://www.i18next.com/translation-function/plurals)

### قرارداد metadata و generator

- `labelKey`، `placeholderKey`، کلید عنوان موجودیت/منو و label گزینه‌های enum اضافه شوند؛ `label` فعلی fallback سازگار با پروژه‌های موجود بماند. بین متن و key با جستجوی نقطه در رشته حدس زده نشود.
- type، Zod schema و parser YAML هم‌زمان تغییر کنند؛ schemaهای فعلی strict هستند و افزودن تنها یک خصوصیت در YAML کافی نیست.
- پیکربندی پروژه شامل supported/default/fallback locale و تنظیم جهت هر زبان باشد. runtime موجود از locale/calendar/direction پشتیبانی جزئی دارد؛ generator هنوز قرارداد پروژه برای این نیازها ندارد.
- کلیدهای ترجمه ثابت و مستقل از متن فارسی تولید شوند. فایل ترجمهٔ ویرایش‌شدهٔ پروژه بازنویسی نشود؛ کلیدهای تازه با merge قابل پیش‌بینی اضافه و کلیدهای مفقود در CI گزارش شوند.
- تغییر زبان، عنوان صفحه، breadcrumb، منو و خطاهای validation موجود روی صفحه را هم به‌روز کند. error map سراسری متغیر برای چند Provider با locale متفاوت مناسب نیست؛ تولید پیام در مرز فرم/adapter انجام شود.
- locale درخواست HTTP نیز همگام شود؛ `configureApi` فعلی تنظیم زبان مستقل دارد. اگر API دادهٔ ترجمه‌شده برمی‌گرداند، locale باید در هویت cache یا سیاست invalidation آن لحاظ شود.

### تفکیک زبان از فرمت داده

زبان UI، `direction`، تقویم، numbering system، timezone و currency تنظیمات جدا باشند. مثال معتبر: UI انگلیسی با تقویم شمسی یا UI فارسی با تقویم میلادی. DatePicker فعلی انتخاب locale را به calendar گره زده است.

برای نمایش از `Intl.DateTimeFormat`، `Intl.NumberFormat` و ابزارهای مرتبط استفاده شود؛ instant در timezone انتخابی نمایش داده شود. date-only و local datetime بدون تبدیل ناخواستهٔ timezone حفظ شوند. ورودی ارقام فارسی/عربی به مقدار canonical تبدیل شود، بدون تبدیل ناامن LONG و decimal دقیق به Number. فرمت محلی نمایش، قرارداد API را تغییر ندهد.

ترجمهٔ UI با چندزبانه‌بودن محتوای رکورد دو نیاز جدا هستند. مثلاً عنوان فارسی/انگلیسی محصول به قرارداد دادهٔ ترجمه‌ها، فیلدهای زبان و validation خودش نیاز دارد؛ نصب i18next این مسئله را حل نمی‌کند.

برای سایت عمومی با نیاز SEO، تولید route زبان، عنوان/meta، hreflang و خروجی SSR/SSG باید در profile مربوط به سایت بررسی شود. ادامهٔ Vite برای پنل فعلی منطقی است؛ مهاجرت عمومی تمام core به فریم‌ورک دیگر پیش‌شرط این اصلاحات نیست.

## تکنولوژی‌های پیشنهادی

| بخش | انتخاب پیشنهادی و دلیل |
| --- | --- |
| React و استایل | React 19 و Tailwind 4 فعلی حفظ شوند؛ CSS variables، layerهای روشن، logical properties، `@theme inline` و container query برای کنترل داخل ظرفهای مختلف استفاده شوند |
| variant و class merge | CVA و `clsx/tailwind-merge` موجود به‌صورت مشترک استفاده شوند؛ تنظیم component و slot بالای این ابزارها تعریف شود |
| تعامل پیچیده | با توجه به Radix موجود، Dialog/Menu/Popover/Tabs/Accordion را روی primitives مشترک آن استاندارد کنید؛ نوشتن دستی focus و keyboard در هر فایل هزینهٔ نگهداری را زیاد می‌کند. [Radix Primitives](https://www.radix-ui.com/primitives) |
| تاریخ و ورودی چندفرهنگی | React Aria Components و `@internationalized/date` گزینهٔ مناسب برای ارزیابی DatePicker/DateRange هستند. پیش از جایگزینی، رفتار شمسی، keyboard، bundle و قرارداد date/datetime/instant نمونه‌سازی شود؛ تعویض فوری تمام کنترل‌های فعلی لازم نیست. [DatePicker](https://react-aria.adobe.com/DatePicker)، [Calendar](https://react-aria.adobe.com/Calendar) |
| جدول پیشرفته | TanStack Table به‌عنوان موتور headless برای ستون‌ها و state؛ ظاهر همچنان core باشد. قابلیت‌هایی مثل visibility/sizing/pinning مرحله‌ای اضافه شوند؛ virtualization تنها برای حجم واقعی نیاز است. [مستندات رسمی](https://tanstack.com/table/latest/docs/overview) |
| فرم و داده | React Hook Form، Zod و TanStack Query فعلی حفظ شوند. وجود Zod 4 در dependency به معنی مصرف API v4 نیست؛ بخش‌های core فعلاً `zod/v3` وارد می‌کنند. ارتقا همراه migration و تست قرارداد انجام شود |
| ترجمه | i18next و react-i18next با adapter و کلیدهای تایپ‌شده؛ detector یا backend فقط در صورت نیاز profile پروژه اضافه شوند |
| کاتالوگ و کیفیت | Storybook برای حالت‌ها و مستندات زنده، accessibility addon و Playwright برای تعامل و مقایسهٔ تصویر. تست خودکار دسترس‌پذیری جای تست keyboard و بررسی انسانی را نمی‌گیرد. [مستندات رسمی تست accessibility](https://storybook.js.org/docs/writing-tests/accessibility-testing) |

انتخاب نهایی نسخه‌ها باید با peer dependencyهای این پروژه lock و آزمایش شود. استفاده از فناوری فعلی به معنی ارتقای هم‌زمان و بی‌هدف تمام وابستگی‌ها نیست. Radix مبنای مشترک پروژه باقی بماند؛ React Aria برای کنترل‌هایی که نیاز چندفرهنگی مشخص دارند ارزیابی شود تا دو سیستم رفتاری موازی برای هر کنترل ساخته نشود.

## چه کامپوننت‌هایی اضافه شوند؟

### اولویت اول: اجزای مشترک اکثر پروژه‌ها

| دسته | اجزای موردنیاز | وضعیت نسبت به کد فعلی |
| --- | --- | --- |
| چارچوب فرم | `Field`، `FieldLabel`، `FieldDescription`، `FieldError`، `FormSection` | قطعات label/error هست؛ قرارداد ترکیبی مشترک لازم است |
| دکمه و لینک | `IconButton`، `ButtonGroup` و Link ظاهری هماهنگ | Button و linkهای فعلی توسعه و یکدست شوند |
| انتخاب ساده | `RadioGroup`، `Switch`، checkbox سه‌حالته | API عمومی این کنترل‌ها موجود نیست |
| ورود اطلاعات | `SearchField`، `NumberField`، `CurrencyField`، `InputGroup` | ورودی متن/عدد هست؛ کنترل locale-aware و ترکیب addon لازم است |
| انتخاب پیشرفته | `Combobox/AsyncSelect` مستقل از فرم، `MultiSelect` با tag | FormAutoComplete هست؛ primitive عمومی و reusable لازم است |
| تاریخ و ساعت | `TimeField/TimePicker`، `DateRangePicker` | تاریخ و زمان ترکیبی موجود است؛ کنترل مستقل ساعت و بازه لازم است |
| چیدمان و نمایش | `Card` ترکیبی، `Badge/StatusBadge`، `Separator`، `Stack/Grid/Container` | wrapper صفحه هست؛ primitives طراحی عمومی کامل نیستند |
| بازخورد | `Alert`، `EmptyState`، `Skeleton`، `Progress` و Toast عمومی | حالت‌های پراکنده و Sonner موجودند؛ استانداردسازی و export لازم است |
| navigation و overlay | `Tabs` عمومی، `Popover`، `DropdownMenu` کامل، `Pagination` مستقل | وابستگی/پیاده‌سازی جزئی وجود دارد؛ API کامل reusable لازم است |
| تنظیمات محصول | `LanguageSwitcher` و `ThemeSwitcher` متصل به Provider | انتخابگر عمومی هماهنگ با runtime وجود ندارد |

### اولویت دوم: پنل و CRUD پیشرفته

- `DataTableToolbar`، `ColumnVisibilityMenu`، `BulkActionBar`، sort header و مدیریت تراکم/ستون؛ export و virtualization در صورت نیاز محصول.
- `FilterBuilder` و `FilterChips` برای عملگرها، گروه‌های AND/OR و فیلتر ذخیره‌شده؛ فرم فیلتر فعلی نقطهٔ شروع است.
- `FormWizard` برای اتصال Stepper به validation و ذخیرهٔ مرحله‌ای؛ `FieldArray/Repeater` عمومی روی منطق تو‌در‌توی موجود.
- `Dropzone` و صف فایل با cancel/retry، پیشرفت هر فایل و پیش‌نمایش؛ روی adapter فعلی ساخته شوند.
- `Tree/TreeSelect` و `CommandPalette` برای ساختارهای سلسله‌مراتبی و navigation بزرگ.
- `Avatar`، `DescriptionList`، `CopyButton/CopyField` و `Timeline` برای نمایش اطلاعات متداول.
- `AppShell` و Sidebar/Navigation قابل پیکربندی، روی Layout تزریقی موجود؛ منوهای مخصوص این محصول در لایهٔ پروژه باقی بمانند.

### اولویت سوم: افزونه‌ها و سایت عمومی

RichText/Markdown editor، chart، map، calendar scheduler، drag-and-drop، media gallery و ورودی‌هایی مثل تلفن/OTP/رنگ/slider براساس محصول اضافه شوند. این موارد، به‌ویژه ویرایشگر و نقشه، بهتر است بسته یا feature اختیاری و lazy باشند تا همهٔ پروژه‌ها هزینهٔ آن‌ها را نپردازند.

برای جنریتور سایت عمومی، علاوه بر primitives به catalog بلوک‌های `Navbar/Header`، `Footer`، `Hero`، `FeatureGrid`، `Pricing`، `FAQ`، `CTA`، فرم تماس و بخش محتوا نیاز است. این‌ها بلوک‌های ترکیبی روی core UI هستند و بهتر است در لایهٔ blocks قرار بگیرند؛ LandingPage محصول فعلی معادل کاتالوگ reusable نیست.

## ترتیب اجرای پیشنهادی و معیار پایان

| مرحله | خروجی | معیار پذیرش |
| --- | --- | --- |
| ۱. قرارداد و نمونهٔ مرجع | توکن‌ها، precedence، slotها و API روی Button، Field/Input، Dialog و Table | یک صفحه با طراحی default و دو برند متفاوت بدون تغییر core اجرا شود؛ instance override روی همان صفحه کار کند |
| ۲. زبان و جهت | i18n adapter، منابع core، root lang/dir، Radix direction و portal scope | تغییر زندهٔ fa ↔ en و یک locale دیگر بدون reload؛ Modal/Select/Toast هم درست تغییر کنند |
| ۳. یکدست‌سازی موجودها | مصرف UI مشترک در EntityPages، اصلاح keyboard/ref/Label، حذف فرض‌های ثابت | یک entity در صفحه، Modal و Drawer با عرض متفاوت درست کار کند؛ submit ناخواسته و focus گمشده نداشته باشد |
| ۴. اتصال جنریتور | metadata presentation/translation، config پروژه و مالکیت منابع | entity تازه کلید و wrapper لازم را تولید کند؛ regenerate طراحی و ترجمهٔ دستی را حفظ کند |
| ۵. گسترش کاتالوگ | کامپوننت‌های اولویت اول، سپس advanced/blocks | هر کامپوننت همراه docs، stateهای واقعی، keyboard و پوشش جهت/تم عرضه شود |
| ۶. بسته‌بندی پایدار | export/CSS/versioning و پروژهٔ مصرف‌کنندهٔ مستقل | core بدون کپی سورس نصب شود؛ CSS production و tree shaking در مصرف‌کنندهٔ تازه تأیید شود |

برای شروع، یک نمونهٔ مرجع کوچک شامل فرم، جدول، Dialog و autocomplete بهتر از اضافه‌کردن هم‌زمان ده‌ها کنترل است. نمونه باید واقعاً دو پروژهٔ طراحی متفاوت را ثابت کند؛ صرف نمایش چند رنگ روی Button کافی نیست.

ماتریس پذیرش شامل default و دو تم پروژه، light/dark، RTL/LTR، زبان‌های منتخب، عرض موبایل/دسکتاپ و ظرف باریک، حالت‌های loading/error/disabled/readOnly/empty و استفادهٔ مستقل/RHF باشد. سناریوهای حساس: دو Dialog تو‌در‌تو، theme scoped با portal، تغییر زبان با خطاهای موجود، جدول بدون داده و با دادهٔ طولانی، ارقام فارسی/عربی، تاریخ مرزی timezone، کنتراست حالت‌های فعال و کنترل فقط با keyboard. سناریوهای ترکیبی هدفمند کافی‌اند؛ اجرای ضرب کامل همهٔ حالت‌ها برای هر تغییر لازم نیست.

**پیشنهاد اقدام بعدی:** تصویب قرارداد همین چهار جزء مرجع و پیاده‌سازی زیرساخت طراحی/زبان/جهت آن‌ها؛ سپس انتقال بقیهٔ کامپوننت‌ها و قالب‌ها به این قرارداد و در نهایت افزایش تعداد کامپوننت‌ها.
