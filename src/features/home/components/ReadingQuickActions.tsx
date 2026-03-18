import { Button } from "@/components/ui/button";
import { Check, Slash } from "lucide-react";

type ReadingQuickActionsProps = {
  disabled: boolean;
  onComplete: () => void;
  onQuit: () => void;
};

export default function ReadingQuickActions({
  disabled,
  onComplete,
  onQuit,
}: ReadingQuickActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        data-quick-action="true"
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          onComplete();
        }}
      >
        <Check className="size-3.5" />
        완독
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        data-quick-action="true"
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          onQuit();
        }}
      >
        <Slash className="size-3.5" />
        중단
      </Button>
    </div>
  );
}
