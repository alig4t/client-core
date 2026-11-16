// src/core/components/general/stepper/Stepper.tsx

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import React from "react";

export interface Step {
  id: string | number;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

export type StepperOrientation = "horizontal" | "vertical";

export type StepStatus = "completed" | "current" | "upcoming";

interface StepperProps {
  steps: Step[];
  currentStep: number;
  orientation?: StepperOrientation;
  onStepClick?: (stepIndex: number) => void;
  allowClickOnCompleted?: boolean;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  orientation = "horizontal",
  onStepClick,
  allowClickOnCompleted = true,
  className = "",
}) => {
  const getStepStatus = (index: number): StepStatus => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "current";
    return "upcoming";
  };

  const handleStepClick = (index: number) => {
    if (!onStepClick) return;

    const status = getStepStatus(index);
    if (status === "completed" && allowClickOnCompleted) {
      onStepClick(index);
    }
  };

  const isClickable = (index: number): boolean => {
    return (
      allowClickOnCompleted &&
      getStepStatus(index) === "completed" &&
      !!onStepClick
    );
  };

  return (
    <div
      dir="rtl"
      className={`w-full ${className}`}
      role="navigation"
      aria-label="پیشرفت مراحل"
    >
      <div
        className={`flex ${
          orientation === "horizontal"
            ? "flex-row items-center"
            : "flex-col items-start"
        }`}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;
          const clickable = isClickable(index);

          return (
            <React.Fragment key={step.id}>
              {/* Step Item */}
              <div
                className={`flex ${
                  orientation === "horizontal"
                    ? "flex-col items-center"
                    : "flex-row items-start w-full"
                }`}
              >
                {/* Step Circle */}
                <motion.button
                  onClick={() => handleStepClick(index)}
                  disabled={!clickable}
                  className={`relative flex items-center justify-center flex-shrink-0 ${
                    orientation === "horizontal" ? "w-10 h-10" : "w-9 h-9"
                  } rounded-full border-2 transition-all duration-300 ${
                    status === "completed"
                      ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
                      : status === "current"
                        ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30"
                        : "bg-[var(--card-bg)] border-[var(--border-secondary)] text-[var(--text-secondary)]"
                  } ${
                    clickable
                      ? "cursor-pointer hover:scale-110 hover:shadow-lg"
                      : "cursor-default"
                  }`}
                  initial={false}
                  animate={{
                    scale: status === "current" ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: status === "current" ? Infinity : 0,
                    repeatType: "reverse",
                  }}
                  aria-label={`مرحله ${index + 1}: ${step.label}`}
                  aria-current={status === "current" ? "step" : undefined}
                >
                  {status === "completed" ? (
                    <Check className="w-5 h-5" />
                  ) : step.icon ? (
                    <step.icon className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}

                  {/* Pulse Ring for Current Step */}
                  {status === "current" && (
                    <motion.span
                      className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)]"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 1.4, opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </motion.button>

                {/* Step Label & Description */}
                <div
                  className={`${
                    orientation === "horizontal"
                      ? "text-center mt-2 max-w-[120px]"
                      : "mr-4 flex-1"
                  }`}
                >
                  <p
                    className={`text-sm font-medium transition-colors duration-200 ${
                      status === "current"
                        ? "text-[var(--color-primary)]"
                        : status === "completed"
                          ? "text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p
                      className={`text-xs mt-1 transition-colors duration-200 ${
                        status === "upcoming"
                          ? "text-[var(--text-tertiary)]"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={`relative ${
                    orientation === "horizontal"
                      ? "flex-1 h-[2px] mx-2 min-w-[40px]"
                      : "w-[2px] h-12 mr-[18px]"
                  } bg-[var(--border-secondary)] overflow-hidden`}
                >
                  {/* Progress Fill */}
                  <motion.div
                    className={`absolute ${
                      orientation === "horizontal"
                        ? "top-0 right-0 h-full"
                        : "top-0 right-0 w-full"
                    } bg-[var(--color-success)]`}
                    initial={false}
                    animate={{
                      [orientation === "horizontal" ? "width" : "height"]:
                        index < currentStep ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
