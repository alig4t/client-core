import { BaseService } from "@/core/service/BaseService";
import type { ChannelModel } from "./ChannelModel";

class ChannelServiceClass extends BaseService<ChannelModel> {
  constructor() {
    super("/channel");
  }
}

const ChannelService = new ChannelServiceClass();

export default ChannelService;
export { ChannelService };
