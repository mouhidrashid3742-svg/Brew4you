import { cn } from "@/lib/utils";
import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "primary" | "outline" | "secondary";
}

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-gold text-surface shadow-glow hover:bg-[#c59f2a] border border-transparent",
  secondary: "bg-surface/10 text-ink border border-[#3d3d3d] hover:bg-surface/20",
  ghost: "bg-transparent text-ink hover:text-gold",
  outline: "border border-[#3d3d3d] bg-transparent text-ink hover:border-gold hover:text-gold"
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
