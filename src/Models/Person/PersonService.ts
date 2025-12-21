import { BaseService } from "@/core/service/BaseService";
import type { PersonModel } from "./PersonModel";

class PersonService extends BaseService<PersonModel> {
  constructor() {
    super("/person");
  }
}

export default new PersonService();
