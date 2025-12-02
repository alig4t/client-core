import React, { useState, useEffect, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/core/components/form/Checkbox";
import { PAGE_SIZE_OPTIONS, type Option } from "@/core/forms/OptionUtils";
import Button from "../Button/Button";
import { Select } from "@/core/components/form/Select";
import { Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import TableErrorState from "@/components/Layout/TableErrorState";

// --- Types ---
type RenderRowFunction<T> = (
    item: T,
    index: number,
    isSelected: boolean,
    toggleSelect: () => void
) => React.ReactNode;

export interface PaginatedFetchParams<TFilters> {
    page: number;
    size: number;
    sort: string;
    filters?: TFilters;
}

export interface PaginatedFetchResult<TData> {
    data: TData[];
    meta?: {
        totalItems?: number;
        totalPages?: number;
        currentPage?: number;
        pageSize?: number;
        isLastPage?: boolean;
    };
}

interface ModernDataTableProps<TData, TFilters> {
    queryKey: string;
    fetchPage: (params: PaginatedFetchParams<TFilters>) => Promise<PaginatedFetchResult<TData>>;
    filters?: TFilters;
    defaultPageSize?: number;
    defaultSort?: string;
    header: React.ReactNode;
    renderRow: RenderRowFunction<TData>;
    title?: string;
    sortOptions: Option[];
    dataIdKey: keyof TData;
    onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 },
};

const ModernDataTable = <TData extends Record<string, any>, TFilters = Record<string, any>>({
    queryKey,
    fetchPage,
    filters,
    defaultPageSize = 10,
    defaultSort,
    header,
    renderRow,
    title,
    sortOptions,
    dataIdKey,
    onSelectionChange,
}: ModernDataTableProps<TData, TFilters>) => {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [sortValue, setSortValue] = useState<string>(
        defaultSort ?? String(sortOptions[0]?.value ?? "")
    );
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
    const isSelectionMode = !!onSelectionChange;

    // Reset page when filters change
    useEffect(() => {
        setPage(0);
    }, [filters]);

    // Reset selection when data changes
    useEffect(() => {
        if (isSelectionMode) setSelectedIds([]);
    }, [page, pageSize, sortValue, filters, isSelectionMode]);

    // Notify parent of selection
    useEffect(() => {
        if (isSelectionMode) onSelectionChange(selectedIds);
    }, [selectedIds, onSelectionChange, isSelectionMode]);

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: [queryKey, page, pageSize, sortValue, filters],
        queryFn: () => fetchPage({ page, size: pageSize, sort: sortValue, filters }),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

    const pageData = data?.data ?? [];
    const meta = data?.meta ?? {};
    const totalPages = meta.totalPages ?? 0;
    const totalItems = meta.totalItems ?? 0;

    const toggleSelect = (id: string | number) => {
        if (!isSelectionMode) return;
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        );
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    // --- Skeleton Loading ---
    const renderSkeleton = () => {
        return Array.from({ length: pageSize }).map((_, index) => (
            <tr key={`skeleton-${index}`} className="animate-pulse border-b border-gray-100 dark:border-gray-800">
                {isSelectionMode && <td className="p-4"><div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>}
                {React.Children.map(header, () => (
                    <td className="p-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                    </td>
                ))}
            </tr>
        ));
    };

    if (isError) {
        return <TableErrorState message={(error as Error).message} onRetry={refetch} />;
    }

    return (
        <div className="w-full space-y-4">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isSelectionMode && selectedIds.length > 0 && (
                        <Button
                            variant="danger"
                            icon={Trash2}
                            onClick={() => setSelectedIds([])}
                            className="mr-auto sm:mr-0"
                        >
                            لغو انتخاب ({selectedIds.length})
                        </Button>
                    )}

                    <Select
                        options={sortOptions}
                        value={sortValue}
                        onChange={(val) => setSortValue(String(val))}
                        className="w-40"
                        minilabel="مرتب‌سازی"
                    />

                    <Select
                        options={PAGE_SIZE_OPTIONS}
                        value={pageSize}
                        onChange={(val) => {
                            setPageSize(Number(val));
                            setPage(0);
                        }}
                        className="w-24"
                        minilabel="تعداد"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                {isSelectionMode && <th className="p-4 w-12 text-center">#</th>}
                                {header}
                            </tr>
                        </thead>
                        <motion.tbody
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="divide-y divide-gray-100 dark:divide-gray-800"
                        >
                            {isLoading ? (
                                renderSkeleton()
                            ) : pageData.length > 0 ? (
                                <AnimatePresence mode="wait">
                                    {pageData.map((item, index) => {
                                        const id = item[dataIdKey] as string | number;
                                        const isSelected = selectedIds.includes(id);
                                        const rowContent = renderRow(item, index, isSelected, () => toggleSelect(id));

                                        // Extract children to wrap in motion.tr
                                        // Note: renderRow usually returns a <tr>. We might need to adjust this if renderRow returns <tr> directly.
                                        // Ideally renderRow should return the *content* of the row (tds), but the current interface implies it returns a Node.
                                        // If it returns a <tr>, we can't easily wrap it in motion.tr without cloning or changing the interface.
                                        // However, we can wrap the *content* if we change how renderRow is used, OR we can just use a motion component wrapper if the <tr> is passed.
                                        // BUT, `framer-motion` needs `motion.tr` to animate the row itself.
                                        // Let's assume renderRow returns a <tr> and we will try to use it as is, but we lose the stagger effect on the row itself if we don't control the tr.
                                        // BETTER APPROACH: The user's `renderRow` returns a `<tr>`. We should probably ask the user to change `renderRow` to return `<td>` fragments, OR we just wrap the result.
                                        // But wrapping a `<tr>` in a `div` or `motion.div` inside `tbody` is invalid HTML.
                                        // So, for now, I will render it as is, but I'll add a specific class for animation if I can't control the tag.
                                        // WAIT, I can use `motion.create` or just accept that `renderRow` returns a standard `tr` and I can't easily animate it with `framer-motion`'s `variants` prop unless I clone it.

                                        // Let's try to clone the element and add motion props? No, that's messy.
                                        // I will wrap the `renderRow` call in a component that renders `motion.tr`.
                                        // BUT `renderRow` returns the whole `<tr>`.
                                        // I will MODIFY `ComprehensiveTable.tsx` to return `motion.tr` or just `tr` with classes.
                                        // For `ModernDataTable`, I will assume `renderRow` returns a valid React Element (the tr).
                                        // I will wrap it in a Fragment.

                                        // Actually, to get the "staggered element reveal" requested, I really need `motion.tr`.
                                        // I will update `ComprehensiveTable.tsx` to use `motion.tr` directly in `renderRow`.
                                        // So here I just render it.

                                        return (
                                            <React.Fragment key={id}>
                                                {rowContent}
                                            </React.Fragment>
                                        );
                                    })}
                                </AnimatePresence>
                            ) : (
                                <tr>
                                    <td colSpan={100} className="p-8 text-center text-gray-500">
                                        داده‌ای یافت نشد.
                                    </td>
                                </tr>
                            )}
                        </motion.tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-sm text-gray-500">
                        نمایش {page * pageSize + 1} تا {Math.min((page + 1) * pageSize, totalItems)} از {totalItems} رکورد
                    </span>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="secondary"
                            onClick={() => handlePageChange(0)}
                            disabled={page === 0}
                            className="p-2"
                        >
                            <ChevronsRight size={16} />
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 0}
                            className="p-2"
                        >
                            <ChevronRight size={16} />
                        </Button>

                        <span className="px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                            صفحه {page + 1} از {totalPages}
                        </span>

                        <Button
                            variant="secondary"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages - 1}
                            className="p-2"
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => handlePageChange(totalPages - 1)}
                            disabled={page >= totalPages - 1}
                            className="p-2"
                        >
                            <ChevronsLeft size={16} />
                        </Button>
                    </div>
                </div>
            </div>

            {isFetching && !isLoading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-10 flex items-center justify-center">
                    {/* Optional: Add a spinner here */}
                </div>
            )}
        </div>
    );
};

export default ModernDataTable;
