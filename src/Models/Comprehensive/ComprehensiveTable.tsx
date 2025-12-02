import React, { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion"; // Import motion

import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";

import DateUtil from "@/core/forms/DateUtils";
import { Checkbox } from "@/core/components/form/Checkbox";
import type { ComprehensiveModel } from "./ComprehensiveModel";
import ComprehensiveService from "./ComprehensiveService";
import OptionUtils, {
  buildSortOptions,
  type Option,
} from "@/core/forms/OptionUtils";
import ModernDataTable, { type PaginatedFetchParams } from "@/components/Table/ModernDataTable"; // Import ModernDataTable
import { TBODY, THEAD } from "@/core/components/Table/DataTable"; // Keep TBODY/THEAD if needed or replace
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
import Button from "@/components/Button/Button";

interface ComprehensiveTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const sortOptions: Option[] = buildSortOptions(comprehensiveModelMeta);

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -20 },
};

const ComprehensiveTableWrapper: React.FC<ComprehensiveTableProps> = ({
  filters,
  onSelectionChange,
}) => {
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const deleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(ids.map((id) => ComprehensiveService.delete(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comprehensive"] });
      setSelectedIds([]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleDeleteClick = (id: number) => {
    setIdsToDelete([id]);
    setIsModalOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedIds.length === 0) return;
    setIdsToDelete(selectedIds);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (idsToDelete.length === 0) return;
    deleteMutation.mutate(idsToDelete);
    setIsModalOpen(false);
    setIdsToDelete([]);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setIdsToDelete([]);
  };

  const handleSelectionChange = useCallback(
    (ids: (string | number)[]) => {
      const numericIds = ids
        .map((id) => Number(id))
        .filter((id) => !Number.isNaN(id));
      setSelectedIds((prev) => {
        const prevKey = prev.join(",");
        const nextKey = numericIds.join(",");
        return prevKey === nextKey ? prev : numericIds;
      });
      onSelectionChange?.(numericIds);
    },
    [onSelectionChange]
  );

  const fetchComprehensivePage = ({
    page,
    size,
    sort,
    filters: currentFilters,
  }: PaginatedFetchParams<DynamicFilters>) =>
    ComprehensiveService.getAll({
      page,
      size,
      sort,
      filters: currentFilters,
    });

  const renderPermissionRow = (
    comprehensive: ComprehensiveModel,
    _: number,
    isSelected: boolean,
    toggleSelect: () => void
  ) => (
    <motion.tr
      key={comprehensive.id}
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`hover:bg-gray-50 whitespace-nowrap ${isSelected ? "bg-purple-50" : ""}`}
    >
      <TBODY className="text-center">
        <Checkbox
          name={`row-${comprehensive.id}`}
          standalone
          hideLabel
          checked={isSelected}
          onChange={toggleSelect}
        />
      </TBODY>
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

      <TBODY className="flex gap-x-2 justify-center">
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
            onClick={() => handleDeleteClick(comprehensive.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={20} />
          </TableLink>
        )}
      </TBODY>
    </motion.tr>
  );

  return (
    <>
      {hasPermission(Permission.ComprehensiveEntity_Delete) &&
        selectedIds.length > 0 && (
          <div className="flex justify-end mb-3">
            <Button
              variant="danger"
              icon={Trash2}
              onClick={handleBulkDeleteClick}
              disabled={deleteMutation.isPending}
              badgeCount={selectedIds.length}
            >
              حذف انتخاب شده ها
            </Button>
          </div>
        )}
      <ModernDataTable<ComprehensiveModel, DynamicFilters>
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
        onSelectionChange={handleSelectionChange}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="تأیید حذف"
        message={`آیا مطمئنید که می‌خواهید رکورد با 

         ${idsToDelete.length === 1 ? ` شناسه  ${idsToDelete[0]}` : `شناسه های   ${idsToDelete.join(',')}  `}
 را حذف کنید؟ این عمل غیرقابل بازگشت است.`}

        isDeleting={deleteMutation.isPending}
      />
    </>
  );
};

export default ComprehensiveTableWrapper;
