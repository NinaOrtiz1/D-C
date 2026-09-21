import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center py-2", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted shadow-inner">
      <SliderPrimitive.Range className="absolute h-full rounded-full bg-linear-to-r from-aether via-electric to-gold shadow-[0_0_14px_color-mix(in_srgb,var(--color-aether)_42%,transparent)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-background bg-aether shadow-[0_3px_10px_color-mix(in_srgb,var(--color-aether)_45%,transparent)] transition-[transform,box-shadow] duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aether/20 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
