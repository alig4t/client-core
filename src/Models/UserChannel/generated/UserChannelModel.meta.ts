import { createModelMeta } from "@/core/models/modelMetaUtils";
import { UserChannelDefinition } from "./UserChannel.definition";
export const UserChannelModelMeta = {
  ...createModelMeta(
    UserChannelDefinition.fields,
    "role",
    "کاربر-کانال",
    "کاربران-کانال",
  ),
  definition: UserChannelDefinition,
  displayField: "role" as const,
};
