// src/core/components/general/stepper/StepperDemo.tsx

import React, { useState } from "react";
import Stepper, { Step } from "./Stepper";
import CompactStepper, { CompactStep } from "./CompactStepper";
import Button from "@/core/components/general/button/Button";
import { User, Mail, FileText, CheckCircle } from "lucide-react";

/**
 * صفحه نمایشی برای مقایسه Stepper استاندارد و فشرده
 */
const StepperDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const fullSteps: Step[] = [
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
      label: "جزئیات بیشتر",
      description: "توضیحات تکمیلی",
      icon: FileText,
    },
    {
      id: 4,
      label: "تایید نهایی",
      description: "بررسی و تایید",
      icon: CheckCircle,
    },
  ];

  const compactSteps: CompactStep[] = [
    { id: 1, label: "کاربری" },
    { id: 2, label: "تماس" },
    { id: 3, label: "جزئیات" },
    { id: 4, label: "تایید" },
  ];

  const handleNext = () => {
    if (currentStep < fullSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  return (
    <div dir="rtl" className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Stepper Components Demo
        </h1>
        <p className="text-[var(--text-secondary)]">
          مقایسه نسخه‌های استاندارد و فشرده کامپوننت Stepper
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button variant="cancel" onClick={handlePrevious} disabled={currentStep === 0}>
          مرحله قبل
        </Button>
        <Button variant="secondary" onClick={handleReset}>
          شروع مجدد
        </Button>
        <Button variant="primary" onClick={handleNext} disabled={currentStep === fullSteps.length - 1}>
          مرحله بعد
        </Button>
      </div>

      {/* Current Step Indicator */}
      <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
        <p className="text-sm text-[var(--text-secondary)]">
          مرحله فعلی: <span className="font-bold text-[var(--color-primary)]">{currentStep + 1}</span> از {fullSteps.length}
        </p>
      </div>

      {/* Compact Stepper */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Compact Stepper
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          نسخه فشرده برای استفاده در فضاهای محدود - فقط حالت افقی
        </p>
        <CompactStepper steps={compactSteps} currentStep={currentStep} />
      </div>

      {/* Standard Stepper - Horizontal */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Standard Stepper - افقی
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          نسخه کامل با آیکون و توضیحات - مناسب برای دسکتاپ
        </p>
        <Stepper
          steps={fullSteps}
          currentStep={currentStep}
          orientation="horizontal"
          onStepClick={setCurrentStep}
          allowClickOnCompleted={true}
        />
      </div>

      {/* Standard Stepper - Vertical */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Standard Stepper - عمودی
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          نسخه کامل با جهت عمودی - مناسب برای موبایل و سایدبار
        </p>
        <div className="max-w-md">
          <Stepper
            steps={fullSteps}
            currentStep={currentStep}
            orientation="vertical"
            onStepClick={setCurrentStep}
            allowClickOnCompleted={true}
          />
        </div>
      </div>

      {/* Features List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            ویژگی‌های Standard Stepper
          </h3>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <span>پشتیبانی از حالت‌های افقی و عمودی</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <span>آیکون سفارشی برای هر مرحله</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <span>عنوان و توضیحات برای هر مرحله</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <span>قابلیت کلیک روی مراحل تکمیل شده</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <span>انیمیشن Pulse برای مرحله فعلی</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <span>خطوط اتصال با انیمیشن پیشرفت</span>
            </li>
          </ul>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            ویژگی‌های Compact Stepper
          </h3>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <span>طراحی فشرده و minimalist</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <span>نوار پیشرفت gradient</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <span>مناسب برای فضاهای محدود</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <span>فقط حالت افقی</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <span>انیمیشن Scale برای مرحله فعلی</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <span>عملکرد سریع‌تر</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Usage Example Code */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          مثال کد
        </h3>
        <pre className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-4 overflow-x-auto text-xs text-[var(--text-secondary)] font-mono">
{`import { Stepper } from "@/core/components/general/stepper";

const steps = [
  { id: 1, label: "مرحله 1", icon: User },
  { id: 2, label: "مرحله 2", icon: Mail },
];

<Stepper
  steps={steps}
  currentStep={currentStep}
  orientation="horizontal"
  onStepClick={setCurrentStep}
/>`}
        </pre>
      </div>
    </div>
  );
};

export default StepperDemo;
