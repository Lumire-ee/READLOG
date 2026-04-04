import {
  DEMO_QUERY,
  DEMO_SEARCH_RESULTS,
  DEV_ONLY_SCENE,
  FLOW_TIMINGS,
  INITIAL_BOOK_ID,
} from "@/features/landing/lib/heroSearchFlowConstants";
import type {
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
  const [query, setQuery] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(INITIAL_BOOK_ID);

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
  const renderQuery = prefersReducedMotion ? DEMO_QUERY : query;

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

    async function runLoop() {
      while (alive) {
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
    renderQuery,
  };
}
