'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Zap } from 'lucide-react';

export default function MarketplacePage() {
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
            <Store className="w-8 h-8 text-primary" />
            Marketplace
          </h1>
          <p className="text-muted-foreground">Buy and sell champion NFTs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Listings</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">24h Volume</span>
                <span className="font-semibold">0 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Floor Price</span>
                <span className="font-semibold">-</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Browse Listings</CardTitle>
              <CardDescription>No listings available yet</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Be the first to list your champions on the marketplace!
              </p>
              <Button variant="outline" className="w-full" disabled>
                View Listings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
