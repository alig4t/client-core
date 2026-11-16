import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { ServerSideParams } from "../../service/BaseService";
import type { EntityId } from "../../service/contracts";
export interface BaseModel {
  id: EntityId;
}
interface LookupService<T> {
  getAll(
    params: ServerSideParams<T>,
  ): Promise<{ data: T[]; meta?: { totalPages?: number } }>;
  getById?(id: EntityId, options?: { signal?: AbortSignal }): Promise<T>;
}
interface FormAutoCompleteProps<T extends BaseModel> {
  name: string;
  label?: string;
  minilabel?: string;
  service: LookupService<T>;
  labelKey: keyof T;
  valueKey: keyof T;
  multi?: boolean;
  className?: string;
  placeholder?: string;
  maxVisible?: number;
  debounceTime?: number;
  extraFilters?: Record<string, unknown>;
  valueMode?: "id" | "object";
  disabled?: boolean;
}
export function FormAutoComplete<T extends BaseModel>({
  name,
  label,
  service,
  labelKey,
  valueKey,
  multi = false,
  className,
  placeholder = "جستجو و انتخاب کنید",
  debounceTime = 300,
  extraFilters = {},
  valueMode = "object",
  disabled,
}: FormAutoCompleteProps<T>) {
  const { control, setValue, getFieldState, formState } = useFormContext();
  const currentValue: unknown = useWatch({ name, control });
  const selected = useMemo<unknown[]>(
    () =>
      multi
        ? Array.isArray(currentValue)
          ? currentValue
          : []
        : currentValue == null
          ? []
          : [currentValue],
    [currentValue, multi],
  );
  const idOf = (value: unknown): EntityId =>
    value && typeof value === "object"
      ? ((value as T)[valueKey] as EntityId)
      : (value as EntityId);
  const [open, setOpen] = useState(false),
    [search, setSearch] = useState(""),
    [term, setTerm] = useState(""),
    [page, setPage] = useState(0),
    [totalPages, setTotalPages] = useState(0),
    [options, setOptions] = useState<T[]>([]),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [highlight, setHighlight] = useState(0);
  const cache = useRef(new Map<EntityId, T>());
  const [, setHydrated] = useState(0);
  const wrapper = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const filterKey = JSON.stringify(extraFilters);
  const previousFilters = useRef(filterKey);
  useEffect(() => {
    if (previousFilters.current !== filterKey) {
      previousFilters.current = filterKey;
      setPage(0);
      setValue(name, multi ? [] : null, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [filterKey, name, multi, setValue]);
  useEffect(() => {
    if (!service.getById) return;
    const controller = new AbortController();
    const ids = selected
      .filter(
        (value) =>
          !(
            value &&
            typeof value === "object" &&
            (value as T)[labelKey] !== undefined
          ),
      )
      .map((value) =>
        value && typeof value === "object"
          ? ((value as T)[valueKey] as EntityId)
          : (value as EntityId),
      )
      .filter((id) => !cache.current.has(id));
    if (!ids.length) return;
    Promise.all(
      ids.map((id) => service.getById!(id, { signal: controller.signal })),
    )
      .then((records) => {
        if (!controller.signal.aborted) {
          records.forEach((record) =>
            cache.current.set(record[valueKey] as EntityId, record),
          );
          setHydrated((value) => value + 1);
        }
      })
      .catch((cause) => {
        if (!controller.signal.aborted)
          setError(
            cause instanceof Error
              ? cause.message
              : "دریافت مقدار اولیه ناموفق بود",
          );
      });
    return () => controller.abort();
  }, [selected, service, labelKey, valueKey]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTerm(search);
      setPage(0);
    }, debounceTime);
    return () => clearTimeout(timer);
  }, [search, debounceTime]);
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    service
      .getAll({
        page,
        size: 5,
        filters: {
          ...JSON.parse(filterKey),
          [String(labelKey) + "_like"]: term,
        },
        signal: controller.signal,
      })
      .then((result) => {
        if (controller.signal.aborted) return;
        result.data.forEach((item) =>
          cache.current.set(item[valueKey] as EntityId, item),
        );
        setOptions(result.data);
        setTotalPages(result.meta?.totalPages ?? 1);
        setHighlight(0);
      })
      .catch((cause) => {
        if (!controller.signal.aborted) {
          setOptions([]);
          setError(
            cause instanceof Error
              ? cause.message
              : "دریافت گزینه‌ها ناموفق بود",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [open, page, term, service, filterKey, labelKey, valueKey]);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const toggle = (item: T) => {
    const id = item[valueKey] as EntityId;
    cache.current.set(id, item);
    const value =
      valueMode === "id" ? id : { [valueKey]: id, [labelKey]: item[labelKey] };
    const exists = selected.some((entry) => idOf(entry) === id);
    setValue(
      name,
      multi
        ? exists
          ? selected.filter((entry) => idOf(entry) !== id)
          : [...selected, value]
        : exists
          ? null
          : value,
      { shouldValidate: true, shouldDirty: true },
    );
    if (!multi) {
      setOpen(false);
      trigger.current?.focus();
    }
  };
  const selectedLabel = (value: unknown) => {
    if (value && typeof value === "object")
      return String(
        (value as T)[labelKey] ??
          cache.current.get(idOf(value))?.[labelKey] ??
          idOf(value),
      );
    return String(cache.current.get(value as EntityId)?.[labelKey] ?? value);
  };
  const fieldError = getFieldState(name, formState).error?.message;
  return (
    <div
      className={"relative " + (className ?? "")}
      ref={wrapper}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
        if (!open) return;
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setHighlight((index) => Math.min(index + 1, options.length - 1));
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          setHighlight((index) => Math.max(0, index - 1));
        }
        if (event.key === "Enter" && options[highlight]) {
          event.preventDefault();
          toggle(options[highlight]);
        }
      }}
    >
      <label htmlFor={name} className="block text-sm mb-1.5">
        {label}
      </label>
      <button
        ref={trigger}
        id={name}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled}
        onClick={() => {
          setOpen((value) => !value);
          setPage(0);
        }}
        className="w-full text-start p-2 border rounded-lg bg-[var(--input-bg)] border-[var(--input-border)]"
      >
        {selected.length ? selected.map(selectedLabel).join("، ") : placeholder}
      </button>
      {open && (
        <div className="absolute z-50 w-full p-2 bg-[var(--input-bg)] border rounded-lg shadow-lg">
          <input
            autoFocus
            aria-label={"جستجو " + (label ?? name)}
            aria-controls={listId}
            aria-activedescendant={
              options[highlight] ? listId + "-" + highlight : undefined
            }
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full p-2 border rounded"
          />
          {loading && <p role="status">در حال دریافت…</p>}
          {error && <p role="alert">{error}</p>}
          <ul id={listId} role="listbox" aria-multiselectable={multi}>
            {options.map((item, index) => (
              <li
                key={String(item[valueKey])}
                id={listId + "-" + index}
                role="option"
                aria-selected={selected.some(
                  (value) => idOf(value) === item[valueKey],
                )}
                className={
                  highlight === index ? "bg-purple-100 dark:bg-gray-700" : ""
                }
              >
                <button
                  type="button"
                  className="w-full p-2 text-start"
                  onClick={() => toggle(item)}
                >
                  {String(item[labelKey])}
                </button>
              </li>
            ))}
          </ul>
          {!loading && !error && !options.length && <p>موردی یافت نشد</p>}
          <div className="flex justify-between">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((value) => value - 1)}
            >
              قبلی
            </button>
            <span>
              {totalPages ? page + 1 : 0} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((value) => value + 1)}
            >
              بعدی
            </button>
          </div>
        </div>
      )}
      {fieldError && (
        <p role="alert" className="text-red-600">
          {fieldError}
        </p>
      )}
    </div>
  );
}
