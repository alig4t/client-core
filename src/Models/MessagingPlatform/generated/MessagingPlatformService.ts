import { BaseService } from "@/core/service/BaseService";
import type {
  MessagingPlatformModel,
  MessagingPlatformCreateInput,
  MessagingPlatformUpdateInput,
} from "./MessagingPlatformModel";
import { MessagingPlatformDefinition } from "./MessagingPlatform.definition";
const service = new BaseService<
  MessagingPlatformModel,
  MessagingPlatformCreateInput,
  MessagingPlatformUpdateInput
>("/messagingplatform", undefined, {
  operations: MessagingPlatformDefinition.operations,
});
export default service;
