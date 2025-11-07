import { api } from "@/lib/axios";
import { BaseService } from "@/Models/BaseService";
import type { UserModel } from "@/Models/User/UserModel";


class AuthService extends BaseService<UserModel> {
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

}

export default new AuthService();
