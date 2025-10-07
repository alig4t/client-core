// نوع داده برای گزینه‌های Select
export interface SelectOption {
    value: string | number;
    label: string;
  }
  
  // تعریف ساختار یک فیلد در فرم فیلتر
  export interface FilterField {
    name: string; // شناسه منحصر به فرد فیلد (برای state)
    label: string; // متنی که به کاربر نمایش داده می‌شود
    type: 'text' | 'date' | 'select'; // نوع اینپوت
    filterKey: string; // کلیدی که به API ارسال می‌شود (e.g., "name_like")
    options?: SelectOption[]; // گزینه‌ها برای نوع select
  }