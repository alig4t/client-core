import { api } from "@/core/service/Axios";
import { BaseService,type ServerSideParams } from "@/core/service/BaseService";
import { normalizePage } from "@/core/service/contracts";
import type { User } from "@/stores/AuthContext";
import type { UserModel } from "./UserModel";
interface AuthResponse { token: string; user: User }
class UserService extends BaseService<UserModel> {
  constructor() { super("/auth/users"); }
  login(data: { username: string; password: string }) { return api.post<AuthResponse>("/auth/login", data); }
  register(data: { name: string; username: string; password: string }) { return api.post<AuthResponse>("/auth/register", data); }
  async getAll(params: ServerSideParams<UserModel> = {}) {
    const response = await api.get<UserModel[]>("/auth/users", { params: { page: params.page, size: params.size, sort: params.sort, ...params.filters }, signal: params.signal });
    return normalizePage(response, params.page, params.size);
  }
}
export default new UserService();
