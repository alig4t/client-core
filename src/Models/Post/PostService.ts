// services/PostService.ts
import { BaseService } from '@/core/service/BaseService';
import type { PostModel } from '@/Models/Post/PostModel';

class PostService extends BaseService<PostModel> {
  constructor() {
    super('/posts');
  }
}

export default new PostService();
