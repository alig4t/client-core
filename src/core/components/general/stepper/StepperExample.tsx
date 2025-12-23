// src/core/components/general/stepper/StepperExample.tsx

import React, { useState } from "react";
import Stepper, { type Step } from "./Stepper";
import Button from "@/core/components/general/button/Button";
import { User, Mail, CheckCircle, FileText } from "lucide-react";

/**
 * مثالی از استفاده از Stepper برای فرم‌های چند مرحله‌ای
 * این کامپوننت نحوه استفاده از Stepper را در حالت‌های افقی و عمودی نشان می‌دهد
 */
const StepperExample: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");

  // تعریف مراحل
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

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleSubmit = () => {
    alert("فرم با موفقیت ارسال شد!");
    setCurrentStep(0);
  };

  // محتوای هر مرحله
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              اطلاعات کاربری
            </h3>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                نام
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="نام خود را وارد کنید"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                نام خانوادگی
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="نام خانوادگی خود را وارد کنید"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              اطلاعات تماس
            </h3>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                ایمیل
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="example@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                شماره تماس
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="09123456789"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              جزئیات بیشتر
            </h3>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                توضیحات
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="توضیحات تکمیلی خود را وارد کنید"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              تایید نهایی
            </h3>
            <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
              <p className="text-sm text-[var(--text-secondary)]">
                لطفاً اطلاعات وارد شده را بررسی کنید و در صورت صحیح بودن، دکمه ثبت را
                بزنید.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div dir="rtl" className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Toggle Orientation */}
      <div className="flex justify-center gap-4">
        <Button
          variant={orientation === "horizontal" ? "primary" : "secondary"}
          onClick={() => setOrientation("horizontal")}
        >
          حالت افقی
        </Button>
        <Button
          variant={orientation === "vertical" ? "primary" : "secondary"}
          onClick={() => setOrientation("vertical")}
        >
          حالت عمودی
        </Button>
      </div>

      {/* Stepper Container */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6 shadow-lg">
        {/* Stepper */}
        <Stepper
          steps={steps}
          currentStep={currentStep}
          orientation={orientation}
          onStepClick={handleStepClick}
          allowClickOnCompleted={true}
        />

        {/* Form Content */}
        <div className="mt-8 min-h-[300px]">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-[var(--border-primary)]">
          <Button
            variant="cancel"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            مرحله قبل
          </Button>

          <div className="text-sm text-[var(--text-secondary)]">
            مرحله {currentStep + 1} از {steps.length}
          </div>

          {currentStep === steps.length - 1 ? (
            <Button variant="success" onClick={handleSubmit}>
              ثبت نهایی
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              مرحله بعد
            </Button>
          )}
        </div>
      </div>

      {/* Usage Information */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-6">
        <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          نحوه استفاده
        </h4>
        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
          <p>• می‌توانید روی مراحل تکمیل شده کلیک کنید تا به آن مرحله برگردید</p>
          <p>• انیمیشن‌های نرم برای تغییر مراحل</p>
          <p>• پشتیبانی از حالت‌های افقی و عمودی</p>
          <p>• سازگار با سیستم تم و متغیرهای CSS</p>
          <p>• پشتیبانی کامل از RTL</p>
        </div>
      </div>
    </div>
  );
};

export default StepperExample;
