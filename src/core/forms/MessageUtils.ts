// src/utils/MessageUtils.ts

/**
 * ساخت پیام‌های استاندارد برای هر مدل با نام فارسی
 */

// src/utils/message.types.ts

export type MessageStatus = "success" | "error";

export interface MessageBlock {
  title: string;
  description?: string;
  defaultDescription?: string;
}

export interface ModelMessages {
  create: {
    success: MessageBlock;
    error: MessageBlock;
  };
  update: {
    success: MessageBlock;
    error: MessageBlock;
  };
  delete: {
    success: MessageBlock;
    error: MessageBlock;
  };
  list: {
    title: string;
  };
  manage: {
    title: string;
  };
  createButton: string;
  pageTitle: {
    create: string;
    edit: string;
  };
}


/**
 * ساخت پیام‌های استاندارد برای هر مدل با نام فارسی
 */
export const createMessages = (
  modelName: string,
  pluralName?: string
): ModelMessages => {
  const capitalized =
    modelName.charAt(0).toUpperCase() + modelName.slice(1);

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

    pageTitle: {
      create: `ایجاد ${capitalized} جدید`,
      edit: `ویرایش ${capitalized}`,
    },
  };
};


// src/utils/publicMessages.ts

export const publicMessages = {
  delete: {
    success: {
      title: "حذف موفق",
      description: "عملیات حذف با موفقیت انجام شد.",
    },
    error: {
      title: "خطا در حذف",
      description: "امکان حذف وجود ندارد.",
    },
  },

  network: {
    error: {
      title: "خطای شبکه",
      description: "اتصال به سرور برقرار نشد.",
    },
  },

  auth: {
    sessionExpired: {
      title: "نشست منقضی شد",
      description: "لطفاً دوباره وارد شوید.",
    },
  },

  form: {
    buttons: {
      save: "ذخیره",
      update: "به‌روزرسانی",
      cancel: "لغو",
      submit: "ثبت",
      reset: "بازنشانی",
      search: "جستجو",
      clear: "پاک کردن",
    },
    filters: {
      title: "فیلتر‌ها",
      apply: "اعمال فیلتر",
      reset: "حذف فیلتر",
    },
    range: {
      from: "(از)",
      to: "(تا)",
    },
  },
} as const;

/**
 * ساخت برچسب برای فیلدهای بازه‌ای (min/max)
 * @param baseLabel - نام فیلد پایه
 * @param type - نوع بازه (from یا to)
 * @returns برچسب کامل
 *
 * @example
 * makeRangeLabel("قیمت", "from") // "قیمت از"
 * makeRangeLabel("قیمت", "to") // "قیمت تا"
 */
export const makeRangeLabel = (
  baseLabel: string | undefined,
  type: "from" | "to"
): string => {
  if (!baseLabel) return type === "from" ? publicMessages.form.range.from : publicMessages.form.range.to;
  return type === "from" ? `${baseLabel} ${publicMessages.form.range.from}` : `${baseLabel} ${publicMessages.form.range.to}`;
};
