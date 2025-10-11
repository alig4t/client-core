// src/core/filters/filterOperators.ts

/**
 * عملگرهای فیلترینگ پشتیبانی‌شده توسط سرور (Spring Data JPA Specification)
 * 
 * الگوی URL: ?field_operation=value
 * مثال:
 *   - name_like=bot        → جستجوی متنی
 *   - createdAt_ge=2025-01-01 → تاریخ از
 *   - price_le=100         → قیمت تا
 */

// --- انواع عملگرها (type-safe) ---
export type FilterOperator = 'like' | 'eq' | 'ne' | 'gt' | 'lt' | 'ge' | 'le';

// --- شیء ثابت برای دسترسی راحت ---
export const FilterOperator = {
  LIKE: 'like' as const,
  EQ: 'eq' as const,
  NE: 'ne' as const,
  GT: 'gt' as const,
  LT: 'lt' as const,
  GE: 'ge' as const,
  LE: 'le' as const,
} as const;

// --- تابع ساخت کلید فیلتر (field_operation) ---
export const buildFilterKey = (fieldName: string, operator: FilterOperator): string => {
  return `${fieldName}_${operator}`;
};

// --- مثال استفاده:
// buildFilterKey("createdAt", FilterOperator.GE) → "createdAt_ge"
// buildFilterKey("name", FilterOperator.LIKE) → "name_like"