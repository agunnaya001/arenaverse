'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/lib/web3-context';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Zap, Sword, Heart, Wand2, Shield, Cpu } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Champion {
  id: string;
  name: string;
  class: string;
  rarity: string;
  level: number;
  health: number;
  attack: number;
  defense: number;
  speed: number;
  experience: number;
}

const RARITY_COLORS: Record<string, string> = {
  Common: 'bg-gray-500',
  Rare: 'bg-blue-500',
  Epic: 'bg-purple-500',
  Legendary: 'bg-yellow-500',
};

const CLASS_ICONS: Record<string, any> = {
  Warrior: Sword,
  Mage: Wand2,
  Archer: Cpu,
  Paladin: Shield,
};

export default function ChampionsPage() {
  const { isConnected, address, connect } = useWeb3();
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      loadChampions();
    }
  }, [isConnected, address]);

  const loadChampions = async () => {
    try {
      setLoading(true);
      
      // First, ensure user profile exists
      const { data: userExists } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', address?.toLowerCase())
        .single();

      if (!userExists) {
        const { data: newUser } = await supabase
          .from('users')
          .insert([{
            wallet_address: address?.toLowerCase(),
            username: `Player_${address?.slice(2, 8)}`,
            total_xp: 0,
            level: 1,
            arena_tokens_earned: 0,
          }])
          .select()
          .single();
        
        if (!newUser) return;
      }

      // Load champions
      const { data, error } = await supabase
        .from('champions')
        .select('*')
        .eq('user_id', userExists?.id);

      if (error) throw error;
      setChampions(data || []);
    } catch (error) {
      console.error('[v0] Failed to load champions:', error);
      toast.error('Failed to load champions');
    } finally {
      setLoading(false);
    }
  };

  const handleMintChampion = async () => {
    try {
      const classes = ['Warrior', 'Mage', 'Archer', 'Paladin'];
      const rarities = ['Common', 'Rare', 'Epic', 'Legendary'];
      
      const randomClass = classes[Math.floor(Math.random() * classes.length)];
      const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
      
      const stats = {
        Warrior: { health: 150, attack: 120, defense: 100, speed: 60 },
        Mage: { health: 100, attack: 160, defense: 60, speed: 80 },
        Archer: { health: 110, attack: 130, defense: 70, speed: 120 },
        Paladin: { health: 160, attack: 100, defense: 140, speed: 50 },
      };

      const baseStats = stats[randomClass as keyof typeof stats];
      const multiplier = rarities.indexOf(randomRarity) + 1;

      const newChampion = {
        user_id: address,
        nft_id: `nft_${Date.now()}`,
        name: `${randomClass} #${Math.floor(Math.random() * 10000)}`,
        class: randomClass,
        rarity: randomRarity,
        level: 1,
        experience: 0,
        health: Math.round(baseStats.health * multiplier),
        mana: 100,
        attack: Math.round(baseStats.attack * multiplier),
        defense: Math.round(baseStats.defense * multiplier),
        speed: Math.round(baseStats.speed * multiplier),
      };

      const { data, error } = await supabase
        .from('champions')
        .insert([newChampion])
        .select()
        .single();

      if (error) throw error;

      setChampions([...champions, data]);
      toast.success(`New ${randomRarity} ${randomClass} minted!`);
    } catch (error) {
      console.error('[v0] Failed to mint champion:', error);
      toast.error('Failed to mint champion');
    }
  };

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
      <div className="border-b border-border/50 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">My Champions</h1>
              <p className="text-muted-foreground">Manage your NFT champion collection ({champions.length})</p>
            </div>
            <Link href="/profile">
              <Button variant="outline">View Profile</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="collection" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="collection">Collection</TabsTrigger>
            <TabsTrigger value="mint">Mint New</TabsTrigger>
          </TabsList>

          {/* Collection Tab */}
          <TabsContent value="collection" className="space-y-6">
            {champions.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Champions Yet</CardTitle>
                  <CardDescription>Start by minting your first champion</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    You don&apos;t have any champions yet. Mint one to get started!
                  </p>
                  <TabsTrigger value="mint" className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Mint Champion
                  </TabsTrigger>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {champions.map((champion) => {
                  const ClassIcon = CLASS_ICONS[champion.class] || Sword;
                  return (
                    <Card key={champion.id} className="hover:border-primary transition overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2">
                              <ClassIcon className="w-5 h-5" />
                              {champion.name}
                            </CardTitle>
                            <CardDescription>{champion.class}</CardDescription>
                          </div>
                          <Badge className={`${RARITY_COLORS[champion.rarity]} text-white`}>
                            {champion.rarity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Level</span>
                          <span className="font-semibold">{champion.level}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/50">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Health</p>
                              <p className="font-semibold">{champion.health}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sword className="w-4 h-4 text-orange-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Attack</p>
                              <p className="font-semibold">{champion.attack}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Defense</p>
                              <p className="font-semibold">{champion.defense}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Speed</p>
                              <p className="font-semibold">{champion.speed}</p>
                            </div>
                          </div>
                        </div>
                        <Link href={`/battle?championId=${champion.id}`}>
                          <Button className="w-full gap-2">
                            <Sword className="w-4 h-4" />
                            Battle
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Mint Tab */}
          <TabsContent value="mint" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mint New Champion</CardTitle>
                <CardDescription>Create a new champion NFT with randomized stats and rarity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-6 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="text-center space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Mint Cost</p>
                      <p className="text-3xl font-bold">0.01 ETH</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Each mint creates a unique champion with random class, rarity, and stats.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-background border border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Rarity Chances</p>
                    <ul className="text-sm space-y-1">
                      <li><span className="font-semibold">50%</span> Common</li>
                      <li><span className="font-semibold">30%</span> Rare</li>
                      <li><span className="font-semibold">15%</span> Epic</li>
                      <li><span className="font-semibold">5%</span> Legendary</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Classes</p>
                    <ul className="text-sm space-y-1">
                      <li>⚔️ Warrior</li>
                      <li>🧙 Mage</li>
                      <li>🏹 Archer</li>
                      <li>🛡️ Paladin</li>
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={handleMintChampion}
                  disabled={loading}
                  className="w-full gap-2 h-12"
                  size="lg"
                >
                  <Plus className="w-5 h-5" />
                  {loading ? 'Minting...' : 'Mint Champion for 0.01 ETH'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

