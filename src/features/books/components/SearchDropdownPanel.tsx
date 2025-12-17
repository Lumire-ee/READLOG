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
        "absolute left-0 top-full mt-2 z-50",
        "w-[70vw] max-w-[900px] min-w-[200px]",
        "rounded-2xl border border-gray-2",
        "flex gap-6 p-6",
        "max-h-[500px] overflow-hidden"
      )}
    >
      {children}
    </div>
  );
}
