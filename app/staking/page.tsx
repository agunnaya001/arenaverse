'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/lib/web3-context';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, TrendingUp, Lock, Zap, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const STAKING_TIERS = [
  { id: 1, name: 'Bronze', minTokens: 100, apy: 5, multiplier: 1.0 },
  { id: 2, name: 'Silver', minTokens: 1000, apy: 10, multiplier: 1.5 },
  { id: 3, name: 'Gold', minTokens: 10000, apy: 15, multiplier: 2.0 },
  { id: 4, name: 'Platinum', minTokens: 50000, apy: 20, multiplier: 2.5 },
  { id: 5, name: 'Diamond', minTokens: 100000, apy: 25, multiplier: 3.0 },
];

export default function StakingPage() {
  const { isConnected, address, connect, arenaBalance } = useWeb3();
  const [mounted, setMounted] = useState(false);
  const [stakedAmount, setStakedAmount] = useState('0');
  const [rewards, setRewards] = useState('0');
  const [selectedChampion, setSelectedChampion] = useState<string | null>(null);
  const [champions, setChampions] = useState<any[]>([]);
  const [stakeAmount, setStakeAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      loadChampions();
      loadStakingData();
    }
  }, [isConnected, address]);

  const loadChampions = async () => {
    try {
      const { data, error } = await supabase
        .from('champions')
        .select('*')
        .eq('user_id', address);

      if (error) throw error;
      setChampions(data || []);
    } catch (error) {
      console.error('[v0] Failed to load champions:', error);
    }
  };

  const loadStakingData = async () => {
    try {
      const { data, error } = await supabase
        .from('staking')
        .select('*')
        .eq('user_id', address);

      if (error) throw error;

      const total = (data || []).reduce((sum, stake) => sum + stake.arena_tokens_staked, 0);
      const totalRewards = (data || []).reduce((sum, stake) => sum + stake.claimed_rewards, 0);

      setStakedAmount(total.toString());
      setRewards(totalRewards.toString());
    } catch (error) {
      console.error('[v0] Failed to load staking data:', error);
    }
  };

  const handleStake = async () => {
    if (!selectedChampion || !stakeAmount) {
      toast.error('Please select a champion and amount');
      return;
    }

    try {
      setLoading(true);
      const amount = parseInt(stakeAmount);

      const { data, error } = await supabase
        .from('staking')
        .insert([{
          user_id: address,
          champion_id: selectedChampion,
          arena_tokens_staked: amount,
          reward_multiplier: 1.0,
        }])
        .select();

      if (error) throw error;

      toast.success(`Staked ${amount} ARENA tokens!`);
      setStakeAmount('');
      setSelectedChampion(null);
      loadStakingData();
    } catch (error) {
      console.error('[v0] Failed to stake:', error);
      toast.error('Failed to stake tokens');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>View and manage your staking positions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => connect()} className="w-full gap-2">
              <Zap className="w-4 h-4" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Coins className="w-8 h-8 text-primary" />
            Token Staking
          </h1>
          <p className="text-muted-foreground">Earn passive rewards by staking ARENA tokens</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Your Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{parseFloat(arenaBalance).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">ARENA tokens</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Staked Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stakedAmount}</p>
              <p className="text-xs text-muted-foreground">Total staked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Claimable Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{rewards}</p>
              <p className="text-xs text-muted-foreground">ARENA rewards</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Avg. APY</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-500">15%</p>
              <p className="text-xs text-muted-foreground">Annual yield</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="stake" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stake">Stake Tokens</TabsTrigger>
            <TabsTrigger value="tiers">Staking Tiers</TabsTrigger>
          </TabsList>

          {/* Stake Tab */}
          <TabsContent value="stake" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stake Your Champions</CardTitle>
                <CardDescription>Lock tokens with your champions to earn rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Select Champion</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {champions.length === 0 ? (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground">No champions available</p>
                      </div>
                    ) : (
                      champions.map((champion) => (
                        <button
                          key={champion.id}
                          onClick={() => setSelectedChampion(champion.id)}
                          className={`p-4 rounded-lg border-2 transition text-left ${
                            selectedChampion === champion.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border/50 hover:border-primary/50'
                          }`}
                        >
                          <p className="font-semibold text-sm">{champion.name}</p>
                          <p className="text-xs text-muted-foreground">{champion.class}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            Lvl {champion.level}
                          </Badge>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    Stake Amount
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setStakeAmount(arenaBalance)}
                    >
                      Max
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Available: {parseFloat(arenaBalance).toFixed(2)} ARENA
                  </p>
                </div>

                <Button
                  onClick={handleStake}
                  disabled={loading || !selectedChampion || !stakeAmount}
                  size="lg"
                  className="w-full"
                >
                  {loading ? 'Staking...' : 'Stake Tokens'}
                </Button>

                {selectedChampion && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm font-semibold mb-2">Estimated Daily Rewards</p>
                    <p className="text-2xl font-bold text-primary">
                      {stakeAmount ? (parseInt(stakeAmount) * 0.15 / 365).toFixed(2) : '0.00'} ARENA
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tiers Tab */}
          <TabsContent value="tiers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {STAKING_TIERS.map((tier) => (
                <Card key={tier.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{tier.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Minimum Stake</p>
                      <p className="font-bold">{tier.minTokens.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">APY</p>
                      <p className="text-2xl font-bold text-emerald-500">{tier.apy}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Multiplier</p>
                      <p className="font-bold">{tier.multiplier}x</p>
                    </div>
                    <Badge variant="outline" className="w-full justify-center">
                      {tier.id <= 2 ? 'Available' : 'Locked'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How Staking Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Select a champion</p>
                    <p className="text-sm text-muted-foreground">
                      Choose which champion to stake tokens with
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Deposit ARENA tokens</p>
                    <p className="text-sm text-muted-foreground">
                      Lock your tokens for a fixed period to earn rewards
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Earn rewards daily</p>
                    <p className="text-sm text-muted-foreground">
                      Rewards are calculated based on your tier and multiplier
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

