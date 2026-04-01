'use client';

import { useState } from 'react';
import { 
  Users, 
  Swords, 
  Plus,
  Loader2,
  Wallet,
  Trophy,
  Coins,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Header } from '@/components/header';
import { ChampionCard } from '@/components/champion-card';
import { StatsCard, StatsGrid } from '@/components/stats-card';
import { useWeb3 } from '@/lib/web3-context';
import { useChampions, useChallenges, usePlayerStats, type Champion, type Challenge } from '@/hooks/use-game-state';
import { formatAddress } from '@/lib/contracts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function PVPPage() {
  const { isConnected, address, connect } = useWeb3();
  const { champions } = useChampions(address);
  const { challenges, refresh: refreshChallenges } = useChallenges();
  const { stats } = usePlayerStats(address);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedChampion, setSelectedChampion] = useState<string>('');
  const [wagerAmount, setWagerAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const availableChampions = champions.filter(c => !c.isStaked);

  const handleCreateChallenge = async () => {
    if (!selectedChampion || !wagerAmount) return;
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      toast.success('Challenge created! Waiting for opponent...');
      setShowCreateDialog(false);
      setSelectedChampion('');
      setWagerAmount('');
      refreshChallenges();
    } catch {
      toast.error('Failed to create challenge');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptChallenge = async () => {
    if (!selectedChampion || !selectedChallenge) return;
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      const isWin = Math.random() > 0.5;
      if (isWin) {
        toast.success(`Victory! You won ${selectedChallenge.wagerAmount} ETH!`);
      } else {
        toast.error(`Defeat! You lost ${selectedChallenge.wagerAmount} ETH.`);
      }
      setShowAcceptDialog(false);
      setSelectedChallenge(null);
      setSelectedChampion('');
      refreshChallenges();
    } catch {
      toast.error('Failed to accept challenge');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-arena-gold/10 flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-arena-gold" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Connect to PVP Arena</h1>
            <p className="text-muted-foreground mb-8">
              Connect your wallet to challenge other players in high-stakes PVP battles.
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="w-8 h-8 text-arena-gold" />
              PVP Arena
            </h1>
            <p className="text-muted-foreground mt-1">
              Challenge other players for ETH wagers
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="w-5 h-5" />
            Create Challenge
          </Button>
        </div>

        {/* PVP Stats */}
        {stats && (
          <StatsGrid className="mb-8">
            <StatsCard
              title="PVP Wins"
              value={stats.pvpWins}
              icon={Trophy}
              variant="gold"
            />
            <StatsCard
              title="PVP Losses"
              value={stats.pvpLosses}
              icon={Swords}
              variant="accent"
            />
            <StatsCard
              title="Total Wagered"
              value={`${stats.totalWagered} ETH`}
              icon={Coins}
            />
            <StatsCard
              title="Total Won"
              value={`${stats.totalWon} ETH`}
              icon={Trophy}
              variant="primary"
            />
          </StatsGrid>
        )}

        {/* Challenges */}
        <Tabs defaultValue="open" className="space-y-6">
          <TabsList>
            <TabsTrigger value="open">Open Challenges</TabsTrigger>
            <TabsTrigger value="my">My Challenges</TabsTrigger>
          </TabsList>

          <TabsContent value="open">
            {challenges.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-border/50 bg-card">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Open Challenges</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to create a challenge!
                </p>
                <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                  <Plus className="w-5 h-5" />
                  Create Challenge
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {challenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onAccept={() => {
                      setSelectedChallenge(challenge);
                      setShowAcceptDialog(true);
                    }}
                    isOwn={challenge.challenger.toLowerCase() === address?.toLowerCase()}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my">
            <div className="text-center py-16 rounded-xl border border-border/50 bg-card">
              <Swords className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Challenges</h3>
              <p className="text-muted-foreground">
                Create a challenge to start battling other players.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Challenge Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create PVP Challenge</DialogTitle>
            <DialogDescription>
              Select a champion and set your wager amount. Other players can accept your challenge.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Champion</label>
              <Select value={selectedChampion} onValueChange={setSelectedChampion}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your champion" />
                </SelectTrigger>
                <SelectContent>
                  {availableChampions.map((champion) => (
                    <SelectItem key={champion.id} value={champion.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn(
                          champion.rarity === 'Legendary' && 'text-amber-400 border-amber-400/30',
                          champion.rarity === 'Epic' && 'text-purple-400 border-purple-400/30',
                          champion.rarity === 'Rare' && 'text-blue-400 border-blue-400/30'
                        )}>
                          {champion.rarity}
                        </Badge>
                        {champion.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Wager Amount (ETH)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.05"
                value={wagerAmount}
                onChange={(e) => setWagerAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Winner takes the combined wager minus platform fee (5%)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateChallenge} 
              disabled={isLoading || !selectedChampion || !wagerAmount}
              className="gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Challenge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Accept Challenge Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Accept Challenge</DialogTitle>
            <DialogDescription>
              Select a champion to fight against {selectedChallenge?.champion.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {selectedChallenge && (
              <div className="rounded-lg border border-border/50 p-4 bg-secondary/30">
                <p className="text-sm text-muted-foreground mb-2">Opponent&apos;s Champion</p>
                <ChampionCard champion={selectedChallenge.champion} showActions={false} compact />
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Wager Amount</span>
                  <span className="font-bold text-arena-gold">{selectedChallenge.wagerAmount} ETH</span>
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block">Select Your Champion</label>
              <Select value={selectedChampion} onValueChange={setSelectedChampion}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your champion" />
                </SelectTrigger>
                <SelectContent>
                  {availableChampions.map((champion) => (
                    <SelectItem key={champion.id} value={champion.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn(
                          champion.rarity === 'Legendary' && 'text-amber-400 border-amber-400/30',
                          champion.rarity === 'Epic' && 'text-purple-400 border-purple-400/30',
                          champion.rarity === 'Rare' && 'text-blue-400 border-blue-400/30'
                        )}>
                          {champion.rarity}
                        </Badge>
                        {champion.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAcceptChallenge} 
              disabled={isLoading || !selectedChampion}
              className="gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Accept & Battle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ChallengeCard({ 
  challenge, 
  onAccept, 
  isOwn 
}: { 
  challenge: Challenge; 
  onAccept: () => void; 
  isOwn: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-6 hover:border-border transition-colors">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Champion Preview */}
        <div className="flex-shrink-0 w-full md:w-48">
          <ChampionCard champion={challenge.champion} showActions={false} compact />
        </div>

        {/* Challenge Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Challenger:</span>
            <span className="font-mono text-sm">{formatAddress(challenge.challenger)}</span>
            {isOwn && <Badge>You</Badge>}
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Wager Amount</p>
              <p className="text-xl font-bold text-arena-gold">{challenge.wagerAmount} ETH</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Potential Win</p>
              <p className="text-xl font-bold text-green-500">
                {(parseFloat(challenge.wagerAmount) * 1.9).toFixed(4)} ETH
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isOwn ? (
            <Button variant="outline" className="gap-2">
              <X className="w-4 h-4" />
              Cancel
            </Button>
          ) : (
            <Button onClick={onAccept} className="gap-2">
              <Swords className="w-4 h-4" />
              Accept Challenge
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
