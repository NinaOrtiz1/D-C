import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-15 w-full rounded-xl border border-input bg-background/70 px-3.5 py-3 text-base shadow-sm transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground hover:border-aether/30 focus-visible:border-aether focus-visible:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aether/12 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
