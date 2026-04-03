import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

type Props = {
  query: string;
  showCaret: boolean;
  isSearchPressing: boolean;
};

export default function DemoSearchBar({
  query,
  showCaret,
  isSearchPressing,
}: Props) {
  const shouldShowCaret = showCaret || query.length === 0;

  return (
    <div className="border-accent-indigo/65 bg-bg-surface flex min-h-14 items-center gap-2 rounded-full border-2 px-4 py-2">
      <div className="typo-label-sm flex min-h-5 min-w-0 flex-1 items-center truncate px-1 text-left">
        <span className="text-text-primary inline-flex items-center">
          {query}
          {shouldShowCaret ? (
            <span
              className={cn(
                "demo-caret bg-text-primary inline-block h-4 w-px",
                query ? "ml-0.5" : undefined,
              )}
            />
          ) : null}
        </span>
      </div>
      <span className="text-text-secondary">
        <motion.span
          className="inline-flex"
          animate={
            isSearchPressing
              ? {
                  scale: [1, 0.75, 1],
                  opacity: [1, 0.85, 1],
                }
              : { scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Search className="size-4" />
        </motion.span>
      </span>
    </div>
  );
}
