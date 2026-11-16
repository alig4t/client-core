import { EntitySearch } from "@/core/entity";
import type { EntityInput } from "@/core/entity";
import { ComprehensiveEntityDefinition } from "./ComprehensiveEntity.definition";
export default function ComprehensiveEntitySearch({
  onApplyFilters,
}: {
  onApplyFilters: (values: EntityInput) => void;
}) {
  return (
    <EntitySearch
      definition={ComprehensiveEntityDefinition}
      onApply={onApplyFilters}
    />
  );
}
