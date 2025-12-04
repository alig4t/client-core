// src/core/filters/filterOperators.ts

/**
 * Supported filtering operators by server (Spring Data JPA Specification)
 * 
 * URL Pattern: ?field_operation=value
 * Example:
 *   - name_like=bot        → Text search
 *   - createdAt_ge=2025-01-01 → Date from
 *   - price_le=100         → Price to
 */

// --- Operator types (type-safe) ---
export type FilterOperator = 'like' | 'eq' | 'ne' | 'gt' | 'lt' | 'ge' | 'le';

// --- Constant object for easy access ---
export const FilterOperator = {
  LIKE: 'like' as const,
  EQ: 'eq' as const,
  NE: 'ne' as const,
  GT: 'gt' as const,
  LT: 'lt' as const,
  GE: 'ge' as const,
  LE: 'le' as const,
} as const;


// --- Function to build filter key (field_operation) ---
export const buildFilterKey = (fieldName: string, operator: FilterOperator): string => {
  return `${fieldName}_${operator}`;
};

// --- Usage example:
// buildFilterKey("createdAt", FilterOperator.GE) → "createdAt_ge"
// buildFilterKey("name", FilterOperator.LIKE) → "name_like"