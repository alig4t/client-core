// services/UserService.ts
import { api } from '@/core/service/Axios';
import { BaseService } from '@/core/service/BaseService';
import type { UserModel } from '@/Models/User/UserModel';

class UserService extends BaseService<UserModel> {
  constructor() {
    super('/auth');
  }

  
    login = (data: { username: string; password: string }) => {
      return api.post("/auth/login", data);
    };
  
    register = (data: { name: string; username: string; password: string }) => {
      return api.post("/auth/register", data);
    };
  
    getAll = () => {
      return api.get("/auth/users");
    };
  

  // Add login, register, profile, etc. as needed
}

export default new UserService();
