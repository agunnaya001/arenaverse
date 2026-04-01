'use client';

import { useState } from 'react';
import { 
  Store, 
  Search,
  Filter,
  Grid3X3,
  List,
  Loader2,
  ShoppingCart,
  TrendingUp,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useListings, type Listing } from '@/hooks/use-game-state';
import { formatAddress } from '@/lib/contracts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function MarketplacePage() {
  const { isConnected, address, connect } = useWeb3();
  const { listings, isLoading, refresh } = useListings();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  // Filter and sort listings
  const filteredListings = listings
    .filter((listing) => {
      const matchesSearch = listing.champion.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRarity = rarityFilter === 'all' || listing.champion.rarity === rarityFilter;
      const matchesClass = classFilter === 'all' || listing.champion.class === classFilter;
      return matchesSearch && matchesRarity && matchesClass;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'rarity':
          const rarityOrder = { Legendary: 0, Epic: 1, Rare: 2, Common: 3 };
          return rarityOrder[a.champion.rarity] - rarityOrder[b.champion.rarity];
        case 'newest':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  // Stats
  const totalVolume = listings.reduce((sum, l) => sum + parseFloat(l.price), 0);
  const avgPrice = totalVolume / listings.length || 0;
  const floorPrice = Math.min(...listings.map(l => parseFloat(l.price)));

  const handleBuy = async () => {
    if (!selectedListing) return;
    setIsBuying(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      toast.success(`Successfully purchased ${selectedListing.champion.name}!`);
      setShowBuyDialog(false);
      setSelectedListing(null);
      refresh();
    } catch {
      toast.error('Failed to purchase champion');
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Store className="w-8 h-8 text-primary" />
            Marketplace
          </h1>
          <p className="text-muted-foreground mt-1">
            Buy and sell champions from other players
          </p>
        </div>

        {/* Market Stats */}
        <StatsGrid className="mb-8">
          <StatsCard
            title="Total Listings"
            value={listings.length}
            icon={Store}
            variant="primary"
          />
          <StatsCard
            title="Floor Price"
            value={`${floorPrice.toFixed(4)} ETH`}
            icon={TrendingUp}
            variant="accent"
          />
          <StatsCard
            title="Average Price"
            value={`${avgPrice.toFixed(4)} ETH`}
            icon={ArrowUpDown}
          />
          <StatsCard
            title="Total Volume"
            value={`${totalVolume.toFixed(2)} ETH`}
            icon={ShoppingCart}
            variant="gold"
          />
        </StatsGrid>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search champions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={rarityFilter} onValueChange={setRarityFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value="Common">Common</SelectItem>
                <SelectItem value="Rare">Rare</SelectItem>
                <SelectItem value="Epic">Epic</SelectItem>
                <SelectItem value="Legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="Warrior">Warrior</SelectItem>
                <SelectItem value="Mage">Mage</SelectItem>
                <SelectItem value="Rogue">Rogue</SelectItem>
                <SelectItem value="Paladin">Paladin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rarity">Rarity</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredListings.length} of {listings.length} listings
          </p>
        </div>

        {/* Listings */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Listings Found</h2>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <div className={cn(
            viewMode === 'grid'
              ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'flex flex-col gap-4'
          )}>
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                viewMode={viewMode}
                isConnected={isConnected}
                currentAddress={address}
                onBuy={() => {
                  if (!isConnected) {
                    connect();
                    return;
                  }
                  setSelectedListing(listing);
                  setShowBuyDialog(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Buy Dialog */}
      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase Champion</DialogTitle>
            <DialogDescription>
              You are about to purchase {selectedListing?.champion.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {selectedListing && (
              <>
                <ChampionCard champion={selectedListing.champion} showActions={false} />
                <div className="rounded-lg bg-secondary/50 p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Seller</span>
                    <span className="font-mono">{formatAddress(selectedListing.seller)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-bold text-lg">{selectedListing.price} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform Fee (2.5%)</span>
                    <span>{(parseFloat(selectedListing.price) * 0.025).toFixed(4)} ETH</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-primary">
                      {(parseFloat(selectedListing.price) * 1.025).toFixed(4)} ETH
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBuyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBuy} disabled={isBuying} className="gap-2">
              {isBuying && <Loader2 className="w-4 h-4 animate-spin" />}
              {isBuying ? 'Processing...' : 'Confirm Purchase'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ListingCard({ 
  listing, 
  viewMode,
  isConnected,
  currentAddress,
  onBuy 
}: { 
  listing: Listing; 
  viewMode: 'grid' | 'list';
  isConnected: boolean;
  currentAddress: string | null;
  onBuy: () => void;
}) {
  const isOwn = listing.seller.toLowerCase() === currentAddress?.toLowerCase();

  if (viewMode === 'list') {
    return (
      <div className="rounded-xl border border-border/50 bg-card p-4 hover:border-border transition-colors">
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0 w-64">
            <ChampionCard champion={listing.champion} showActions={false} compact />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Seller:</span>
              <span className="font-mono text-sm">{formatAddress(listing.seller)}</span>
              {isOwn && <Badge>You</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">
              Listed {listing.createdAt.toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{listing.price} ETH</p>
            {!isOwn && (
              <Button onClick={onBuy} className="mt-2 gap-2">
                <ShoppingCart className="w-4 h-4" />
                {isConnected ? 'Buy Now' : 'Connect to Buy'}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <ChampionCard champion={listing.champion} price={listing.price} showActions={false} />
      <div className="absolute bottom-4 left-4 right-4">
        {!isOwn && (
          <Button onClick={onBuy} className="w-full gap-2">
            <ShoppingCart className="w-4 h-4" />
            {isConnected ? 'Buy Now' : 'Connect to Buy'}
          </Button>
        )}
        {isOwn && (
          <Badge className="w-full justify-center py-2">Your Listing</Badge>
        )}
      </div>
    </div>
  );
}
