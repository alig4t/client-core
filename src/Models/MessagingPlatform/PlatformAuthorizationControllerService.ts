import { BaseService } from "@/core/service/BaseService";
import type { MessagingPlatformModel } from "./MessagingPlatformModel";

export type DraftDto = { platformKey: string; authorizationType: "MONITORING_CHANNEL" | "NOTIFICATION_CHANNEL"; chatTitle: string };
export interface PlatformAuthorization { id: number; ownedChannelId: number; verificationCode: string; chatTitle: string; platformKey: string; authorizationType: string; status: string; createdAt: string }
class PlatformAuthorizationControllerService extends BaseService<MessagingPlatformModel> {
  constructor() { super("/messaging-platform"); }
  draftAuthorizations(dto: DraftDto) { return this.call<PlatformAuthorization>({ method: "post", path: "authorizations/draft", body: dto }); }
  authorizations() { return this.call<PlatformAuthorization[]>({ method: "get", path: "authorizations" }); }
  authorizationsByStatus(status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED") {
    return this.call<PlatformAuthorization[]>({ method: "get", path: "authorizations/my/by-status", query: { status, page: 0, size: 10 } });
  }
  approveAuthorization(id: number) { return this.call({ method: "put", path: "authorizations/" + id + "/approve" }); }
  rejectAuthorization(id: number) { return this.call({ method: "put", path: "authorizations/" + id + "/reject" }); }
}
export default new PlatformAuthorizationControllerService();
