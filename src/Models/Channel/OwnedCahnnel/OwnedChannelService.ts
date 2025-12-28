import { BaseService } from "@/core/service/BaseService";
import type { ChannelModel } from "../ChannelModel";
import type { OwnedChannelModel } from "./OwnedChannelModel";

class OwnedChannelService extends BaseService<OwnedChannelModel> {
  constructor() {
    super("/owned-channels");
  }

  authorized() {
    return this.call(
      "get",
      "/authorized",
    );
  }


  pending() {
    return this.call(
      "get",
      "/pending",
    );
  }

}

export default new OwnedChannelService();
