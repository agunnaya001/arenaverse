'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/lib/web3-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Zap, Trophy, Flame, Target, Coins, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

interface Challenge {
  id: string;
  challenger: string;
  wager: string;
  rank: string;
  status: 'open' | 'active' | 'completed';
}

const SAMPLE_CHALLENGES: Challenge[] = [
  { id: '1', challenger: '0x1234...5678', wager: '0.5 ETH', rank: 'Gold I', status: 'open' },
  { id: '2', challenger: '0x2345...6789', wager: '0.25 ETH', rank: 'Silver III', status: 'open' },
  { id: '3', challenger: '0x3456...7890', wager: '1.0 ETH', rank: 'Platinum', status: 'active' },
];

export default function PVPPage() {
  const { isConnected, connectWallet } = useWeb3();
  const [mounted, setMounted] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [userStats, setUserStats] = useState({
    rank: 'Silver II',
    wins: 24,
    losses: 8,
    totalWagers: '12.5 ETH',
    seasonalRank: 1427,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/30 bg-gradient-to-b from-accent/5 to-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-accent/20">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">PvP Arena</h1>
              <p className="text-muted-foreground">Challenge players and climb the ranked ladder</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!isConnected ? (
          <Card className="w-full max-w-md mx-auto border-border/30">
            <CardHeader className="text-center">
              <Users className="w-12 h-12 text-accent mx-auto mb-4" />
              <CardTitle>Join the PvP Arena</CardTitle>
              <CardDescription>Challenge other players to epic ranked battles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={connectWallet} size="lg" className="w-full gap-2">
                <Zap className="w-5 h-5" />
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Ranked Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Trophy} label="Current Rank" value={userStats.rank} color="primary" />
              <StatCard icon={TrendingUp} label="Win Rate" value={`${Math.round(userStats.wins / (userStats.wins + userStats.losses) * 100)}%`} color="accent" />
              <StatCard icon={Flame} label="Total Wins" value={userStats.wins.toString()} color="orange" />
              <StatCard icon={Coins} label="Seasonal Rank" value={`#${userStats.seasonalRank}`} color="primary" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Open Challenges */}
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Available Challenges
                </h2>

                <div className="space-y-4">
                  {SAMPLE_CHALLENGES.filter(c => c.status === 'open').map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onAccept={() => setSelectedChallenge(challenge)}
                    />
                  ))}
                </div>

                {SAMPLE_CHALLENGES.filter(c => c.status === 'open').length === 0 && (
                  <Card className="border-border/30 border-dashed text-center py-12">
                    <CardContent>
                      <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No open challenges available</p>
                      <p className="text-sm text-muted-foreground mt-2">Create a new challenge to invite opponents</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Create Challenge / Active */}
              <div>
                <h3 className="text-lg font-bold mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full gap-2">
                    <Zap className="w-4 h-4" />
                    Create Challenge
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Clock className="w-4 h-4" />
                    View History
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Trophy className="w-4 h-4" />
                    Leaderboard
                  </Button>
                </div>

                {/* Current Match Info */}
                <Card className="mt-6 border-border/30 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-sm">Season Info</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ends in:</span>
                      <span className="font-semibold">15 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Earned:</span>
                      <span className="font-semibold text-primary">2.5 ETH</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Ranked Tiers Info */}
            <Card className="border-border/30 bg-card/50">
              <CardHeader>
                <CardTitle>Ranked Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Bronze', color: 'from-orange-700 to-orange-600', minRating: '0' },
                    { name: 'Silver', color: 'from-gray-400 to-gray-300', minRating: '1000' },
                    { name: 'Gold', color: 'from-yellow-600 to-yellow-500', minRating: '2000' },
                    { name: 'Platinum', color: 'from-blue-500 to-cyan-400', minRating: '3000' },
                  ].map((tier) => (
                    <div key={tier.name} className="text-center">
                      <div className={`w-12 h-12 rounded-full mx-auto mb-2 bg-gradient-to-br ${tier.color}`} />
                      <p className="font-semibold text-sm">{tier.name}</p>
                      <p className="text-xs text-muted-foreground">{tier.minRating}+ RP</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rewards Section */}
            <Card className="border-border/30">
              <CardHeader>
                <CardTitle>Season Rewards</CardTitle>
                <CardDescription>Earn exclusive rewards based on your final rank</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <RewardTier rank="Gold+" reward="5 ETH + Exclusive Avatar" />
                  <RewardTier rank="Silver" reward="2 ETH + Rare Badge" />
                  <RewardTier rank="Bronze" reward="0.5 ETH + Common Badge" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="border-border/30">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`p-2 rounded-lg bg-${color}/10`}>
            <Icon className={`w-5 h-5 text-${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChallengeCard({ challenge, onAccept }: { challenge: Challenge; onAccept: () => void }) {
  return (
    <Card className="border-border/30 hover:border-accent/50 transition cursor-pointer">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">{challenge.rank}</Badge>
              <Badge className="text-xs bg-accent/20 text-accent border-0">Ready</Badge>
            </div>
            <p className="font-mono text-sm text-muted-foreground mb-2">{challenge.challenger}</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-sm">
                <Coins className="w-4 h-4 text-primary" />
                Wager: <span className="font-semibold">{challenge.wager}</span>
              </span>
            </div>
          </div>
          <Button onClick={onAccept} className="w-full sm:w-auto gap-2">
            <Flame className="w-4 h-4" />
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RewardTier({ rank, reward }: { rank: string; reward: string }) {
  return (
    <div className="border border-border/30 rounded-lg p-4 text-center hover:border-primary/50 transition">
      <p className="font-bold mb-2">{rank}</p>
      <p className="text-sm text-muted-foreground">{reward}</p>
    </div>
  );
}
