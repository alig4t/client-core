import { EntitySearch } from "@/core/entity";
import type { EntityInput } from "@/core/entity";
import { ChannelDefinition } from "./Channel.definition";
export default function ChannelSearch({
  onApplyFilters,
}: {
  onApplyFilters: (values: EntityInput) => void;
}) {
  return (
    <EntitySearch definition={ChannelDefinition} onApply={onApplyFilters} />
  );
}
