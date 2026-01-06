import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground placeholder:italic selection:bg-foreground selection:text-background flex h-9 w-full min-w-0 border-2 border-foreground bg-transparent px-3 py-2 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[4px] focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
}

export { Input }
