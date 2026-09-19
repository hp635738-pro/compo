"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { ThinkingOrb } from "@/components/ui/thinking-orbs";

type Msg = { role: "user" | "assistant"; text: string };
type Mode = "text" | "search" | "models" | "code";
type Convo = {
  id: string;
  title: string;
  msgs: Msg[];
  createdAt: number;
  model?: string;
};

const ORB_STATE: Record<
  Mode,
  "composing" | "searching" | "working" | "shaping"
> = {
  text: "composing",
  search: "searching",
  models: "working",
  code: "shaping",
};
const ORB_LABEL: Record<Mode, string> = {
  text: "Thinking…",
  search: "Searching…",
  models: "Working…",
  code: "Coding…",
};

const DUMMY_REPLIES = [
  "This is a dummy reply — real model integration coming soon! 🤖",
  "Got it! (dummy response) Main abhi demo mode mein hoon.",
  "Interesting! Though I'm just a dummy reply for now.",
  "Demo reply: aapka message mil gaya. Backend jald connect hoga!",
  "Hmm, let me think… just kidding — dummy mode ON 🙂",
];

let seq = 0;

export default function Home() {
  const [convos, setConvos] = useState<Convo[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [mode, setMode] = useState<Mode>("text");
  const replyIdx = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = convos.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convos, pending]);

  const startNewChat = () => {
    setActiveId(null);
    setPending(false);
  };

  const deleteConvo = (id: string) => {
    setConvos((cs) => cs.filter((c) => c.id !== id));
    if (activeId === id) {
      setActiveId(null);
      setPending(false);
    }
  };

  const handleSend = (
    message: string,
    files?: File[],
    meta?: { model?: string },
  ) => {
    const fileNote =
      files && files.length > 0 ? `  ·  📎 ${files.length} file(s)` : "";
    const userMsg: Msg = { role: "user", text: message + fileNote };
    let id = activeId;
    if (!id || !convos.some((c) => c.id === id)) {
      seq += 1;
      id = `c${Date.now()}-${seq}`;
      const convo: Convo = {
        id,
        title: message.slice(0, 42) || "New chat",
        msgs: [userMsg],
        createdAt: Date.now(),
        model: meta?.model,
      };
      setConvos((cs) => [convo, ...cs]);
      setActiveId(id);
    } else {
      setConvos((cs) =>
        cs.map((c) =>
          c.id === id
            ? { ...c, model: meta?.model ?? c.model, msgs: [...c.msgs, userMsg] }
            : c,
        ),
      );
    }
    setPending(true);
    window.setTimeout(() => {
      const reply = DUMMY_REPLIES[replyIdx.current % DUMMY_REPLIES.length];
      replyIdx.current += 1;
      setConvos((cs) =>
        cs.map((c) =>
          c.id === id
            ? { ...c, msgs: [...c.msgs, { role: "assistant", text: reply }] }
            : c,
        ),
      );
      setPending(false);
    }, 1400);
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-black">
      {/* decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(75%_65%_at_50%_35%,black,transparent)]" />
        <div className="absolute -top-28 left-1/2 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-[#F97316]/15 blur-3xl" />
        <div className="absolute top-1/3 -left-24 h-64 w-64 rounded-full bg-[#8B5CF6]/10 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-[#1EAEDB]/10 blur-3xl" />
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex min-h-full flex-col gap-3">
            {active || pending ? <div className="mt-auto" /> : null}
            {!active && !pending && (
              <div className="flex flex-1 -translate-y-8 flex-col items-center justify-center text-center">
                <h1 className="text-3xl font-light text-white/85">
                  How can I help today?
                </h1>
                <p className="mt-3 text-sm text-white/40">
                  Type a command or ask a question
                </p>
              </div>
            )}
            {active?.msgs.map((m, i) =>
              m.role === "user" ? (
                <div
                  key={i}
                  className="max-w-[80%] self-end rounded-2xl border border-[#F97316]/40 bg-[#F97316]/15 px-4 py-3 text-sm break-words whitespace-pre-wrap text-orange-50"
                >
                  {m.text}
                </div>
              ) : (
                <div
                  key={i}
                  className="max-w-[80%] self-start rounded-2xl border border-white/10 bg-neutral-900/80 px-4 py-3 text-sm break-words whitespace-pre-wrap text-white/90 backdrop-blur"
                >
                  {m.text}
                </div>
              ),
            )}
            {pending && (
              <div
                className="inline-flex items-center gap-2 self-start rounded-full pr-4 pl-1"
                style={{
                  background: "rgba(29,29,29,0.42)",
                  boxShadow: "inset 0 0 0 1px rgba(44,47,54,0.31)",
                }}
              >
                <ThinkingOrb state={ORB_STATE[mode]} size={32} theme="dark" />
                <span className="text-xs whitespace-nowrap text-white/50">
                  {ORB_LABEL[mode]}
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </main>

        <footer className="px-4 pb-6">
          <div className="w-full">
            <PromptInputBox
              onSend={handleSend}
              placeholder="Type your message here...."
              hasConversation={!!active && active.msgs.length > 0}
              onNewChat={startNewChat}
              onModeChange={setMode}
            />
          </div>
        </footer>
      </div>

      <aside className="relative flex w-64 flex-shrink-0 flex-col border-l border-white/10 bg-neutral-950 md:w-72">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="text-sm font-medium text-white/80">History</h2>
          <button
            type="button"
            onClick={startNewChat}
            className="flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" /> New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {convos.length === 0 && (
            <p className="px-2 py-6 text-center text-xs text-white/35">
              No chats yet.
              <br />
              History yahan manage hogi.
            </p>
          )}
          {convos.map((c) => (
            <div
              key={c.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                setActiveId(c.id);
                setPending(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setActiveId(c.id);
                  setPending(false);
                }
              }}
              className={`group mb-1 flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left ${
                c.id === activeId
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs">{c.title}</span>
                {c.model && (
                  <span className="block truncate text-[10px] text-[#F97316]/80">
                    ↳ {c.model}
                  </span>
                )}
              </span>
              <button
                type="button"
                title="Delete chat"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConvo(c.id);
                }}
                className="hidden rounded p-1 text-white/40 group-hover:block hover:bg-white/10 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 p-2">
          <button
            type="button"
            disabled={convos.length === 0}
            onClick={() => {
              setConvos([]);
              setActiveId(null);
              setPending(false);
            }}
            className="w-full rounded-lg border border-white/10 px-2 py-1.5 text-xs text-white/60 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
          >
            Clear all history
          </button>
        </div>
      </aside>
    </div>
  );
}
