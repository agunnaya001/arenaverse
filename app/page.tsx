'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Swords, Trophy, Users, Coins, Shield, Zap, Store, Flame, Star, Gamepad2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SplashScreen } from '@/components/splash-screen';
import { useWeb3 } from '@/lib/web3-context';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const { isConnected, address, connectWallet, balance, isAdmin } = useWeb3();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <SplashScreen />;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Navigation */}
      <nav className="border-b border-border/30 sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
        <div className="px-4 py-3 flex items-center justify-between md:max-w-7xl md:mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image src="/logo.png" alt="ArenaVerse" fill className="object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ArenaVerse
              </h1>
              <p className="text-xs text-muted-foreground">Web3 Gaming</p>
            </div>
          </div>

          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="text-right text-xs hidden sm:block">
                <p className="font-mono text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                <p className="text-muted-foreground">{parseFloat(balance).toFixed(2)} ETH</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary text-xs font-bold">
                {address?.slice(2, 4).toUpperCase()}
              </div>
            </div>
          ) : (
            <Button onClick={connectWallet} size="sm" className="gap-2 text-xs">
              <Zap className="w-3 h-3" />
              <span className="hidden sm:inline">Connect</span>
              <span className="sm:hidden">Link</span>
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section - Mobile Optimized */}
      <section className="relative overflow-hidden px-4 py-12 md:py-20">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Logo Badge */}
          <Badge className="mb-6 inline-flex" variant="outline">
            <Flame className="w-3 h-3 mr-2 text-orange-500" />
            <span className="text-xs md:text-sm">Play to Earn on Base</span>
          </Badge>

          {/* Hero Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Collect • Battle • Earn
            </span>
          </h1>

          {/* Hero Description */}
          <p className="text-base md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Own Champion NFTs, compete in epic PvE and PvP battles, trade in the marketplace, and earn ARENA rewards.
          </p>

          {/* CTA Buttons - Mobile Friendly */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            {isConnected ? (
              <>
                <Button size="lg" asChild className="gap-2 w-full sm:w-auto">
                  <Link href="/champions">
                    <Shield className="w-5 h-5" />
                    <span>My Champions</span>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="gap-2 w-full sm:w-auto">
                  <Link href="/battle">
                    <Swords className="w-5 h-5" />
                    <span>Enter Battle</span>
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" onClick={connectWallet} className="gap-2 w-full sm:w-auto">
                  <Zap className="w-5 h-5" />
                  <span>Connect Wallet</span>
                </Button>
                <Button size="lg" variant="outline" asChild className="gap-2 w-full sm:w-auto">
                  <Link href="/marketplace">
                    <Store className="w-5 h-5" />
                    <span>Browse Market</span>
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-12">
            <Card className="border-border/30">
              <CardContent className="pt-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">10K+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Active Players</div>
              </CardContent>
            </Card>
            <Card className="border-border/30">
              <CardContent className="pt-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent">50K+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Champions</div>
              </CardContent>
            </Card>
            <Card className="border-border/30">
              <CardContent className="pt-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary/80">24/7</div>
                <div className="text-xs md:text-sm text-muted-foreground">Gaming</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Grid - Responsive */}
      <section className="px-4 py-12 md:py-20 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Game Features</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Experience the ultimate Web3 gaming ecosystem
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <FeatureCard
              icon={Shield}
              title="Champion Collection"
              description="Own unique NFTs with different rarities and abilities"
              href="/champions"
            />
            <FeatureCard
              icon={Swords}
              title="PvE Battles"
              description="Fight AI dungeons and earn ETH and ARENA rewards"
              href="/battle"
            />
            <FeatureCard
              icon={Users}
              title="PvP Challenges"
              description="Compete against players with wagers and rankings"
              href="/pvp"
            />
            <FeatureCard
              icon={Store}
              title="NFT Marketplace"
              description="Buy, sell, and trade champions with other players"
              href="/marketplace"
            />
            <FeatureCard
              icon={Coins}
              title="Token Staking"
              description="Stake ARENA tokens and earn passive rewards"
              href="/staking"
            />
            <FeatureCard
              icon={Trophy}
              title="Leaderboards"
              description="Compete for top ranks and exclusive rewards"
              href="/leaderboard"
            />
          </div>
        </div>
      </section>

      {/* Gameplay Flow - Mobile Optimized */}
      <section className="px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How to Play</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { num: '1', title: 'Connect', desc: 'Link MetaMask wallet on Base' },
              { num: '2', title: 'Mint', desc: 'Create or purchase Champions' },
              { num: '3', title: 'Battle', desc: 'Fight in PvE or PvP arenas' },
              { num: '4', title: 'Earn', desc: 'Claim ARENA rewards' },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground text-center">{step.desc}</p>
                {idx < 3 && <div className="hidden md:block absolute ml-32 mt-8 text-2xl text-primary">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 md:py-20 bg-gradient-to-r from-primary/10 via-background to-accent/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Enter the Arena?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join thousands of players in the ultimate Web3 gaming experience. Start earning rewards today.
          </p>
          {isConnected ? (
            <Button size="lg" asChild className="gap-2">
              <Link href="/champions">
                <Gamepad2 className="w-5 h-5" />
                Start Playing
              </Link>
            </Button>
          ) : (
            <Button size="lg" onClick={connectWallet} className="gap-2">
              <Zap className="w-5 h-5" />
              Connect Wallet Now
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 px-4 py-8 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Play</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/champions" className="hover:text-foreground transition">Champions</Link></li>
                <li><Link href="/battle" className="hover:text-foreground transition">Battles</Link></li>
                <li><Link href="/marketplace" className="hover:text-foreground transition">Marketplace</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Compete</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/pvp" className="hover:text-foreground transition">PvP Arena</Link></li>
                <li><Link href="/leaderboard" className="hover:text-foreground transition">Leaderboards</Link></li>
                <li><Link href="/staking" className="hover:text-foreground transition">Staking</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Network</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://base.org" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">Base Network</a></li>
                <li><a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">Discord</a></li>
                <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2024 ArenaVerse. All rights reserved.</p>
            <p className="text-sm text-muted-foreground">Built on Base • Powered by Web3</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, href }: any) {
  return (
    <Link href={href}>
      <Card className="h-full hover:border-primary/50 hover:bg-card/80 transition cursor-pointer group border-border/30">
        <CardHeader>
          <div className="w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-3 transition">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-lg group-hover:text-primary transition">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
