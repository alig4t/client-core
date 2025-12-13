import { BaseService } from "@/core/service/BaseService";
import type { KeywordMatchModel } from "./KeywordMatchModel";

class KeywordMatchServiceClass extends BaseService<KeywordMatchModel> {
  constructor() {
    super("/keywordmatch");
  }
}

const KeywordMatchService = new KeywordMatchServiceClass();

export default KeywordMatchService;
export { KeywordMatchService };
