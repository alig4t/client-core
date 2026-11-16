// src/lib/validation.ts
import { z } from "zod/v3";

// Base validation for numeric strings (required + string)
const numberAsString = () => z.string().min(1, "این فیلد اجباری است");

// Integer validation (int)
export const integer = () =>
  numberAsString()
    .regex(/^-?\d+$/, "باید یک عدد صحیح معتبر باشد")
    .max(11, "عدد وارد شده بیش از حد مجاز است (حداکثر 11 رقم)");

// Long validation (long)
export const long = () =>
  numberAsString()
    .regex(/^-?\d+$/, "باید یک عدد صحیح معتبر باشد")
    .max(20, "عدد وارد شده بیش از حد مجاز است (حداکثر 20 رقم)");

// Float validation (float)
export const float = () =>
  numberAsString()
    .regex(/^-?\d+(\.\d+)?$/, "فرمت عدد اعشاری نامعتبر است")
    .max(15, "عدد وارد شده بیش از حد مجاز است (حداکثر 15 رقم)");

// Double validation (double)
export const double = () =>
  numberAsString()
    .regex(/^-?\d+(\.\d+)?$/, "فرمت عدد اعشاری نامعتبر است")
    .max(25, "عدد وارد شده بیش از حد مجاز است (حداکثر 25 رقم)");

// BigDecimal validation (high precision string)
export const bigDecimal = () =>
  numberAsString()
    .regex(/^-?\d+(\.\d+)?$/, "فرمت عدد اعشاری نامعتبر است")
    .max(50, "عدد وارد شده بیش از حد مجاز است (حداکثر 50 رقم)");

// General string validation (with maxLength option)
export const text = (maxLength: number = 255) =>
  z
    .string()
    .min(1, "این فیلد اجباری است")
    .max(maxLength, `حداکثر تعداد کاراکتر مجاز: ${maxLength}`);

// Optional string validation (for non-required fields)
export const optionalText = (maxLength: number = 255) =>
  z
    .string()
    .max(maxLength, `حداکثر تعداد کاراکتر مجاز: ${maxLength}`)
    .optional();

// Boolean validation (required)
export const boolean = () =>
  z.boolean({ required_error: "این فیلد اجباری است" });

// Date validation (as string, e.g., 'YYYY-MM-DD')

export const dateTime = () => z.string().min(1, "تاریخ و زمان را انتخاب کنید");

// If you want only date (without time), but with full ISO format:
export const date = () => z.string().min(1, "تاریخ را انتخاب کنید");

// For single select
export const select = () =>
  z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== null && val !== undefined, {
      message: "لطفاً یک گزینه انتخاب کنید",
    });

// ✅ For multi select (string[] | number[])
export const multiSelect = () =>
  z
    .array(z.union([z.string(), z.number()]))
    .min(1, "حداقل یک گزینه انتخاب کنید")
    .refine((arr) => arr.every((v) => v !== "" && v !== null), {
      message: "گزینه‌های انتخابی نامعتبر هستند",
    });

// src/lib/validation.ts

// Validation for an object with id and label (single select)
export const autoComplete = () => z.object({});

// Validation for multi-select autocomplete
export const multiAutoComplete = () =>
  z.array(z.any()).min(1, "حداقل یک مورد باید انتخاب شود.");

export const notNull = (message: string = "این فیلد اجباری است") =>
  z.any().refine(
    (val) => {
      if (val === null || val === undefined) return false;

      if (typeof val === "string") return val.trim().length > 0;
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === "object") return Object.keys(val).length > 0;
      if (typeof val === "boolean") return true; // For checkbox
      if (typeof val === "number") return true; // For numeric values

      return false;
    },
    { message },
  );

export const optional = () => z.any().optional();
// If you want to add more validations, this is the right place

// Export all validations under one name (like MyValidation)
const Validator = {
  integer,
  long,
  float,
  double,
  bigDecimal,
  text,
  optionalText,
  boolean,
  dateTime,
  date,
  select,
  multiSelect,
  autoComplete,
  multiAutoComplete,
  notNull,
  optional,
};

export default Validator;
