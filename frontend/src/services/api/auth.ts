import { api } from "./client";
import type { User } from "@/types/domain";
export const authApi = {
  me: "/api/auth/me",
  login: (input: { email: string; password: string }) =>
    api<User>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  register: (input: { name: string; email: string; password: string }) =>
    api<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  logout: () => api<void>("/api/auth/logout", { method: "POST" }),
  updateProfile: (input: {
    name?: string;
    email?: string;
    password?: string;
    avatarUrl?: string | null;
  }) =>
    api<User>("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
};
