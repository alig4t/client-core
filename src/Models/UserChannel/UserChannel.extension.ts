import type { EntityDefinitionOverrides,EntityPageProps } from "@/core/entity";
import type {
UserChannelCreateInput,
UserChannelModel,
UserChannelUpdateInput,
} from "./generated/UserChannelModel";
export const definitionOverrides: EntityDefinitionOverrides = {};
export const entityExtension: Partial<
  Omit<
    EntityPageProps<
      UserChannelModel,
      UserChannelCreateInput,
      UserChannelUpdateInput
    >,
    "definition"
  >
> = {};
