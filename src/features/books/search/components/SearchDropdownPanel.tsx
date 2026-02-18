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
    // TODO: 모바일 환경에서 UI 개선 필요(Row, Preview)
    <div
      className={cn(
        "absolute top-full left-0 z-50 mt-2",
        "w-[70vw] max-w-[900px] min-w-[200px]",
        "border-border-subtitle rounded-xl border",
        "bg-bg-elevated",
        "flex gap-6 p-6",
        "h-[550px] overflow-hidden",
      )}
    >
      {children}
    </div>
  );
}

