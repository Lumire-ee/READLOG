import type { SearchPhase } from "@/features/landing/lib/heroSearchFlowTypes";

export function deriveSearchPhaseView(searchPhase: SearchPhase) {
  const isBarCentered =
    searchPhase === "centered" ||
    searchPhase === "focusing" ||
    searchPhase === "typing";

  const showDropdown =
    searchPhase === "results" ||
    searchPhase === "hovering" ||
    searchPhase === "adding" ||
    searchPhase === "added";

  const showResultRow = showDropdown;
  const isHoveringTarget =
    searchPhase === "hovering" ||
    searchPhase === "adding" ||
    searchPhase === "added";
  const isIconClicking = searchPhase === "adding";
  const isSearchPressing = searchPhase === "submitting";
  const showCaret = searchPhase === "typing";

  return {
    isBarCentered,
    showDropdown,
    showResultRow,
    isHoveringTarget,
    isIconClicking,
    isSearchPressing,
    showCaret,
  };
}

