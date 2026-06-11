'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/lib/web3-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Swords, Zap } from 'lucide-react';

export default function BattlePage() {
  const { isConnected, connectWallet } = useWeb3();
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
            <Swords className="w-8 h-8 text-primary" />
            Battle Arena
          </h1>
          <p className="text-muted-foreground">Engage in PvE battles and earn rewards</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!isConnected ? (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Connect to Battle</CardTitle>
              <CardDescription>Connect your wallet to participate in battles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={connectWallet} className="w-full gap-2">
                <Zap className="w-4 h-4" />
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Battle Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Entry Fee</p>
                  <p className="text-lg font-semibold">0.001 ETH</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Win Reward</p>
                  <p className="text-lg font-semibold">0.002 ETH + 100 ARENA</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
                  <p className="text-lg font-semibold">50% vs AI</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Start Battle</CardTitle>
                <CardDescription>Select a champion to battle</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  You need to own a champion to participate in battles. Mint or purchase one first.
                </p>
                <Button className="w-full" disabled>
                  No Champions Available
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
