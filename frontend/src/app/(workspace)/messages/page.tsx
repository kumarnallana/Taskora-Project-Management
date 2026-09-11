"use client";
import { useState } from "react";
import useSWR from "swr";
import { MessageSquare, Hash, ArrowLeft } from "lucide-react";
import { api } from "@/services/api/client";
import { chatApi, type ChatIndex } from "@/services/api/chat";
import { ChatThread } from "@/components/chat/ChatThread";
import { Avatar } from "@/components/shared/Avatar";
import { ErrorMessage, Loading } from "@/components/shared/Feedback";
import type { User } from "@/types/domain";

export default function MessagesPage() {
  const { data, error, mutate } = useSWR<ChatIndex>(chatApi.list, api, {
    refreshInterval: 10000,
  });
  const { data: contacts, error: contactsError } = useSWR<User[]>(
    chatApi.contacts,
    api,
  );
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<unknown>();
  async function open(
    input: { projectId: string } | { userId: string },
    name: string,
  ) {
    setBusy(true);
    setFailure(undefined);
    try {
      const conversation = await chatApi.open(input);
      setSelected({ id: conversation.id, name });
      void mutate();
    } catch (error) {
      setFailure(error);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Better together</p>
          <h1>Messages</h1>
          <p>Keep the conversation close to the work.</p>
        </div>
      </div>
      <ErrorMessage error={failure || error || contactsError} />
      {error && (
        <button
          className="btn btn-secondary mb-4"
          onClick={() => void mutate()}
        >
          Retry conversations
        </button>
      )}
      <div className={`chat-workspace ${selected ? "has-conversation" : ""}`}>
        <aside className="chat-sidebar" aria-label="Conversations">
          <div className="p-5 border-b border-line">
            <h2 className="text-sm font-semibold">Your conversations</h2>
            <label className="field mt-4">
              Start a direct message
              <select
                className="input !text-xs"
                value=""
                disabled={busy}
                onChange={(event) => {
                  const contact = contacts?.find(
                    (entry) => entry.id === event.target.value,
                  );
                  if (contact) void open({ userId: contact.id }, contact.name);
                }}
              >
                <option value="">
                  {contacts?.length ? "Choose a teammate" : "No teammates yet"}
                </option>
                {contacts?.map((contact) => (
                  <option value={contact.id} key={contact.id}>
                    {contact.name} · {contact.email}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {!data && !error && <Loading />}
          <div className="p-3">
            <p className="eyebrow !my-3 !px-2">Projects</p>
            {data?.projects.map((project) => (
              <button
                key={project.id}
                className={`chat-channel ${data.conversations.some((entry) => entry.id === selected?.id && entry.projectId === project.id) ? "active" : ""}`}
                disabled={busy}
                onClick={() =>
                  void open({ projectId: project.id }, project.name)
                }
              >
                <Hash size={17} />
                <span className="truncate">{project.name}</span>
              </button>
            ))}
            {data && !data.projects.length && (
              <p className="p-2 text-xs text-muted">
                Join a project to start chatting with your team.
              </p>
            )}
            <p className="eyebrow !mt-6 !mb-3 !px-2">Direct messages</p>
            {data?.conversations
              .filter((entry) => !entry.projectId)
              .map((conversation) => (
                <button
                  key={conversation.id}
                  className={`chat-channel ${selected?.id === conversation.id ? "active" : ""}`}
                  onClick={() =>
                    setSelected({
                      id: conversation.id,
                      name: conversation.name,
                    })
                  }
                >
                  <Avatar
                    name={conversation.name}
                    image={conversation.participant?.avatarUrl}
                  />
                  <span className="truncate">{conversation.name}</span>
                </button>
              ))}
          </div>
        </aside>
        <div className="chat-main">
          {selected ? (
            <>
              <button
                className="btn btn-secondary mb-3 md:hidden"
                onClick={() => setSelected(null)}
              >
                <ArrowLeft size={16} />
                Conversations
              </button>
              <ChatThread
                key={selected.id}
                conversationId={selected.id}
                title={selected.name}
              />
            </>
          ) : (
            <div className="chat-empty h-full">
              <MessageSquare size={32} />
              <h2>Good work starts with a conversation</h2>
              <p>Open a project channel or send a teammate a direct message.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
