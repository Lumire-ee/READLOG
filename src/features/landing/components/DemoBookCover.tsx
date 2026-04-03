import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function DemoBookCover({ className }: Props) {
  return (
    <div
      className={cn(
        "from-accent-green via-bg-black to-accent-red h-16 w-12 rounded-md bg-linear-to-b from-45% via-50% to-55%",
        className,
      )}
    />
  );
}

