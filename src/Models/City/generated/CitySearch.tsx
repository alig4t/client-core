import { EntitySearch } from "@/core/entity";
import type { EntityInput } from "@/core/entity";
import { CityDefinition } from "./City.definition";
export default function CitySearch({
  onApplyFilters,
}: {
  onApplyFilters: (values: EntityInput) => void;
}) {
  return <EntitySearch definition={CityDefinition} onApply={onApplyFilters} />;
}
