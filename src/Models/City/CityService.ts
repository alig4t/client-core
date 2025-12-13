import { BaseService } from "@/core/service/BaseService";
import type { CityModel } from "./CityModel";

class CityServiceClass extends BaseService<CityModel> {
  constructor() {
    super("/city");
  }
}

const CityService = new CityServiceClass();

export default CityService;
export { CityService };
