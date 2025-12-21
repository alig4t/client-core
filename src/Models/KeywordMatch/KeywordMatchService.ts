import { BaseService } from "@/core/service/BaseService";
import type { KeywordMatchModel } from "./KeywordMatchModel";

class KeywordMatchService extends BaseService<KeywordMatchModel> {
  constructor() {
    super("/keywordmatch");
  }
}

export default new KeywordMatchService();
