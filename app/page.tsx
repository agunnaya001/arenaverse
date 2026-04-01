'use client';

import Link from 'next/link';
import { 
  Swords, 
  Trophy, 
  Users, 
  Coins, 
  Shield, 
  TrendingUp,
  ArrowRight,
  Zap,
  Store,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/header';
import { StatsCard, StatsGrid } from '@/components/stats-card';
import { ChampionCard } from '@/components/champion-card';
import { useWeb3 } from '@/lib/web3-context';
import { useChampions, useListings, useLeaderboard, usePlayerStats } from '@/hooks/use-game-state';
import { cn } from '@/lib/utils';
import { formatAddress } from '@/lib/contracts';

export default function HomePage() {
  const { isConnected, address, connect } = useWeb3();
  const { champions } = useChampions(address);
  const { listings } = useListings();
  const { leaderboard } = useLeaderboard();
  const { stats } = usePlayerStats(address);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-primary border-primary/30">
              <Zap className="w-3 h-3 mr-1" />
              Live on Base Network
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
              Collect Champions.{' '}
              <span className="text-primary">Battle Opponents.</span>{' '}
              <span className="text-accent">Conquer the Arena.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              The ultimate blockchain gaming experience. Mint unique champion NFTs, 
              engage in strategic PVP battles, stake tokens for rewards, and trade 
              in the marketplace.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isConnected ? (
                <>
                  <Button asChild size="lg" className="w-full sm:w-auto gap-2">
                    <Link href="/champions">
                      <Shield className="w-5 h-5" />
                      View My Champions
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                    <Link href="/battle">
                      <Swords className="w-5 h-5" />
                      Enter Battle
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={connect} size="lg" className="w-full sm:w-auto gap-2">
                    <Zap className="w-5 h-5" />
                    Connect Wallet to Start
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                    <Link href="/marketplace">
                      <Store className="w-5 h-5" />
                      Browse Marketplace
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      {isConnected && stats && (
        <section className="container mx-auto px-4 py-12">
          <StatsGrid>
            <StatsCard
              title="Total Wins"
              value={stats.wins}
              subtitle="Battle victories"
              icon={Trophy}
              variant="gold"
            />
            <StatsCard
              title="Win Rate"
              value={`${Math.round((stats.wins / (stats.wins + stats.losses)) * 100)}%`}
              subtitle={`${stats.wins + stats.losses} total battles`}
              icon={TrendingUp}
              variant="primary"
            />
            <StatsCard
              title="Champions Owned"
              value={champions.length}
              subtitle="In your collection"
              icon={Shield}
              variant="accent"
            />
            <StatsCard
              title="Total Rewards"
              value={`${stats.totalRewards} ETH`}
              subtitle="Earned from battles"
              icon={Coins}
              variant="gold"
            />
          </StatsGrid>
        </section>
      )}

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Game Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to dominate the arena and earn rewards
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={Shield}
            title="Champion Collection"
            description="Mint and collect unique champion NFTs with different rarities, classes, and abilities."
            href="/champions"
            color="primary"
          />
          <FeatureCard
            icon={Swords}
            title="Battle Arena"
            description="Send your champions into battle against AI opponents and earn rewards."
            href="/battle"
            color="accent"
          />
          <FeatureCard
            icon={Users}
            title="PVP Battles"
            description="Challenge other players to high-stakes PVP matches with token wagers."
            href="/pvp"
            color="gold"
          />
          <FeatureCard
            icon={Store}
            title="Marketplace"
            description="Buy and sell champions with other players in the decentralized marketplace."
            href="/marketplace"
            color="primary"
          />
          <FeatureCard
            icon={Coins}
            title="Token Staking"
            description="Stake ARENA tokens to earn passive rewards and boost your champions."
            href="/staking"
            color="accent"
          />
          <FeatureCard
            icon={Trophy}
            title="Leaderboard"
            description="Compete for the top ranks and showcase your battle prowess."
            href="/leaderboard"
            color="gold"
          />
        </div>
      </section>

      {/* My Champions Preview (if connected) */}
      {isConnected && champions.length > 0 && (
        <section className="container mx-auto px-4 py-16 border-t border-border/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Your Champions</h2>
              <p className="text-muted-foreground">Ready for battle</p>
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/champions">
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {champions.slice(0, 4).map((champion) => (
              <ChampionCard 
                key={champion.id} 
                champion={champion}
                showActions={false}
              />
            ))}
          </div>
        </section>
      )}

      {/* Marketplace Preview */}
      <section className="container mx-auto px-4 py-16 border-t border-border/50">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Featured Listings</h2>
            <p className="text-muted-foreground">Champions available for purchase</p>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/marketplace">
              View Marketplace
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.slice(0, 4).map((listing) => (
            <ChampionCard 
              key={listing.id} 
              champion={listing.champion}
              price={listing.price}
              showActions={false}
            />
          ))}
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="container mx-auto px-4 py-16 border-t border-border/50">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Top Players</h2>
            <p className="text-muted-foreground">Arena champions</p>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/leaderboard">
              Full Leaderboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-secondary/30 text-sm font-medium text-muted-foreground">
            <div>Rank</div>
            <div className="col-span-2">Player</div>
            <div className="text-right">Wins</div>
            <div className="text-right">Win Rate</div>
          </div>
          <div className="divide-y divide-border/50">
            {leaderboard.slice(0, 5).map((entry) => (
              <div 
                key={entry.rank}
                className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {entry.rank <= 3 ? (
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                      entry.rank === 1 && 'bg-amber-500/20 text-amber-400',
                      entry.rank === 2 && 'bg-slate-400/20 text-slate-300',
                      entry.rank === 3 && 'bg-orange-600/20 text-orange-400'
                    )}>
                      {entry.rank}
                    </div>
                  ) : (
                    <span className="w-8 text-center text-muted-foreground">{entry.rank}</span>
                  )}
                </div>
                <div className="col-span-2 font-mono text-sm">
                  {formatAddress(entry.address)}
                </div>
                <div className="text-right font-medium">{entry.wins}</div>
                <div className="text-right">
                  <Badge variant={entry.winRate >= 60 ? 'default' : 'secondary'}>
                    {entry.winRate}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50">
        <div className="container mx-auto px-4 py-20">
          <div className="relative rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-8 sm:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5" />
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Enter the Arena?
              </h2>
              <p className="text-muted-foreground mb-8">
                Connect your wallet to start collecting champions and battling for glory.
              </p>
              {isConnected ? (
                <Button asChild size="lg" className="gap-2">
                  <Link href="/champions">
                    Start Playing
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </Button>
              ) : (
                <Button onClick={connect} size="lg" className="gap-2">
                  <Zap className="w-5 h-5" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-bold">ArenaGameFi</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built on Base. Powered by blockchain.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  href,
  color 
}: { 
  icon: typeof Shield; 
  title: string; 
  description: string; 
  href: string;
  color: 'primary' | 'accent' | 'gold';
}) {
  const colorStyles = {
    primary: 'bg-primary/10 text-primary group-hover:bg-primary/20',
    accent: 'bg-accent/10 text-accent group-hover:bg-accent/20',
    gold: 'bg-arena-gold/10 text-arena-gold group-hover:bg-arena-gold/20',
  };

  return (
    <Link 
      href={href}
      className="group relative rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-lg"
    >
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors',
        colorStyles[color]
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm">
        {description}
      </p>
      <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
