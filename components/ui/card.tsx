import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "glass-card rounded-[28px] border border-white/10 p-6 shadow-xl shadow-black/20",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
