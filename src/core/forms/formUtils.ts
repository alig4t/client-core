// src/forms/formUtils.ts

/**
 * Create required error message based on field label
 */
export const getRequiredMessage = (fieldLabel: string): string => {
  return `${fieldLabel} را وارد نمایید`;
};

/**
 * Create page title for CRUD
 */
export const getCreatePageTitle = (entityLabel: string): string => {
  return `ایجاد ${entityLabel}`;
};

export const getEditPageTitle = (entityLabel: string): string => {
  return `ویرایش ${entityLabel}`;
};

/**
 * Create success message
 */
export const getSuccessMessage = (entityLabel: string, action: "create" | "update" | "delete" = "create"): string => {
  const actions = {
    create: `ایجاد ${entityLabel} موفقیت‌آمیز بود`,
    update: `ویرایش ${entityLabel} موفقیت‌آمیز بود`,
    delete: `حذف ${entityLabel} موفقیت‌آمیز بود`,
  };
  return actions[action];
};

export const getSuccessDescription = (entityLabel: string, action: "create" | "update" | "delete" = "create"): string => {
  const descriptions = {
    create: `${entityLabel} جدید با موفقیت ایجاد شد.`,
    update: `${entityLabel} با موفقیت به‌روزرسانی شد.`,
    delete: `${entityLabel} با موفقیت حذف شد.`,
  };
  return descriptions[action];
};