import { BaseService } from "@/core/service/BaseService";
import type { CityModel } from "./CityModel";

class CityService extends BaseService<CityModel> {
  constructor() {
    super("/city");
  }
}

export default new CityService();
