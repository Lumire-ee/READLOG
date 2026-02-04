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
    <div className="flex items-center border border-border-subtle rounded-xl bg-bg-surface">
      <Input
        className="bg-transparent text-text-primary placeholder:text-text-tertiary border-none focus-visible:ring-0 typo-label-sm"
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
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );
}
