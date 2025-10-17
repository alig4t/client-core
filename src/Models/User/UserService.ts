// services/UserService.ts
import { BaseService } from '@/Models/BaseService';
import type { UserModel } from '@/Models/User/UserModel';

class UserService extends BaseService<UserModel> {
  constructor() {
    super('/auth');
  }

  // Add login, register, profile, etc. as needed
}

export default new UserService();
