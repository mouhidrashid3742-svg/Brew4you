import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full bg-[#d4af37]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold",
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

export { Badge };
