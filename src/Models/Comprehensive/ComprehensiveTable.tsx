import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";

import DateUtil from "@/core/forms/DateUtils";
import { Checkbox } from "@/core/components/form/Checkbox";
import type { ComprehensiveModel } from "./ComprehensiveModel";
import ComprehensiveService from "./ComprehensiveService";
import OptionUtils, {
  buildSortOptions,
  type Option,
} from "@/core/forms/OptionUtils";
import { PaginatedDataTable, TBODY, THEAD } from "@/core/components/Table/DataTable";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";
import { Eye, Pencil, Trash2 } from "lucide-react";

import LinkView from "@/components/general/LinkView";
import { VIEWNAME } from "@/router/ViewName";
import TableLink from "@/core/components/general/TableLink";
import { getViewPath } from "@/router/RouteUtils";
import ConfirmationModal from "@/components/general/ConfirmationModal";
import { useAuth } from "@/stores/AuthContext";
import { Permission } from "@/router/Permission";
import NavLink from "@/components/Button/NavLink";

interface ComprehensiveTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void; // برای ارتباط با والد
}

const sortOptions: Option[] = buildSortOptions(comprehensiveModelMeta);

const ComprehensiveTableWrapper: React.FC<ComprehensiveTableProps> = ({
  filters,
  onSelectionChange,
}) => {
  // Query client for invalidating table data after mutations
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ComprehensiveService.delete(id),
    onSuccess: () => {
      // در صورت موفقیت‌آمیز بودن حذف:
      // لیست داده‌ها را رفرش (Invalidate) می‌کند تا ردیف حذف شده ناپدید شود
      queryClient.invalidateQueries({ queryKey: ["comprehensive"] });
      // می‌توانید یک پیام موفقیت‌آمیز نیز نمایش دهید
      // مثلاً: toast.success("رکورد با موفقیت حذف شد.");
    },
    onError: (error) => {
      // نمایش خطا در صورت عدم موفقیت
      // مثلاً: toast.error(`خطا در حذف: ${error.message}`);
    },
  });

  // State for Confirmation Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  // --- Handlers ---
  // ... (handlePageSizeChange, handleSortChange)

  const handleDeleteClick = (id: number) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (idToDelete !== null) {
      deleteMutation.mutate(idToDelete);
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setIdToDelete(null);
  };

  const fetchComprehensivePage = ({
    page,
    size,
    sort,
    filters: currentFilters,
  }: {
    page: number;
    size: number;
    sort: string;
    filters?: DynamicFilters;
  }) =>
    ComprehensiveService.getAll({
      page,
      size,
      sort,
      filters: currentFilters,
    });

  // --- Row Renderer Function (Type-safe) ---
  const renderPermissionRow = (
    comprehensive: ComprehensiveModel,
    _: number, // Index is not used here, so we name it '_'
    isSelected: boolean,
    toggleSelect: () => void
  ) => (
    <tr
      key={comprehensive.id}
      className={`hover:bg-gray-50 whitespace-nowrap ${isSelected ? "bg-purple-50" : ""}`}
    >
      {/* Checkbox Column - Handled by the Table component */}
      <TBODY className="text-center">
        <Checkbox
          name={`row-${comprehensive.id}`}
          standalone
          hideLabel
          checked={isSelected}
          onChange={toggleSelect}
        />
      </TBODY>
      {/* Data Columns */}
      <TBODY>{comprehensive.id}</TBODY>
      <TBODY>{comprehensive.stringField}</TBODY>
      <TBODY>{comprehensive.integerField}</TBODY>
      <TBODY>{comprehensive.longField}</TBODY>
      <TBODY>{comprehensive.doubleField}</TBODY>
      <TBODY>{comprehensive.bigDecimalField}</TBODY>
      <TBODY>{comprehensive.booleanField ? "بله" : "خیر"}</TBODY>
      <TBODY>{comprehensive.dateField}</TBODY>
      <TBODY>{comprehensive.localDateField}</TBODY>
      <TBODY>{comprehensive.localDateTimeField}</TBODY>
      <TBODY>
        {OptionUtils.GET_BOOLEAN_OPTION(comprehensive.booleanField)}
      </TBODY>
      <TBODY>{comprehensive.uniqueField}</TBODY>
      <TBODY>{comprehensive.indexedField}</TBODY>
      <TBODY>
        <LinkView
          viewName={VIEWNAME.COMPREHENSIVE_DISPLAY}
          id={comprehensive.oneToOneUser?.id}
          label={comprehensive.oneToOneUser?.username}
        />
      </TBODY>
      <TBODY>{comprehensive.manyToOneChannel.channelName}</TBODY>
      <TBODY>{DateUtil.GEORGIAN_TO_JALALI(comprehensive.createdAt)}</TBODY>
      <TBODY>{DateUtil.GEORGIAN_TO_JALALI(comprehensive.updatedAt)}</TBODY>

      <TBODY className="flex gap-x-2">
        {/* {hasPermission(Permission.ComprehensiveEntity_Update) && (
          <TableLink
            tooltipText="ویرایش"
            to={getViewPath(VIEWNAME.COMPREHENSIVE_EDIT, comprehensive.id)}
          >
            <Pencil size={20} />
          </TableLink>
        )} */}
        <NavLink
          variant="edit"
          permission={Permission.ComprehensiveEntity_Update}
          viewName={VIEWNAME.COMPREHENSIVE_EDIT}
          idParam={comprehensive.id}
          tooltipSide="top"
          className="mr-2"
        />

        {hasPermission(Permission.ComprehensiveEntity_Read) && (
          <TableLink
            to={getViewPath(VIEWNAME.COMPREHENSIVE_DISPLAY, comprehensive.id)}
          >
            <Eye size={20} />
          </TableLink>
        )}

        {hasPermission(Permission.ComprehensiveEntity_Delete) && (
          <TableLink
            tooltipText="حذف"
            onClick={() => handleDeleteClick(comprehensive.id)} // فراخوانی هندلر مودال
            className="text-red-600 hover:text-red-800" // استایل قرمز برای دکمه حذف
          >
            <Trash2 size={20} />
          </TableLink>
        )}
      </TBODY>
    </tr>
  );

  return (
    <>
      <PaginatedDataTable<ComprehensiveModel, DynamicFilters>
        dataIdKey="id"
        header={
          <>
            <THEAD>{comprehensiveModelMeta.fields.id.label}</THEAD>
            <THEAD>{comprehensiveModelMeta.fields.stringField.label}</THEAD>
            <THEAD>{comprehensiveModelMeta.fields.integerField.label}</THEAD>
            <THEAD>{comprehensiveModelMeta.fields.longField.label}</THEAD>
            <THEAD>{comprehensiveModelMeta.fields.doubleField.label}</THEAD>
            <THEAD>{comprehensiveModelMeta.fields.bigDecimalField.label}</THEAD>
            <THEAD>{comprehensiveModelMeta.fields.booleanField.label}</THEAD>
            <THEAD>{comprehensiveModelMeta.fields.dateField.label}</THEAD>
            <THEAD>{comprehensiveModelMeta.fields.localDateField.label}</THEAD>
            <THEAD>
              {comprehensiveModelMeta.fields.localDateTimeField.label}
            </THEAD>
            <THEAD>{comprehensiveModelMeta.fields.enumField.label}</THEAD>
            <THEAD>{comprehensiveModelMeta.fields.uniqueField.label}</THEAD>
            <THEAD>{comprehensiveModelMeta.fields.indexedField.label}</THEAD>
            <THEAD>{comprehensiveModelMeta.fields.oneToOneUser.label}</THEAD>
            <THEAD>
              {comprehensiveModelMeta.fields.manyToOneChannel.label}
            </THEAD>
            <THEAD>{comprehensiveModelMeta.fields.createdAt.label}</THEAD>
            <THEAD>{comprehensiveModelMeta.fields.updatedAt.label}</THEAD>
            <THEAD>عملیات</THEAD>
          </>
        }
        renderRow={renderPermissionRow}
        title={comprehensiveModelMeta.messages.list.title}
        sortOptions={sortOptions}
        queryKey="comprehensive"
        fetchPage={fetchComprehensivePage}
        filters={filters}
        defaultSort="createdAt,desc"
        defaultPageSize={10}
        onSelectionChange={
          onSelectionChange ?? ((ids) => console.log(ids))
        }
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="تأیید حذف"
        message={`آیا مطمئنید که می‌خواهید رکورد با شناسه ${idToDelete} را حذف کنید؟ این عمل غیرقابل بازگشت است.`}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
};

export default ComprehensiveTableWrapper;
