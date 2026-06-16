'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/lib/web3-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Swords, Zap, Flame, Shield, Heart, TrendingUp, Clock, Coins } from 'lucide-react';
import Link from 'next/link';

interface BattleDifficulty {
  level: number;
  name: string;
  description: string;
  entryFee: string;
  reward: string;
  difficulty: number;
}

const DIFFICULTY_LEVELS: BattleDifficulty[] = [
  {
    level: 1,
    name: 'Novice',
    description: 'Perfect for beginners',
    entryFee: '0.001 ETH',
    reward: '0.002 ETH + 50 ARENA',
    difficulty: 20,
  },
  {
    level: 2,
    name: 'Intermediate',
    description: 'Moderate challenge',
    entryFee: '0.002 ETH',
    reward: '0.005 ETH + 150 ARENA',
    difficulty: 50,
  },
  {
    level: 3,
    name: 'Advanced',
    description: 'For experienced players',
    entryFee: '0.005 ETH',
    reward: '0.015 ETH + 500 ARENA',
    difficulty: 75,
  },
  {
    level: 4,
    name: 'Expert',
    description: 'High risk, high reward',
    entryFee: '0.01 ETH',
    reward: '0.05 ETH + 2000 ARENA',
    difficulty: 85,
  },
  {
    level: 5,
    name: 'Legendary',
    description: 'Ultimate challenge',
    entryFee: '0.025 ETH',
    reward: '0.2 ETH + 10000 ARENA',
    difficulty: 95,
  },
];

export default function BattlePage() {
  const { isConnected, connectWallet, address } = useWeb3();
  const [mounted, setMounted] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<BattleDifficulty | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [battleResult, setBattleResult] = useState<{ won: boolean; xpGained: number } | null>(null);
  const [userStats, setUserStats] = useState({ level: 1, xp: 45, totalWins: 0, totalBattles: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartBattle = async (difficulty: BattleDifficulty) => {
    setSelectedDifficulty(difficulty);
    setIsSimulating(true);
    
    // Simulate battle (in real app, would call smart contract)
    await new Promise(r => setTimeout(r, 2000));
    
    const won = Math.random() > 0.4; // 60% win rate
    const xpGained = difficulty.level * 100;
    
    setBattleResult({ won, xpGained });
    setUserStats(prev => ({
      ...prev,
      totalBattles: prev.totalBattles + 1,
      totalWins: prev.totalWins + (won ? 1 : 0),
      xp: prev.xp + xpGained,
    }));
    
    setIsSimulating(false);
  };

  const resetBattle = () => {
    setSelectedDifficulty(null);
    setBattleResult(null);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/30 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <Swords className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">PvE Battle Arena</h1>
              <p className="text-muted-foreground">Engage in epic battles and earn rewards</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!isConnected ? (
          <Card className="w-full max-w-md mx-auto border-border/30">
            <CardHeader className="text-center">
              <Swords className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Enter the Battle Arena</CardTitle>
              <CardDescription>Connect your wallet to start battling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={connectWallet} size="lg" className="w-full gap-2">
                <Zap className="w-5 h-5" />
                Connect Wallet
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                You'll need a champion NFT to participate in battles.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Player Stats */}
            <Card className="border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Your Battle Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatItem icon={Shield} label="Level" value={userStats.level.toString()} />
                  <StatItem icon={Flame} label="Total Battles" value={userStats.totalBattles.toString()} />
                  <StatItem icon={Heart} label="Win Rate" value={userStats.totalBattles > 0 ? `${Math.round(userStats.totalWins / userStats.totalBattles * 100)}%` : '0%'} />
                  <StatItem icon={TrendingUp} label="XP Gained" value={userStats.xp.toString()} />
                </div>
              </CardContent>
            </Card>

            {!battleResult ? (
              <>
                {/* Battle Selection */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Select Battle Difficulty</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {DIFFICULTY_LEVELS.map((diff) => (
                      <BattleCard
                        key={diff.level}
                        difficulty={diff}
                        isSelected={selectedDifficulty?.level === diff.level}
                        isSimulating={isSimulating}
                        onSelect={() => handleStartBattle(diff)}
                      />
                    ))}
                  </div>
                </div>

                {/* Battle Tips */}
                <Card className="border-border/30 bg-card/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Battle Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <TipItem icon={Flame} text="Higher difficulty battles give more rewards but are harder to win" />
                    <TipItem icon={Clock} text="You can challenge the same difficulty multiple times daily" />
                    <TipItem icon={Coins} text="Winning grants XP to level up your champions" />
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Battle Result */}
                <Card className={`border-2 ${battleResult.won ? 'border-primary/50 bg-primary/5' : 'border-destructive/50 bg-destructive/5'}`}>
                  <CardContent className="pt-8">
                    <div className="text-center">
                      <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${battleResult.won ? 'bg-primary/20' : 'bg-destructive/20'}`}>
                        {battleResult.won ? (
                          <Flame className="w-10 h-10 text-primary" />
                        ) : (
                          <Heart className="w-10 h-10 text-destructive" />
                        )}
                      </div>
                      <h3 className={`text-3xl font-bold mb-2 ${battleResult.won ? 'text-primary' : 'text-destructive'}`}>
                        {battleResult.won ? 'Victory!' : 'Defeated'}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {battleResult.won 
                          ? `You've earned ${battleResult.xpGained} XP and rewards!`
                          : `You lost this battle. Try again!`}
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 mb-6">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span className="text-primary font-semibold">+{battleResult.xpGained} XP</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={resetBattle} size="lg" className="flex-1" variant="outline">
                    Back to Battles
                  </Button>
                  <Button asChild size="lg" className="flex-1" variant="outline">
                    <Link href="/champions">View Champions</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BattleCard({ difficulty, isSelected, isSimulating, onSelect }: any) {
  return (
    <Card
      className={`cursor-pointer transition-all border-border/30 hover:border-primary/50 ${isSelected ? 'border-primary/50 bg-primary/10' : ''}`}
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div>
            <CardTitle className="text-lg">{difficulty.name}</CardTitle>
            <CardDescription className="text-xs">{difficulty.description}</CardDescription>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Difficulty</span>
            <Badge variant="outline" className="text-xs">{difficulty.difficulty}%</Badge>
          </div>
          <Progress value={difficulty.difficulty} className="h-2" />
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Entry: {difficulty.entryFee}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold">{difficulty.reward}</span>
          </div>
        </div>
        <Button
          className="w-full"
          disabled={isSimulating}
          onClick={() => {}}
        >
          {isSimulating ? 'Battling...' : 'Enter Battle'}
        </Button>
      </CardContent>
    </Card>
  );
}

function StatItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-bold text-lg">{value}</p>
      </div>
    </div>
  );
}

function TipItem({ icon: Icon, text }: any) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
