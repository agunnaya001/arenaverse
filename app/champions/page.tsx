'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/lib/web3-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Zap } from 'lucide-react';

export default function ChampionsPage() {
  const { isConnected, address, connectWallet } = useWeb3();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>View and manage your champion NFTs</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={connectWallet} className="w-full gap-2">
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
      <div className="border-b border-border/50 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">My Champions</h1>
          <p className="text-muted-foreground">Manage your NFT champion collection</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mint Card */}
          <Card className="hover:border-primary transition cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Mint Champion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create a new champion NFT. Each mint has a chance to be rare or legendary.
              </p>
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Mint for 0.01 ETH
              </Button>
            </CardContent>
          </Card>

          {/* Empty State */}
          <Card className="md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Collection</CardTitle>
              <CardDescription>You don&apos;t have any champions yet</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Start by minting your first champion or browse the marketplace to purchase from other players.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
