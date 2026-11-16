import type { EntityDefinitionOverrides,EntityPageProps } from "@/core/entity";
import type {
MessageCreateInput,
MessageModel,
MessageUpdateInput,
} from "./generated/MessageModel";
export const definitionOverrides: EntityDefinitionOverrides = {};
export const entityExtension: Partial<
  Omit<
    EntityPageProps<MessageModel, MessageCreateInput, MessageUpdateInput>,
    "definition"
  >
> = {};
