import { Star } from "lucide-react";

type HomeRatingStarsProps = {
  value: number;
};

export default function HomeRatingStars({ value }: HomeRatingStarsProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const active = index < value;
        return (
          <Star
            key={index}
            className={
              active
                ? "fill-accent-yellow text-accent-yellow"
                : "text-text-tertiary"
            }
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
