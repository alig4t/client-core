import type { EntityDefinitionOverrides,EntityPageProps } from "@/core/entity";
import type {
ComprehensiveEntityCreateInput,
ComprehensiveEntityModel,
ComprehensiveEntityUpdateInput,
} from "./generated/ComprehensiveEntityModel";
export const definitionOverrides: EntityDefinitionOverrides = {};
export const entityExtension: Partial<
  Omit<
    EntityPageProps<
      ComprehensiveEntityModel,
      ComprehensiveEntityCreateInput,
      ComprehensiveEntityUpdateInput
    >,
    "definition"
  >
> = {};
