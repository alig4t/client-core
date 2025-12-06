import type { Option } from "@/core/forms/OptionUtils";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import ErrorFormText from "./ErrorFormText";
import Label from "./Label";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Icon components for clean UI
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <ChevronDown
    size={14}
    className={` text-gray-600 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
  />
);

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-zinc-100"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

// --- MAIN COMPONENT INTERFACE ---

interface FormSelectProps {
  name: string;
  label?: string;
  minilabel?: string;
  options: Option[];
  multi?: boolean; // New prop to enable multi-select mode
  className?: string;
  placeholder?: string;
  maxVisible?: number;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  minilabel,
  options,
  multi = false, // Default to single select
  className = "",
  placeholder = "انتخاب کنید", // Default Farsi placeholder
  maxVisible = 2,
}) => {
  const formContext = useFormContext();
  if (!formContext) {
    throw new Error("FormSelect must be used inside FormWrapper.");
  }

  const {
    setValue,
    control,
    formState: { errors },
  } = formContext;

  // State to manage the open/close of the dropdown
  const [isOpen, setIsOpen] = useState(false);
  // Ref for the entire component wrapper (for click outside detection)
  const wrapperRef = useRef<HTMLDivElement>(null);

  // NEW: State to manage the direction ('down' or 'up')
  const [openDirection, setOpenDirection] = useState<"down" | "up">("down");

  // Watch the field value
  const currentValue = useWatch({ name, control });
  const selectedValues = multi
    ? Array.isArray(currentValue)
      ? currentValue
      : []
    : currentValue !== undefined && currentValue !== null
      ? [currentValue]
      : [];

  // --- EFFECT: Handle Click Outside & Smart Positioning ---
  useEffect(() => {
    // 1. Click Outside Logic
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // 2. Smart Positioning Logic (Runs only when opening)
    if (isOpen && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const availableSpaceBelow = window.innerHeight - rect.bottom;
      const availableSpaceAbove = rect.top;

      // Estimate the height of the dropdown (e.g., max 6 options * 40px height + padding)
      const estimatedDropdownHeight = Math.min(options.length * 40 + 20, 240); // max-h-60 is 240px

      // If available space below is less than the required height, AND there is more space above, open upwards.
      if (
        availableSpaceBelow < estimatedDropdownHeight &&
        availableSpaceAbove > availableSpaceBelow
      ) {
        setOpenDirection("up");
      } else {
        setOpenDirection("down");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, options.length]); // Re-run when isOpen changes or options length changes

  // Unified Toggle Logic for both Single and Multi
  const handleToggle = useCallback(
    (value: string | number) => {
      if (multi) {
        // --- MULTI-SELECT LOGIC ---
        let newValues = Array.isArray(currentValue) ? [...currentValue] : [];

        if (newValues.includes(value)) {
          newValues = newValues.filter((v) => v !== value);
        } else {
          newValues.push(value);
        }
        setValue(name, newValues, { shouldValidate: true, shouldDirty: true });
      } else {
        // --- SINGLE-SELECT LOGIC ---
        const newValue = currentValue === value ? null : value; // Toggle selection (or deselect to null)
        setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
        setIsOpen(false); // Close dropdown on single selection
      }
    },
    [currentValue, multi, name, setValue]
  );

  // --- Display Text Logic (Summary for Multi, Label for Single) ---
  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => opt.label);

  let displayText = placeholder;
  const count = selectedLabels.length;

  if (count > 0) {
    if (multi) {
      if (count <= maxVisible) {
        // Join with Farsi comma
        displayText = selectedLabels.join("، ");
      } else {
        // Farsi summary: "First Item" and "X others"
        const first = selectedLabels[0];
        const others = count - 1;
        displayText = `${first} و ${others} مورد دیگر`;
      }
    } else {
      // Single select mode: show the label of the selected item
      displayText = selectedLabels[0];
    }
  }

  // Determine if an option is currently selected/checked
  const isSelected = (value: string | number) => selectedValues.includes(value);

  // Dynamic classes for dropdown positioning (The Fix!)
  const dropdownPositionClasses =
    openDirection === "up"
      ? "bottom-[72%] mb-1" // Positions above the select box, with a small margin (mb-1)
      : "top-full mt-2"; // Positions below the select box, with a small margin (mt-1)

  return (
    <div className={`relative w-full ${className}`} ref={wrapperRef}>
      <Label>{label ?? ""}</Label>

      {/* Select Box / Trigger Button */}
      <button
        type="button"
        id={name}
        className="flex relative justify-between items-center w-full p-3 text-right bg-white dark:bg-gray-300 border border-[var(--input-border)] rounded-lg shadow-sm cursor-pointer hover:border-purple-500 transition duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {minilabel && (
          <span className="absolute right-2 px-1 w-fit bg-white dark:bg-gray-200 dark:text-gray-950 text-gray-400 top-0 -translate-y-1/2 text-[9px]  rounded-sm">
            {minilabel}
          </span>
        )}
        <span
          className={`flex-1 truncate ${count > 0 ? "text-gray-900" : "text-gray-500"}`}
        >
          {displayText}
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      {/* Dropdown Options List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openDirection === "up" ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openDirection === "up" ? 10 : -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-50 w-full bg-white dark:bg-gray-300 border border-[var(--input-border)] rounded-lg shadow-xl max-h-60 overflow-y-auto ${dropdownPositionClasses}`}
          >
            <ul role="listbox" aria-labelledby={name} className="p-1">
              {options.map((option) => (
                <li
                  key={option.value}
                  role={multi ? "option" : "listitem"}
                  aria-selected={isSelected(option.value)}
                  onClick={() => handleToggle(option.value)}
                  className={`flex justify-right gap-2 items-center my-0.5 p-2 text-sm text-gray-900 rounded-md cursor-pointer transition duration-150 hover:bg-purple-50 dark:hover:bg-zinc-400/45 ${
                    isSelected(option.value)
                      ? "bg-purple-100 dark:bg-gray-400 font-semibold"
                      : ""
                  }`}
                >
                  {multi ? (
                    // Checkbox style for multi-select
                    <div
                      className={`w-5 h-5 flex items-center justify-center border rounded transition-all ${
                        isSelected(option.value)
                          ? "bg-purple-600 border-purple-600"
                          : "bg-gray-200 border-gray-300"
                      }`}
                    >
                      {isSelected(option.value) && (
                        <span className="!text-white">
                          <CheckIcon />
                        </span>
                      )}
                    </div>
                  ) : (
                    // Checkmark style for single select
                    isSelected(option.value) && <CheckIcon />
                  )}
                  <span>{option.label}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden input to ensure r-h-f tracks the field, especially important for validation */}
      <input type="hidden" {...formContext.register(name)} />

      {/* Error Display */}
      {errors[name] && <ErrorFormText msg={errors[name]?.message as string} />}
    </div>
  );
};
