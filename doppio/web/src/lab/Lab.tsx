import { useEffect } from "react";
import { prototypes } from "../prototypes";
import { goTo, useHashId } from "./useHash";

/**
 * Shell for the prototype lab. Shows one prototype at a time and lets you
 * switch with the tabs, the URL hash (#word-card), the back button, or keys 1–9.
 */
export function Lab() {
  const requested = useHashId();
  const index = Math.max(0, prototypes.findIndex((p) => p.id === requested));
  const active = prototypes[index];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const n = Number(event.key);
      if (Number.isInteger(n) && n >= 1 && n <= prototypes.length) {
        goTo(prototypes[n - 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="lab">
      <p className="brand">Doppio · prototype lab</p>
      <nav className="switcher" aria-label="Prototypes">
        {prototypes.map((p, i) => {
          const current = p.id === active.id;
          return (
            <a
              key={p.id}
              href={`#${p.id}`}
              className={current ? "tab active" : "tab"}
              aria-current={current ? "page" : undefined}
            >
              <kbd>{i + 1}</kbd>
              {p.title}
            </a>
          );
        })}
      </nav>
      <header className="lab-head">
        <h1>{active.title}</h1>
        <p className="hint">{active.summary}</p>
      </header>
      <active.Component />
    </div>
  );
}
