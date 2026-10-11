import type { ComponentType } from "react";

/** One screen in the prototype lab. Each one tests a single interaction or layout idea. */
export interface Prototype {
  /** Used in the URL hash (#id), so every prototype has a shareable link. */
  id: string;
  title: string;
  /** One line on what this prototype is trying to answer. */
  summary: string;
  Component: ComponentType;
}
