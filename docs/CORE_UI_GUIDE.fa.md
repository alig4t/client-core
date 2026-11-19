# قرارداد اولیهٔ UI مشترک

این راهنما مربوط به مرحلهٔ یک [برنامهٔ معماری](CORE_UI_IMPLEMENTATION_PLAN.fa.md) است. API در source موجود است؛ پکیج npm مستقل هنوز منتشر نشده و مهاجرت کامل ترجمه و سایر کنترل‌ها در مراحل بعد انجام می‌شود.

## مصرف و مالکیت تنظیمات

ورودی مستقل `src/core/ui/index.ts` به router، سرویس، احراز هویت و QueryClient وابسته نیست. برنامه Tailwind را یک بار وارد می‌کند و سپس `src/core/ui/styles.css` را؛ theme خود Tailwind/reset را دوباره وارد نمی‌کند. فونت اختصاصی و asset آن متعلق به پروژه است.

```tsx
import { CoreUIProvider, ThemeScope, Button, Field, Input } from "@/core/ui";

<CoreUIProvider value={{
  direction: "ltr",
  components: {
    Button: { defaultProps: { size: "sm" }, classNames: { icon: "size-4" } },
    Dialog: { classNames: { header: "border-b pb-4" } },
  },
}}>
  <ThemeScope tokens={{
    "--core-action-bg": "#0f766e",
    "--core-action-hover": "#115e59",
    "--core-action-fg": "#ffffff",
    "--core-radius": "0.875rem",
  }}>
    <Field label="Title" description="Public title">
      {(control) => <Input {...control} />}
    </Field>
    <Button className="rounded-full">Save</Button>
  </ThemeScope>
</CoreUIProvider>
```

Providerهای تو‌در‌تو defaultProps و کلاس هر slot را ادغام می‌کنند: core ← پروژه ← صفحه ← نمونه. مقدار `undefined` تنظیم قبلی را پاک نمی‌کند؛ `false` و صفر حفظ می‌شوند. `classNames.root` و `className` دو راه تنظیم همان root هستند؛ در یک سطح `className` مقدم است. defaultProps اجازهٔ تزریق `ref`، `style` و children را ندارد؛ native prop و ref نمونه مستقیم به DOM می‌رسند.

`ThemeScope` یک div واقعی با lang/dir محلی و host پورتال می‌سازد. `style` نمونه پس از tokens اعمال می‌شود. Dialog به‌طور پیش‌فرض داخل همین host رندر می‌شود؛ خارج از scope، modal-root برنامه یا body استفاده می‌شود. `portalContainer` صریح مسئولیت حفظ CSS و جهت DOM ظرف سفارشی را به مصرف‌کننده می‌دهد. Providerهای UI به document دست نمی‌زنند؛ مالک زبان/جهت document در مرحلهٔ دو به برنامه اضافه خواهد شد.

## توکن و slot

توکن‌های semantic در [styles.css](../src/core/ui/styles.css) تعریف شده‌اند: action/success/danger با foreground و hover، surface/text/border/focus، فونت، اندازه و فاصلهٔ کنترل، radius، shadow، z-index و motion. توکن‌های component مانند `--core-button-bg`، `--core-input-border` و `--core-dialog-width` روی خود مصرف‌کننده به semantic fallback می‌کنند؛ تغییر برند در subtree قابل ارث‌بری است. تغییر رنگ برند باید foreground و hover مناسب نیز داشته باشد.

پیش‌فرض در layer `components` و ترتیب کلی `theme, base, components, project, utilities` است. CSS پروژه در layer `project` نوشته شود؛ utility نمونه مانند `rounded-full` یا `border-0` بر پیش‌فرض غلبه دارد. `!important` و selector داخلی DOM بخشی از قرارداد نیستند.

slotهای عمومی:

| جزء | root و slotها |
| --- | --- |
| Button | root، icon، label، badge، spinner |
| Input | root؛ اندازهٔ ظاهری `controlSize` است و `size` بومی HTML حفظ می‌شود |
| Field | root، label، control، description، error؛ `controlId` برای id کنترل و `id` برای wrapper |
| Dialog | root پنل، overlay، header، title، description، close، content |
| Table | root جدول، viewport، caption، header، body، empty |

`className/style/ref` به root می‌رسند؛ Table یک wrapper اسکرول جدا با slot viewport دارد. `data-core-component`، `data-slot` و stateهای Button (`idle/disabled/loading`)، Field (`valid/invalid`) و Dialog (`open/closed` از Radix) برای بررسی و استایل قابل استفاده‌اند. نگهداری نام slotها بخشی از قرارداد سازگاری نسخه‌های آینده است.

## جایگزینی ساختار

```tsx
import { ButtonBase, type ButtonProps } from "@/core/ui";

function ProjectButton(props: ButtonProps) {
  return <ButtonBase {...props} data-project-button="" />;
}

<CoreUIProvider value={{ registry: { Button: ProjectButton } }}>
  {children}
</CoreUIProvider>
```

replacement تنظیمات resolve‌شده را دریافت می‌کند و مسئول رعایت props/ref/aria و رفتار است. برای حفظ رفتار آماده از `ButtonBase/InputBase/FieldBase/DialogBase/TableBase` استفاده کنید؛ فراخوانی wrapper رجیستری همان جزء از داخل replacement باعث بازگشت نامحدود می‌شود.

## سازگاری و نمونه

مسیرهای قدیمی Button و Modal adapter اجزای مشترک‌اند؛ `variant`، permission، loading، icon و badge قبلی حفظ شده‌اند. submit فرم Entity و پوستهٔ جدول موجود نیز از UI مشترک استفاده می‌کنند. متغیرهای CSS قدیمی برای کنترل‌های هنوز مهاجرت‌نکرده باقی‌اند؛ تنظیم برند اجزای جدید از `--core-*` می‌آید.

`FormInput` همچنان مستقل (`standalone`) و RHF است؛ `className` طبق قرارداد قبلی روی wrapper می‌ماند، و `classNames.input` کنترل را تغییر می‌دهد. id تولیدی یکتا و ref متصل به RHF، label/help/error و focus خطای فرم را متصل می‌کنند. textarea فعلاً استایل مشترک دارد؛ registry Input مربوط به input بومی است و مهاجرت primitive مستقل textarea در مرحلهٔ سه انجام می‌شود.

با `npm run dev` صفحهٔ `/__core-ui.html` را باز کنید. این صفحه default و دو برند با همان فرم، autocomplete، جدول و Dialog را نشان می‌دهد؛ جهت و حالت تیره قابل تغییرند. در RTL متن‌های نمونه فارسی و در LTR انگلیسی‌اند؛ lang/dir صفحه و پورتال نیز هماهنگ می‌شوند. دکمه‌های مودال در گروهی با فاصله و قابلیت شکستن سطر قرار دارند. این نمونه ورودی توسعه است و به routeها و bundle محصول اضافه نشده است. منابع محلی نمونه جای ترجمهٔ سراسری core را نمی‌گیرند؛ مهاجرت متن‌ها، تقویم/timezone، Select/Toast و سایر جهت‌های ثابت همچنان در مراحل دو و سه قرار دارند.
