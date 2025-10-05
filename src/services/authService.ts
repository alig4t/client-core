import { api } from "@/lib/axios";

export const login = (data: { username: string; password: string }) => {
  return api.post("/auth/login", data);
};

export const register = (data: { name: string; username: string; password: string }) => {
  return api.post("/auth/register", data);
};