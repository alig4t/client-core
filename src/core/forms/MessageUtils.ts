// src/utils/MessageUtils.ts

/**
 * ساخت پیام‌های استاندارد برای هر مدل با نام فارسی
 */
export const createMessages = (modelName: string, pluralName?: string) => {
  const capitalized = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  const plural = pluralName || `${capitalized}‌ها`;

  return {
    create: {
      success: {
        title: `ایجاد ${capitalized} موفقیت‌آمیز بود`,
        description: `${capitalized} جدید با موفقیت ایجاد شد.`,
      },
      error: {
        title: `خطا در ایجاد ${capitalized}`,
        defaultDescription: "مشکلی در اتصال به سرور رخ داده است.",
      },
    },
    update: {
      success: {
        title: `ویرایش ${capitalized} موفقیت‌آمیز بود`,
        description: `${capitalized} با موفقیت به‌روزرسانی شد.`,
      },
      error: {
        title: `خطا در ویرایش ${capitalized}`,
        defaultDescription: "مشکلی در اتصال به سرور رخ داده است.",
      },
    },
    delete: {
      success: {
        title: `حذف ${capitalized} موفقیت‌آمیز بود`,
        description: `${capitalized} با موفقیت حذف شد.`,
      },
      error: {
        title: `خطا در حذف ${capitalized}`,
        defaultDescription: "مشکلی در اتصال به سرور رخ داده است.",
      },
    },
    list: {
      title: `لیست ${plural}`,
    },
    manage: {
      title: `مدیریت ${modelName}`,
    },
    createButton: `افزودن ${modelName} جدید`,
  };
};