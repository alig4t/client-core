import type { Option } from "@/core/forms/OptionUtils";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useFormContext, useWatch } from "react-hook-form";
import ErrorFormText from "./ErrorFormText";
import Label from "./Label";
import { ChevronDown } from "lucide-react";

// ----------------------------------------------------------------------
// 1. INTERFACE DEFINITIONS (Based on User's Provided Service/Model Contracts)
// ----------------------------------------------------------------------

/** The base required structure for any model used in this component. */
export interface BaseModel {
  id: number | string;
}

/** The structure of the server-side query parameters. */
interface ServerSideParams {
  page?: number;
  size?: number;
  sort?: string;
  filters?: Record<string, any>; // Used to send the search term and extra filters
}

/** The structure of the paginated API response. */
interface ApiResponsePayload<T> {
  data: T[];
  meta?: {
    totalItems: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
    isLastPage?: boolean;
  };
}

/** The contract for the BaseService class used for fetching options. */
interface IBaseService<T extends BaseModel> {
  getAll(params: ServerSideParams): Promise<ApiResponsePayload<T>>;
}

// ----------------------------------------------------------------------
// 2. MOCK/SIMPLIFIED UI DEPENDENCIES (For self-contained file)
// ----------------------------------------------------------------------

// const Label: React.FC<{ children: React.ReactNode; htmlFor?: string }> = ({
//   children,
// }) => (
//   <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
//     {children}
//   </label>
// );

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <ChevronDown size={14} className={` text-gray-600 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
  // <svg
  //   className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
  //   xmlns="http://www.w3.org/2000/svg"
  //   viewBox="0 0 20 20"
  //   fill="currentColor"
  //   aria-hidden="true"
  // >
  //   <path
  //     fillRule="evenodd"
  //     d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
  //     clipRule="evenodd"
  //   />
  // </svg>
);

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-white"
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

const LoadingSpinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// ----------------------------------------------------------------------
// 3. MAIN COMPONENT
// ----------------------------------------------------------------------

interface FormAutoCompleteProps<T extends BaseModel> {
  name: string;
  label: string;
  service: IBaseService<T>;
  labelKey: keyof T;
  valueKey: keyof T;
  multi?: boolean;
  className?: string;
  placeholder?: string;
  maxVisible?: number;
  debounceTime?: number; // NEW PROP: Additional filters to be applied to the service call
  extraFilters?: Record<string, any>;
}

export const FormAutoComplete = <T extends BaseModel>({
  name,
  label,
  service,
  labelKey,
  valueKey,
  multi = false,
  className = "",
  placeholder = "جستجو و انتخاب کنید",
  maxVisible = 2,
  debounceTime = 300,
  extraFilters = {}, // Default to empty object
}: FormAutoCompleteProps<T>) => {
  const formContext = useFormContext();
  if (!formContext) {
    throw new Error("FormAutoComplete must be used inside FormWrapper.");
  }

  const {
    setValue,
    control,
    formState: { errors },
  } = formContext; // Internal component state

  // Internal component state
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchedOptions, setFetchedOptions] = useState<T[]>([]);
  // Cache to store the label of any selected item (ID => Label)
  const [selectedLabelCache, setSelectedLabelCache] = useState<
    Record<string | number, string>
  >({});
  const wrapperRef = useRef<HTMLDivElement>(null); // --- RHF Watch and Select Logic ---

  // --- RHF Watch and Select Logic ---
  const currentValue = useWatch({ name, control });

  const selectedValues = useMemo(() => {
    if (multi) {
      return Array.isArray(currentValue) ? currentValue : [];
    }
    return currentValue !== undefined && currentValue !== null
      ? [currentValue]
      : [];
  }, [currentValue, multi]);

  // --- Debouncing Effect ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceTime]); // --- Fetching Effect (Triggers on debounce, open, or extraFilters change) ---

  const [hasError, setHasError] = useState(false);

  const fetchOptions = useCallback(async () => {
    if (!isOpen || hasError) return;

    setLoading(true);
   
    setHasError(false);

    // 1. Construct the dynamic search filter key based on the labelKey
    // Note: The key name must be determined by your backend API contract.
    // Assuming the format requires a "_like" suffix for the search field.
    const searchFilterKey = `${labelKey as string}_like`;

    // 2. Combine static and dynamic filters
    const combinedFilters = {
      ...extraFilters,
      [searchFilterKey]: debouncedSearchTerm,
    };

    try {
      const results = await service.getAll({
        filters: combinedFilters,
        size: 20,
      });
      setFetchedOptions(results.data);
      setHasError(false);
    } catch (e) {
      console.error("Failed to fetch autocomplete options:", e);
      setFetchedOptions([]);
      setHasError(true);
    } finally {
      setLoading(false); 
    }
  }, [isOpen, debouncedSearchTerm, service, extraFilters, labelKey]); // extraFilters is a dependency

  useEffect(() => {
    // Only fetch if the debounce term changes or if the extra filters change
    // (isOpen is handled implicitly by the fetchOptions useCallback check)
    fetchOptions();
  }, [fetchOptions]); // --- Unified Toggle Logic (Handles Selection and Cache Update) ---

  const handleToggle = useCallback(
    (value: string | number, label: string) => {
      let newValues;

      if (multi) {
        newValues = Array.isArray(currentValue) ? [...currentValue] : [];

        if (newValues.includes(value)) {
          newValues = newValues.filter((v: string | number) => v !== value);
        } else {
          newValues.push(value); // Cache the label when selecting
          setSelectedLabelCache((prev) => ({ ...prev, [value]: label }));
        }
      } else {
        // Single-select: toggle selection
        const newValue = currentValue === value ? null : value;
        newValues = newValue;

        if (newValue) {
          // Cache the label when selecting
          setSelectedLabelCache((prev) => ({ ...prev, [value]: label }));
        }

        setIsOpen(false); // Close dropdown on single selection
      }

      setValue(name, newValues, { shouldValidate: true, shouldDirty: true });
    },
    [currentValue, multi, name, setValue]
  ); // --- Dynamic Options and Display Text Logic ---
  // Combines fetched options with selected options (using cache)

  const allUniqueOptions = useMemo(() => {
    const optionMap = new Map<string | number, Option>(); // 1. Add current fetched options

    fetchedOptions.forEach((item) => {
      console.log(item);
      const value = item[valueKey] as string | number;
      const label = item[labelKey] as string;
      optionMap.set(value, { value, label });
    }); // 2. Add previously selected options from the cache (if they are not already in fetched results)

    Object.entries(selectedLabelCache).forEach(([value, label]) => {
      // Ensure key is correctly typed (handling potential string-id in cache)
      const val = isNaN(Number(value)) ? value : Number(value);

      if (selectedValues.includes(val) && !optionMap.has(val)) {
        optionMap.set(val, { value: val, label });
      }
    }); // Sort alphabetically for clean display

    return Array.from(optionMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [fetchedOptions, selectedValues, selectedLabelCache, labelKey, valueKey]); // Get the display summary text

  const selectedLabels = useMemo(() => {
    return allUniqueOptions
      .filter((opt) => selectedValues.includes(opt.value))
      .map((opt) => opt.label);
  }, [allUniqueOptions, selectedValues]);

  let displayText = placeholder;
  const count = selectedLabels.length;

  if (count > 0) {
    if (multi) {
      if (count <= maxVisible) {
        displayText = selectedLabels.join("، ");
      } else {
        const first = selectedLabels[0];
        const others = count - 1;
        displayText = `${first} و ${others} مورد دیگر`;
      }
    } else {
      displayText = selectedLabels[0];
    }
  }

  const isSelected = (value: string | number) => selectedValues.includes(value); // --- Smart Positioning Logic ---

  const [openDirection, setOpenDirection] = useState<"down" | "up">("down");

  useEffect(() => {
    // Click Outside Logic
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Reset search term when closing to ensure fresh fetch next time
        setSearchTerm("");
      }
    } // Smart Positioning Logic (Runs only when opening)

    if (isOpen && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const availableSpaceBelow = window.innerHeight - rect.bottom;
      const availableSpaceAbove = rect.top; // Estimated height of the dropdown (max-h-60 is 240px + search input)

      const estimatedDropdownHeight = 300;

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
  }, [isOpen]); // Dynamic classes for dropdown positioning

  const dropdownPositionClasses =
    openDirection === "up" ? "bottom-full mb-1" : "top-full mt-1";

  return (
    <div className={`relative w-full ${className}`} ref={wrapperRef}>
      <Label>{label}</Label>
      {/* Select Box / Trigger Button (Shows summary text) */}
      <button
        type="button"
        id={name}
        className="flex justify-between items-center w-full p-3 text-right bg-white dark:bg-gray-300  border border-[var(--input-border)] rounded-lg shadow-sm cursor-pointer hover:border-purple-500 transition duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 truncate ${
            count > 0 ? "text-gray-900" : "text-gray-500"
          }`}
        >
          {displayText}
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>
      {/* Dropdown Options List */}
      {isOpen && (
        <div
          className={`absolute z-50 w-full bg-white dark:bg-gray-300 border border-[var(--input-border)] rounded-lg shadow-xl ${dropdownPositionClasses}`}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Search Input Box */}
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white dark:bg-gray-400 z-10">
            <input
              type="text"
              className="w-full p-2 placeholder:text-[var(--placeholder-text)]  text-right border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 dark:focus:ring-gray-700"
              placeholder="جستجو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {loading && (
              <div className="flex justify-center items-center p-4 text-purple-600">
                <LoadingSpinner />
                <span className="mr-2">درحال بارگذاری...</span>
              </div>
            )}
            {!loading && allUniqueOptions.length === 0 && (
              <div className="p-4 text-sm text-gray-500 text-center">
                موردی یافت نشد.
              </div>
            )}
            {!loading && allUniqueOptions.length > 0 && (
              <ul role="listbox" aria-labelledby={name} className="p-1">
                {allUniqueOptions.map((option) => (
                  <li
                    key={option.value}
                    role={multi ? "option" : "listitem"}
                    aria-selected={isSelected(option.value)}
                    onClick={() => handleToggle(option.value, option.label)}
                    className={`flex justify-between items-center p-2 text-sm text-gray-900 rounded-md cursor-pointer transition duration-150 hover:bg-purple-50 dark:hover:bg-zinc-400/45 ${
                      isSelected(option.value)
                        ? "bg-purple-100 dark:bg-gray-400 font-semibold"
                        : ""
                    }`}
                  >
                    <span className="text-right">{option.label}</span>

                    {multi ? (
                      <div
                        className={`w-5 h-5 flex items-center justify-center border rounded transition-all ${
                          isSelected(option.value)
                            ? "bg-purple-600 border-purple-600"
                            : "bg-gray-200 border-gray-300"
                        }`}
                      >
                        {isSelected(option.value) && <CheckIcon />}
                      </div>
                    ) : (
                      isSelected(option.value) && <CheckIcon />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {/* Hidden input for RHF registration and validation */}
      <input type="hidden" {...formContext.register(name)} />
      {/* Error Display */}
      {errors[name] && <ErrorFormText msg={errors[name]?.message as string} />}
    </div>
  );
};
