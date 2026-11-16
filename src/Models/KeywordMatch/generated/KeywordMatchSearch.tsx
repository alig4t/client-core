import { EntitySearch } from "@/core/entity";
import type { EntityInput } from "@/core/entity";
import { KeywordMatchDefinition } from "./KeywordMatch.definition";
export default function KeywordMatchSearch({
  onApplyFilters,
}: {
  onApplyFilters: (values: EntityInput) => void;
}) {
  return (
    <EntitySearch
      definition={KeywordMatchDefinition}
      onApply={onApplyFilters}
    />
  );
}
