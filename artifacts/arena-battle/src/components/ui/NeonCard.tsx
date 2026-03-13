import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'primary' | 'secondary' | 'accent' | 'none';
}

export function NeonCard({ className, glowColor = 'none', children, ...props }: CardProps) {
  const glows = {
    primary: "hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] border-primary/20 hover:border-primary/50",
    secondary: "hover:shadow-[0_0_20px_rgba(255,0,255,0.15)] border-secondary/20 hover:border-secondary/50",
    accent: "hover:shadow-[0_0_20px_rgba(255,230,0,0.15)] border-accent/20 hover:border-accent/50",
    none: "border-border hover:border-muted-foreground/30"
  };

  return (
    <div
      className={cn(
        "relative bg-card/80 backdrop-blur-md border rounded-none p-6",
        "transition-all duration-500 ease-out overflow-hidden group",
        glows[glowColor],
        className
      )}
      {...props}
    >
      {/* Decorative scanline effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]" />
      
      {/* Content wrapper to keep it above background effects */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Cyberpunk cut corner effect (visual only via pseudo elements in CSS normally, but implemented via borders here) */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-current opacity-30" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-current opacity-30" />
    </div>
  )
}
