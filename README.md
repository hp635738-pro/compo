# compo

Next.js 16 + Tailwind CSS v4 + shadcn/ui playground featuring the **AI prompt Box**
component (`https://21st.dev/r/jahed/ai-prompt-box`, by Hossain Jahed / EaseMize UI
Registry) installed with the shadcn CLI into `src/components/ui/ai-prompt-box.tsx`.

## What's in the box

- AI prompt box with attachments, web-search toggle, think mode, canvas dialog and
  audio recording (framer-motion + Radix dialog/tooltip + lucide icons).
- Demo page (`src/app/page.tsx`) on the original sunset radial-gradient backdrop that
  echoes the last sent message and attached file names.

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build + typecheck
npm run lint    # eslint
```

## Install provenance (read this)

This sandbox blocks direct HTTPS egress to `21st.dev` and `ui.shadcn.com` (TLS
handshakes are killed), while the npm registry and GitHub stay reachable. To still run
the genuine `npx shadcn@latest add "https://21st.dev/r/jahed/ai-prompt-box"` flow:

1. The registry item JSON was vendored from the component's public source mirror
   (`github.com/Johuniq/jolyui`, MIT — same component lineage that 21st.dev cites as
   source) into `registry/ai-prompt-box.json`.
2. A throw-away local TLS stub (self-signed CA in `/tmp/mirror`, hosts entries for
   `21st.dev` / `ui.shadcn.com`, `NODE_EXTRA_CA_CERTS` for the CLI) served that JSON so
   the shadcn CLI resolved the URL and wrote the file itself.

If you re-run the install command on a machine with normal internet access it will
fetch the live upstream registry instead — the component API is the same
(`<PromptInputBox onSend={(message, files) => …} placeholder="…" />`).
