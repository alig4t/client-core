import type { EntityDefinitionOverrides,EntityPageProps } from "@/core/entity";
import type {
KeywordCreateInput,
KeywordModel,
KeywordUpdateInput,
} from "./generated/KeywordModel";
export const definitionOverrides: EntityDefinitionOverrides = {};
export const entityExtension: Partial<
  Omit<
    EntityPageProps<KeywordModel, KeywordCreateInput, KeywordUpdateInput>,
    "definition"
  >
> = {};
