import React, { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";

import type { ComprehensiveModel } from "./ComprehensiveModel";
import ComprehensiveService from "./ComprehensiveService";
import {
  buildSortOptions,
  type Option,
} from "@/core/forms/OptionUtils";
import ModernDataTable, { type PaginatedFetchParams } from "@/components/Table/ModernDataTable";
import ComprehensiveTableColumns, { ComprehensiveTableHeaders } from "./ComprehensiveTableColumns";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";

interface ComprehensiveTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const sortOptions: Option[] = buildSortOptions(comprehensiveModelMeta);

const ComprehensiveTableWrapper: React.FC<ComprehensiveTableProps> = ({
  filters,
  onSelectionChange,
}) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (ids: (string | number)[]) => {
      // Ensure ids are numbers if your service expects numbers
      const numericIds = ids.map(Number).filter(n => !isNaN(n));
      await Promise.all(numericIds.map((id) => ComprehensiveService.delete(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comprehensive"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSelectionChange = useCallback(
    (ids: (string | number)[]) => {
      const numericIds = ids
        .map((id) => Number(id))
        .filter((id) => !Number.isNaN(id));
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

  const handleDelete = async (ids: (string | number)[]) => {
    await deleteMutation.mutateAsync(ids);
  };

  return (
    <ModernDataTable<ComprehensiveModel, DynamicFilters>
      dataIdKey="id"
      header={<ComprehensiveTableHeaders />}
      renderRow={(item, index, onDelete) => (
        <ComprehensiveTableColumns
          key={item.id}
          item={item}
          onDelete={onDelete}
        />
      )}
      title={comprehensiveModelMeta.messages.list.title}
      sortOptions={sortOptions}
      queryKey="comprehensive"
      fetchPage={fetchComprehensivePage}
      filters={filters}
      defaultSort="createdAt,desc"
      defaultPageSize={10}
      onSelectionChange={handleSelectionChange}
      onDelete={handleDelete}
    />
  );
};

export default ComprehensiveTableWrapper;
