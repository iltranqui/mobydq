import { useState } from "react";
import { sentencePairs, tokenLinks } from "./sample";
import type { Sentence } from "./model";

interface PaneProps {
  sentence: Sentence;
  selected: string | null;
  linked: Set<string>;
  onTap: (id: string) => void;
}

function Pane({ sentence, selected, linked, onTap }: PaneProps) {
  return (
    <p className="pane" lang={sentence.lang}>
      {sentence.tokens.map((token) => {
        const classes = ["token"];
        if (token.id === selected) classes.push("selected");
        if (linked.has(token.id)) classes.push("linked");
        return (
          <span key={token.id} className={classes.join(" ")} onClick={() => onTap(token.id)}>
            {token.text}{" "}
          </span>
        );
      })}
    </p>
  );
}

export function App() {
  const [selected, setSelected] = useState<string | null>(null);
  const linked = new Set(selected ? (tokenLinks[selected] ?? []) : []);
  const tap = (id: string) => setSelected((current) => (current === id ? null : id));

  return (
    <main className="reader">
      <h1>Doppio</h1>
      <p className="hint">Tap a word. Its counterpart in the other language lights up.</p>
      {sentencePairs.map((pair) => (
        <section className="pair" key={pair.id}>
          <Pane sentence={pair.learning} selected={selected} linked={linked} onTap={tap} />
          <Pane sentence={pair.known} selected={selected} linked={linked} onTap={tap} />
        </section>
      ))}
    </main>
  );
}
