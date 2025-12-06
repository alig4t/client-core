import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/core/components/form/Checkbox";
import { PAGE_SIZE_OPTIONS, type Option } from "@/core/forms/OptionUtils";
import Button from "../Button/Button";
import { Select } from "@/core/components/form/Select";
import { Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import TableErrorState from "@/components/Layout/TableErrorState";
import ConfirmationModal from "@/components/general/ConfirmationModal";
import { TBODY, THEAD } from "@/core/components/Table/DataTable";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import type { BaseService } from "@/core/service/BaseService";
import { publicMessages } from "@/core/forms/MessageUtils";
import { toast } from "sonner";

// --- Types ---
export type RenderRowFunction<T> = (
    item: T,
    index: number,
    onDelete: (id: string | number) => void
) => React.ReactNode;

interface BaseDataTableProps<TData, TFilters extends Record<string, any> = Record<string, any>> {
    queryKey: string;
    service: BaseService<TData>;
    filters?: TFilters;
    defaultPageSize?: number;
    defaultSort?: string;
    header: React.ReactNode;
    renderRow: RenderRowFunction<TData>;
    title?: string;
    sortOptions: Option[];
    dataIdKey?: keyof TData;
    onSelectionChange?: (selectedIds: (string | number)[]) => void;
    enableDelete?: boolean;
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

const BaseDataTable = <TData extends Record<string, any>, TFilters extends Record<string, any> = Record<string, any>>({
    queryKey,
    service,
    filters,
    defaultPageSize = 10,
    defaultSort = "createdAt,desc",
    header,
    renderRow,
    title,
    sortOptions,
    dataIdKey = "id",
    onSelectionChange,
    enableDelete = true,
}: BaseDataTableProps<TData, TFilters>) => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [sortValue, setSortValue] = useState<string>(
        defaultSort ?? String(sortOptions[0]?.value ?? "")
    );
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
    const isSelectionMode = !!onSelectionChange;

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState<(string | number)[]>([]);

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

    // Data fetching
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: [queryKey, page, pageSize, sortValue, filters],
        queryFn: () => service.getAll({ page, size: pageSize, sort: sortValue, filters }),
        ...ReactQueryOptions.tableOptions,
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (ids: (string | number)[]) => {
            const numericIds = ids.map(Number).filter(n => !isNaN(n));
            if (numericIds.length === 1) {
                await service.delete(numericIds[0]);
            } else {
                await service.deleteMany(numericIds);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            setSelectedIds([]);
            toast.success(publicMessages.delete.success.title,
                {
                    description: publicMessages.delete.success.description,
                    position: "bottom-left",
                }
            );
        },
        onError: (error) => {
            console.error("Delete failed:", error);
            toast.success(publicMessages.delete.error.title,
                {
                    description: error?.message || publicMessages.delete.success.description,
                    position: "bottom-left",
                }
            );
        },
    });

    const pageData = data?.data ?? [];
    const meta = data?.meta;
    const totalPages = meta?.totalPages ?? 0;
    const totalItems = meta?.totalItems ?? 0;

    const toggleSelect = useCallback((id: string | number) => {
        if (!isSelectionMode) return;
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        );
    }, [isSelectionMode]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    // --- Delete Handlers ---
    const handleDeleteClick = useCallback((id: string | number) => {
        setIdsToDelete([id]);
        setIsDeleteModalOpen(true);
    }, []);

    const handleBulkDeleteClick = () => {
        if (selectedIds.length === 0) return;
        setIdsToDelete(selectedIds);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (idsToDelete.length === 0) return;
        try {
            await deleteMutation.mutateAsync(idsToDelete);
            setIsDeleteModalOpen(false);
            setIdsToDelete([]);
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setIdsToDelete([]);
    };

    // --- Skeleton Loading ---
    const renderSkeleton = () => {

        let childrenCount = 0;

        if (React.isValidElement(header)) {

            const props = header.props as { children?: React.ReactNode };
            childrenCount = React.Children.toArray(props.children).length;
        } else {
            childrenCount = React.Children.toArray(header).length;
        }
        console.log(childrenCount)
        return Array.from({ length: pageSize }).map((_, index) => (
            <tr key={`skeleton-${index}`} className="animate-pulse border-b border-gray-100 dark:border-gray-800">
                {isSelectionMode && <td className="p-4"><div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>}

                {Array.from({ length: childrenCount }).map((_, index2) => (
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
            <div className="flex flex-col md:flex-row justify-between
             items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700
             max-w-full
             ">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>

                <div className="flex flex-wrap-reverse md:flex-nowrap items-center gap-2 w-full sm:w-auto">
                    <AnimatePresence mode="wait">
                        {enableDelete && isSelectionMode && selectedIds.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="mr-auto sm:mr-0"
                            >
                                <Button
                                    variant="danger"
                                    icon={Trash2}
                                    onClick={handleBulkDeleteClick}
                                    className="min-w-56"
                                >
                                    حذف انتخاب شده ها  ({selectedIds.length})
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

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
            <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="relative w-full overflow-x-auto scrollbar-thin">
                    <table className="min-w-full text-sm text-right">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                {isSelectionMode && <THEAD className="">#</THEAD>}
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
                                        const rowContent = renderRow(
                                            item,
                                            index,
                                            handleDeleteClick
                                        );

                                        return (
                                            <motion.tr
                                                key={id}
                                                variants={rowVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className={`whitespace-nowrap transition-colors duration-150 ${
                                                    isSelected
                                                        ? "bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                                                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                                }`}
                                            >
                                                {isSelectionMode && (
                                                    <TBODY className="text-center">
                                                        <Checkbox
                                                            name={`row-${id}`}
                                                            standalone
                                                            hideLabel
                                                            checked={isSelected}
                                                            onChange={() => toggleSelect(id)}
                                                        />
                                                    </TBODY>
                                                )}
                                                {rowContent}
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            ) : (
                                <tr>
                                    <td colSpan={100} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        داده‌ای یافت نشد.
                                    </td>
                                </tr>
                            )}
                        </motion.tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
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

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="تأیید حذف"
                message={`آیا مطمئنید که می‌خواهید ${idsToDelete.length} مورد را حذف کنید؟ این عمل غیرقابل بازگشت است.`}
                isDeleting={deleteMutation.isPending}
            />
        </div>
    );
};

export default BaseDataTable;
