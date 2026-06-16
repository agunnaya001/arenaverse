'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/lib/web3-context';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, Zap, Sword, Shield, TrendingUp, Search } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface MarketplaceChampion {
  id: string;
  name: string;
  class: string;
  rarity: string;
  level: number;
  attack: number;
  defense: number;
  priceEth: number;
  sellerAddress: string;
}

const SAMPLE_LISTINGS: MarketplaceChampion[] = [
  {
    id: 'market-1',
    name: 'Flame Warrior',
    class: 'Warrior',
    rarity: 'Legendary',
    level: 25,
    attack: 180,
    defense: 150,
    priceEth: 2.5,
    sellerAddress: '0x1234...5678',
  },
  {
    id: 'market-2',
    name: 'Frost Mage',
    class: 'Mage',
    rarity: 'Epic',
    level: 20,
    attack: 200,
    defense: 90,
    priceEth: 1.2,
    sellerAddress: '0x9876...5432',
  },
  {
    id: 'market-3',
    name: 'Shadow Archer',
    class: 'Archer',
    rarity: 'Rare',
    level: 15,
    attack: 160,
    defense: 100,
    priceEth: 0.5,
    sellerAddress: '0xabcd...efgh',
  },
];

const RARITY_COLORS: Record<string, string> = {
  Common: 'bg-gray-500',
  Rare: 'bg-blue-500',
  Epic: 'bg-purple-500',
  Legendary: 'bg-yellow-500',
};

export default function MarketplacePage() {
  const { isConnected, connect } = useWeb3();
  const [mounted, setMounted] = useState(false);
  const [listings, setListings] = useState<MarketplaceChampion[]>(SAMPLE_LISTINGS);
  const [filteredListings, setFilteredListings] = useState<MarketplaceChampion[]>(SAMPLE_LISTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('All');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let filtered = listings;

    if (searchQuery) {
      filtered = filtered.filter(
        (listing) =>
          listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.class.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRarity !== 'All') {
      filtered = filtered.filter((listing) => listing.rarity === selectedRarity);
    }

    setFilteredListings(filtered);
  }, [searchQuery, selectedRarity, listings]);

  const handleBuy = (champion: MarketplaceChampion) => {
    if (!isConnected) {
      connect();
      return;
    }
    toast.success(`Purchased ${champion.name} for ${champion.priceEth} ETH!`);
  };

  if (!mounted) return null;

  const totalVolume = listings.reduce((sum, listing) => sum + listing.priceEth, 0);
  const floorPrice = listings.length > 0 ? Math.min(...listings.map((l) => l.priceEth)) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Store className="w-8 h-8 text-primary" />
            Marketplace
          </h1>
          <p className="text-muted-foreground">Buy and sell champion NFTs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{listings.length}</p>
              <p className="text-xs text-muted-foreground">Champions for sale</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">24h Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalVolume.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">ETH traded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Floor Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{floorPrice.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">ETH</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Average Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {listings.length > 0 ? (totalVolume / listings.length).toFixed(2) : '0.00'}
              </p>
              <p className="text-xs text-muted-foreground">ETH</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Listings</TabsTrigger>
            <TabsTrigger value="sell">Sell Champion</TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search Listings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or class..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Filter by Rarity</p>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Common', 'Rare', 'Epic', 'Legendary'].map((rarity) => (
                      <Button
                        key={rarity}
                        variant={selectedRarity === rarity ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedRarity(rarity)}
                      >
                        {rarity}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Listings */}
            {filteredListings.length === 0 ? (
              <Card>
                <CardContent className="pt-8 text-center">
                  <p className="text-muted-foreground">No listings found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden hover:border-primary transition">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <CardTitle className="text-lg">{listing.name}</CardTitle>
                          <CardDescription>{listing.class}</CardDescription>
                        </div>
                        <Badge className={`${RARITY_COLORS[listing.rarity]} text-white`}>
                          {listing.rarity}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="p-2 rounded bg-background border border-border/50 text-center">
                          <p className="text-xs text-muted-foreground">Level</p>
                          <p className="font-bold">{listing.level}</p>
                        </div>
                        <div className="p-2 rounded bg-background border border-border/50 text-center">
                          <p className="text-xs text-muted-foreground">Attack</p>
                          <p className="font-bold">{listing.attack}</p>
                        </div>
                        <div className="p-2 rounded bg-background border border-border/50 text-center">
                          <p className="text-xs text-muted-foreground">Defense</p>
                          <p className="font-bold">{listing.defense}</p>
                        </div>
                      </div>

                      <div className="border-t border-border/50 pt-4">
                        <p className="text-sm text-muted-foreground mb-1">Price</p>
                        <p className="text-2xl font-bold mb-4">{listing.priceEth} ETH</p>
                        <Button
                          className="w-full"
                          onClick={() => handleBuy(listing)}
                        >
                          Buy Now
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground text-center">
                        Seller: {listing.sellerAddress}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Sell Tab */}
          <TabsContent value="sell" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>List Your Champion</CardTitle>
                <CardDescription>Sell your champion NFT on the marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                {!isConnected ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Connect your wallet to list champions for sale
                    </p>
                    <Button onClick={() => connect()} size="lg" className="gap-2">
                      <Zap className="w-4 h-4" />
                      Connect Wallet
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Select a champion from your collection to list it for sale.
                    </p>
                    <Link href="/champions">
                      <Button className="w-full" variant="outline">
                        Go to Champions
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

