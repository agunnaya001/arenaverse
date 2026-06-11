'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins } from 'lucide-react';

export default function StakingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Coins className="w-8 h-8 text-primary" />
            Token Staking
          </h1>
          <p className="text-muted-foreground">Earn passive rewards by staking ARENA tokens</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">ARENA tokens</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staked Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">ARENA staked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">ARENA rewards</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Staking Tiers</CardTitle>
            <CardDescription>Lock tokens to earn daily rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-semibold">Bronze Tier</p>
                  <p className="text-sm text-muted-foreground">100+ ARENA • 5% APY</p>
                </div>
                <Button variant="outline" disabled>Stake</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-semibold">Silver Tier</p>
                  <p className="text-sm text-muted-foreground">1,000+ ARENA • 10% APY</p>
                </div>
                <Button variant="outline" disabled>Stake</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-semibold">Gold Tier</p>
                  <p className="text-sm text-muted-foreground">10,000+ ARENA • 15% APY</p>
                </div>
                <Button variant="outline" disabled>Stake</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
