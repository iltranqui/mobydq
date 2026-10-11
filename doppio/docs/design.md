# Design notes

## Decisions

- **Rust core as a library, no server in v1.** The desktop shell (Tauri) calls
  `reader_core` directly. The iOS shell is open: spike Tauri mobile first, and
  fall back to UniFFI with a SwiftUI shell if it is rough.
- **No SQL.** Books are whole files written once. User state (known words,
  flashcards, reviews) is an append-only JSON Lines log, which can later be
  merged across devices. Writes that replace a file are atomic (temp file + rename).
- **TypeScript front end** (React). Type-check with the official TypeScript 7.0
  compiler (`tsc`). The community Rust port (ts-rust) is not a dependency.
- **Alignment pipeline.** Chapter and paragraph anchors, then sentence alignment
  (length-based baseline now; add sentence embeddings later), then word alignment.
  Word alignment will likely run as a Python import step at first.
- **Lookup order.** The counterpart in the other language comes first, because the
  book's own translation shows meaning in context. A dictionary gloss second, and
  an LLM sentence explanation third (cached per sentence).

## Open questions

- Word-alignment tool (eflomal vs. awesome-align) and whether it runs on-device.
- Mobile shell: Tauri mobile vs. UniFFI + SwiftUI.
- Dictionary source per language (Wiktionary extracts, English vs. Italian glosses).
- Chinese support: word segmentation (jieba-rs) before word alignment.

## Test material

Public-domain editions of a children's classic (for example, Pinocchio) are a
good first pair, if available in both languages on Project Gutenberg or Wikisource.
