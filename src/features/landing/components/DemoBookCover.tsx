import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  bookId?: string;
};

function resolveCoverTone(bookId?: string) {
  if (bookId === "maskerade-game") {
    return "from-[#2e2a5f] via-[#7b3f99] to-[#d18b2f] from-10% via-50% to-95%";
  }

  return "from-accent-green via-bg-black to-accent-red from-45% via-50% to-55%";
}

export default function DemoBookCover({ className, bookId }: Props) {
  return (
    <div
      className={cn(
        "h-16 w-12 rounded-md bg-linear-to-b",
        resolveCoverTone(bookId),
        className,
      )}
    />
  );
}
