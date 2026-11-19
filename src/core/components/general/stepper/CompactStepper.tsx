// src/core/components/general/stepper/CompactStepper.tsx

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import React from "react";
import { useCore } from "../../../entity/CoreProvider";

export interface CompactStep {
  id: string | number;
  label: string;
}

interface CompactStepperProps {
  steps: CompactStep[];
  currentStep: number;
  className?: string;
}

/**
 * نسخه فشرده Stepper برای استفاده در فضاهای محدود
 * فقط حالت افقی را پشتیبانی می‌کند و بدون آیکون و توضیحات است
 */
const CompactStepper: React.FC<CompactStepperProps> = ({
  steps,
  currentStep,
  className = "",
}) => {
  const { direction } = useCore();
  return (
    <div
      dir={direction}
      className={`w-full ${className}`}
      role="navigation"
      aria-label="پیشرفت مراحل"
    >
      {/* Progress Bar Background */}
      <div className="relative w-full h-1 bg-[var(--border-secondary)] rounded-full overflow-hidden">
        {/* Animated Progress Fill */}
        <motion.div
          className="absolute top-0 start-0 h-full bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-success)] rounded-full"
          initial={{ width: "0%" }}
          animate={{
            width: `${((currentStep + 1) / steps.length) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between mt-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center flex-1 max-w-[100px]"
            >
              {/* Step Circle */}
              <motion.div
                className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
                    : isCurrent
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                      : "bg-[var(--card-bg)] border-[var(--border-secondary)] text-[var(--text-tertiary)]"
                }`}
                initial={false}
                animate={{
                  scale: isCurrent ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 1.5,
                  repeat: isCurrent ? Infinity : 0,
                  repeatType: "reverse",
                }}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </motion.div>

              {/* Step Label */}
              <p
                className={`text-xs mt-2 text-center transition-colors duration-200 ${
                  isCurrent
                    ? "text-[var(--color-primary)] font-medium"
                    : isCompleted
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-tertiary)]"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompactStepper;
