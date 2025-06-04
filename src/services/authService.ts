import { api } from "@/lib/axios";

export const login = (data: { email: string; password: string }) => {
  return api.post("/auth/login", data);
};
