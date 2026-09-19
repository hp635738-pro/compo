"use client";

import { useEffect, useRef, useState } from "react";
import { ModelIcon, PromptInputBox } from "@/components/ui/ai-prompt-box";
import { SidebarNav } from "@/components/ui/dashboard-sidebar";
import { ThinkingOrb } from "@/components/ui/thinking-orbs";

type Msg = { role: "user" | "assistant"; text: string; model?: string };
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
  const isEmpty = !active && !pending;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convos, pending]);

  const startNewChat = () => {
    setActiveId(null);
    setPending(false);
  };

  const handleSend = (
    message: string,
    files?: File[],
    meta?: { model?: string },
  ) => {
    const fileNote =
      files && files.length > 0 ? `  ·  📎 ${files.length} file(s)` : "";
    const modelUsed = meta?.model ?? "Max";
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
        model: modelUsed,
      };
      setConvos((cs) => [convo, ...cs]);
      setActiveId(id);
    } else {
      setConvos((cs) =>
        cs.map((c) =>
          c.id === id
            ? { ...c, model: modelUsed, msgs: [...c.msgs, userMsg] }
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
            ? {
                ...c,
                msgs: [
                  ...c.msgs,
                  { role: "assistant", text: reply, model: modelUsed },
                ],
              }
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

      <div className="dark relative z-10 h-full flex-shrink-0 max-md:hidden">
        <SidebarNav />
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <main
          className={`${
            isEmpty ? "overflow-hidden" : "overflow-y-auto"
          } flex-1 px-4 py-4`}
        >
          {isEmpty ? (
            <div className="flex h-full flex-col justify-center pb-16">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-light text-white/85">
                  How can I help today?
                </h1>
                <p className="mt-3 text-sm text-white/40">
                  Type a command or ask a question
                </p>
              </div>
              <PromptInputBox
                onSend={handleSend}
                placeholder="Type your message here...."
                hasConversation={false}
                onNewChat={startNewChat}
                onModeChange={setMode}
              />
            </div>
          ) : (
            <div className="flex min-h-full flex-col gap-3">
              <div className="mt-auto" />
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
                  {m.model && (
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] tracking-wide text-white/45">
                      <ModelIcon
                        name={m.model}
                        className="h-3.5 w-3.5 text-[#F97316]"
                      />
                      <span>{m.model}</span>
                    </div>
                  )}
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
          )}
        </main>

        {!isEmpty && (
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
        )}
      </div>

    </div>
  );
}
