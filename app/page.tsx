'use client';

import Link from 'next/link';
import { Swords, Trophy, Users, Coins, Shield, Zap, Store, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWeb3 } from '@/lib/web3-context';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const { isConnected, address, connectWallet, balance, isAdmin } = useWeb3();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">ArenaGameFi</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition">
              Marketplace
            </Link>
            <Link href="/leaderboard" className="text-sm text-muted-foreground hover:text-foreground transition">
              Leaderboard
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm text-primary hover:text-primary/80 transition font-semibold">
                Admin Panel
              </Link>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="text-right text-sm">
                  <p className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                  <p className="text-muted-foreground">{parseFloat(balance).toFixed(3)} ETH</p>
                </div>
                <Button variant="outline" size="sm">Connected</Button>
              </div>
            ) : (
              <Button onClick={connectWallet} size="sm" className="gap-2">
                <Zap className="w-4 h-4" />
                Connect
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b border-border/50 bg-gradient-to-b from-primary/5 to-background py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6" variant="outline">
            <Zap className="w-3 h-3 mr-2" />
            Live on Base Network
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground text-balance">
            Collect Champions<br />
            <span className="text-primary">Battle Opponents</span><br />
            Earn Rewards
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            The ultimate blockchain gaming experience on Base. Mint champion NFTs, engage in strategic battles, and trade in the marketplace.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isConnected ? (
              <>
                <Button size="lg" asChild className="gap-2">
                  <Link href="/champions">
                    <Shield className="w-5 h-5" />
                    My Champions
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="gap-2">
                  <Link href="/battle">
                    <Swords className="w-5 h-5" />
                    Enter Battle
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" onClick={connectWallet} className="gap-2">
                  <Zap className="w-5 h-5" />
                  Connect Wallet to Start
                </Button>
                <Button size="lg" variant="outline" asChild className="gap-2">
                  <Link href="/marketplace">
                    <Store className="w-5 h-5" />
                    Browse Market
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Game Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Shield}
              title="Champion Collection"
              description="Mint and collect unique champion NFTs with different rarities and abilities."
              href="/champions"
            />
            <FeatureCard
              icon={Swords}
              title="Battle Arena"
              description="Fight AI opponents and earn ETH and ARENA token rewards."
              href="/battle"
            />
            <FeatureCard
              icon={Users}
              title="PVP Battles"
              description="Challenge other players with wagers and compete for rewards."
              href="/pvp"
            />
            <FeatureCard
              icon={Store}
              title="Marketplace"
              description="Buy and sell champion NFTs with other players instantly."
              href="/marketplace"
            />
            <FeatureCard
              icon={Coins}
              title="Token Staking"
              description="Stake ARENA tokens and earn passive rewards."
              href="/staking"
            />
            <FeatureCard
              icon={Trophy}
              title="Leaderboards"
              description="Compete for top rankings and showcase your prowess."
              href="/leaderboard"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-muted/30 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Game Statistics</h2>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">10K+</p>
              <p className="text-muted-foreground">Active Players</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">50K+</p>
              <p className="text-muted-foreground">Champions Minted</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">1M+</p>
              <p className="text-muted-foreground">ETH Traded</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">24/7</p>
              <p className="text-muted-foreground">Live Gaming</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Play?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of players in the ultimate blockchain gaming experience.
          </p>
          {!isConnected && (
            <Button size="lg" onClick={connectWallet} className="gap-2">
              <Zap className="w-5 h-5" />
              Connect MetaMask to Start
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, href }: any) {
  return (
    <Link href={href}>
      <Card className="h-full hover:border-primary transition cursor-pointer">
        <CardHeader>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
