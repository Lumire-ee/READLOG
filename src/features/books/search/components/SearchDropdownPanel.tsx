import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SearchDropdownPanelProps {
  open: boolean;
  children?: ReactNode;
}

export default function SearchDropdownPanel({
  open,
  children,
}: SearchDropdownPanelProps) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 z-50 mt-3 w-full md:w-[calc(100%+60px)]",
        "max-w-[calc(100vw-var(--container-padding,2rem))] md:max-w-[min(1000px,94vw)]",
        "min-w-[320px] md:min-w-[850px]",
        "border-accent-indigo/65 rounded-xl border-2",
        "bg-bg-elevated",
        "flex flex-col gap-4 p-4 md:h-[550px] md:flex-row md:gap-6 md:p-6",
        "max-h-[70vh] overflow-hidden md:max-h-none",
      )}
    >
      {children}
    </div>
  );
}

