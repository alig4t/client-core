import { BaseService } from "@/core/service/BaseService";
import type { MessagingPlatformModel } from "./MessagingPlatformModel";

class MessagingPlatformService extends BaseService<MessagingPlatformModel> {
  constructor() {
    super("/messagingplatform");
  }
}

export default new MessagingPlatformService();
