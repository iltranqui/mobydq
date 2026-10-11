import type { SentencePair, TokenLinks } from "./model";

// Hard-coded sample until the Rust core can import real EPUBs.
// Spanish is the learning language; Italian is the known one.
export const sentencePairs: SentencePair[] = [
  {
    id: "p1",
    learning: {
      id: "es-1",
      lang: "es",
      tokens: [
        { id: "es-1-1", text: "Llegaron" },
        { id: "es-1-2", text: "tarde" },
        { id: "es-1-3", text: "a" },
        { id: "es-1-4", text: "la" },
        { id: "es-1-5", text: "estación." },
      ],
    },
    known: {
      id: "it-1",
      lang: "it",
      tokens: [
        { id: "it-1-1", text: "Arrivarono" },
        { id: "it-1-2", text: "in" },
        { id: "it-1-3", text: "ritardo" },
        { id: "it-1-4", text: "alla" },
        { id: "it-1-5", text: "stazione." },
      ],
    },
  },
];

const linkPairs: [string, string][] = [
  ["es-1-1", "it-1-1"],
  ["es-1-2", "it-1-2"],
  ["es-1-2", "it-1-3"],
  ["es-1-3", "it-1-4"],
  ["es-1-4", "it-1-4"],
  ["es-1-5", "it-1-5"],
];

// Build links in both directions so tapping either language works.
export const tokenLinks: TokenLinks = {};
for (const [a, b] of linkPairs) {
  (tokenLinks[a] ??= []).push(b);
  (tokenLinks[b] ??= []).push(a);
}
