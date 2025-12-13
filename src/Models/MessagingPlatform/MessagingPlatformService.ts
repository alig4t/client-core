import { BaseService } from "@/core/service/BaseService";
import type { MessagingPlatformModel } from "./MessagingPlatformModel";

class MessagingPlatformServiceClass extends BaseService<MessagingPlatformModel> {
  constructor() {
    super("/messagingplatform");
  }
}

const MessagingPlatformService = new MessagingPlatformServiceClass();

export default MessagingPlatformService;
export { MessagingPlatformService };
