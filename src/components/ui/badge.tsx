import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        to_read:
          "bg-accent-indigo/65 text-white [&>svg]:text-accent-indigo hover:bg-accent-indigo/75 group-hover:bg-accent-indigo/75 group-data-[highlighted]:bg-accent-indigo/75",
        reading:
          "bg-accent-blue/65 text-white [&>svg]:text-accent-blue hover:bg-accent-blue/75 group-hover:bg-accent-blue/75 group-data-[highlighted]:bg-accent-blue/75",
        completed:
          "bg-accent-green/65 text-white [&>svg]:text-accent-green hover:bg-accent-green/75 group-hover:bg-accent-green/75 group-data-[highlighted]:bg-accent-green/75",
        quit: "bg-accent-orange/65 text-white [&>svg]:text-accent-orange hover:bg-accent-orange/75 group-hover:bg-accent-orange/75 group-data-[highlighted]:bg-accent-orange/75",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

