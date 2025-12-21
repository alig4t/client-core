import { BaseService } from "@/core/service/BaseService";
import type { ComprehensiveEntityModel } from "./ComprehensiveEntityModel";

class ComprehensiveEntityService extends BaseService<ComprehensiveEntityModel> {
  constructor() {
    super("/comprehensiveentity");
  }
}

export default new ComprehensiveEntityService();
