export interface Token {
  id: string;
  text: string;
}

export interface Sentence {
  id: string;
  lang: string;
  tokens: Token[];
}

export interface SentencePair {
  id: string;
  learning: Sentence;
  known: Sentence;
}

/** Maps a token id to the ids of its counterparts in the other language. Symmetric. */
export type TokenLinks = Record<string, string[]>;
