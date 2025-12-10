import { Check } from "lucide-react";

// --- Stepper Props ---
interface StepperProps {
  /** Array of step labels. */
  steps: string[];
  /** The currently active step (0-indexed). */
  currentStep: number;
  /** Optional: Fired when a step is clicked. */
  onStepClick?: (stepIndex: number) => void;
  className?: string; // Optional custom class
}

/**
 * A modern, animated stepper component designed for RTL layouts.
 */
const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className = "",
}) => {
  return (
    <div dir="rtl" className={`w-full ${className}`}>
      <ol className="flex items-center w-full">
        {steps.map((label, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          const isClickable = onStepClick && (isCompleted || isActive);

          const stepStatusClasses = {
            completed:
              "bg-purple-600 text-white dark:bg-purple-500",
            active:
              "bg-purple-600 text-white dark:bg-purple-500 animate-pulse",
            pending:
              "bg-gray-100 border-2 border-gray-300 dark:bg-gray-700 dark:border-gray-500",
          };

          const textStatusClasses = {
            completed: "text-purple-600 dark:text-purple-400 font-semibold",
            active: "text-purple-600 dark:text-purple-400 font-bold",
            pending: "text-gray-500 dark:text-gray-400",
          };

          const lineStatusClasses = {
            completed: "bg-purple-600 dark:bg-purple-500",
            pending: "bg-gray-200 dark:bg-gray-700",
          };

          const status = isCompleted ? "completed" : isActive ? "active" : "pending";

          return (
            <li
              key={index}
              className={`flex w-full items-center ${
                index === steps.length - 1 ? "flex-shrink-0" : ""
              }`}
            >
              {/* Step Circle and Label */}
              <button
                type="button"
                className={`flex flex-col items-center ${isClickable ? "cursor-pointer" : "cursor-default"}`}
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
              >
                {/* Circle */}
                <span
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full
                    font-bold text-lg transition-all duration-300 transform scale-100
                    ${stepStatusClasses[status]}
                    ${isActive ? "scale-110" : ""}
                  `}
                >
                  {isCompleted ? <Check size={24} /> : index + 1}
                </span>
                {/* Label */}
                <span
                  className={`
                    mt-2 text-sm text-center w-max max-w-20 sm:max-w-xs truncate
                    ${textStatusClasses[status]}
                  `}
                >
                  {label}
                </span>
              </button>

              {/* Connecting Line (not after the last step) */}
              {index < steps.length - 1 && (
                <div className="flex-auto h-1.5 mx-2 sm:mx-4 relative">
                  {/* Background Line */}
                  <div
                    className={`absolute inset-0 h-full ${lineStatusClasses.pending}`}
                  />
                  {/* Foreground (Progress) Line */}
                  <div
                    className={`
                      absolute inset-0 h-full transition-all duration-500
                      ${lineStatusClasses.completed}
                    `}
                    style={{
                      width: isCompleted ? "100%" : isActive ? "0%" : "0%",
                    }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};


// USAGE
// return (
//     <div dir="rtl" className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8 font-sans">
//       <div className="w-full max-w-4xl p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
//           فرم ثبت نام
//         </h1>
        
//         {/* --- The Stepper Component --- */}
//         <Stepper
//           steps={steps}
//           currentStep={currentStep}
//           onStepClick={handleStepClick}
//         />

//         {/* --- Content Area (Placeholder) --- */}
//         <div className="mt-12 p-8 border border-gray-200 dark:border-gray-700 rounded-lg min-h-[200px] flex items-center justify-center">
//           <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
//             محتوای مرحله {currentStep + 1}: {steps[currentStep]}
//           </h2>
//         </div>

//         {/* --- Navigation Buttons --- */}
//         <div className="flex justify-between mt-8">
//           <button
//             onClick={handlePrev}
//             disabled={currentStep === 0}
//             className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400
//                        disabled:opacity-50 disabled:cursor-not-allowed
//                        dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
//           >
//             قبلی
//           </button>
//           <button
//             onClick={handleNext}
//             disabled={currentStep === steps.length - 1}
//             className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700
//                        disabled:opacity-50 disabled:cursor-not-allowed
//                        dark:bg-purple-500 dark:hover:bg-purple-400"
//           >
//             بعدی
//           </button>
//         </div>
//       </div>
//     </div>
//   );