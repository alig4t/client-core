import { BaseService, type ApiResponsePayload } from "@/core/service/BaseService";
import type { ChannelModel } from "../ChannelModel";
import type { OwnedChannelModel } from "./OwnedChannelModel";

class OwnedChannelService extends BaseService<OwnedChannelModel> {
  constructor() {
    super("/owned-channels");
  }

  authorized(): Promise<ApiResponsePayload<OwnedChannelModel>> {
    return this.call<ApiResponsePayload<OwnedChannelModel>>(
      "get",
      "/authorized",
      true,
    );
  }

  pending(): Promise<ApiResponsePayload<OwnedChannelModel>> {
    return this.call<ApiResponsePayload<OwnedChannelModel>>(
      "get",
      "/pending",
      true,
    );
  }

}

export default new OwnedChannelService();
