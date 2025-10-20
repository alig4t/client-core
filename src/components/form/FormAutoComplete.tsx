// src/components/form/FormAutoComplete.tsx
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
// Interfaces
// ----------------------------------------------------------------------
export interface BaseModel {
  id: number | string;
}

interface ServerSideParams {
  page?: number;
  size?: number;
  sort?: string;
  filters?: Record<string, any>;
}

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

interface IBaseService<T extends BaseModel> {
  getAll(params: ServerSideParams): Promise<ApiResponsePayload<T>>;
}

// ----------------------------------------------------------------------
// UI Components
// ----------------------------------------------------------------------
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <ChevronDown
    size={14}
    className={`text-gray-600 dark:text-gray-500 transition-transform duration-200 ${
      isOpen ? "transform rotate-180" : ""
    }`}
  />
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
// Main Component
// ----------------------------------------------------------------------
interface FormAutoCompleteProps<T extends BaseModel> {
  name: string;
  label: string;
  service: IBaseService<T>;
  labelKey: keyof T;
  valueKey: keyof T; // usually 'id'
  multi?: boolean;
  className?: string;
  placeholder?: string;
  maxVisible?: number;
  debounceTime?: number;
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
  extraFilters = {},
}: FormAutoCompleteProps<T>) => {
  const formContext = useFormContext();
  if (!formContext) {
    throw new Error("FormAutoComplete must be used inside FormWrapper.");
  }

  const {
    setValue,
    control,
    formState: { errors },
  } = formContext;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchedOptions, setFetchedOptions] = useState<T[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Watch current value from RHF
  const currentValue = useWatch({ name, control });

  // Extract selected items for display
  const selectedItems = useMemo(() => {
    if (multi) {
      return Array.isArray(currentValue) ? currentValue : [];
    }
    return currentValue ? [currentValue] : [];
  }, [currentValue, multi]);

  const selectedLabels = useMemo(() => {
    return selectedItems.map((item) => item[labelKey] as string);
  }, [selectedItems, labelKey]);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedSearchTerm(searchTerm),
      debounceTime
    );
    return () => clearTimeout(handler);
  }, [searchTerm, debounceTime]);

  // Fetch options
  const fetchOptions = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const searchFilterKey = `${String(labelKey)}_like`;
      const results = await service.getAll({
        filters: { ...extraFilters, [searchFilterKey]: debouncedSearchTerm },
        size: 20,
      });
      setFetchedOptions(results.data);
    } catch (e) {
      console.error("Failed to fetch autocomplete options:", e);
      setFetchedOptions([]);
    } finally {
      setLoading(false);
    }
  }, [isOpen, debouncedSearchTerm, service, extraFilters, labelKey]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // ✅ Helper: Create minimal object with only id and label
  const createMinimalItem = useCallback(
    (item: T) => {
      return {
        [valueKey]: item[valueKey],
        [labelKey]: item[labelKey],
      } as Pick<T, typeof valueKey | typeof labelKey>;
    },
    [valueKey, labelKey]
  );

  // Handle selection
  const handleToggle = useCallback(
    (item: T) => {
      const minimalItem = createMinimalItem(item);

      if (multi) {
        const current = Array.isArray(currentValue) ? [...currentValue] : [];
        const exists = current.some(
          (i) => i[valueKey] === minimalItem[valueKey]
        );
        const newItems = exists
          ? current.filter((i) => i[valueKey] !== minimalItem[valueKey])
          : [...current, minimalItem];
        setValue(name, newItems, { shouldValidate: true, shouldDirty: true });
      } else {
        const newValue =
          currentValue?.[valueKey] === minimalItem[valueKey]
            ? null
            : minimalItem;
        setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
        setIsOpen(false);
      }
    },
    [currentValue, multi, name, setValue, valueKey, createMinimalItem]
  );

  // Check if item is selected
  const isSelected = (item: T) => {
    const itemValue = item[valueKey];
    if (multi) {
      return (
        Array.isArray(currentValue) &&
        currentValue.some((i) => i[valueKey] === itemValue)
      );
    }
    return currentValue?.[valueKey] === itemValue;
  };

  // Display text
  let displayText = placeholder;
  const count = selectedLabels.length;
  if (count > 0) {
    if (multi) {
      displayText =
        count <= maxVisible
          ? selectedLabels.join("، ")
          : `${selectedLabels[0]} و ${count - 1} مورد دیگر`;
    } else {
      displayText = selectedLabels[0];
    }
  }

  // Smart positioning
  const [openDirection, setOpenDirection] = useState<"down" | "up">("down");
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenDirection(
        spaceBelow < 300 && spaceAbove > spaceBelow ? "up" : "down"
      );
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const dropdownPositionClasses =
    openDirection === "up" ? "bottom-[72%] mb-1" : "top-[80%] mt-1";

  return (
    <div className={`relative w-full ${className}`} ref={wrapperRef}>
      <Label>{label}</Label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-3 text-right bg-white dark:bg-gray-300 border border-[var(--input-border)] rounded-lg shadow-sm cursor-pointer hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
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

      {isOpen && (
        <div
          className={`absolute z-50 w-full bg-white dark:bg-gray-300 border border-[var(--input-border)] rounded-lg shadow-xl ${dropdownPositionClasses}`}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white dark:bg-gray-400 z-10">
            <input
              type="text"
              placeholder="جستجو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 text-right placeholder:text-[var(--placeholder-text)] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
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
            {!loading && fetchedOptions.length === 0 && (
              <div className="p-4 text-sm text-gray-500 text-center">
                موردی یافت نشد.
              </div>
            )}
            {!loading && fetchedOptions.length > 0 && (
              <ul className="p-1">
                {fetchedOptions.map((item) => (
                  <li
                    key={item[valueKey] as string | number}
                    onClick={() => handleToggle(item)}
                    className={`flex items-center gap-2 p-2 my-0.5 text-sm text-gray-900 rounded-md cursor-pointer transition duration-150 hover:bg-purple-50 dark:hover:bg-zinc-400/45 ${
                      isSelected(item)
                        ? "bg-purple-100 dark:bg-gray-400 font-semibold"
                        : ""
                    }`}
                  >
                    {multi ? (
                      <div
                        className={`w-5 h-5 flex items-center justify-center border rounded transition-all ${
                          isSelected(item)
                            ? "bg-purple-600 border-purple-600"
                            : "bg-gray-200 border-gray-300"
                        }`}
                      >
                        {isSelected(item) && <CheckIcon />}
                      </div>
                    ) : isSelected(item) ? (
                      <CheckIcon />
                    ) : null}
                    <span>{item[labelKey] as string}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {errors[name] && <ErrorFormText msg={errors[name]?.message as string} />}
    </div>
  );
};
