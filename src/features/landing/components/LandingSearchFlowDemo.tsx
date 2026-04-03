import SearchFlowScene from "@/features/landing/components/SearchFlowScene";
import { useHeroSearchFlowMachine } from "@/features/landing/hooks/useHeroSearchFlowMachine";
import { SCENE_VARIANTS } from "@/features/landing/lib/heroSearchFlowConstants";
import { AnimatePresence, motion } from "framer-motion";

export default function LandingSearchFlowDemo() {
  const prefersReducedMotion = false;
  const { selectedBook, renderScene, renderSearchPhase, renderQuery } =
    useHeroSearchFlowMachine({ prefersReducedMotion });

  return (
    <div className="relative flex h-[clamp(420px,68vh,560px)] flex-col overflow-hidden rounded-2xl p-4 sm:p-5">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={renderScene}
            variants={SCENE_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.26, ease: "easeOut" }}
            className="absolute inset-0 w-full overflow-hidden"
          >
            {renderScene === "searchFlow" ? (
              <SearchFlowScene
                query={renderQuery}
                searchPhase={renderSearchPhase}
                selectedBook={selectedBook}
              />
            ) : null}

            {/* TODO: 책 정보 입력 / home 페이지 Scene추가 */}
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  );
}
