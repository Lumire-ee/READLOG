import { Button } from "@/components/ui/button";
import DemoBookCover from "@/features/landing/components/DemoBookCover";
import DemoSearchBar from "@/features/landing/components/DemoSearchBar";
import { deriveSearchPhaseView } from "@/features/landing/lib/heroSearchFlowSelectors";
import type {
  DemoSearchBook,
  SearchPhase,
} from "@/features/landing/lib/heroSearchFlowTypes";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { BookPlus } from "lucide-react";

type Props = {
  query: string;
  searchPhase: SearchPhase;
  selectedBook: DemoSearchBook;
};

export default function SearchFlowScene({
  query,
  searchPhase,
  selectedBook,
}: Props) {
  const {
    isBarCentered,
    showDropdown,
    showResultRow,
    isHoveringTarget,
    isIconClicking,
    isSearchPressing,
    showCaret,
  } = deriveSearchPhaseView(searchPhase);

  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        className="absolute inset-x-0 z-10"
        initial={false}
        animate={
          isBarCentered
            ? { top: "50%", y: "-50%" }
            : { top: "0.25rem", y: "0%" }
        }
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <DemoSearchBar
          query={query}
          showCaret={showCaret}
          isSearchPressing={isSearchPressing}
        />
      </motion.div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            key="search-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="border-accent-indigo/65 bg-bg-surface absolute top-20 right-0 left-0 rounded-xl border-2 p-4"
          >
            <div className="grid gap-4 lg:grid-cols-[1.25fr_0.95fr]">
              <div className="space-y-2">
                {showResultRow ? (
                  <>
                    <motion.div
                      className={cn(
                        "flex items-center gap-3 rounded-md px-2 py-2 text-left transition-colors",
                        isHoveringTarget ? "bg-bg-surface-hover" : undefined,
                      )}
                      animate={
                        isIconClicking ? { scale: [1, 0.985, 1] } : { scale: 1 }
                      }
                      transition={{ duration: 0.4 }}
                    >
                      <DemoBookCover
                        bookId={selectedBook.id}
                        className="h-16 w-12"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="typo-label-md text-text-primary truncate">
                          {selectedBook.title}
                        </p>
                        <p className="typo-label-sm text-text-secondary truncate">
                          {selectedBook.author}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled
                        className="text-text-primary h-8 w-8 border-none bg-transparent p-0 shadow-none disabled:opacity-100"
                      >
                        <span className="inline-flex items-center justify-center">
                          <BookPlus className="size-4" />
                        </span>
                      </Button>
                    </motion.div>

                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-2 py-2"
                      >
                        <div className="border-border-skeleton bg-bg-surface-subtitle h-16 w-12 rounded-md border border-dashed" />
                        <div className="flex-1 space-y-2">
                          <div className="bg-bg-surface-subtitle h-3 w-24 rounded" />
                          <div className="bg-bg-surface-subtitle h-2 w-16 rounded" />
                        </div>
                        <div className="border-border-skeleton bg-bg-surface-subtitle h-8 w-8 rounded border border-dashed" />
                      </div>
                    ))}
                  </>
                ) : null}
              </div>

              <div className="hidden flex-col justify-start gap-5 overflow-hidden px-1 lg:flex lg:px-2">
                <div className="flex justify-center pt-1">
                  <DemoBookCover
                    bookId={selectedBook.id}
                    className="h-48 w-32 rounded-lg"
                  />
                </div>
                <div className="flex min-w-0 flex-col text-left">
                  <h3 className="typo-heading-sm text-text-primary line-clamp-2">
                    {selectedBook.title}
                  </h3>
                  <p className="typo-body-sm text-text-secondary mt-1 line-clamp-1">
                    {selectedBook.author}
                  </p>
                </div>
                <div className="border-border-default border-l-2 pl-3 text-left">
                  <p className="typo-caption text-text-secondary line-clamp-2 break-keep">
                    {selectedBook.preview}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
