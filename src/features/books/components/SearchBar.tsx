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
    <div className="relative flex items-center w-[90vw] md:w-[50vw] max-w-[550px] min-w-[200px] border border-gray-2 rounded-full">
      <Input
        className="bg-transparent text-label-primary placeholder:text-label-tertiary border-none focus-visible:ring-0 text-[14px] placeholder:text-[12px]"
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
        className="rounded-full text-label-primary foucs-visible:ring-0 cursor-pointer"
        aria-label="검색"
      >
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );
}
