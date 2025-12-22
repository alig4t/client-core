# Stepper Component

کامپوننت‌های Stepper برای نمایش مراحل فرم‌ها و پروسه‌های چند مرحله‌ای با طراحی مدرن و انیمیشن‌های نرم.

## ویژگی‌ها

- ✅ پشتیبانی از حالت‌های افقی و عمودی
- ✅ انیمیشن‌های نرم با Framer Motion
- ✅ پشتیبانی کامل از RTL
- ✅ قابلیت کلیک روی مراحل تکمیل شده
- ✅ نمایش آیکون، عنوان و توضیحات برای هر مرحله
- ✅ طراحی responsive و mobile-friendly
- ✅ سازگار با سیستم تم (CSS Variables)
- ✅ دو نسخه: استاندارد و فشرده (Compact)

## استفاده

### Stepper استاندارد

```tsx
import { Stepper, Step } from "@/core/components/general/stepper";
import { User, Mail, CheckCircle } from "lucide-react";

const steps: Step[] = [
  {
    id: 1,
    label: "اطلاعات کاربری",
    description: "نام و نام خانوادگی",
    icon: User,
  },
  {
    id: 2,
    label: "اطلاعات تماس",
    description: "ایمیل و شماره تماس",
    icon: Mail,
  },
  {
    id: 3,
    label: "تایید نهایی",
    description: "بررسی و تایید",
    icon: CheckCircle,
  },
];

function MyForm() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <Stepper
      steps={steps}
      currentStep={currentStep}
      orientation="horizontal"
      onStepClick={(index) => setCurrentStep(index)}
      allowClickOnCompleted={true}
    />
  );
}
```

### Stepper فشرده (Compact)

برای استفاده در فضاهای محدود:

```tsx
import CompactStepper from "@/core/components/general/stepper/CompactStepper";

const steps = [
  { id: 1, label: "اطلاعات" },
  { id: 2, label: "تماس" },
  { id: 3, label: "تایید" },
];

function MyCompactForm() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <CompactStepper
      steps={steps}
      currentStep={currentStep}
    />
  );
}
```

## Props

### Stepper

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `Step[]` | **required** | آرایه‌ای از مراحل |
| `currentStep` | `number` | **required** | شماره مرحله فعلی (از 0 شروع می‌شود) |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | جهت نمایش stepper |
| `onStepClick` | `(stepIndex: number) => void` | `undefined` | تابع callback برای کلیک روی مراحل |
| `allowClickOnCompleted` | `boolean` | `true` | اجازه کلیک روی مراحل تکمیل شده |
| `className` | `string` | `""` | کلاس‌های CSS اضافی |

### Step Interface

```typescript
interface Step {
  id: string | number;
  label: string;
  description?: string;
  icon?: LucideIcon;
}
```

### CompactStepper

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `CompactStep[]` | **required** | آرایه‌ای از مراحل |
| `currentStep` | `number` | **required** | شماره مرحله فعلی |
| `className` | `string` | `""` | کلاس‌های CSS اضافی |

### CompactStep Interface

```typescript
interface CompactStep {
  id: string | number;
  label: string;
}
```

## مثال کامل با فرم

```tsx
import { useState } from "react";
import { Stepper, Step } from "@/core/components/general/stepper";
import Button from "@/core/components/general/button/Button";
import { User, Mail, CheckCircle } from "lucide-react";

function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    { id: 1, label: "اطلاعات کاربری", icon: User },
    { id: 2, label: "اطلاعات تماس", icon: Mail },
    { id: 3, label: "تایید نهایی", icon: CheckCircle },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="bg-[var(--card-bg)] p-6 rounded-lg">
      <Stepper
        steps={steps}
        currentStep={currentStep}
        orientation="horizontal"
        onStepClick={setCurrentStep}
      />

      <div className="mt-8 min-h-[300px]">
        {/* محتوای فرم بر اساس currentStep */}
      </div>

      <div className="flex justify-between mt-8">
        <Button
          variant="cancel"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          قبلی
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
        >
          بعدی
        </Button>
      </div>
    </div>
  );
}
```

## حالت‌های مختلف

### حالت افقی (Horizontal)

```tsx
<Stepper steps={steps} currentStep={1} orientation="horizontal" />
```

بهترین حالت برای:
- فرم‌های دسکتاپ
- مراحل کم (3-5 مرحله)
- نمایش در هدر یا بالای صفحه

### حالت عمودی (Vertical)

```tsx
<Stepper steps={steps} currentStep={1} orientation="vertical" />
```

بهترین حالت برای:
- فرم‌های موبایل
- مراحل زیاد (بیش از 5 مرحله)
- نمایش در سایدبار

## انیمیشن‌ها

- **Pulse Effect**: برای مرحله فعلی
- **Scale Animation**: برای تمرکز بیشتر روی مرحله جاری
- **Progress Fill**: برای نمایش پیشرفت بین مراحل
- **Smooth Transitions**: برای تغییر وضعیت‌ها

## دسترسی‌پذیری (Accessibility)

- استفاده از `role="navigation"` و `aria-label`
- `aria-current="step"` برای مرحله فعلی
- `aria-label` برای هر دکمه مرحله
- پشتیبانی از keyboard navigation (در صورت فعال بودن onStepClick)

## نکات مهم

1. **شماره‌گذاری مراحل**: `currentStep` از 0 شروع می‌شود
2. **Clickable Steps**: فقط مراحل تکمیل شده قابل کلیک هستند (در صورت فعال بودن `allowClickOnCompleted`)
3. **Icons**: استفاده از آیکون‌های Lucide React
4. **Responsive**: به طور خودکار در موبایل بهینه می‌شود

## Integration با سایر کامپوننت‌ها

### با Modal

```tsx
<ModalAnimation isOpen={isOpen} onDismiss={onClose} title="فرم ثبت‌نام">
  <Stepper steps={steps} currentStep={currentStep} />
  {/* فرم */}
</ModalAnimation>
```

### با Button

```tsx
<div className="flex justify-between">
  <Button variant="cancel" onClick={handlePrevious}>
    مرحله قبل
  </Button>
  <Button variant="primary" onClick={handleNext}>
    مرحله بعد
  </Button>
</div>
```

## مثال‌های بیشتر

برای مشاهده مثال کامل و تعاملی، فایل `StepperExample.tsx` را مشاهده کنید.
