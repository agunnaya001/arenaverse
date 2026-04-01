'use client';

import { useState } from 'react';
import { 
  Shield, 
  Plus, 
  Filter, 
  Search,
  Grid3X3,
  List,
  Loader2,
  Wallet
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
import { useChampions, type Champion } from '@/hooks/use-game-state';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ChampionsPage() {
  const { isConnected, address, connect } = useWeb3();
  const { champions, isLoading, refresh } = useChampions(address);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [showMintDialog, setShowMintDialog] = useState(false);
  const [showListDialog, setShowListDialog] = useState(false);
  const [listPrice, setListPrice] = useState('');

  // Filter champions
  const filteredChampions = champions.filter((champion) => {
    const matchesSearch = champion.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = rarityFilter === 'all' || champion.rarity === rarityFilter;
    const matchesClass = classFilter === 'all' || champion.class === classFilter;
    return matchesSearch && matchesRarity && matchesClass;
  });

  // Stats
  const totalPower = champions.reduce(
    (sum, c) => sum + c.stats.strength + c.stats.agility + c.stats.intelligence + c.stats.vitality,
    0
  );
  const legendaryCount = champions.filter(c => c.rarity === 'Legendary').length;
  const stakedCount = champions.filter(c => c.isStaked).length;

  // Handlers
  const handleMint = async () => {
    setIsMinting(true);
    try {
      // Simulate minting
      await new Promise(r => setTimeout(r, 2000));
      toast.success('Champion minted successfully!');
      setShowMintDialog(false);
      refresh();
    } catch {
      toast.error('Failed to mint champion');
    } finally {
      setIsMinting(false);
    }
  };

  const handleList = async () => {
    if (!selectedChampion || !listPrice) return;
    try {
      // Simulate listing
      await new Promise(r => setTimeout(r, 1500));
      toast.success(`${selectedChampion.name} listed for ${listPrice} ETH`);
      setShowListDialog(false);
      setSelectedChampion(null);
      setListPrice('');
    } catch {
      toast.error('Failed to list champion');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-muted-foreground mb-8">
              Connect your wallet to view and manage your champion collection.
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
              <Shield className="w-8 h-8 text-primary" />
              My Champions
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your champion collection
            </p>
          </div>
          <Button onClick={() => setShowMintDialog(true)} className="gap-2">
            <Plus className="w-5 h-5" />
            Mint Champion
          </Button>
        </div>

        {/* Stats */}
        <StatsGrid className="mb-8">
          <StatsCard
            title="Total Champions"
            value={champions.length}
            icon={Shield}
            variant="primary"
          />
          <StatsCard
            title="Total Power"
            value={totalPower.toLocaleString()}
            icon={Shield}
            variant="accent"
          />
          <StatsCard
            title="Legendary Champions"
            value={legendaryCount}
            icon={Shield}
            variant="gold"
          />
          <StatsCard
            title="Staked Champions"
            value={stakedCount}
            icon={Shield}
          />
        </StatsGrid>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search champions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
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
            Showing {filteredChampions.length} of {champions.length} champions
          </p>
        </div>

        {/* Champions Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredChampions.length === 0 ? (
          <div className="text-center py-20">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Champions Found</h2>
            <p className="text-muted-foreground mb-6">
              {champions.length === 0
                ? "You don't have any champions yet. Mint your first one!"
                : "No champions match your current filters."}
            </p>
            {champions.length === 0 && (
              <Button onClick={() => setShowMintDialog(true)} className="gap-2">
                <Plus className="w-5 h-5" />
                Mint Your First Champion
              </Button>
            )}
          </div>
        ) : (
          <div className={cn(
            viewMode === 'grid'
              ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'flex flex-col gap-3'
          )}>
            {filteredChampions.map((champion) => (
              <ChampionCard
                key={champion.id}
                champion={champion}
                compact={viewMode === 'list'}
                onList={() => {
                  setSelectedChampion(champion);
                  setShowListDialog(true);
                }}
                onBattle={() => {
                  toast.info(`Sending ${champion.name} to battle...`);
                }}
                onUpgrade={() => {
                  toast.info(`Upgrading ${champion.name}...`);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mint Dialog */}
      <Dialog open={showMintDialog} onOpenChange={setShowMintDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mint New Champion</DialogTitle>
            <DialogDescription>
              Mint a new champion NFT to add to your collection. Each champion has unique stats and abilities.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-secondary/50 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mint Price</span>
                <span className="font-medium">0.01 ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rarity Chances</span>
                <span className="font-medium">
                  <Badge variant="outline" className="mr-1">50% Common</Badge>
                  <Badge variant="outline" className="mr-1 text-blue-400 border-blue-400/30">30% Rare</Badge>
                </span>
              </div>
              <div className="flex justify-end text-sm">
                <span className="font-medium">
                  <Badge variant="outline" className="mr-1 text-purple-400 border-purple-400/30">15% Epic</Badge>
                  <Badge variant="outline" className="text-amber-400 border-amber-400/30">5% Legendary</Badge>
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMintDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMint} disabled={isMinting} className="gap-2">
              {isMinting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isMinting ? 'Minting...' : 'Mint Champion'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* List Dialog */}
      <Dialog open={showListDialog} onOpenChange={setShowListDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>List Champion for Sale</DialogTitle>
            <DialogDescription>
              List {selectedChampion?.name} on the marketplace for other players to purchase.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {selectedChampion && (
              <ChampionCard champion={selectedChampion} showActions={false} compact />
            )}
            <div>
              <label className="text-sm font-medium mb-2 block">Sale Price (ETH)</label>
              <Input
                type="number"
                step="0.001"
                placeholder="0.1"
                value={listPrice}
                onChange={(e) => setListPrice(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowListDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleList} disabled={!listPrice}>
              List for Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
