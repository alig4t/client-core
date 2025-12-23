import { BaseService } from "@/core/service/BaseService";
import type { MessagingPlatformModel } from "./MessagingPlatformModel";
import { api } from "@/core/service/Axios";

export type DraftDto = {
  platformKey: string,
  authorizationType: "MONITORING_CHANNEL" | "NOTIFICATION_CHANNEL";
}
class PlatformAuthorizationControllerService extends BaseService<MessagingPlatformModel> {
  constructor() {
    super("/messaging-platform");
  }

  // draftAuthorizations(dto: DraftDto) {
  //   return api.post("/messagingplatform/authorizations/draft", dto);
  // }

  draftAuthorizations(dto: DraftDto) {
    return this.call(
      "post",
      "authorizations/draft",
      dto
    );
  }

}

export default new PlatformAuthorizationControllerService();
