"use client";
import useSWR from "swr";
import { chatApi } from "@/services/api/chat";
import { Loading, LoadError } from "@/components/shared/Feedback";
import { ChatThread } from "./ChatThread";

export function ProjectChat({ projectId }: { projectId: string }) {
  const { data, error, mutate } = useSWR(
    ["project-chat", projectId],
    () => chatApi.open({ projectId }),
    { shouldRetryOnError: false },
  );
  if (error) return <LoadError error={error} retry={() => void mutate()} />;
  if (!data) return <Loading />;
  return (
    <ChatThread key={data.id} conversationId={data.id} title="Project chat" />
  );
}
