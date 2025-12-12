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
        "absolute left-0 top-full mt-2 w-full z-50",
        "b-white border border-gray-2 rounded-xl",
        "p-4 flex gap-6",
        "max-h-[500px] overflow-hidden"
      )}
    >
      {children}
    </div>
  );
}
