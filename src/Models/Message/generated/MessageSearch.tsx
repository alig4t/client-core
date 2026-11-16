import { EntitySearch } from "@/core/entity";
import type { EntityInput } from "@/core/entity";
import { MessageDefinition } from "./Message.definition";
export default function MessageSearch({
  onApplyFilters,
}: {
  onApplyFilters: (values: EntityInput) => void;
}) {
  return (
    <EntitySearch definition={MessageDefinition} onApply={onApplyFilters} />
  );
}
