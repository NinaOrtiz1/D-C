import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-xl text-sm font-semibold cursor-pointer transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/15 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_10px_24px_-14px_color-mix(in_srgb,var(--color-primary)_70%,transparent)] hover:bg-primary/90 hover:shadow-[0_16px_30px_-16px_color-mix(in_srgb,var(--color-primary)_75%,transparent)]",
        destructive: "bg-destructive text-destructive-foreground shadow-[0_10px_24px_-14px_color-mix(in_srgb,var(--color-destructive)_70%,transparent)] hover:bg-destructive/90",
        outline:
          "border border-input bg-background/80 text-foreground shadow-sm backdrop-blur-sm hover:border-aether/40 hover:bg-accent hover:text-accent-foreground hover:shadow-soft",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-soft",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline",
        wine: "bg-linear-to-r from-aether via-purple to-electric text-white shadow-[0_14px_30px_-16px_color-mix(in_srgb,var(--color-aether)_85%,transparent)] hover:from-purple hover:via-electric hover:to-cyan hover:shadow-float",
        wineGhost:
          "border border-aether/25 bg-background/80 text-aether backdrop-blur-sm hover:border-electric/45 hover:bg-electric-soft hover:text-purple hover:shadow-soft",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        xl: "h-13 rounded-full px-8 text-[0.95rem] sm:h-14",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
