import { useEffect } from "react";
import { sentencePairs, tokenLinks } from "../sample";
import { TokenLine, locate, useTokenSelection } from "./shared";

const noLinks = new Set<string>();

/**
 * Prototype 2: the learning text stays clean. Tapping a word opens a card with its
 * counterpart, a grammar note, and the other-language sentence with matches highlighted.
 */
export function WordCard() {
  const { selected, tap, clear, linked } = useTokenSelection();
  const hit = selected ? locate(selected) : undefined;
  // The sentence to show in context is the one in the other language.
  const other = hit && (hit.sentence === hit.pair.learning ? hit.pair.known : hit.pair.learning);
  const counterparts = selected
    ? (tokenLinks[selected] ?? []).map((id) => locate(id)?.token.text ?? id)
    : [];

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") clear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, clear]);

  return (
    <>
      {sentencePairs.map((pair) => (
        <section className="block" key={pair.id}>
          <TokenLine sentence={pair.learning} selected={selected} linked={noLinks} onTap={tap} className="big" />
        </section>
      ))}

      {hit && other && (
        <aside className="card" role="dialog" aria-label={`About ${hit.token.text}`}>
          <div className="card-head">
            <div>
              <strong className="card-word">{hit.token.text}</strong>
              {hit.token.note && <span className="card-note">{hit.token.note}</span>}
            </div>
            <button type="button" className="close" onClick={clear} aria-label="Close">
              ×
            </button>
          </div>
          <p className="card-label">Counterpart</p>
          {counterparts.length > 0 ? (
            <p>
              {counterparts.map((text) => (
                <span key={text} className="chip">
                  {text}
                </span>
              ))}
            </p>
          ) : (
            <p className="muted">No counterpart yet.</p>
          )}
          <p className="card-label">In context</p>
          <TokenLine sentence={other} selected={selected} linked={linked} onTap={tap} className="muted" />
        </aside>
      )}
    </>
  );
}
