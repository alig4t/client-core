# برنامهٔ اجرایی معماری UI و core نسخه‌دار

تاریخ شروع: ۲۰۲۶/۱۱/۱۹

مبنای این برنامه، مطالعهٔ کامل [بررسی معماری](CORE_COMPONENTS_ARCHITECTURE_REVIEW.fa.md) و بررسی کد فعلی است. برنامهٔ قبلی در `IMPLEMENTATION_PLAN.md` مربوط به تکمیل قرارداد CRUD و جنریتور است؛ تکمیل آن به معنای تکمیل معماری UI نیست.

## قرارداد هدف و مرز تغییرات

- core مالک رفتار، API، توکن‌های پیش‌فرض و slotهای مستند است؛ پروژه مالک برند، تنظیم کامپوننت، ترجمه، replacement و extension است.
- ترتیب تنظیمات: پیش‌فرض core ← Provider پروژه ← Provider صفحه/موجودیت ← props نمونه. کلاس‌ها در هر slot با `cn` ادغام می‌شوند؛ `className` و `style` به root می‌رسند.
- UI پایه entry مستقل `src/core/ui/index.ts` دارد و به Auth، router، service و QueryClient وابسته نیست. انتشار پکیج و subpathهای npm در مرحلهٔ ششم انجام می‌شود.
- مسیرهای import قبلی، permission، loading، ref، مقدارهای false/zero، دقت long/decimal، قرارداد تاریخ و رفتار CRUD باید حفظ شوند. `FormInput.className` به دلیل سازگاری همچنان wrapper است؛ `classNames.input` برای خود کنترل اضافه می‌شود.
- ظاهر پیش‌فرض از CSS داخل core می‌آید. Tailwind/reset فقط در ورودی برنامه وارد می‌شوند؛ پیش‌فرض core در layer قرار می‌گیرد تا utilities نمونه قابل اعمال باشند.
- افزودن metadata فقط با تغییر هم‌زمان type، schema سخت‌گیر و parser جنریتور مجاز است. خروجی generated و فایل پروژه مالکیت جدا دارند.

## مرحلهٔ صفر — خط مبنا

خروجی: ثبت وضعیت مخزن و اجرای تست‌های موجود پیش از تغییر. سند معماریِ کاربر حفظ می‌شود. تست پایه در شروع: ۵۲ تست در ۵ فایل موفق.

معیار پایان: نتیجهٔ تست‌های قبل و بعد قابل مقایسه باشد؛ فایل generated یا wrapper پروژه بدون نیاز بازنویسی نشود.

## مرحلهٔ یک — قرارداد طراحی و نمونهٔ مرجع

خروجی‌ها:

1. `CoreUIProvider` مستقل با تنظیمات تایپ‌شده برای Button، Input، Field، Dialog و Table، registry و ادغام Providerهای تو‌در‌تو.
2. `ThemeScope` با توکن‌های `--core-*`، حالت روشن/تیره، جهت موضعی و container پورتال در همان scope.
3. Button با props/ref بومی، tone/appearance/size و slot؛ Input مستقل؛ Field با id یکتا، label/help/error؛ Dialog روی Radix موجود؛ Table معنایی با slot و حالت empty.
4. اتصال مسیرهای موجود Button، Modal، FormInput و Table به UI مشترک؛ اتصال submit فرم موجودیت به Button مشترک.
5. حذف CSS عمومی مزاحم button/div و import تکراری Tailwind؛ حفظ متغیرهای قدیمی برای بخش‌های مهاجرت‌نکرده.
6. صفحهٔ مرجع توسعه در `/__core-ui.html` با default و دو برند با تفاوت فونت، فاصله، radius، تنظیم نوع کامپوننت و override نمونه؛ فرم RHF، autocomplete فعلی، جدول و Dialog.

معیار پایان: برندها بدون ویرایش core کار کنند؛ override پروژه/صفحه/نمونه و replacement واقعاً رندر شوند؛ ظاهر و جهت Dialog در پورتال حفظ شوند؛ فرم فعلی و تست‌های CRUD همچنان موفق باشند.

تست‌ها: قرارداد precedence و registry، ref/event/aria، focus خطای RHF، id دو فرم، precision، تست واقعی مرورگر برای computed style و cascade، دو Dialog تو‌در‌تو، Escape/Tab/restore focus، RTL/LTR، dark/light، viewport باریک و حالت empty/disabled/loading/readOnly. سپس typecheck، lint، unit، E2E، build، generator build و regeneration check.

## مرحلهٔ دو — چندزبانگی و جهت کامل

خروجی‌ها: adapter ترجمهٔ مستقل از singleton؛ اتصال i18next/react-i18next و کلیدهای تایپ‌شده؛ منابع core/validation برای fa، en و ar؛ مالک واحد `html.lang/dir` در لایهٔ برنامه؛ Direction Provider مشترک Radix؛ ترجمهٔ متن/aria/toast و خطاهای موجود بدون reload. Providerهای lookup فقط context محلی را تغییر می‌دهند.

زبان UI، جهت، تقویم، numbering system، timezone و currency تنظیمات مستقل خواهند بود. `date` و `datetime` محلی بدون تبدیل timezone؛ فقط `instant` با timezone نمایش داده می‌شود. ورودی ارقام فارسی/عربی بدون تبدیل ناامن long/decimal نرمال می‌شود. locale درخواست HTTP و هویت cache دادهٔ ترجمه‌شده همگام می‌شوند.

معیار پایان: تغییر زندهٔ fa ↔ en ↔ ar شامل Modal/Select/Toast، عنوان، breadcrumb و validation؛ دو subtree با زبان متفاوت و بدون دخالت در document؛ انگلیسی با تقویم شمسی و فارسی با میلادی.

تست‌ها: نبود کلید ترجمه، plural، fallback label، تغییر زبان با خطای موجود، portal، Radix keyboard، cache locale، ارقام و مرز timezone. موارد P0 متن/جهت تا پایان این مرحله و مهاجرت مرحلهٔ سه بسته نمی‌شوند.

## مرحلهٔ سه — مهاجرت runtime و کامپوننت‌های موجود

خروجی‌ها: تمام actionهای EntityPages و فرم/نمایش/فیلتر از UI مشترک؛ adapterهای Select/Checkbox/Date/Upload؛ id/ref/label یکپارچه؛ Dialog مشترک برای Drawer/BottomSheet/Confirmation؛ side منطقی start/end؛ Dropdown/Tabs/Accordion با رفتار صفحه‌کلید؛ mapping ثابت colSpan؛ رفع props بی‌اثر مانند previewSize.

معیار پایان: یک موجودیت در صفحه، Dialog و Drawer باریک با همان تنظیم پروژه اجرا شود؛ submit ناخواسته، focus گمشده، محتوای بستهٔ قابل Tab و جهت ثابت وجود نداشته باشد؛ امکانات فعلی فایل/رابطه/فرم تو‌در‌تو حفظ شوند.

تست‌ها: lifecycle کامل CRUD و فیلتر، keyboard/focus overlayها، لغو درخواست autocomplete و upload، read/write permission، فرم تکراری و خطای سرور، layout production و عرض ظرف. جایگزینی DatePicker فقط پس از prototype و تست دو تقویم انجام شود.

## مرحلهٔ چهار — اتصال metadata و جنریتور

خروجی‌ها: `labelKey`، `placeholderKey` و کلید عنوان/منو/enum همراه fallback متن فعلی؛ presentation صفحه/موجودیت؛ config supported/default/fallback locale و جهت؛ تولید کلید پایدار و merge ترجمه‌های پروژه؛ استفادهٔ templateها از API عمومی.

معیار پایان: entity جدید با theme و زبان پروژه کار کند؛ regenerate فایل ترجمه، طراحی، wrapper و extension دستی را حفظ کند؛ schema نامعتبر با پیام روشن رد شود.

تست‌ها: parser/type/schema و نمونه‌های metadata قدیمی و جدید، مالکیت فایل، merge ترجمه، تولید تکرارپذیر و `generate:check`؛ تست مرورگر روی خروجی تازهٔ جنریتور.

## مرحلهٔ پنج — توسعهٔ کاتالوگ

ابتدا Field/FormSection، IconButton/ButtonGroup، RadioGroup/Switch، Search/Number/Currency/InputGroup، AsyncSelect/MultiSelect، Time/DateRange، Card/Badge/Separator/Stack/Grid، Alert/EmptyState/Skeleton/Progress، Tabs/Popover/Menu/Pagination و Language/ThemeSwitcher. سپس جدول/فیلتر پیشرفته، wizard، dropzone و shell؛ editor/map/chart و blocks سایت تنها براساس نیاز و به‌صورت اختیاری/lazy.

معیار پایان هر جزء: API و slotهای مستند، stateهای واقعی، keyboard، ref/aria، RTL/LTR، light/dark و کاربرد مستقل و RHF. ابزارهای پیچیده پس از ارزیابی dependency اضافه شوند؛ ارتقای هم‌زمان و بی‌هدف کتابخانه‌ها جزو این برنامه نیست.

تست‌ها: کاتالوگ Storybook و accessibility، سناریوهای Playwright و visual regression هدفمند؛ آزمون انسانی keyboard و کنتراست نیز لازم است.

## مرحلهٔ شش — انتشار نسخه‌دار

خروجی‌ها: پکیج قابل نصب با entryهای ui/entity/contracts و CSS کامپایل‌شده، type declaration، peer dependencies، SemVer، changelog، deprecation/migration و ماتریس سازگاری schema/generator. نام scope پکیج هنگام آماده‌شدن انتشار انتخاب می‌شود.

معیار پایان: مصرف‌کنندهٔ مستقل از tarball بدون کپی source و بدون router/Auth برای UI اجرا شود؛ CSS production، dark/scoped theme و tree shaking تأیید شوند؛ legacy importها مسیر مهاجرت مستند داشته باشند. انتشار خارجی جزو پیاده‌سازی محلی نیست.

تست‌ها: build/pack و نصب در fixture مستقل، بررسی exports/types/CSS، جلوگیری از ورود وابستگی برنامه به ui، bundle smoke و اجرای مرورگر مصرف‌کننده.

## ثبت پیشرفت

- مرحلهٔ صفر: انجام شد؛ ۵۲ تست موجود موفق.
- مرحلهٔ یک: پیاده‌سازی شد؛ API مستقل، تنظیمات و registry، تم scoped، پنج جزء مرجع، adapterهای قبلی و نمونهٔ default/ocean/paper موجودند. برخورد id در autocomplete فرم‌های هم‌نام نیز در تست مرجع کشف و رفع شد.
- مراحل دو تا شش: برنامه‌ریزی‌شده؛ تکمیل پشتیبانی سراسری زبان/جهت و انتشار پکیج هنوز ادعا نمی‌شود.

| بررسی پایان مرحلهٔ یک | نتیجه |
| --- | --- |
| `npm run typecheck` | موفق؛ برنامه و تست‌ها |
| `npm run lint` | موفق |
| `npm test` | ۶۷ تست در ۷ فایل؛ شامل ۵۲ تست قبلی، ۱۳ تست قرارداد UI و ۲ تست پوشش کاتالوگ |
| `npm run test:e2e` | ۱۹ سناریو؛ ۵ سناریوی قبلی CRUD، ۹ سناریوی مرجع و ۵ سناریوی کاتالوگ |
| `npm run build` | موفق؛ نمونهٔ توسعه وارد bundle محصول نمی‌شود |
| `npm run generator:build` | موفق |
| `npm run generate:check` | موفق؛ changed و preserved خالی |

تست‌های مرورگر UI هر سه طراحی را در ترکیب‌های RTL/روشن/۳۹۰px، LTR/روشن/۱۲۸۰px، RTL/تیره/۱۲۸۰px و LTR/تیره/۳۹۰px بررسی می‌کنند. computed style برای radius، override ورودی، فونت، رنگ پورتال و عرض بررسی می‌شود؛ سناریوهای جدا شامل Dialog تو‌در‌تو، Tab/Escape/restore focus و scroll lock، خطای RHF، long دقیق، autocomplete و جدول empty هستند. کنتراست دکمه‌های primary/success/danger پیش‌فرض در حالت عادی و hover و هر دو تم اندازه‌گیری می‌شود. تصاویر مرجع در `test-results` تولید می‌شوند؛ مقایسهٔ خودکار snapshot تصویری هنوز اضافه نشده است.

تست قدیمی بازگرداندن focus پس از بسته‌شدن Modal، اکنون منتظر lifecycle غیرهم‌زمان Radix می‌ماند؛ انتظار رفتاری حذف نشده است. هشدارهای قبلی bundler دربارهٔ annotationهای Zod، eval وابستگی Lottie و اندازهٔ chunk باقی‌اند. تست‌های CRUD با API شبیه‌سازی‌شده انجام می‌شوند و جای آزمون backend واقعی را نمی‌گیرند.

اصلاح نمونهٔ RTL: متن‌های نمونه و پیام validation در RTL فارسی و در LTR انگلیسی‌اند؛ lang/dir صفحه و پورتال هماهنگ شده‌اند. دکمه‌های مودال در گروه `flex-wrap` با `gap` قرار گرفته‌اند. تست مرورگر فاصلهٔ واقعی دکمه‌ها را در هر سه برند و هر دو جهت و اندازهٔ موبایل/دسکتاپ می‌سنجد؛ تست فرم نیز برای فارسی و انگلیسی اجرا می‌شود. این تغییر محدود به نمونه است و مرحلهٔ دو را تکمیل‌شده نمی‌کند.

گسترش نمونه به کاتالوگ: صفحه اکنون ۶۸ مدخل از کامپوننت‌های موجود و compatibilityها، همراه با حالت‌های props، جستجو، دسته‌بندی و انتخاب طراحی دارد. نمونه‌های فرم، فایل و CRUD با دادهٔ محلی کار می‌کنند. Skeleton عمومی به UI و registry اضافه شده است. آکاردئون روی Radix استاندارد شده؛ جهت برخی wrapperها و Stepper ارثی شده؛ Dropdown بسته از Tab خارج و alignment آن منطقی شده؛ اندازهٔ FilePreview و colSpan ثابت DisplayField اعمال می‌شوند. تکرار فرم‌ها در کاتالوگ نیز با id یکتای Checkbox و FormSelect پوشش داده شده است.

این کاتالوگ بخشی از کار مستندسازی مرحلهٔ پنج را جلو انداخته است؛ به معنای تکمیل مهاجرت تمام APIهای قدیمی، ترجمهٔ داخلی آن‌ها، Storybook، مقایسهٔ خودکار تصویری یا انتشار پکیج نیست. تست مرورگر علاوه بر مرجع قبلی، پوشش مدخل‌ها و نبود id تکراری، جستجو، Skeleton/reduced motion، فایل محلی، شرط فرم، عدد دقیق، password، select/checkbox، تاریخ کنترل‌شده، state جدول، عرض Dialog، Dropdown/Stepper و تم Tooltip در پورتال را بررسی می‌کند.
