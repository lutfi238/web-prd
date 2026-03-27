import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-primary/10 text-orange-200",
        secondary: "border-white/10 bg-white/6 text-slate-200",
        outline: "border-white/12 text-slate-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
