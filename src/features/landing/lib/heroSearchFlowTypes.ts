export type FlowScene = "searchFlow";

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
