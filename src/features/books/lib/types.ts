export type BookSource = "naver" | "google";

export interface Book {
  title: string;
  author: string;
  image: string;
  publisher: string;
  isbn?: string;
  source: BookSource;
}

export interface SearchOptions {
  includeVariants?: boolean;
}
