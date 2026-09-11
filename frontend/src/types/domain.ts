export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
};
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
export type MyTask = Task & {
  canManageTasks: boolean;
  project: { id: string; name: string };
};
export type Member = { role: "MEMBER" | "LEAD"; createdAt: string; user: User };
export type Project = {
  canManageTasks: boolean;
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

export type Attachment = {
  id: string;
  name: string;
  mime: string;
  size: number;
  url?: string;
};
export type Conversation = {
  id: string;
  projectId: string | null;
  name: string;
  participant: User | null;
  updatedAt: string;
};
export type ChatMessage = {
  id: string;
  body: string;
  senderId: string;
  clientId: string;
  sender: User;
  createdAt: string;
  attachments: Attachment[];
};
export type MessagePage = {
  messages: ChatMessage[];
  nextCursor: string | null;
};
