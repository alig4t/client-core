import type { EntityDefinitionOverrides,EntityPageProps } from "@/core/entity";
import type {
BotCreateInput,
BotModel,
BotUpdateInput,
} from "./generated/BotModel";
export const definitionOverrides: EntityDefinitionOverrides = {};
export const entityExtension: Partial<
  Omit<
    EntityPageProps<BotModel, BotCreateInput, BotUpdateInput>,
    "definition"
  >
> = {};
