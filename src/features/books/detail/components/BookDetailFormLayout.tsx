import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type DivProps = React.ComponentProps<"div">;
type LabelProps = React.ComponentProps<typeof Label>;

export function BookDetailFormRow({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3",
        className,
      )}
      {...props}
    />
  );
}

export function BookDetailFormLabel({ className, ...props }: LabelProps) {
  return (
    <Label
      className={cn("typo-label-sm text-text-secondary", className)}
      {...props}
    />
  );
}

export function BookDetailFormContent({ className, ...props }: DivProps) {
  return <div className={cn("min-w-0", className)} {...props} />;
}

export function BookDetailFormFullRow({ className, ...props }: DivProps) {
  return <div className={cn("col-span-2", className)} {...props} />;
}
