import DetailFlowScene from "@/features/landing/components/DetailFlowScene";
import HomeFlowScene from "@/features/landing/components/HomeFlowScene";
import SearchFlowScene from "@/features/landing/components/SearchFlowScene";
import { useHeroSearchFlowMachine } from "@/features/landing/hooks/useHeroSearchFlowMachine";
import { SCENE_VARIANTS } from "@/features/landing/lib/heroSearchFlowConstants";
import { AnimatePresence, motion } from "framer-motion";

export default function LandingSearchFlowDemo() {
  const prefersReducedMotion = false;
  const {
    selectedBook,
    renderScene,
    renderSearchPhase,
    renderHomePhase,
    renderDetailPhase,
    renderQuery,
    renderDetailCurrentPageText,
    renderDetailRating,
    renderDetailNotes,
  } = useHeroSearchFlowMachine({ prefersReducedMotion });

  return (
    <div className="pointer-events-none relative flex h-[clamp(420px,70vh,720px)] flex-col overflow-hidden rounded-2xl p-4 sm:p-5">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={renderScene}
            variants={SCENE_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 w-full overflow-hidden"
          >
            {renderScene === "searchFlow" ? (
              <SearchFlowScene
                query={renderQuery}
                searchPhase={renderSearchPhase}
                selectedBook={selectedBook}
              />
            ) : null}
            {renderScene === "homeFlow" ? (
              <HomeFlowScene
                selectedBook={selectedBook}
                homePhase={renderHomePhase}
              />
            ) : null}
            {renderScene === "detailFlow" ? (
              <DetailFlowScene
                selectedBook={selectedBook}
                detailPhase={renderDetailPhase}
                detailCurrentPageText={renderDetailCurrentPageText}
                detailRating={renderDetailRating}
                detailNotes={renderDetailNotes}
              />
            ) : null}
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  );
}
