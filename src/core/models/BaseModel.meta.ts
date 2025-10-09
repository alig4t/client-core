// متادیتای پایه — فقط یک‌بار تعریف می‌شه
import type { FieldMetadata } from "./types";

export const baseModelMeta = {
    fields: {
        id: {
            label: "شناسه",
            sortable: true,
        },
        createdAt: {
            label: "تاریخ ایجاد",
            sortable: true,
        },
        updatedAt: {
            label: "تاریخ بروزرسانی",
            sortable: true,
        },
        // deletedAt عموماً در لیست‌های عادی نمایش داده نمی‌شود
        // پس آن را نمی‌آوریم (یا بعداً می‌تونی hidden بذاری)
    },
} as const;