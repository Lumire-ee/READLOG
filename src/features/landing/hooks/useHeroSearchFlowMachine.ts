import {
  DEMO_DETAIL_TARGET_CURRENT_PAGE_TEXT,
  DEMO_DETAIL_TARGET_NOTES,
  DEMO_DETAIL_TARGET_RATING,
  DEMO_QUERY,
  DEMO_SEARCH_RESULTS,
  DEV_ONLY_SCENE,
  FLOW_TIMINGS,
  INITIAL_BOOK_ID,
} from "@/features/landing/lib/heroSearchFlowConstants";
import type {
  DetailPhase,
  FlowScene,
  HomePhase,
  SearchPhase,
} from "@/features/landing/lib/heroSearchFlowTypes";
import { useEffect, useMemo, useState } from "react";

type Params = {
  prefersReducedMotion: boolean;
};

export function useHeroSearchFlowMachine({ prefersReducedMotion }: Params) {
  const [scene, setScene] = useState<FlowScene>("searchFlow");
  const [searchPhase, setSearchPhase] = useState<SearchPhase>("centered");
  const [homePhase, setHomePhase] = useState<HomePhase>("empty");
  const [detailPhase, setDetailPhase] = useState<DetailPhase>("prefilled");
  const [query, setQuery] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(INITIAL_BOOK_ID);
  const [detailCurrentPageText, setDetailCurrentPageText] = useState("");
  const [detailRating, setDetailRating] = useState<number | null>(null);
  const [detailNotes, setDetailNotes] = useState("");

  const selectedBook = useMemo(
    () =>
      DEMO_SEARCH_RESULTS.find((book) => book.id === selectedBookId) ??
      DEMO_SEARCH_RESULTS[0],
    [selectedBookId],
  );

  const renderScene: FlowScene = DEV_ONLY_SCENE ?? scene;
  const renderSearchPhase: SearchPhase = prefersReducedMotion
    ? "added"
    : searchPhase;
  const renderHomePhase: HomePhase = prefersReducedMotion ? "added" : homePhase;
  const renderDetailPhase: DetailPhase = prefersReducedMotion
    ? "typingNotes"
    : detailPhase;
  const renderQuery = prefersReducedMotion ? DEMO_QUERY : query;
  const renderDetailCurrentPageText = prefersReducedMotion
    ? DEMO_DETAIL_TARGET_CURRENT_PAGE_TEXT
    : detailCurrentPageText;
  const renderDetailRating = prefersReducedMotion
    ? DEMO_DETAIL_TARGET_RATING
    : detailRating;
  const renderDetailNotes = prefersReducedMotion
    ? DEMO_DETAIL_TARGET_NOTES
    : detailNotes;

  useEffect(() => {
    if (prefersReducedMotion) return;

    let alive = true;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      });

    const wait = async (ms: number) => {
      await sleep(ms);
      return alive;
    };

    const typeText = async (
      text: string,
      setter: (value: string) => void,
      delay: number,
    ) => {
      for (let index = 1; index <= text.length; index += 1) {
        if (!alive) return false;
        setter(text.slice(0, index));
        await sleep(delay);
      }
      return alive;
    };

    const resetDetailScene = () => {
      setDetailPhase("prefilled");
      setDetailCurrentPageText("");
      setDetailRating(null);
      setDetailNotes("");
    };

    const runSearchScene = async () => {
      setScene("searchFlow");
      setHomePhase("empty");
      setSearchPhase("centered");
      setQuery("");
      setSelectedBookId(INITIAL_BOOK_ID);

      if (!(await wait(FLOW_TIMINGS.centered))) return false;

      setSearchPhase("focusing");
      if (!(await wait(FLOW_TIMINGS.focusing))) return false;

      setSearchPhase("typing");
      if (!(await typeText(DEMO_QUERY, setQuery, FLOW_TIMINGS.typingChar))) {
        return false;
      }
      if (!(await wait(FLOW_TIMINGS.typingHold))) return false;

      setSearchPhase("lifting");
      if (!(await wait(FLOW_TIMINGS.lifting))) return false;

      setSearchPhase("submitting");
      if (!(await wait(FLOW_TIMINGS.submitting))) return false;

      setSearchPhase("results");
      if (!(await wait(FLOW_TIMINGS.results))) return false;

      setSearchPhase("hovering");
      if (!(await wait(FLOW_TIMINGS.hovering))) return false;

      setSearchPhase("adding");
      if (!(await wait(FLOW_TIMINGS.adding))) return false;

      setSearchPhase("added");
      if (!(await wait(FLOW_TIMINGS.added))) return false;

      return true;
    };

    const runHomeScene = async () => {
      setScene("homeFlow");
      setHomePhase("empty");
      if (!(await wait(FLOW_TIMINGS.homeEmpty))) return false;

      setHomePhase("added");
      if (!(await wait(FLOW_TIMINGS.homeAdded))) return false;

      return true;
    };

    const runDetailScene = async () => {
      setScene("detailFlow");
      resetDetailScene();

      if (!(await wait(FLOW_TIMINGS.detailPrefilled))) return false;

      setDetailPhase("typingPage");
      if (
        !(await typeText(
          DEMO_DETAIL_TARGET_CURRENT_PAGE_TEXT,
          setDetailCurrentPageText,
          FLOW_TIMINGS.detailPageTypingChar,
        ))
      ) {
        return false;
      }
      if (!(await wait(FLOW_TIMINGS.detailPageTypedHold))) return false;

      setDetailPhase("changingRating");
      if (!(await wait(FLOW_TIMINGS.detailProgressToRatingDelay))) return false;
      for (let value = 1; value <= DEMO_DETAIL_TARGET_RATING; value += 1) {
        if (!alive) return false;
        setDetailRating(value);
        await sleep(FLOW_TIMINGS.detailRatingStep);
      }
      if (!(await wait(FLOW_TIMINGS.detailRatingHold))) return false;

      setDetailPhase("scrolling");
      if (!(await wait(FLOW_TIMINGS.detailScroll))) return false;

      setDetailPhase("typingNotes");
      if (
        !(await typeText(
          DEMO_DETAIL_TARGET_NOTES,
          setDetailNotes,
          FLOW_TIMINGS.detailNotesTypingChar,
        ))
      ) {
        return false;
      }
      if (!(await wait(FLOW_TIMINGS.detailNotesHold))) return false;

      return true;
    };

    async function runLoop() {
      while (alive) {
        if (DEV_ONLY_SCENE === "detailFlow") {
          setQuery(DEMO_QUERY);
          setSearchPhase("added");
          setHomePhase("added");
          setSelectedBookId(INITIAL_BOOK_ID);
          if (!(await runDetailScene())) return;
          if (!(await wait(FLOW_TIMINGS.loopPause))) return;
          continue;
        }

        if (DEV_ONLY_SCENE === "homeFlow") {
          setQuery(DEMO_QUERY);
          setSearchPhase("added");
          setSelectedBookId(INITIAL_BOOK_ID);
          if (!(await runHomeScene())) return;
          if (!(await wait(FLOW_TIMINGS.loopPause))) return;
          continue;
        }

        if (DEV_ONLY_SCENE === "searchFlow") {
          if (!(await runSearchScene())) return;
          if (!(await wait(FLOW_TIMINGS.loopPause))) return;
          continue;
        }

        if (!(await runSearchScene())) return;
        if (!(await runHomeScene())) return;
        if (!(await wait(FLOW_TIMINGS.homeToDetailPause))) return;
        if (!(await runDetailScene())) return;
        if (!(await wait(FLOW_TIMINGS.loopPause))) return;
      }
    }

    void runLoop();

    return () => {
      alive = false;
    };
  }, [prefersReducedMotion]);

  return {
    selectedBook,
    renderScene,
    renderSearchPhase,
    renderHomePhase,
    renderDetailPhase,
    renderQuery,
    renderDetailCurrentPageText,
    renderDetailRating,
    renderDetailNotes,
  };
}
