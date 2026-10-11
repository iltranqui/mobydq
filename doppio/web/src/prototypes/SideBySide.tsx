import { sentencePairs } from "../sample";
import { TokenLine, useTokenSelection } from "./shared";

/** Prototype 1: learning language on the left, known language on the right. */
export function SideBySide() {
  const { selected, tap, linked } = useTokenSelection();

  return (
    <>
      {sentencePairs.map((pair) => (
        <section className="pair" key={pair.id}>
          <TokenLine sentence={pair.learning} selected={selected} linked={linked} onTap={tap} />
          <TokenLine sentence={pair.known} selected={selected} linked={linked} onTap={tap} />
        </section>
      ))}
    </>
  );
}
