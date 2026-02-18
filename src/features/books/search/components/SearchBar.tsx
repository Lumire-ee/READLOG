import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFocus: () => void;
}

export default function SearchBar({
  query,
  onChange,
  onSubmit,
  onFocus,
}: SearchBarProps) {
  return (
    <div className="border-border-subtitle bg-bg-surface flex items-center rounded-xl border">
      <Input
        className="text-text-primary placeholder:text-text-tertiary typo-label-sm border-none bg-transparent focus-visible:ring-0"
        type="text"
        placeholder="책 제목 또는 저자를 입력하세요"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        onFocus={onFocus}
      />
      <Button
        type="button"
        onClick={onSubmit}
        variant="iconRound"
        aria-label="검색"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}

