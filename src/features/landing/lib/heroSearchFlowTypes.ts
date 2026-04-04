export type FlowScene = "searchFlow" | "homeFlow";

export type HomePhase = "empty" | "added";

export type SearchPhase =
  | "centered"
  | "focusing"
  | "typing"
  | "lifting"
  | "submitting"
  | "results"
  | "hovering"
  | "adding"
  | "added";

export type DemoSearchBook = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  preview: string;
};
