"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Copy, EnvelopeSimple, X } from "@phosphor-icons/react/dist/ssr";
import { cta, site } from "@/content/profile";
import { sound } from "@/lib/sound";

export type ContactKind = "hire" | "build";
type Ctx = { open: (kind: ContactKind) => void };
const ContactCtx = createContext<Ctx>({ open: () => {} });
export const useContact = () => useContext(ContactCtx);

const COPY: Record<ContactKind, { title: string; subject: string; hint: string }> = {
  hire: { title: "Write to me about a role", subject: "Role: let's talk", hint: "A line about the team and the role is enough; I reply within a day." },
  build: { title: "Tell me what you want built", subject: "Project: what I want built", hint: "What you want built, who it is for, and when you need it. Two paragraphs are plenty." },
};

/**
 * The contact sheet. A mailto link does nothing in a browser without a mail
 * app, so the notes open this instead: the address to copy, and a button
 * that still hands off to the mail app for those who have one.
 */
export function ContactProvider({ children }: { children: ReactNode }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<ContactKind>("hire");
  const [copied, setCopied] = useState(false);

  const open = useCallback((k: ContactKind) => {
    setKind(k);
    setCopied(false);
    sound.pop();
    const d = dlg.current;
    if (d && !d.open) d.showModal();
  }, []);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    const onClick = (e: MouseEvent) => {
      if (e.target === d) d.close();
    };
    d.addEventListener("click", onClick);
    return () => d.removeEventListener("click", onClick);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      sound.tick();
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* the address is also selectable text */
    }
  };

  const c = COPY[kind];
  const href = kind === "hire" ? cta.hire.href : cta.build.href;

  return (
    <ContactCtx.Provider value={{ open }}>
      {children}
      <dialog ref={dlg} className="sheet" aria-labelledby="sheet-title" data-no-draw>
        <form method="dialog" className="sheet-body">
          <button type="submit" className="tool sheet-close" aria-label="Close">
            <X size={18} />
          </button>
          <p className="hand text-[1.2rem]">{c.title}</p>
          <p className="display-md text-[clamp(1.35rem,2.6vw,1.9rem)] mt-2 break-all select-all">{site.email}</p>
          <p className="mono text-xs text-ink-2 mt-3">Subject: {c.subject}</p>
          <p className="text-[0.9375rem] text-ink-2 mt-3 max-w-[40ch]">{c.hint}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={href} className="btn btn-marker" onClick={() => sound.tick()}>
              <EnvelopeSimple size={18} /> Open your mail app
            </a>
            <button type="button" className="btn" onClick={copy}>
              <Copy size={18} /> {copied ? "Copied" : "Copy the address"}
            </button>
          </div>
        </form>
      </dialog>
    </ContactCtx.Provider>
  );
}
