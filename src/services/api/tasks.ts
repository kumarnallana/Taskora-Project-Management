import { api } from "./client";
import type { Task, TaskInput } from "@/types/domain";
export const tasksApi = {
  mine: "/api/tasks/mine",
  create: (projectId: string, input: TaskInput) =>
    api<Task>(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: Partial<TaskInput>) =>
    api<Task>(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) => api<void>(`/api/tasks/${id}`, { method: "DELETE" }),
};
