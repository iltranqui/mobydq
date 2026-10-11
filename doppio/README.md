# Doppio

A bilingual EPUB reader for language learners. Load two editions of the same
book in different languages, read them side by side, and tap a word to see its
counterpart in the language you already know.

**Status:** early skeleton. The Rust core has sentence splitting, a length-based
sentence aligner, and local file storage. The web front end shows one
hard-coded Spanish/Italian sentence with tap-to-highlight.

## Layout

- `crates/reader_core/`: Rust library for segmentation, alignment, and storage.
  No server and no SQL.
- `web/`: TypeScript + React front end.
  - `web/src/lab/`: the prototype switcher (tabs, URL hash routing, 1–9 keys).
  - `web/src/prototypes/`: one file per prototype, plus the registry in `index.ts`.
  - `web/src/sample.ts`: hard-coded sentence pairs and word links for the prototypes.
- `docs/design.md`: architecture decisions and open questions.

## Prototype lab

The web app opens a lab with one tab per interaction prototype. Each tab is a
self-contained screen that tests one idea:

| Key | Prototype | Question it answers |
|---|---|---|
| 1 | Side by side | Does a two-pane layout with linked highlights work? |
| 2 | Word card | Is a card with counterpart, grammar, and context better than highlights alone? |
| 3 | Interleaved | Is a stacked, phone-first layout with hidden translations usable? |

Switch prototypes with the tabs, the number keys, the back button, or a link
such as `#word-card`.

To add a prototype, create a component in `web/src/prototypes/`, then add an
entry to the array in `web/src/prototypes/index.ts`. The array order sets the
tab order and the number-key shortcuts.

## Development

```sh
cargo test                       # core library tests

cd web
npm install
npm run dev                      # local dev server
npm run build                    # type-check (tsc) and production build
```
