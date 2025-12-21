import { BaseService } from "@/core/service/BaseService";
import type { UserChannelModel } from "./UserChannelModel";

class UserChannelService extends BaseService<UserChannelModel> {
  constructor() {
    super("/userchannel");
  }
}

export default new UserChannelService();
