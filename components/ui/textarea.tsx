import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-foreground placeholder:text-muted-foreground placeholder:italic selection:bg-foreground selection:text-background flex field-sizing-content min-h-16 w-full border-2 bg-transparent px-3 py-2 text-base outline-none focus-visible:border-[4px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
