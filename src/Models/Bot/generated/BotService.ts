import { BaseService } from "@/core/service/BaseService";
import type { BotModel, BotCreateInput, BotUpdateInput } from "./BotModel";
import { BotDefinition } from "./Bot.definition";
const service = new BaseService<BotModel, BotCreateInput, BotUpdateInput>(
  "/bot",
  undefined,
  { operations: BotDefinition.operations },
);
export default service;
