"use client";
import { useEffect, useState } from "react";
import { Eraser, Moon, SpeakerHigh, SpeakerSlash, Sun } from "@phosphor-icons/react/dist/ssr";
import { getPrefs, loadPrefs, setPrefs, subscribePrefs, type Marker } from "@/lib/prefs";
import { sound } from "@/lib/sound";

const markers: { id: Marker; label: string; css: string }[] = [
  { id: "marker", label: "Cobalt marker", css: "var(--marker)" },
  { id: "rose", label: "Rose marker", css: "var(--rose)" },
  { id: "ink", label: "Graphite marker", css: "var(--ink)" },
];

/** The whiteboard-app toolbar: theme, sound, marker colour, clear the board. */
export default function Toolbar() {
  const [p, setP] = useState(() => getPrefs());
  useEffect(() => {
    setP({ ...loadPrefs() });
    return subscribePrefs((n) => setP({ ...n }));
  }, []);
  const night = p.theme === "night";
  return (
    <div
      data-no-draw
      role="toolbar"
      aria-label="Board tools"
      className="fixed z-[60] flex flex-row gap-2 p-1.5 rounded-[10px] panel bottom-4 right-4 max-md:right-auto max-md:left-1/2 max-md:-translate-x-1/2 max-md:bottom-3"
    >
      <button
        type="button"
        className="tool"
        aria-label={night ? "Switch to day board" : "Switch to night board"}
        title={night ? "Day board" : "Night board"}
        onClick={() => {
          setPrefs({ theme: night ? "day" : "night" });
          sound.tick();
        }}
      >
        {night ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <button
        type="button"
        className="tool"
        aria-pressed={p.sound}
        aria-label={p.sound ? "Turn sound off" : "Turn sound on"}
        title={p.sound ? "Sound on" : "Sound off"}
        onClick={() => {
          const next = !p.sound;
          setPrefs({ sound: next });
          if (next) {
            sound.unlock();
            sound.pop();
          }
        }}
      >
        {p.sound ? <SpeakerHigh size={20} /> : <SpeakerSlash size={20} />}
      </button>
      <span className="w-px self-stretch bg-[var(--line)]" aria-hidden />
      {markers.map((m) => (
        <button
          key={m.id}
          type="button"
          className="tool"
          aria-pressed={p.marker === m.id}
          aria-label={m.label}
          title={m.label}
          onClick={() => {
            setPrefs({ marker: m.id });
            sound.tick();
          }}
        >
          <span className="swatch" style={{ background: m.css }} />
        </button>
      ))}
      <button
        type="button"
        className="tool"
        aria-label="Clear your drawings"
        title="Clear your drawings"
        onClick={() => {
          window.dispatchEvent(new Event("board:clear"));
          sound.swoosh();
        }}
      >
        <Eraser size={20} />
      </button>
    </div>
  );
}
