import { EntitySearch } from "@/core/entity";
import type { EntityInput } from "@/core/entity";
import { PersonDefinition } from "./Person.definition";
export default function PersonSearch({
  onApplyFilters,
}: {
  onApplyFilters: (values: EntityInput) => void;
}) {
  return (
    <EntitySearch definition={PersonDefinition} onApply={onApplyFilters} />
  );
}
