"use client";

import { useEffect, useRef, useState } from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { ThinkingOrb } from "@/components/ui/thinking-orbs";

type Msg = { role: "user" | "assistant"; text: string };
type Mode = "text" | "search" | "models";

const ORB_STATE: Record<Mode, "composing" | "searching" | "working"> = {
  text: "composing",
  search: "searching",
  models: "working",
};
const ORB_LABEL: Record<Mode, string> = {
  text: "Thinking…",
  search: "Searching…",
  models: "Working…",
};

const DUMMY_REPLIES = [
  "This is a dummy reply — real model integration coming soon! 🤖",
  "Got it! (dummy response) Main abhi demo mode mein hoon.",
  "Interesting! Though I'm just a dummy reply for now.",
  "Demo reply: aapka message mil gaya. Backend jald connect hoga!",
  "Hmm, let me think… just kidding — dummy mode ON 🙂",
];

export default function Home() {
  const [thread, setThread] = useState<Msg[]>([]);
  const [pending, setPending] = useState(false);
  const [mode, setMode] = useState<Mode>("text");
  const replyIdx = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread, pending]);

  const handleSend = (message: string, files?: File[]) => {
    const fileNote =
      files && files.length > 0 ? `  ·  📎 ${files.length} file(s)` : "";
    setThread((t) => [...t, { role: "user", text: message + fileNote }]);
    setPending(true);
    window.setTimeout(() => {
      const reply = DUMMY_REPLIES[replyIdx.current % DUMMY_REPLIES.length];
      replyIdx.current += 1;
      setThread((t) => [...t, { role: "assistant", text: reply }]);
      setPending(false);
    }, 1400);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-black">
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex min-h-full flex-col gap-3">
          <div className="mt-auto" />
          {thread.length === 0 && !pending && (
            <p className="mb-2 text-center text-sm text-white/40">
              Kuch bhi poochho — demo abhi dummy replies deta hai.
            </p>
          )}
          {thread.map((m, i) =>
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
                className="max-w-[80%] self-start rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm break-words whitespace-pre-wrap text-white/90"
              >
                {m.text}
              </div>
            ),
          )}
          {pending && (
            <div
              className="inline-flex items-center gap-2 self-start rounded-full pl-1 pr-4"
              style={{
                background: "rgba(29,29,29,0.42)",
                boxShadow:
                  "inset 0 0 0 1px rgba(44,47,54,0.31), inset 0 50px 0 0 rgba(255,255,255,0.012)",
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
            hasConversation={thread.length > 0}
            onNewChat={() => setThread([])}
            onModeChange={setMode}
          />
        </div>
      </footer>
    </div>
  );
}
