import { BaseService } from "@/core/service/BaseService";
import type { UserChannelModel } from "./UserChannelModel";

class UserChannelServiceClass extends BaseService<UserChannelModel> {
  constructor() {
    super("/userchannel");
  }
}

const UserChannelService = new UserChannelServiceClass();

export default UserChannelService;
export { UserChannelService };
