import { BaseService } from "@/core/service/BaseService";
import type { ChannelModel } from "./ChannelModel";

class OwnedChannelService extends BaseService<ChannelModel> {
  constructor() {
    super("/owned-channels");
  }

    // draftAuthorizations(dto: DraftDto) {
    //   return this.call(
    //     "post",
    //     "authorizations/draft",
    //     dto
    //   );
    // }
  
}

export default new OwnedChannelService();
