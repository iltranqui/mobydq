import { useCallback, useState } from "react";
import type { Sentence, SentencePair, Token } from "../model";
import { sentencePairs, tokenLinks } from "../sample";

/** Finds a token by id, along with its sentence and sentence pair. */
export function locate(
  id: string,
): { token: Token; sentence: Sentence; pair: SentencePair } | undefined {
  for (const pair of sentencePairs) {
    for (const sentence of [pair.learning, pair.known]) {
      const token = sentence.tokens.find((t) => t.id === id);
      if (token) return { token, sentence, pair };
    }
  }
  return undefined;
}

/** Tap-to-link selection, shared by every prototype that has it. */
export function useTokenSelection() {
  const [selected, setSelected] = useState<string | null>(null);
  const tap = useCallback(
    (id: string) => setSelected((current) => (current === id ? null : id)),
    [],
  );
  const clear = useCallback(() => setSelected(null), []);
  const linked = new Set(selected ? (tokenLinks[selected] ?? []) : []);
  return { selected, tap, clear, linked };
}

interface TokenLineProps {
  sentence: Sentence;
  selected: string | null;
  linked: Set<string>;
  onTap: (id: string) => void;
  className?: string;
}

/** One sentence as tappable words. The selected word and its counterparts get their own styles. */
export function TokenLine({ sentence, selected, linked, onTap, className }: TokenLineProps) {
  return (
    <p className={`line ${className ?? ""}`.trim()} lang={sentence.lang}>
      {sentence.tokens.map((token, i) => {
        const classes = ["token"];
        if (token.id === selected) classes.push("selected");
        if (linked.has(token.id)) classes.push("linked");
        const last = i === sentence.tokens.length - 1;
        return (
          <span key={token.id} className={classes.join(" ")} onClick={() => onTap(token.id)}>
            {last ? token.text : `${token.text} `}
          </span>
        );
      })}
      {sentence.end}
    </p>
  );
}
