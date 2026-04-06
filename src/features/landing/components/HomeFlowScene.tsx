import { Badge } from "@/components/ui/badge";
import DemoBookCover from "@/features/landing/components/DemoBookCover";
import { DEMO_SEARCH_RESULTS } from "@/features/landing/lib/heroSearchFlowConstants";
import type {
  DemoSearchBook,
  HomePhase,
} from "@/features/landing/lib/heroSearchFlowTypes";
import HomeRatingStars from "@/features/home/components/HomeRatingStars";
import ReadingQuickActions from "@/features/home/components/ReadingQuickActions";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  selectedBook: DemoSearchBook;
  homePhase: HomePhase;
};

type ReadingCardKey = "spacer" | "book" | "skeleton-a" | "skeleton-b";

function ReadingBookCard({
  selectedBook,
  layoutId,
}: {
  selectedBook: DemoSearchBook;
  layoutId?: string;
}) {
  return (
    <motion.div
      layoutId={layoutId}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.35, 1] }}
      className="border-border-skeleton bg-bg-elevated h-100 overflow-hidden rounded-xl border"
    >
      <div className="bg-bg-surface-subtitle relative h-3/5 overflow-hidden">
        <DemoBookCover
          bookId={selectedBook.id}
          className="absolute inset-0 h-full w-full scale-110 blur-xl"
        />
        <DemoBookCover
          bookId={selectedBook.id}
          className="relative z-10 mx-auto mt-3 h-[90%] w-[38%] rounded-md"
        />
      </div>

      <div className="flex h-2/5 min-h-0 flex-col p-3">
        <div className="min-w-0 shrink-0">
          <p className="typo-label-md text-text-primary line-clamp-2">
            {selectedBook.title}
          </p>
          <p className="typo-label-sm text-text-secondary mt-0.5 line-clamp-1">
            {selectedBook.author}
          </p>
        </div>

        <div className="mt-2 shrink-0">
          <ReadingQuickActions
            disabled={false}
            onComplete={() => {}}
            onQuit={() => {}}
          />
        </div>

        <div className="mt-auto shrink-0 space-y-1">
          <p className="typo-label-sm text-text-secondary">128 / 412 페이지</p>
          <div className="bg-bg-surface-subtitle h-2 w-full rounded-full">
            <div className="bg-accent-indigo/65 h-full w-[30%] rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PlaceholderReadingCard({ layoutId }: { layoutId?: string }) {
  return (
    <motion.div
      layoutId={layoutId}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.35, 1] }}
      className="border-border-skeleton bg-bg-elevated h-100 overflow-hidden rounded-xl border"
    >
      <div className="bg-bg-surface-subtitle h-3/5" />
      <div className="flex h-2/5 min-h-0 flex-col p-3">
        <div className="min-w-0 shrink-0 space-y-2">
          <div className="bg-bg-surface-subtitle h-4 w-5/6 rounded" />
          <div className="bg-bg-surface-subtitle h-3 w-1/2 rounded" />
        </div>

        <div className="mt-3 flex shrink-0 gap-2">
          <div className="bg-bg-surface-subtitle h-8 flex-1 rounded-md" />
          <div className="bg-bg-surface-subtitle h-8 flex-1 rounded-md" />
        </div>

        <div className="mt-auto shrink-0 space-y-1">
          <div className="bg-bg-surface-subtitle h-3 w-2/5 rounded" />
          <div className="bg-bg-surface-subtitle h-2 w-full rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

function SpacerReadingSlot() {
  return <div className="pointer-events-none h-100 rounded-xl opacity-0" />;
}

function LibrarySkeletonRow() {
  return (
    <div className="border-border-skeleton bg-bg-elevated flex items-center gap-4 rounded-md border px-2 py-3">
      <div className="bg-bg-surface-subtitle h-16 w-12 rounded-md" />

      <div className="min-w-0 flex-1 space-y-2">
        <div className="bg-bg-surface-subtitle h-4 w-3/5 rounded" />
        <div className="bg-bg-surface-subtitle h-3 w-2/5 rounded" />
        <div className="bg-bg-surface-subtitle h-3 w-1/5 rounded" />
      </div>

      <div className="bg-bg-surface-subtitle h-5 w-10 rounded-full" />
    </div>
  );
}

function LibraryBookRow({ selectedBook }: { selectedBook: DemoSearchBook }) {
  return (
    <div className="border-border-skeleton bg-bg-elevated flex items-center gap-4 rounded-md border px-2 py-3">
      <DemoBookCover bookId={selectedBook.id} className="h-16 w-12" />

      <div className="min-w-0 flex-1">
        <p className="typo-label-md text-text-primary truncate">
          {selectedBook.title}
        </p>
        <p className="typo-label-sm text-text-secondary truncate">
          {selectedBook.author}
        </p>
        <div className="mt-1">
          <HomeRatingStars value={4} />
        </div>
      </div>

      <Badge variant="completed">완독</Badge>
    </div>
  );
}

export default function HomeFlowScene({ selectedBook, homePhase }: Props) {
  const isAdded = homePhase === "added";
  const libraryRowBook = DEMO_SEARCH_RESULTS[1] ?? selectedBook;
  const desktopReadingCardOrderMd: ReadingCardKey[] = isAdded
    ? ["book", "skeleton-a"]
    : ["skeleton-a", "spacer"];
  const desktopReadingCardOrderXl: ReadingCardKey[] = isAdded
    ? ["book", "skeleton-a", "skeleton-b"]
    : ["skeleton-a", "skeleton-b", "spacer"];

  return (
    <div className="h-full overflow-hidden">
      <motion.div
        className="flex h-full flex-col gap-4"
        animate={isAdded ? { y: ["0%", "0%", "-50%"] } : { y: "0%" }}
        transition={
          isAdded
            ? {
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.65, 1],
              }
            : {
                duration: 0.5,
                ease: "easeOut",
              }
        }
      >
        <section className="bg-bg-surface rounded-xl p-4 sm:p-5">
          <h2 className="typo-heading-sm text-text-primary">나의 독서</h2>
          <div className="mt-4">
            <div className="md:hidden">
              <AnimatePresence mode="wait" initial={false}>
                {isAdded ? (
                  <motion.div
                    key="mobile-book"
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <ReadingBookCard selectedBook={selectedBook} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="mobile-slot"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <PlaceholderReadingCard />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden gap-3 md:grid md:grid-cols-2 xl:hidden">
              <AnimatePresence initial={false} mode="popLayout">
                {desktopReadingCardOrderMd.map((cardKey) => (
                  <motion.div
                    key={cardKey}
                    layout="position"
                    initial={
                      cardKey === "book"
                        ? { opacity: 0, scale: 0.7 }
                        : { opacity: 0, scale: 1 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{
                      duration: cardKey === "book" ? 0.35 : 0.25,
                      ease: "easeOut",
                      layout: { duration: 0.5, ease: [0.25, 1, 0.35, 1] },
                    }}
                  >
                    {cardKey === "spacer" ? (
                      <SpacerReadingSlot />
                    ) : cardKey === "book" ? (
                      <ReadingBookCard selectedBook={selectedBook} />
                    ) : (
                      <PlaceholderReadingCard />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="hidden gap-3 xl:grid xl:grid-cols-3">
              <AnimatePresence initial={false} mode="popLayout">
                {desktopReadingCardOrderXl.map((cardKey) => (
                  <motion.div
                    key={cardKey}
                    layout="position"
                    initial={
                      cardKey === "book"
                        ? { opacity: 0, scale: 0.7 }
                        : { opacity: 0, scale: 1 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{
                      duration: cardKey === "book" ? 0.35 : 0.25,
                      ease: "easeOut",
                      layout: { duration: 0.5, ease: [0.25, 1, 0.35, 1] },
                    }}
                  >
                    {cardKey === "spacer" ? (
                      <SpacerReadingSlot />
                    ) : cardKey === "book" ? (
                      <ReadingBookCard selectedBook={selectedBook} />
                    ) : (
                      <PlaceholderReadingCard />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="bg-bg-surface rounded-xl p-4 sm:p-5">
          <h2 className="typo-heading-sm text-text-primary">나의 서재</h2>
          <div className="mt-4 space-y-2">
            <LibraryBookRow selectedBook={libraryRowBook} />
            <LibrarySkeletonRow />
            <LibrarySkeletonRow />
          </div>
        </section>
      </motion.div>
    </div>
  );
}
