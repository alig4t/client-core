import { BaseService } from "@/core/service/BaseService";
import type { KeywordModel } from "./KeywordModel";

class KeywordService extends BaseService<KeywordModel> {
  constructor() {
    super("/keyword");
  }
}

export default new KeywordService();
