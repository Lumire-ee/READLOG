import {
  DEMO_QUERY,
  DEMO_SEARCH_RESULTS,
  FLOW_TIMINGS,
  INITIAL_BOOK_ID,
} from "@/features/landing/lib/heroSearchFlowConstants";
import type {
  FlowScene,
  SearchPhase,
} from "@/features/landing/lib/heroSearchFlowTypes";
import { useEffect, useMemo, useState } from "react";

type Params = {
  prefersReducedMotion: boolean;
};

export function useHeroSearchFlowMachine({ prefersReducedMotion }: Params) {
  const [searchPhase, setSearchPhase] = useState<SearchPhase>("centered");
  const [query, setQuery] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(INITIAL_BOOK_ID);

  const selectedBook = useMemo(
    () =>
      DEMO_SEARCH_RESULTS.find((book) => book.id === selectedBookId) ??
      DEMO_SEARCH_RESULTS[0],
    [selectedBookId],
  );

  const renderScene: FlowScene = "searchFlow";
  const renderSearchPhase: SearchPhase = prefersReducedMotion
    ? "added"
    : searchPhase;
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

    async function runFlow() {
      while (alive) {
        setSearchPhase("centered");
        setQuery("");
        setSelectedBookId(INITIAL_BOOK_ID);

        if (!(await wait(FLOW_TIMINGS.centered))) return;

        setSearchPhase("focusing");
        if (!(await wait(FLOW_TIMINGS.focusing))) return;

        setSearchPhase("typing");
        if (!(await typeText(DEMO_QUERY, setQuery, FLOW_TIMINGS.typingChar)))
          return;
        if (!(await wait(FLOW_TIMINGS.typingHold))) return;

        setSearchPhase("lifting");
        if (!(await wait(FLOW_TIMINGS.lifting))) return;

        setSearchPhase("submitting");
        if (!(await wait(FLOW_TIMINGS.submitting))) return;

        setSearchPhase("results");
        if (!(await wait(FLOW_TIMINGS.results))) return;

        setSearchPhase("hovering");
        if (!(await wait(FLOW_TIMINGS.hovering))) return;

        setSearchPhase("adding");
        if (!(await wait(FLOW_TIMINGS.adding))) return;

        setSearchPhase("added");
        if (!(await wait(FLOW_TIMINGS.added))) return;

        {
          /* TODO: 책 정보 입력 / home 페이지 Scene추가 */
        }
        if (!(await wait(FLOW_TIMINGS.loopPause))) return;
      }
    }

    void runFlow();

    return () => {
      alive = false;
    };
  }, [prefersReducedMotion]);

  return {
    selectedBook,
    renderScene,
    renderSearchPhase,
    renderQuery,
  };
}
