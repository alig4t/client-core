import { BaseService } from "@/core/service/BaseService";
import type {
  MessageModel,
  MessageCreateInput,
  MessageUpdateInput,
} from "./MessageModel";
import { MessageDefinition } from "./Message.definition";
const service = new BaseService<
  MessageModel,
  MessageCreateInput,
  MessageUpdateInput
>("/message", undefined, { operations: MessageDefinition.operations });
export default service;
