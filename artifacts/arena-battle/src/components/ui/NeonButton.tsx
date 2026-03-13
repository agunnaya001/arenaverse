import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'destructive' | 'outline';
  isLoading?: boolean;
}

export const NeonButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: "border-primary text-primary hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.5),inset_0_0_10px_rgba(0,240,255,0.2)]",
      secondary: "border-secondary text-secondary hover:bg-secondary/10 hover:shadow-[0_0_15px_rgba(255,0,255,0.5),inset_0_0_10px_rgba(255,0,255,0.2)]",
      accent: "border-accent text-accent hover:bg-accent/10 hover:shadow-[0_0_15px_rgba(255,230,0,0.5),inset_0_0_10px_rgba(255,230,0,0.2)]",
      destructive: "border-destructive text-destructive hover:bg-destructive/10 hover:shadow-[0_0_15px_rgba(255,0,0,0.5),inset_0_0_10px_rgba(255,0,0,0.2)]",
      outline: "border-border text-foreground hover:border-primary hover:text-primary",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        disabled={disabled || isLoading}
        className={cn(
          "relative inline-flex items-center justify-center px-6 py-3",
          "font-display tracking-widest uppercase text-sm font-bold",
          "bg-card/50 backdrop-blur-sm border",
          "transition-all duration-300 ease-out",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "overflow-hidden group",
          variants[variant],
          className
        )}
        {...props}
      >
        {/* Animated corner accents */}
        <span className={cn("absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:opacity-20", `border-${variant}`)} />
        <span className={cn("absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:opacity-20", `border-${variant}`)} />
        
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className={cn("w-4 h-4 border-2 border-t-transparent rounded-full animate-spin", `border-${variant}`)} />
            <span>Processing...</span>
          </div>
        ) : (
          children
        )}
      </motion.button>
    )
  }
)
NeonButton.displayName = "NeonButton"
