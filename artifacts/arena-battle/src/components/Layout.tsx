import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative selection:bg-primary/30 selection:text-primary">
      {/* Global Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5 py-3 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary/20 border border-primary/50 flex items-center justify-center overflow-hidden relative group">
            <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors" />
            <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-6 h-6 object-contain z-10" />
          </div>
          <span className="font-display font-bold text-lg tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary hidden sm:block">
            ARENA BATTLE
          </span>
        </div>
        <div>
          <ConnectButton showBalance={false} chainStatus="icon" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 pb-24 pt-4 px-4 max-w-4xl mx-auto w-full">
        {children}
      </main>

      <Navigation />
    </div>
  );
}
