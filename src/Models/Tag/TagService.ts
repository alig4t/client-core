// services/TagService.ts
import { BaseService } from '@/Models/BaseService';
import type { TagModel } from '@/Models/Tag/TagModel';

class TagService extends BaseService<TagModel> {
  constructor() {
    super('/tags');
  }
}

export default new TagService();
