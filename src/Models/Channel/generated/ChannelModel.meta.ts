import { createModelMeta } from "@/core/models/modelMetaUtils";
import { ChannelDefinition } from "./Channel.definition";
export const ChannelModelMeta = {
  ...createModelMeta(
    ChannelDefinition.fields,
    "channelName",
    "کانال",
    "کانال‌ها",
  ),
  definition: ChannelDefinition,
  displayField: "channelName" as const,
};
