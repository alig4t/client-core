import { BaseService } from "@/core/service/BaseService";
import type { ComprehensiveEntityModel } from "./ComprehensiveEntityModel";

class ComprehensiveEntityServiceClass extends BaseService<ComprehensiveEntityModel> {
  constructor() {
    super("/comprehensiveentity");
  }
}

const ComprehensiveEntityService = new ComprehensiveEntityServiceClass();

export default ComprehensiveEntityService;
export { ComprehensiveEntityService };
