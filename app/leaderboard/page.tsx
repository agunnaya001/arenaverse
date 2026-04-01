'use client';

import { useState } from 'react';
import { 
  Trophy, 
  Medal,
  TrendingUp,
  Users,
  Loader2,
  Search,
  Crown,
  Swords,
  Target
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/header';
import { StatsCard, StatsGrid } from '@/components/stats-card';
import { useWeb3 } from '@/lib/web3-context';
import { useLeaderboard, usePlayerStats } from '@/hooks/use-game-state';
import { formatAddress } from '@/lib/contracts';
import { cn } from '@/lib/utils';

export default function LeaderboardPage() {
  const { address } = useWeb3();
  const { leaderboard, isLoading } = useLeaderboard();
  const { stats } = usePlayerStats(address);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overall');

  // Filter leaderboard
  const filteredLeaderboard = leaderboard.filter((entry) =>
    entry.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Find user's rank
  const userRank = address 
    ? leaderboard.findIndex(e => e.address.toLowerCase() === address.toLowerCase()) + 1
    : null;

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="w-8 h-8 text-arena-gold" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Top arena champions ranked by performance
          </p>
        </div>

        {/* User Stats (if connected) */}
        {stats && (
          <div className="mb-8 p-6 rounded-xl border border-primary/30 bg-primary/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                  {userRank && userRank <= 3 ? (
                    <Crown className={cn(
                      'w-8 h-8',
                      userRank === 1 && 'text-amber-400',
                      userRank === 2 && 'text-slate-300',
                      userRank === 3 && 'text-orange-400'
                    )} />
                  ) : (
                    <Medal className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Rank</p>
                  <p className="text-3xl font-bold">
                    #{userRank || '-'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Wins</p>
                  <p className="text-2xl font-bold text-green-500">{stats.wins}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Losses</p>
                  <p className="text-2xl font-bold text-red-500">{stats.losses}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">
                    {Math.round((stats.wins / Math.max(stats.wins + stats.losses, 1)) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Stats */}
        <StatsGrid className="mb-8">
          <StatsCard
            title="Total Players"
            value={leaderboard.length.toLocaleString()}
            icon={Users}
            variant="primary"
          />
          <StatsCard
            title="Total Battles"
            value={leaderboard.reduce((sum, e) => sum + e.wins + e.losses, 0).toLocaleString()}
            icon={Swords}
            variant="accent"
          />
          <StatsCard
            title="Total Rewards Distributed"
            value={`${leaderboard.reduce((sum, e) => sum + parseFloat(e.totalRewards), 0).toFixed(2)} ETH`}
            icon={Trophy}
            variant="gold"
          />
          <StatsCard
            title="Average Win Rate"
            value={`${Math.round(leaderboard.reduce((sum, e) => sum + e.winRate, 0) / leaderboard.length)}%`}
            icon={Target}
          />
        </StatsGrid>

        {/* Leaderboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <TabsList>
              <TabsTrigger value="overall">Overall</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="pvp">PVP</TabsTrigger>
            </TabsList>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <TabsContent value="overall">
            <LeaderboardTable 
              entries={filteredLeaderboard} 
              isLoading={isLoading}
              currentAddress={address}
            />
          </TabsContent>

          <TabsContent value="weekly">
            <LeaderboardTable 
              entries={filteredLeaderboard.slice().sort(() => Math.random() - 0.5)} 
              isLoading={isLoading}
              currentAddress={address}
            />
          </TabsContent>

          <TabsContent value="pvp">
            <LeaderboardTable 
              entries={filteredLeaderboard.slice().sort(() => Math.random() - 0.5)} 
              isLoading={isLoading}
              currentAddress={address}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function LeaderboardTable({ 
  entries, 
  isLoading,
  currentAddress 
}: { 
  entries: Array<{
    rank: number;
    address: string;
    wins: number;
    losses: number;
    winRate: number;
    totalRewards: string;
  }>;
  isLoading: boolean;
  currentAddress: string | null;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-20 rounded-xl border border-border/50 bg-card">
        <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search query.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-secondary/30 text-sm font-medium text-muted-foreground">
        <div>Rank</div>
        <div className="col-span-2">Player</div>
        <div className="text-right">Wins</div>
        <div className="text-right">Win Rate</div>
        <div className="text-right">Rewards</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border/50">
        {entries.map((entry, index) => {
          const isCurrentUser = entry.address.toLowerCase() === currentAddress?.toLowerCase();
          const displayRank = index + 1;
          
          return (
            <div 
              key={entry.address}
              className={cn(
                'grid grid-cols-6 gap-4 px-6 py-4 items-center transition-colors',
                isCurrentUser 
                  ? 'bg-primary/5 hover:bg-primary/10' 
                  : 'hover:bg-secondary/20'
              )}
            >
              {/* Rank */}
              <div>
                {displayRank <= 3 ? (
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                    displayRank === 1 && 'bg-amber-500/20 text-amber-400',
                    displayRank === 2 && 'bg-slate-400/20 text-slate-300',
                    displayRank === 3 && 'bg-orange-600/20 text-orange-400'
                  )}>
                    {displayRank === 1 && <Crown className="w-5 h-5" />}
                    {displayRank === 2 && <Medal className="w-5 h-5" />}
                    {displayRank === 3 && <Medal className="w-5 h-5" />}
                  </div>
                ) : (
                  <span className="w-10 text-center text-muted-foreground font-medium">
                    {displayRank}
                  </span>
                )}
              </div>

              {/* Player */}
              <div className="col-span-2 flex items-center gap-2">
                <span className="font-mono text-sm">
                  {formatAddress(entry.address)}
                </span>
                {isCurrentUser && (
                  <Badge variant="outline" className="text-xs">You</Badge>
                )}
              </div>

              {/* Wins */}
              <div className="text-right">
                <span className="font-medium">{entry.wins}</span>
                <span className="text-muted-foreground text-sm ml-1">
                  / {entry.wins + entry.losses}
                </span>
              </div>

              {/* Win Rate */}
              <div className="text-right">
                <Badge 
                  variant={entry.winRate >= 60 ? 'default' : 'secondary'}
                  className={cn(
                    entry.winRate >= 70 && 'bg-green-500/20 text-green-400 border-green-500/30',
                    entry.winRate >= 60 && entry.winRate < 70 && 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  )}
                >
                  {entry.winRate}%
                </Badge>
              </div>

              {/* Rewards */}
              <div className="text-right">
                <span className="font-medium text-arena-gold">
                  {entry.totalRewards} ETH
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
