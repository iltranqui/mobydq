export interface Token {
  id: string;
  text: string;
  /** Short grammar note shown in the word card, for example a tense and person. */
  note?: string;
}

export interface Sentence {
  id: string;
  lang: string;
  tokens: Token[];
  /** Trailing punctuation. It is shown but not tappable. */
  end?: string;
}

export interface SentencePair {
  id: string;
  learning: Sentence;
  known: Sentence;
}

/** Maps a token id to the ids of its counterparts in the other language. Symmetric. */
export type TokenLinks = Record<string, string[]>;
