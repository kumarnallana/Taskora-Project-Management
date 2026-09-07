export type User = { id: string; name: string; email: string };
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string | null;
  assignee: User | null;
  createdAt: string;
  updatedAt: string;
};
export type MyTask = Task & { project: { id: string; name: string } };
export type Member = { createdAt: string; user: User };
export type Project = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
  progress: number;
};
export type ProjectSummary = Project & {
  memberIds: string[];
  memberCount: number;
  taskCount: number;
  completedTaskCount: number;
  inProgressTaskCount: number;
};
export type ProjectDetail = Project & { members: Member[]; tasks: Task[] };
export type ProjectInput = { name: string; description: string };
export type TaskInput = {
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string | null;
};
