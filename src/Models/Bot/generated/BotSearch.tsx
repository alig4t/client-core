import { EntitySearch } from "@/core/entity";
import type { EntityInput } from "@/core/entity";
import { BotDefinition } from "./Bot.definition";
export default function BotSearch({
  onApplyFilters,
}: {
  onApplyFilters: (values: EntityInput) => void;
}) {
  return <EntitySearch definition={BotDefinition} onApply={onApplyFilters} />;
}
