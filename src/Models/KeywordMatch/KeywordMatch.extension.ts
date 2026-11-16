import type { EntityDefinitionOverrides,EntityPageProps } from "@/core/entity";
import type {
KeywordMatchCreateInput,
KeywordMatchModel,
KeywordMatchUpdateInput,
} from "./generated/KeywordMatchModel";
export const definitionOverrides: EntityDefinitionOverrides = {};
export const entityExtension: Partial<
  Omit<
    EntityPageProps<
      KeywordMatchModel,
      KeywordMatchCreateInput,
      KeywordMatchUpdateInput
    >,
    "definition"
  >
> = {};
