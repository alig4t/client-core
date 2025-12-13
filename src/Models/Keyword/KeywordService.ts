import { BaseService } from "@/core/service/BaseService";
import type { KeywordModel } from "./KeywordModel";

class KeywordServiceClass extends BaseService<KeywordModel> {
  constructor() {
    super("/keyword");
  }
}

const KeywordService = new KeywordServiceClass();

export default KeywordService;
export { KeywordService };
