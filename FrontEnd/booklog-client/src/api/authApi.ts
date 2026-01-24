import { http } from "./http";
import type { AuthResponseDto } from "../types/models";

export async function loginApi(username: string, password: string) {
  const res = await http.post<AuthResponseDto>("/auth/login", { username, password });
  return res.data;
}

export async function registerApi(username: string, password: string, role: string) {
  const res = await http.post<AuthResponseDto>("/auth/register", { username, password, role });
  return res.data;
}
