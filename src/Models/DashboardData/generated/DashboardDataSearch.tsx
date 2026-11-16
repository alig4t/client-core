import { EntitySearch } from "@/core/entity";
import type { EntityInput } from "@/core/entity";
import { DashboardDataDefinition } from "./DashboardData.definition";
export default function DashboardDataSearch({
  onApplyFilters,
}: {
  onApplyFilters: (values: EntityInput) => void;
}) {
  return (
    <EntitySearch
      definition={DashboardDataDefinition}
      onApply={onApplyFilters}
    />
  );
}
