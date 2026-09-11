import { api } from "./client";
import type { Attachment, ChatMessage, Conversation } from "@/types/domain";
export const chatApi = {
  list: "/api/chat",
  contacts: "/api/chat/contacts",
  open: (input: { projectId: string } | { userId: string }) =>
    api<{ id: string }>("/api/chat", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  messages: (id: string) => `/api/chat/${id}/messages`,
  send: (
    id: string,
    input: { body: string; attachmentIds: string[]; clientId: string },
  ) =>
    api<ChatMessage>(`/api/chat/${id}/messages`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  upload: (
    file: File,
    context: { conversationId: string } | { purpose: "avatar" },
  ) => {
    const body = new FormData();
    body.append("file", file);
    return api<Attachment>(`/api/files?${new URLSearchParams(context)}`, {
      method: "POST",
      body,
    });
  },
  pending: (id: string) =>
    api<Attachment[]>(`/api/files/pending?conversationId=${id}`),
  removeFile: (id: string) =>
    api<void>(`/api/files/${id}`, { method: "DELETE" }),
};
export type ChatIndex = {
  conversations: Conversation[];
  projects: { id: string; name: string }[];
};
