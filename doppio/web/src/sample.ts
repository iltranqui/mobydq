import type { SentencePair, TokenLinks } from "./model";

// Hard-coded sample until the Rust core can import real EPUBs.
// Spanish is the learning language; Italian is the known one.
export const sentencePairs: SentencePair[] = [
  {
    id: "p1",
    learning: {
      id: "es-1",
      lang: "es",
      end: ".",
      tokens: [
        { id: "es-1-1", text: "Llegaron", note: "pret. indefinido, 3.ª pl. · llegar" },
        { id: "es-1-2", text: "tarde", note: "adv." },
        { id: "es-1-3", text: "a", note: "prep." },
        { id: "es-1-4", text: "la", note: "art. def. f." },
        { id: "es-1-5", text: "estación", note: "sust. f." },
      ],
    },
    known: {
      id: "it-1",
      lang: "it",
      end: ".",
      tokens: [
        { id: "it-1-1", text: "Arrivarono" },
        { id: "it-1-2", text: "in" },
        { id: "it-1-3", text: "ritardo" },
        { id: "it-1-4", text: "alla" },
        { id: "it-1-5", text: "stazione" },
      ],
    },
  },
  {
    id: "p2",
    learning: {
      id: "es-2",
      lang: "es",
      end: ".",
      tokens: [
        { id: "es-2-1", text: "Nadie", note: "pron. indef." },
        { id: "es-2-2", text: "lo", note: "pron. pers." },
        { id: "es-2-3", text: "sabía", note: "pret. imperfecto, 1.ª/3.ª sg. · saber" },
      ],
    },
    known: {
      id: "it-2",
      lang: "it",
      end: ".",
      tokens: [
        { id: "it-2-1", text: "Nessuno" },
        { id: "it-2-2", text: "lo" },
        { id: "it-2-3", text: "sapeva" },
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
  ["es-2-1", "it-2-1"],
  ["es-2-2", "it-2-2"],
  ["es-2-3", "it-2-3"],
];

// Build links in both directions so tapping either language works.
export const tokenLinks: TokenLinks = {};
for (const [a, b] of linkPairs) {
  (tokenLinks[a] ??= []).push(b);
  (tokenLinks[b] ??= []).push(a);
}
