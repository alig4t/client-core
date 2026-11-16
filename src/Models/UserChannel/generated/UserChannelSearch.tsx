import { EntitySearch } from "@/core/entity";
import type { EntityInput } from "@/core/entity";
import { UserChannelDefinition } from "./UserChannel.definition";
export default function UserChannelSearch({
  onApplyFilters,
}: {
  onApplyFilters: (values: EntityInput) => void;
}) {
  return (
    <EntitySearch definition={UserChannelDefinition} onApply={onApplyFilters} />
  );
}
