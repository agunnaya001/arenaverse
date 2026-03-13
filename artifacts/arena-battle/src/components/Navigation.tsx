import { Link, useLocation } from "wouter";
import { Home, Swords, Trophy, User, ShieldPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/mint", label: "Mint", icon: ShieldPlus },
    { href: "/battle", label: "Arena", icon: Swords },
    { href: "/leaderboard", label: "Rank", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t border-primary/20 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href} className="flex-1 group">
              <div className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
              )}>
                <div className="relative">
                  <Icon className={cn(
                    "w-6 h-6 transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  {isActive && (
                    <div className="absolute -inset-2 bg-primary/20 blur-md rounded-full -z-10" />
                  )}
                </div>
                <span className="text-[10px] font-display tracking-wider uppercase">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
