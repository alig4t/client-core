// src/lib/validation.ts
import { z } from "zod";

// ولیدیشن پایه برای رشته‌های عددی (اجباری + رشته)
const numberAsString = () =>
  z.string().min(1, "این فیلد اجباری است");

// ولیدیشن عدد صحیح (int)
export const integer = () =>
  numberAsString()
    .regex(/^-?\d+$/, "باید یک عدد صحیح معتبر باشد")
    .max(11, "عدد وارد شده بیش از حد مجاز است (حداکثر 11 رقم)");

// ولیدیشن عدد بلند (long)
export const long = () =>
  numberAsString()
    .regex(/^-?\d+$/, "باید یک عدد صحیح معتبر باشد")
    .max(20, "عدد وارد شده بیش از حد مجاز است (حداکثر 20 رقم)");

// ولیدیشن عدد اعشاری (float)
export const float = () =>
  numberAsString()
    .regex(/^-?\d+(\.\d+)?$/, "فرمت عدد اعشاری نامعتبر است")
    .max(15, "عدد وارد شده بیش از حد مجاز است (حداکثر 15 رقم)");

// ولیدیشن عدد اعشاری دقت بالا (double)
export const double = () =>
  numberAsString()
    .regex(/^-?\d+(\.\d+)?$/, "فرمت عدد اعشاری نامعتبر است")
    .max(25, "عدد وارد شده بیش از حد مجاز است (حداکثر 25 رقم)");

// ولیدیشن BigDecimal (رشته‌ای با دقت بالا)
export const bigDecimal = () =>
  numberAsString()
    .regex(/^-?\d+(\.\d+)?$/, "فرمت عدد اعشاری نامعتبر است")
    .max(50, "عدد وارد شده بیش از حد مجاز است (حداکثر 50 رقم)");

// ولیدیشن رشته عمومی (با امکان تنظیم maxLength)
export const text = (maxLength: number = 255) =>
  z.string()
    .min(1, "این فیلد اجباری است")
    .max(maxLength, `حداکثر تعداد کاراکتر مجاز: ${maxLength}`);

// ولیدیشن رشته اختیاری (برای فیلدهای غیر اجباری)
export const optionalText = (maxLength: number = 255) =>
  z.string().max(maxLength, `حداکثر تعداد کاراکتر مجاز: ${maxLength}`).optional();

// ولیدیشن boolean (اجباری)
export const boolean = () =>
  z.boolean({ required_error: "این فیلد اجباری است" });

// ولیدیشن تاریخ (به صورت رشته، مثلاً 'YYYY-MM-DD')

export const dateTime = () =>
    z.string().min(1, "تاریخ و زمان را انتخاب کنید");
  
  // اگر فقط تاریخ (بدون زمان) می‌خواهی، ولی با فرمت ISO کامل:
  export const date = () =>
    z.string().min(1, "تاریخ را انتخاب کنید");


  // برای select تک‌انتخاب
export const select = () =>
    z.string().min(1, "لطفاً یک گزینه انتخاب کنید");
  
  // برای select چندانتخاب
  export const multiSelect = () =>
    z.array(z.string()).min(1, "حداقل یک گزینه انتخاب کنید");

  // src/lib/validation.ts

// ولیدیشن برای یک آبجکت با id و label (تک‌انتخاب)
export const reference = () =>
    z
      .object({
        id: z.union([z.string(), z.number()]),
        // label اختیاری است، ولی برای اطمینان می‌تونی اضافه‌اش کنی
      })
      .refine((obj) => obj.id != null, {
        message: "لطفاً یک مورد انتخاب کنید",
      });
  
  // ولیدیشن برای آرایه‌ای از آبجکت‌ها (چندانتخاب)
  export const multiReference = () =>
    z
      .array(
        z.object({
          id: z.union([z.string(), z.number()]),
        })
      )
      .min(1, "حداقل یک مورد انتخاب کنید");
// اگر خواستی ولیدیشن‌های بیشتری اضافه کنی، اینجا جای مناسبی‌ست

// صادر کردن همه ولیدیشن‌ها تحت یک نام (مثل MyValidation)
const MyValidation = {
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
  reference,
  multiReference
};

export default MyValidation;