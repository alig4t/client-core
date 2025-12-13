import { BaseService } from "@/core/service/BaseService";
import type { PersonModel } from "./PersonModel";

class PersonServiceClass extends BaseService<PersonModel> {
  constructor() {
    super("/person");
  }
}

const PersonService = new PersonServiceClass();

export default PersonService;
export { PersonService };
