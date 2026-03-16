import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

export default function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="focus-visible:ring-accent-indigo/70 border-border-default bg-bg-surface relative inline-flex h-9 w-16 shrink-0 cursor-pointer items-center rounded-full border p-1 transition-colors hover:bg-bg-surface-hover focus-visible:outline-none focus-visible:ring-2 sm:h-10 sm:w-18"
    >
      <span
        aria-hidden="true"
        className={cn(
          "bg-bg-elevated border-border-default pointer-events-none absolute left-1 size-7 rounded-full border shadow-sm transition-transform duration-300 ease-out sm:size-8",
          isDark ? "translate-x-7 sm:translate-x-8" : "translate-x-0",
        )}
      />

      <span
        aria-hidden="true"
        className={cn(
          "relative z-10 flex size-7 items-center justify-center transition-colors sm:size-8",
          isDark ? "text-text-tertiary" : "text-accent-yellow",
        )}
      >
        <Sun className="size-4" />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "relative z-10 flex size-7 items-center justify-center transition-colors sm:size-8",
          isDark ? "text-accent-blue" : "text-text-tertiary",
        )}
      >
        <Moon className="size-4" />
      </span>
    </button>
  );
}
