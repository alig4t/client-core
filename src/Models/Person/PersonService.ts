// services/PersonService.ts
import { BaseService } from '@/Models/BaseService';
import type { PersonModel } from '@/Models/Person/PersonModel';

class PersonService extends BaseService<PersonModel> {
  constructor() {
    super('/persons');
  }
}

export default new PersonService();
