import { BaseService } from "@/core/service/BaseService";
import type { BotModel } from "./BotModel";

class BotServiceClass extends BaseService<BotModel> {
  constructor() {
    super("/bot");
  }
}

const BotService = new BotServiceClass();

export default BotService;
export { BotService };
