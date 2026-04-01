'use client';

import { useState } from 'react';
import { 
  Coins, 
  TrendingUp,
  Lock,
  Unlock,
  Gift,
  Wallet,
  Loader2,
  Info,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Header } from '@/components/header';
import { StatsCard, StatsGrid } from '@/components/stats-card';
import { useWeb3 } from '@/lib/web3-context';
import { useStaking } from '@/hooks/use-game-state';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STAKING_TIERS = [
  { name: 'Bronze', minStake: 0, apy: 5, color: 'text-orange-600' },
  { name: 'Silver', minStake: 1000, apy: 8, color: 'text-slate-400' },
  { name: 'Gold', minStake: 5000, apy: 12, color: 'text-amber-400' },
  { name: 'Platinum', minStake: 25000, apy: 18, color: 'text-cyan-400' },
  { name: 'Diamond', minStake: 100000, apy: 25, color: 'text-blue-400' },
];

export default function StakingPage() {
  const { isConnected, address, arenaBalance, connect } = useWeb3();
  const { stakedAmount, pendingRewards, isLoading, stake, unstake, claimRewards } = useStaking(address);
  const [stakeInput, setStakeInput] = useState('');
  const [unstakeInput, setUnstakeInput] = useState('');
  const [activeTab, setActiveTab] = useState('stake');

  // Calculate current tier
  const stakedNum = parseFloat(stakedAmount) || 0;
  const currentTier = [...STAKING_TIERS].reverse().find(t => stakedNum >= t.minStake) || STAKING_TIERS[0];
  const nextTier = STAKING_TIERS[STAKING_TIERS.indexOf(currentTier) + 1];

  // Calculate progress to next tier
  const progressToNext = nextTier 
    ? ((stakedNum - currentTier.minStake) / (nextTier.minStake - currentTier.minStake)) * 100
    : 100;

  const handleStake = async () => {
    if (!stakeInput || parseFloat(stakeInput) <= 0) return;
    try {
      await stake(stakeInput);
      toast.success(`Successfully staked ${stakeInput} ARENA`);
      setStakeInput('');
    } catch {
      toast.error('Failed to stake tokens');
    }
  };

  const handleUnstake = async () => {
    if (!unstakeInput || parseFloat(unstakeInput) <= 0) return;
    try {
      await unstake(unstakeInput);
      toast.success(`Successfully unstaked ${unstakeInput} ARENA`);
      setUnstakeInput('');
    } catch {
      toast.error('Failed to unstake tokens');
    }
  };

  const handleClaimRewards = async () => {
    try {
      await claimRewards();
      toast.success('Successfully claimed rewards!');
    } catch {
      toast.error('Failed to claim rewards');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-arena-gold/10 flex items-center justify-center mx-auto mb-6">
              <Coins className="w-10 h-10 text-arena-gold" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Connect to Stake</h1>
            <p className="text-muted-foreground mb-8">
              Connect your wallet to stake ARENA tokens and earn rewards.
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
            <Coins className="w-8 h-8 text-arena-gold" />
            Token Staking
          </h1>
          <p className="text-muted-foreground mt-1">
            Stake ARENA tokens to earn passive rewards and unlock benefits
          </p>
        </div>

        {/* Stats */}
        <StatsGrid className="mb-8">
          <StatsCard
            title="Total Staked"
            value={`${stakedAmount} ARENA`}
            icon={Lock}
            variant="primary"
          />
          <StatsCard
            title="Pending Rewards"
            value={`${pendingRewards} ARENA`}
            icon={Gift}
            variant="gold"
          />
          <StatsCard
            title="Current APY"
            value={`${currentTier.apy}%`}
            icon={TrendingUp}
            variant="accent"
          />
          <StatsCard
            title="Available Balance"
            value={`${arenaBalance} ARENA`}
            icon={Wallet}
          />
        </StatsGrid>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Staking Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Manage Stake</CardTitle>
                <CardDescription>
                  Stake or unstake your ARENA tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="stake" className="gap-2">
                      <Lock className="w-4 h-4" />
                      Stake
                    </TabsTrigger>
                    <TabsTrigger value="unstake" className="gap-2">
                      <Unlock className="w-4 h-4" />
                      Unstake
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="stake" className="mt-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Amount to Stake</label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={stakeInput}
                          onChange={(e) => setStakeInput(e.target.value)}
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => setStakeInput(arenaBalance)}
                        >
                          Max
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Available: {arenaBalance} ARENA
                      </p>
                    </div>
                    <Button 
                      onClick={handleStake} 
                      disabled={isLoading || !stakeInput}
                      className="w-full gap-2"
                    >
                      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      Stake ARENA
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="unstake" className="mt-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Amount to Unstake</label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={unstakeInput}
                          onChange={(e) => setUnstakeInput(e.target.value)}
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => setUnstakeInput(stakedAmount)}
                        >
                          Max
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Staked: {stakedAmount} ARENA
                      </p>
                    </div>
                    <Button 
                      onClick={handleUnstake} 
                      disabled={isLoading || !unstakeInput}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      Unstake ARENA
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Rewards Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-arena-gold" />
                  Pending Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-arena-gold/10 to-arena-gold/5 border border-arena-gold/20">
                  <div>
                    <p className="text-sm text-muted-foreground">Claimable Rewards</p>
                    <p className="text-3xl font-bold text-arena-gold">{pendingRewards} ARENA</p>
                  </div>
                  <Button 
                    onClick={handleClaimRewards}
                    disabled={isLoading || parseFloat(pendingRewards) === 0}
                    className="gap-2 bg-arena-gold/20 hover:bg-arena-gold/30 text-arena-gold border border-arena-gold/30"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <Gift className="w-4 h-4" />
                    Claim Rewards
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tier Progress */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Staking Tier</CardTitle>
                <CardDescription>
                  Higher tiers unlock better APY rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Tier */}
                <div className="text-center p-6 rounded-xl bg-secondary/50">
                  <Badge className={cn('mb-2 text-lg px-4 py-1', currentTier.color)}>
                    {currentTier.name}
                  </Badge>
                  <p className="text-4xl font-bold mt-2">{currentTier.apy}% APY</p>
                </div>

                {/* Progress to next tier */}
                {nextTier && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress to {nextTier.name}</span>
                      <span className="font-medium">{Math.round(progressToNext)}%</span>
                    </div>
                    <Progress value={progressToNext} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Stake {(nextTier.minStake - stakedNum).toLocaleString()} more ARENA to reach {nextTier.name}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tier Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Tier Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {STAKING_TIERS.map((tier, index) => (
                    <div 
                      key={tier.name}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg border',
                        tier.name === currentTier.name 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border/50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={tier.color}>
                          {tier.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {tier.minStake.toLocaleString()}+ ARENA
                        </span>
                      </div>
                      <span className="font-bold">{tier.apy}% APY</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
