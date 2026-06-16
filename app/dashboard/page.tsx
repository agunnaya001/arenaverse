'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/lib/web3-context';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Coins, Trophy, Users, Activity, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface DashboardStats {
  totalPlayers: number;
  activeNow: number;
  totalBattles: number;
  totalTokensDistributed: number;
  avgWinRate: number;
}

const mockTimeSeriesData = [
  { date: '2024-06-10', players: 150, battles: 45, tokens: 2250 },
  { date: '2024-06-11', players: 165, battles: 52, tokens: 2600 },
  { date: '2024-06-12', players: 180, battles: 58, tokens: 2900 },
  { date: '2024-06-13', players: 195, battles: 62, tokens: 3100 },
  { date: '2024-06-14', players: 210, battles: 70, tokens: 3500 },
  { date: '2024-06-15', players: 230, battles: 85, tokens: 4250 },
  { date: '2024-06-16', players: 250, battles: 95, tokens: 4750 },
];

const mockTopPlayers = [
  { rank: 1, name: 'ProPlayer123', xp: 50000, wins: 245 },
  { rank: 2, name: 'LegendaryWarrior', xp: 48500, wins: 240 },
  { rank: 3, name: 'NovaKnight', xp: 47200, wins: 235 },
  { rank: 4, name: 'ShadowAssassin', xp: 46100, wins: 228 },
  { rank: 5, name: 'FlameMage', xp: 45300, wins: 220 },
];

export default function DashboardPage() {
  const { isConnected, address, connect } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Load basic stats
      const { count: playerCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { count: battleCount } = await supabase
        .from('battle_history')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalPlayers: playerCount || 0,
        activeNow: Math.floor((playerCount || 0) * 0.3), // Estimate
        totalBattles: battleCount || 0,
        totalTokensDistributed: (battleCount || 0) * 50,
        avgWinRate: 50,
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              {isConnected ? 'Welcome back to ArenaGameFi!' : 'Connect your wallet to see your dashboard'}
            </p>
          </div>
          {!isConnected && (
            <Button onClick={connect} size="lg">
              Connect Wallet
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Players</p>
                      <p className="text-2xl font-bold">{stats?.totalPlayers.toLocaleString()}</p>
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +12.5%
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Online Now</p>
                      <p className="text-2xl font-bold">{stats?.activeNow.toLocaleString()}</p>
                      <p className="text-xs text-green-600 mt-1">Active</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Battles</p>
                      <p className="text-2xl font-bold">{stats?.totalBattles.toLocaleString()}</p>
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +5.2%
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tokens Distributed</p>
                      <p className="text-2xl font-bold">{(stats?.totalTokensDistributed || 0).toLocaleString()}</p>
                      <p className="text-xs text-green-600 mt-1">ARENA</p>
                    </div>
                    <Coins className="w-8 h-8 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Win Rate</p>
                      <p className="text-2xl font-bold">{stats?.avgWinRate.toFixed(1)}%</p>
                      <p className="text-xs text-blue-600 mt-1">Network</p>
                    </div>
                    <Trophy className="w-8 h-8 text-yellow-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="analytics" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="systems">Systems</TabsTrigger>
              </TabsList>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Players Over Time</CardTitle>
                      <CardDescription>Last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={mockTimeSeriesData}>
                          <defs>
                            <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="players"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorPlayers)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Battles & Rewards</CardTitle>
                      <CardDescription>Last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={mockTimeSeriesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="battles" fill="#8b5cf6" />
                          <Bar dataKey="tokens" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Leaderboard Tab */}
              <TabsContent value="leaderboard" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Players</CardTitle>
                    <CardDescription>Ranked by XP</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mockTopPlayers.map((player) => (
                        <div
                          key={player.rank}
                          className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="font-bold text-lg w-8">#{player.rank}</div>
                            <div>
                              <p className="font-semibold">{player.name}</p>
                              <p className="text-sm text-muted-foreground">{player.wins} wins</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{player.xp.toLocaleString()} XP</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Systems Tab */}
              <TabsContent value="systems" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Smart Contracts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        All smart contracts deployed and running on Base network
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/ai-studio">View Contracts</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        Tournaments
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Active tournaments with prize pools
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/tournaments">Browse Tournaments</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Guilds
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Community guilds with shared treasuries
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/guilds">Explore Guilds</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Coins className="w-5 h-5" />
                        Launchpad
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Deploy and manage your smart contracts
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/launchpad">Go to Launchpad</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
