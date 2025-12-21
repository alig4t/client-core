import { BaseService } from "@/core/service/BaseService";
import type { BotModel } from "./BotModel";

class BotService extends BaseService<BotModel> {
  constructor() {
    super("/bot");
  }
}

export default new BotService();
