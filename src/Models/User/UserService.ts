import { BaseService } from "@/core/service/BaseService";
import type { UserModel } from "./UserModel";

class UserService extends BaseService<UserModel> {
  constructor() {
    super("/user");
  }
}

export default new UserService();
