"use client";

import { useState } from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";

export default function Home() {
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [lastFiles, setLastFiles] = useState<File[]>([]);

  return (
    <div className="flex w-full h-screen flex-col justify-center items-center bg-[radial-gradient(125%_125%_at_50%_101%,rgba(245,87,2,1)_10.5%,rgba(245,120,2,1)_16%,rgba(245,140,2,1)_17.5%,rgba(245,170,100,1)_25%,rgba(238,174,202,1)_40%,rgba(202,179,214,1)_65%,rgba(148,201,233,1)_100%)]">
      <div className="p-4 w-[500px] max-w-[92vw]">
        <PromptInputBox
          onSend={(message, files) => {
            setLastMessage(message);
            setLastFiles(files ?? []);
          }}
          placeholder="Type your message here...."
        />
      </div>
      {lastMessage !== null && (
        <div className="mt-6 max-w-[500px] w-[92vw] rounded-2xl bg-black/40 backdrop-blur px-5 py-4 text-sm text-white/90">
          <p className="mb-1 text-xs uppercase tracking-widest text-white/60">
            Sent{lastFiles.length > 0 ? ` · ${lastFiles.length} file(s)` : ""}
          </p>
          <p className="whitespace-pre-wrap break-words">
            {lastMessage || "(empty message)"}
          </p>
          {lastFiles.length > 0 && (
            <p className="mt-2 text-white/70">
              {lastFiles.map((f) => f.name).join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
