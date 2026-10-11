import { Interleaved } from "./Interleaved";
import { SideBySide } from "./SideBySide";
import { WordCard } from "./WordCard";
import type { Prototype } from "./types";

// Order here sets the tab order and the 1–9 keyboard shortcuts.
// To add a prototype: write a component, then add an entry here.
export const prototypes: Prototype[] = [
  {
    id: "side-by-side",
    title: "Side by side",
    summary: "Two panes. Tap a word and its counterpart lights up in the other pane.",
    Component: SideBySide,
  },
  {
    id: "word-card",
    title: "Word card",
    summary: "Tap a word for a card with its counterpart, a grammar note, and the sentence in context.",
    Component: WordCard,
  },
  {
    id: "interleaved",
    title: "Interleaved",
    summary: "One stacked column for phones. The translation stays hidden until you ask for it.",
    Component: Interleaved,
  },
];
