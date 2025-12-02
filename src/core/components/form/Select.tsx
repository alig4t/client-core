import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";

export interface Option {
  value: string | number;
  label: string;
}

// --- Icons ---
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <ChevronDown
    size={14}
    className={`text-gray-600 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""
      }`}
  />
);

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-zinc-500 dark:text-zinc-100"
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

// --- Props ---
interface SelectProps {
  options: Option[];
  value?: string | number; // Only for single-select mode
  onChange: (value: string | number) => void;
  className?: string;
  placeholder?: string;
  label?: string; // Optional
  minilabel?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  className = "",
  placeholder = "انتخاب کنید",
  label,
  minilabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState<"down" | "up">("down");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Click outside + smart positioning
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const availableSpaceBelow = window.innerHeight - rect.bottom;
      const availableSpaceAbove = rect.top;
      const estimatedDropdownHeight = Math.min(options.length * 40 + 20, 240);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, options.length]);

  const handleSelect = useCallback(
    (optionValue: string | number) => {
      onChange(optionValue);
      setIsOpen(false);
    },
    [onChange]
  );

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const dropdownPositionClasses =
    openDirection === "up" ? "bottom-full mb-1" : "top-full mt-2";

  return (
    <div className={`relative w-full ${className}`} ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <button
        type="button"
        className="flex gap-1 relative justify-between items-center w-full p-3 text-right bg-white dark:bg-gray-300 border border-[var(--input-border)] rounded-lg shadow-sm cursor-pointer hover:border-purple-500 transition duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {minilabel && (
          <span className="absolute right-2 px-1 w-fit bg-white dark:bg-gray-200 dark:text-gray-950 text-gray-400 top-0 -translate-y-1/2 text-[9px]  rounded-sm">
            {minilabel}
          </span>
        )}
        <span
          className={`flex-1 truncate ${value !== undefined && value !== "" ? "text-gray-900" : "text-gray-500"}`}
        >
          {displayText}
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 w-full bg-white dark:bg-gray-300 border border-[var(--input-border)] rounded-lg shadow-xl max-h-60 overflow-y-auto ${dropdownPositionClasses}`}
        >
          <ul role="listbox" className="p-1">
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                onClick={() => handleSelect(option.value)}
                className={`flex items-center gap-2 my-0.5 p-2 text-sm text-gray-900 rounded-md cursor-pointer transition duration-150 hover:bg-purple-50 dark:hover:bg-zinc-400/45 ${option.value === value
                    ? "bg-purple-100 dark:bg-gray-400 font-semibold"
                    : ""
                  }`}
              >
                {option.value === value && <CheckIcon />}
                <span>{option.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
