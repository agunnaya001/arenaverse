'use client';

import { useState } from 'react';
import { 
  Swords, 
  Zap, 
  Trophy,
  Loader2,
  Wallet,
  CheckCircle2,
  XCircle,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Header } from '@/components/header';
import { ChampionCard } from '@/components/champion-card';
import { StatsCard, StatsGrid } from '@/components/stats-card';
import { useWeb3 } from '@/lib/web3-context';
import { useChampions, usePlayerStats, type Champion } from '@/hooks/use-game-state';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type BattlePhase = 'select' | 'matchmaking' | 'battle' | 'result';

interface BattleState {
  phase: BattlePhase;
  selectedChampion: Champion | null;
  opponent: Champion | null;
  isWin: boolean | null;
  reward: string | null;
}

export default function BattlePage() {
  const { isConnected, address, connect } = useWeb3();
  const { champions } = useChampions(address);
  const { stats, refresh: refreshStats } = usePlayerStats(address);
  const [battleState, setBattleState] = useState<BattleState>({
    phase: 'select',
    selectedChampion: null,
    opponent: null,
    isWin: null,
    reward: null,
  });
  const [battleProgress, setBattleProgress] = useState(0);

  const availableChampions = champions.filter(c => !c.isStaked);

  const startBattle = async (champion: Champion) => {
    setBattleState(prev => ({ ...prev, selectedChampion: champion, phase: 'matchmaking' }));
    
    // Simulate matchmaking
    await new Promise(r => setTimeout(r, 2000));
    
    // Generate opponent
    const opponent: Champion = {
      id: 999,
      name: 'Arena Bot #' + Math.floor(Math.random() * 1000),
      rarity: ['Common', 'Rare', 'Epic', 'Legendary'][Math.floor(Math.random() * 4)] as Champion['rarity'],
      class: ['Warrior', 'Mage', 'Rogue', 'Paladin'][Math.floor(Math.random() * 4)] as Champion['class'],
      level: champion.level + Math.floor(Math.random() * 5) - 2,
      experience: 0,
      stats: {
        strength: Math.floor(Math.random() * 30) + 10,
        agility: Math.floor(Math.random() * 30) + 10,
        intelligence: Math.floor(Math.random() * 30) + 10,
        vitality: Math.floor(Math.random() * 30) + 10,
      },
      imageUrl: '',
      isStaked: false,
    };

    setBattleState(prev => ({ ...prev, opponent, phase: 'battle' }));
    
    // Simulate battle progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 300));
      setBattleProgress(i);
    }

    // Determine winner based on total stats
    const playerPower = champion.stats.strength + champion.stats.agility + champion.stats.intelligence + champion.stats.vitality;
    const opponentPower = opponent.stats.strength + opponent.stats.agility + opponent.stats.intelligence + opponent.stats.vitality;
    const winChance = playerPower / (playerPower + opponentPower);
    const isWin = Math.random() < winChance + 0.1; // Slight player advantage
    const reward = isWin ? (Math.random() * 0.05 + 0.01).toFixed(4) : '0';

    setBattleState(prev => ({ ...prev, isWin, reward, phase: 'result' }));
    refreshStats();
  };

  const resetBattle = () => {
    setBattleState({
      phase: 'select',
      selectedChampion: null,
      opponent: null,
      isWin: null,
      reward: null,
    });
    setBattleProgress(0);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Swords className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Connect to Battle</h1>
            <p className="text-muted-foreground mb-8">
              Connect your wallet to send your champions into battle.
            </p>
            <Button onClick={connect} size="lg" className="gap-2">
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Swords className="w-8 h-8 text-accent" />
            Battle Arena
          </h1>
          <p className="text-muted-foreground mt-1">
            Send your champions to battle against AI opponents
          </p>
        </div>

        {/* Battle Stats */}
        {stats && (
          <StatsGrid className="mb-8">
            <StatsCard
              title="Total Battles"
              value={stats.wins + stats.losses}
              icon={Swords}
              variant="accent"
            />
            <StatsCard
              title="Wins"
              value={stats.wins}
              icon={Trophy}
              variant="gold"
            />
            <StatsCard
              title="Win Rate"
              value={`${Math.round((stats.wins / Math.max(stats.wins + stats.losses, 1)) * 100)}%`}
              icon={Zap}
              variant="primary"
            />
            <StatsCard
              title="Total Rewards"
              value={`${stats.totalRewards} ETH`}
              icon={Trophy}
            />
          </StatsGrid>
        )}

        {/* Battle Content */}
        {battleState.phase === 'select' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Your Champion</h2>
            {availableChampions.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-border/50 bg-card">
                <Swords className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Available Champions</h3>
                <p className="text-muted-foreground">
                  All your champions are currently staked. Unstake a champion to enter battle.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {availableChampions.map((champion) => (
                  <div key={champion.id} className="relative">
                    <ChampionCard
                      champion={champion}
                      showActions={false}
                      onSelect={() => startBattle(champion)}
                    />
                    <Button
                      className="absolute bottom-4 left-4 right-4 gap-2"
                      onClick={() => startBattle(champion)}
                    >
                      <Swords className="w-4 h-4" />
                      Send to Battle
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {battleState.phase === 'matchmaking' && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">Finding Opponent...</h2>
            <p className="text-muted-foreground">
              Searching for a worthy challenger for {battleState.selectedChampion?.name}
            </p>
          </div>
        )}

        {battleState.phase === 'battle' && battleState.selectedChampion && battleState.opponent && (
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 items-center mb-8">
              {/* Player Champion */}
              <div className="text-center">
                <Badge className="mb-4">Your Champion</Badge>
                <ChampionCard champion={battleState.selectedChampion} showActions={false} />
              </div>

              {/* VS */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Flame className="w-10 h-10 text-accent animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold text-accent">VS</h2>
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-2">Battle Progress</p>
                  <Progress value={battleProgress} className="h-3" />
                </div>
              </div>

              {/* Opponent */}
              <div className="text-center">
                <Badge variant="destructive" className="mb-4">Opponent</Badge>
                <ChampionCard champion={battleState.opponent} showActions={false} />
              </div>
            </div>
          </div>
        )}

        {battleState.phase === 'result' && battleState.selectedChampion && battleState.opponent && (
          <div className="max-w-2xl mx-auto text-center py-10">
            <div className={cn(
              'w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6',
              battleState.isWin ? 'bg-green-500/20' : 'bg-red-500/20'
            )}>
              {battleState.isWin ? (
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              ) : (
                <XCircle className="w-12 h-12 text-red-500" />
              )}
            </div>

            <h2 className="text-3xl font-bold mb-2">
              {battleState.isWin ? 'Victory!' : 'Defeat'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {battleState.isWin 
                ? `${battleState.selectedChampion.name} defeated ${battleState.opponent.name}!`
                : `${battleState.selectedChampion.name} was defeated by ${battleState.opponent.name}.`
              }
            </p>

            {battleState.isWin && battleState.reward && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 mb-8">
                <p className="text-sm text-muted-foreground mb-1">Rewards Earned</p>
                <p className="text-3xl font-bold text-green-500">{battleState.reward} ETH</p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={resetBattle}>
                Select New Champion
              </Button>
              <Button onClick={() => startBattle(battleState.selectedChampion!)} className="gap-2">
                <Swords className="w-4 h-4" />
                Battle Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
