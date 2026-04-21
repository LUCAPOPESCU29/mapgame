import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-garamond transition-colors cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "border-gold/40 bg-gold/10 text-gold hover:bg-gold/20 hover:border-gold/70",
        selected:
          "border-gold bg-gold/30 text-gold-light",
        outline:
          "border-parchment-700 text-parchment-400 hover:border-gold/40 hover:text-gold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
