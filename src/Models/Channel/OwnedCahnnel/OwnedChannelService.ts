import { BaseService,type ApiResponsePayload } from "@/core/service/BaseService";
import { normalizePage } from "@/core/service/contracts";
import type { OwnedChannelModel } from "./OwnedChannelModel";

class OwnedChannelService extends BaseService<OwnedChannelModel> {
  constructor() {
    super("/owned-channels");
  }

  async authorized(): Promise<ApiResponsePayload<OwnedChannelModel>> {
    return normalizePage(await this.request<OwnedChannelModel[]>({ method: "get", path: "authorized" }));
  }

  async pending(): Promise<ApiResponsePayload<OwnedChannelModel>> {
    return normalizePage(await this.request<OwnedChannelModel[]>({ method: "get", path: "pending" }));
  }

}

export default new OwnedChannelService();
