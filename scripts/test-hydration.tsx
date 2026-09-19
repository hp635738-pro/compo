/**
 * Hydration parity check for <PromptInputBox />:
 * renders the real component to an SSR string (like Next.js server render),
 * then hydrates it with react-dom/client inside jsdom (like the browser)
 * and reports any React hydration warnings/errors.
 */
import React from "react";
import { renderToString } from "react-dom/server";
import { JSDOM } from "jsdom";

async function main() {
  // Set up browser-like globals BEFORE importing client react / the component
  const dom = new JSDOM(
    "<!doctype html><html><body><div id=\"r\"></div></body></html>",
    { pretendToBeVisual: true, url: "http://localhost/" },
  );
  (globalThis as any).window = dom.window;
  (globalThis as any).document = dom.window.document;
  Object.defineProperty(globalThis, "navigator", {
    value: dom.window.navigator,
    configurable: true,
  });
  if (!dom.window.matchMedia) {
    (dom.window as any).matchMedia = () => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    });
  }
  (globalThis as any).matchMedia = (dom.window as any).matchMedia;

  const errors: string[] = [];
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    errors.push(args.map(String).join(" ").slice(0, 300));
    origError(...args);
  };

  const { PromptInputBox } = await import("../src/components/ui/ai-prompt-box");
  const app = React.createElement(PromptInputBox, { onSend: () => {} });

  // Server render
  const html = renderToString(app);
  document.getElementById("r")!.innerHTML = html;

  // Client hydrate
  const { hydrateRoot } = await import("react-dom/client");
  hydrateRoot(document.getElementById("r")!, app);
  await new Promise((resolve) => setTimeout(resolve, 800));

  const hydrationIssues = errors.filter(
    (e) => /hydrat|did not match|server|Text|reconcil/i.test(e),
  );
  console.log(
    hydrationIssues.length
      ? `HYDRATION_ISSUES=${hydrationIssues.length}`
      : "HYDRATION_OK",
  );
  hydrationIssues.forEach((e) => console.log("  -", e));
  process.exit(hydrationIssues.length ? 1 : 0);
}

main().catch((e) => {
  console.error("TEST_FAILED", e);
  process.exit(2);
});
