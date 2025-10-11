// Base metadata — defined only once
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
        // deletedAt is generally not displayed in normal lists
        // so we don't include it (or you can set hidden later)
    },
} as const;