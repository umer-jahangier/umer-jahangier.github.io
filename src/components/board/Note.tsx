"use client";
import { sound } from "@/lib/sound";
import { TransitionLink } from "@/components/motion/Eraser";
import { useContact } from "@/components/ui/ContactSheet";

/** A sticky note that is also a call to action. */
export default function Note({ href, title, sub, rose = false, tilt, download = false }: { href: string; title: string; sub?: string; rose?: boolean; tilt?: number; download?: boolean }) {
  const contact = useContact();
  const style = { "--tilt": `${tilt ?? (rose ? 1.4 : -1.2)}deg` } as React.CSSProperties;
  const cls = `note ${rose ? "note-rose" : ""}`;
  const inner = (
    <>
      <span className="note-title">{title}</span>
      {sub && <span className="note-sub">{sub}</span>}
    </>
  );
  const external = href.startsWith("mailto:") || href.startsWith("http") || download;
  if (external) {
    return (
      <a
        href={href}
        className={cls}
        style={style}
        download={download || undefined}
        onPointerEnter={() => sound.pop()}
        onClick={(e) => {
          if (!href.startsWith("mailto:") || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          contact.open(rose ? "build" : "hire");
        }}
        data-no-draw
      >
        {inner}
      </a>
    );
  }
  return (
    <TransitionLink href={href} className={cls} style={style} onPointerEnter={() => sound.pop()}>
      {inner}
    </TransitionLink>
  );
}
