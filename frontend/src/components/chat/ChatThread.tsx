"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import useSWR from "swr";
import { Download, Paperclip, Send, Smile, X } from "lucide-react";
import { api, ApiError } from "@/services/api/client";
import { authApi } from "@/services/api/auth";
import { chatApi } from "@/services/api/chat";
import { Avatar } from "@/components/shared/Avatar";
import { ErrorMessage, Loading } from "@/components/shared/Feedback";
import type {
  Attachment,
  ChatMessage,
  MessagePage,
  User,
} from "@/types/domain";

export function ChatThread({
  conversationId,
  title,
}: {
  conversationId: string;
  title: string;
}) {
  const { data: user } = useSWR<User>(authApi.me, api);
  const { data, error, mutate } = useSWR<MessagePage>(
    chatApi.messages(conversationId),
    api,
    { refreshInterval: 3000, shouldRetryOnError: false },
  );
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [cursor, setCursor] = useState<string | null | undefined>();
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [busy, setBusy] = useState(false);
  const [recovering, setRecovering] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [failure, setFailure] = useState<unknown>();
  const [emojis, setEmojis] = useState(false);
  const pending = useRef<Attachment[]>([]);
  const clientId = useRef<string | null>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const picker = useRef<HTMLInputElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const messages = [...history, ...(data?.messages || [])]
    .filter(
      (message, index, all) =>
        all.findIndex((entry) => entry.id === message.id) === index,
    )
    .sort((a, b) => a.id.localeCompare(b.id));
  const unavailable =
    error instanceof ApiError && [401, 403, 404].includes(error.status);
  const nextCursor = cursor === undefined ? data?.nextCursor : cursor;
  useEffect(() => {
    if (data)
      setHistory((current) =>
        [...current, ...data.messages].filter(
          (message, index, all) =>
            all.findIndex((entry) => entry.id === message.id) === index,
        ),
      );
  }, [data]);
  useEffect(() => {
    if (nearBottom.current && viewport.current)
      viewport.current.scrollTop = viewport.current.scrollHeight;
  }, [messages.length]);
  useEffect(() => {
    let active = true;
    chatApi
      .pending(conversationId)
      .then((files) => {
        if (active) {
          pending.current = files;
          setAttachments(files);
        }
      })
      .catch((error) => {
        if (active) setFailure(error);
      })
      .finally(() => {
        if (active) setRecovering(false);
      });
    return () => {
      active = false;
    };
  }, [conversationId]);
  useEffect(
    () => () => {
      for (const attachment of pending.current)
        void chatApi.removeFile(attachment.id).catch(() => {});
    },
    [],
  );
  async function upload(files: FileList | null) {
    if (!files?.length || busy) return;
    if (
      attachments.length + files.length > 4 ||
      Array.from(files).some((file) => file.size > 25 * 1024 * 1024)
    ) {
      setFailure(
        new Error("Choose up to 4 attachments, each 25 MB or smaller."),
      );
      return;
    }
    setBusy(true);
    setFailure(undefined);
    try {
      for (const file of Array.from(files)) {
        const attachment = await chatApi.upload(file, { conversationId });
        pending.current = [...pending.current, attachment];
        setAttachments([...pending.current]);
      }
      clientId.current = null;
    } catch (error) {
      setFailure(error);
    } finally {
      setBusy(false);
      if (picker.current) picker.current.value = "";
    }
  }
  async function send(event: FormEvent) {
    event.preventDefault();
    if (busy || (!body.trim() && !attachments.length)) return;
    setBusy(true);
    setFailure(undefined);
    clientId.current ||= crypto.randomUUID();
    try {
      const message = await chatApi.send(conversationId, {
        body,
        attachmentIds: attachments.map((file) => file.id),
        clientId: clientId.current,
      });
      pending.current = [];
      setAttachments([]);
      setBody("");
      clientId.current = null;
      nearBottom.current = true;
      setHistory((current) => [...current, message]);
      void mutate();
      textarea.current?.focus();
    } catch (error) {
      setFailure(error);
    } finally {
      setBusy(false);
    }
  }
  async function older() {
    if (!nextCursor || loadingOlder) return;
    setLoadingOlder(true);
    setFailure(undefined);
    const height = viewport.current?.scrollHeight || 0;
    try {
      const page = await api<MessagePage>(
        `${chatApi.messages(conversationId)}?before=${nextCursor}`,
      );
      nearBottom.current = false;
      setHistory((current) => [...page.messages, ...current]);
      setCursor(page.nextCursor);
      requestAnimationFrame(() => {
        if (viewport.current)
          viewport.current.scrollTop += viewport.current.scrollHeight - height;
      });
    } catch (error) {
      setFailure(error);
    } finally {
      setLoadingOlder(false);
    }
  }
  return (
    <section className="chat-thread" aria-label={title}>
      <header className="chat-header">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="mt-1 text-xs text-muted">
            A shared place for ideas, updates, and files.
          </p>
        </div>
        <span className="badge bg-canvas text-accent">Team space</span>
      </header>
      <div
        className="chat-stream"
        ref={viewport}
        onScroll={() => {
          const el = viewport.current;
          if (el)
            nearBottom.current =
              el.scrollHeight - el.scrollTop - el.clientHeight < 100;
        }}
      >
        {nextCursor && (
          <button
            className="btn btn-secondary mx-auto mb-4"
            disabled={loadingOlder}
            onClick={() => void older()}
          >
            {loadingOlder ? "Loading…" : "Earlier messages"}
          </button>
        )}
        {!data && !error && <Loading />}
        {error && (
          <div>
            <ErrorMessage error={error} />
            <button className="btn btn-secondary" onClick={() => void mutate()}>
              Retry messages
            </button>
          </div>
        )}
        {data && !messages.length && (
          <div className="chat-empty">
            <Smile size={28} />
            <h3>Start the conversation</h3>
            <p>
              Share an update, ask a question, or bring your work into the
              conversation.
            </p>
          </div>
        )}
        {!unavailable && (
          <div role="log" aria-label="Messages" aria-relevant="additions">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`chat-message ${message.senderId === user?.id ? "is-own" : ""}`}
              >
                <Avatar
                  name={message.sender.name}
                  image={message.sender.avatarUrl}
                />
                <div className="chat-message-content">
                  <div className="mb-1.5 flex flex-wrap items-baseline gap-2">
                    <span className="text-xs font-semibold">
                      {message.senderId === user?.id
                        ? "You"
                        : message.sender.name}
                    </span>
                    <time
                      className="text-[10px] text-muted"
                      dateTime={message.createdAt}
                      title={new Date(message.createdAt).toLocaleString()}
                    >
                      {new Date(message.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  <div className="chat-bubble">
                    {message.body && (
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                        {message.body}
                      </p>
                    )}
                    {message.attachments.map((file) => (
                      <div key={file.id} className="chat-attachment">
                        {/^image\/(jpeg|png|gif|webp|avif)$/.test(
                          file.mime,
                        ) && (
                          <a
                            href={`/api/files/${file.id}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={`/api/files/${file.id}`}
                              alt={file.name}
                              loading="lazy"
                              onLoad={() => {
                                if (nearBottom.current && viewport.current)
                                  viewport.current.scrollTop =
                                    viewport.current.scrollHeight;
                              }}
                            />
                          </a>
                        )}
                        {file.mime.startsWith("video/") && (
                          <video
                            controls
                            preload="none"
                            src={`/api/files/${file.id}`}
                            aria-label={file.name}
                          />
                        )}
                        {file.mime.startsWith("audio/") && (
                          <audio
                            controls
                            preload="none"
                            src={`/api/files/${file.id}`}
                            aria-label={file.name}
                          />
                        )}
                        <a
                          className="chat-file-link"
                          href={`/api/files/${file.id}?download=1`}
                        >
                          <Download size={16} />
                          <span className="min-w-0 flex-1 truncate">
                            {file.name}
                          </span>
                          <span className="text-[10px] text-muted">
                            {file.size < 1048576
                              ? Math.ceil(file.size / 1024) + " KB"
                              : (file.size / 1048576).toFixed(1) + " MB"}
                          </span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <form onSubmit={send} className="chat-composer">
        <fieldset disabled={unavailable || !data || recovering}>
          <ErrorMessage error={failure} />
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((file) => (
                <span className="chat-pending" key={file.id}>
                  <Paperclip size={13} />
                  <span className="max-w-36 truncate">{file.name}</span>
                  <button
                    type="button"
                    disabled={busy}
                    aria-label={`Remove ${file.name}`}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await chatApi.removeFile(file.id);
                        pending.current = pending.current.filter(
                          (entry) => entry.id !== file.id,
                        );
                        setAttachments([...pending.current]);
                        clientId.current = null;
                      } catch (error) {
                        setFailure(error);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    <X size={15} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <label className="sr-only" htmlFor={`message-${conversationId}`}>
            Message
          </label>
          <textarea
            id={`message-${conversationId}`}
            ref={textarea}
            value={body}
            disabled={busy}
            maxLength={4000}
            rows={2}
            placeholder="Message your teammates…"
            onChange={(event) => {
              setBody(event.target.value);
              clientId.current = null;
            }}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                void send(event);
              }
            }}
          />
          {emojis && (
            <div
              className="flex flex-wrap gap-1 py-2"
              aria-label="Emoji picker"
            >
              {["👍", "❤️", "🎉", "😊", "🚀", "✅", "👀", "🙏", "💡", "🙌"].map(
                (emoji) => (
                  <button
                    type="button"
                    className="icon-button text-lg"
                    disabled={busy || body.length > 3996}
                    key={emoji}
                    aria-label={`Insert ${emoji}`}
                    onClick={() => {
                      setBody((value) => value + emoji);
                      clientId.current = null;
                      setEmojis(false);
                      textarea.current?.focus();
                    }}
                  >
                    {emoji}
                  </button>
                ),
              )}
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <input
                ref={picker}
                className="sr-only"
                tabIndex={-1}
                type="file"
                multiple
                aria-label="Attach files"
                onChange={(event) => void upload(event.target.files)}
              />
              <button
                className="icon-button"
                type="button"
                disabled={busy || attachments.length >= 4}
                aria-label="Add attachments"
                onClick={() => picker.current?.click()}
              >
                <Paperclip size={18} />
              </button>
              <button
                className="icon-button"
                type="button"
                disabled={busy}
                aria-label="Choose emoji"
                aria-expanded={emojis}
                onClick={() => setEmojis(!emojis)}
              >
                <Smile size={18} />
              </button>
              <span className="hidden text-[10px] text-muted sm:inline">
                Up to 4 files · 25 MB each
              </span>
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={busy || (!body.trim() && !attachments.length)}
            >
              <Send size={15} />
              {busy ? "Working…" : "Send"}
            </button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
