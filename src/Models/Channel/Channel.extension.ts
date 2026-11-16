import type { EntityDefinitionOverrides,EntityPageProps } from "@/core/entity";
import type {
ChannelCreateInput,
ChannelModel,
ChannelUpdateInput,
} from "./generated/ChannelModel";
export const definitionOverrides: EntityDefinitionOverrides = {};
export const entityExtension: Partial<
  Omit<
    EntityPageProps<ChannelModel, ChannelCreateInput, ChannelUpdateInput>,
    "definition"
  >
> = {};
