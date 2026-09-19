"use client";

import { useState } from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";

export default function Home() {
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [lastFiles, setLastFiles] = useState<File[]>([]);

  return (
    <div className="flex h-screen w-full flex-col bg-black">
      <main className="flex flex-1 flex-col items-stretch justify-end overflow-y-auto px-4 pb-4">
        {lastMessage !== null && (
          <div className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-5 py-4 text-sm text-white/90">
            <p className="mb-1 text-xs tracking-widest text-white/60 uppercase">
              Sent{lastFiles.length > 0 ? ` · ${lastFiles.length} file(s)` : ""}
            </p>
            <p className="break-words whitespace-pre-wrap">
              {lastMessage || "(empty message)"}
            </p>
            {lastFiles.length > 0 && (
              <p className="mt-2 text-white/70">
                {lastFiles.map((f) => f.name).join(", ")}
              </p>
            )}
          </div>
        )}
      </main>

      <footer className="px-4 pb-6">
        <div className="w-full">
          <PromptInputBox
            onSend={(message, files) => {
              setLastMessage(message);
              setLastFiles(files ?? []);
            }}
            placeholder="Type your message here...."
          />
        </div>
      </footer>
    </div>
  );
}
