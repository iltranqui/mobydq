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
- `docs/design.md`: architecture decisions and open questions.

## Development

```sh
cargo test                       # core library tests

cd web
npm install
npm run dev                      # local dev server
npm run build                    # type-check (tsc) and production build
```
