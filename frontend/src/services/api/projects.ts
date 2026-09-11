import { api } from "./client";
import type { ProjectInput, Project, Member, User } from "@/types/domain";
export const projectsApi = {
  list: "/api/projects",
  detail: (id: string) => `/api/projects/${id}`,
  create: (input: ProjectInput) =>
    api<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: ProjectInput) =>
    api<Project>(`/api/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    api<void>(`/api/projects/${id}`, { method: "DELETE" }),
  addMember: (id: string, email: string) =>
    api<Member>(`/api/projects/${id}/members`, {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  setMemberRole: (id: string, userId: string, role: Member["role"]) =>
    api<Member>(`/api/projects/${id}/members/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
  availableMembers: (id: string) =>
    api<User[]>(`/api/projects/${id}/members/available`),
  removeMember: (id: string, userId: string) =>
    api<void>(`/api/projects/${id}/members/${userId}`, { method: "DELETE" }),
};
