import type { DemoSearchBook } from "@/features/landing/lib/heroSearchFlowTypes";

export const DEMO_QUERY = "하루키";
export const INITIAL_BOOK_ID = "norwegian-wood";
export const DEV_ONLY_SEARCH_FLOW = true;

export const FLOW_TIMINGS = {
  centered: 700,
  focusing: 700,
  typingChar: 100,
  typingHold: 700,
  lifting: 700,
  submitting: 700,
  results: 700,
  hovering: 700,
  adding: 500,
  added: 500,
  loopPause: 900,
  // TODO: 책 정보 입력 / home 페이지 Scene추가
} as const;

export const DEMO_SEARCH_RESULTS: DemoSearchBook[] = [
  {
    id: "norwegian-wood",
    title: "노르웨이의 숲",
    author: "무라카미 하루키",
    publisher: "문학사상",
    preview:
      "하루키 월드의 빛나는 다이아몬드 무라카미 하루키를 만나기 위해 가장 먼저 읽어야 할 책!",
  },
];

export const SCENE_VARIANTS = {
  initial: { opacity: 0, y: 14, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.99 },
};
