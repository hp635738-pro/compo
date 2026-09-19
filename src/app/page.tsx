"use client";

import { useEffect, useRef, useState } from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";

type Msg = { role: "user" | "assistant"; text: string };

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
    }, 900);
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
            <div className="self-start rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3.5">
              <span className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60"
                    style={{ animationDelay: `${d * 150}ms` }}
                  />
                ))}
              </span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      <footer className="px-4 pb-6">
        <div className="w-full">
          <PromptInputBox onSend={handleSend} placeholder="Type your message here...." />
        </div>
      </footer>
    </div>
  );
}
