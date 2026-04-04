import type {
  DemoSearchBook,
  FlowScene,
} from "@/features/landing/lib/heroSearchFlowTypes";

export const DEMO_QUERY = "노르웨이의 숲";
export const INITIAL_BOOK_ID = "norwegian-wood";

export const DEV_ONLY_SCENE: FlowScene | null = null;

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
  homeEmpty: 700,
  homeAdded: 1000,
  loopPause: 900,
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
  {
    id: "maskerade-game",
    title: "매스커레이드 게임",
    author: "히가시노 게이고",
    publisher: "현대문학",
    preview:
      "누적 판매 부수 1억 권, 출간작 100권을 자랑하는 스타 작가 히가시노 게이고의 대표작",
  },
];

export const SCENE_VARIANTS = {
  initial: { opacity: 0, y: 14, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.99 },
};
