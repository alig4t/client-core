import { createModelMeta } from "@/core/models/modelMetaUtils";
import { BotDefinition } from "./Bot.definition";
export const BotModelMeta = {
  ...createModelMeta(BotDefinition.fields, "token", "ربات", "ربات‌ها"),
  definition: BotDefinition,
  displayField: "token" as const,
};
