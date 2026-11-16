import { EntitySearch } from "@/core/entity";
import type { EntityInput } from "@/core/entity";
import { MessagingPlatformDefinition } from "./MessagingPlatform.definition";
export default function MessagingPlatformSearch({
  onApplyFilters,
}: {
  onApplyFilters: (values: EntityInput) => void;
}) {
  return (
    <EntitySearch
      definition={MessagingPlatformDefinition}
      onApply={onApplyFilters}
    />
  );
}
