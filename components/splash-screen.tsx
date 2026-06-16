'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Background animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-accent/10" />
      
      {/* Animated glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo with animation */}
        <div className="mb-8 animate-pulse-glow">
          <Image
            src="/logo.png"
            alt="ArenaVerse"
            width={120}
            height={120}
            priority
            className="drop-shadow-2xl"
          />
        </div>
        
        {/* Brand text */}
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary mb-2">
          ArenaVerse
        </h1>
        <p className="text-muted-foreground text-sm">Web3 Gaming Ecosystem</p>
        
        {/* Loading indicator */}
        <div className="mt-8 flex gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
