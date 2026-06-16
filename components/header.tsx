'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sword, 
  Trophy, 
  Store, 
  Users, 
  Coins, 
  Wallet,
  ChevronDown,
  Menu,
  X,
  Zap,
  Shield,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWeb3, BASE_CHAIN } from '@/lib/web3-context';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Champions', href: '/champions', icon: Shield },
  { name: 'Battle', href: '/battle', icon: Sword },
  { name: 'PVP Arena', href: '/pvp', icon: Users },
  { name: 'Marketplace', href: '/marketplace', icon: Store },
  { name: 'Staking', href: '/staking', icon: Coins },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
];

const ecosystemNav = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Ecosystem', href: '/ecosystem', icon: Zap },
  { name: 'AI Studio', href: '/ai-studio', icon: Zap },
  { name: 'Launchpad', href: '/launchpad', icon: Zap },
  { name: 'Guilds', href: '/guilds', icon: Users },
  { name: 'Tournaments', href: '/tournaments', icon: Shield },
];

export function Header() {
  const pathname = usePathname();
  const { 
    address, 
    isConnected, 
    isConnecting, 
    chainId,
    ethBalance, 
    arenaBalance,
    connect, 
    disconnect,
    switchToBase,
    formatAddress 
  } = useWeb3();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isWrongNetwork = isConnected && chainId !== BASE_CHAIN.id;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div className="absolute inset-0 rounded-lg bg-primary/20 blur-lg group-hover:blur-xl transition-all" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              <span className="text-primary">Arena</span>
              <span className="text-foreground">GameFi</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
            
            {/* Ecosystem Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost"
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm font-medium',
                    ecosystemNav.some(item => pathname.startsWith(item.href.split('/')[1]) && item.href !== '/dashboard')
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  <Zap className="w-4 h-4" />
                  Ecosystem
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {ecosystemNav.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Side - Wallet */}
          <div className="flex items-center gap-3">
            {isConnected ? (
              <>
                {/* Balance Display */}
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{arenaBalance} ARENA</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50">
                    <span className="text-sm font-medium">{ethBalance} ETH</span>
                  </div>
                </div>

                {/* Wrong Network Warning */}
                {isWrongNetwork && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={switchToBase}
                    className="hidden sm:flex"
                  >
                    Switch to Base
                  </Button>
                )}

                {/* Account Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Wallet className="w-4 h-4" />
                      <span className="hidden sm:inline">{formatAddress(address!)}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-2">
                      <p className="text-xs text-muted-foreground">Connected Wallet</p>
                      <p className="font-mono text-sm truncate">{address}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-2 md:hidden">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">ARENA</span>
                        <span>{arenaBalance}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">ETH</span>
                        <span>{ethBalance}</span>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="md:hidden" />
                    {isWrongNetwork && (
                      <>
                        <DropdownMenuItem onClick={switchToBase} className="text-destructive">
                          Switch to Base Network
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/champions">My Champions</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/staking">Staking Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={disconnect}
                      className="text-destructive focus:text-destructive"
                    >
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                onClick={() => connect()} 
                disabled={isConnecting}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Wallet className="w-4 h-4" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
