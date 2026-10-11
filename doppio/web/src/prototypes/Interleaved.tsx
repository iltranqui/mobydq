import { useState } from "react";
import { sentencePairs } from "../sample";
import { TokenLine, useTokenSelection } from "./shared";

/**
 * Prototype 3: one stacked column for phones. Each translation stays hidden until
 * asked for, so the reader sees the learning text first.
 */
export function Interleaved() {
  const { selected, tap, linked } = useTokenSelection();
  const [shown, setShown] = useState<string[]>([]);

  const toggle = (id: string) =>
    setShown((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );

  return (
    <>
      {sentencePairs.map((pair) => {
        const open = shown.includes(pair.id);
        return (
          <section className="block" key={pair.id}>
            <TokenLine sentence={pair.learning} selected={selected} linked={linked} onTap={tap} className="big" />
            {open && (
              <TokenLine sentence={pair.known} selected={selected} linked={linked} onTap={tap} className="muted" />
            )}
            <button type="button" className="toggle" aria-expanded={open} onClick={() => toggle(pair.id)}>
              {open ? "Hide translation" : "Show translation"}
            </button>
          </section>
        );
      })}
    </>
  );
}
