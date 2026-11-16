import { EntitySearch } from "@/core/entity";
import type { EntityInput } from "@/core/entity";
import { KeywordDefinition } from "./Keyword.definition";
export default function KeywordSearch({
  onApplyFilters,
}: {
  onApplyFilters: (values: EntityInput) => void;
}) {
  return (
    <EntitySearch definition={KeywordDefinition} onApply={onApplyFilters} />
  );
}
