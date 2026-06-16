'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, TrendingUp, Zap, Flame, Medal } from 'lucide-react';
import Link from 'next/link';

interface LeaderboardEntry {
  rank: number;
  username: string;
  wallet_address: string;
  total_xp: number;
  level: number;
  battles?: number;
  wins?: number;
}

export default function LeaderboardPage() {
  const [mounted, setMounted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'xp' | 'level'>('xp');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadLeaderboard();
    }
  }, [mounted]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('users')
        .select('id, username, wallet_address, total_xp, level')
        .order('total_xp', { ascending: false })
        .limit(100);

      if (error) throw error;

      const entries: LeaderboardEntry[] = (data || []).map((user, idx) => ({
        rank: idx + 1,
        username: user.username,
        wallet_address: user.wallet_address,
        total_xp: user.total_xp,
        level: user.level,
      }));

      setLeaderboard(entries);
    } catch (error) {
      console.error('[v0] Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr?.slice(0, 6)}...${addr?.slice(-4)}`;
  };

  if (!mounted) return null;

  const topThree = leaderboard.slice(0, 3);
  const restPlayers = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Trophy className="w-8 h-8 text-primary" />
            Global Leaderboard
          </h1>
          <p className="text-muted-foreground">Compete with players worldwide</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top 3 Podium */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Top Champions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topThree.map((player, idx) => (
              <Card
                key={player.rank}
                className={`border-2 relative overflow-hidden ${
                  idx === 0
                    ? 'border-yellow-500/50 bg-yellow-500/5 md:col-span-1 md:row-span-2'
                    : idx === 1
                    ? 'border-gray-400/50 bg-gray-400/5'
                    : 'border-orange-600/50 bg-orange-600/5'
                }`}
              >
                <div
                  className={`absolute -top-4 -right-4 w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl ${
                    idx === 0
                      ? 'bg-yellow-500/20'
                      : idx === 1
                      ? 'bg-gray-400/20'
                      : 'bg-orange-600/20'
                  }`}
                >
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Medal
                      className={`w-5 h-5 ${
                        idx === 0
                          ? 'text-yellow-500'
                          : idx === 1
                          ? 'text-gray-400'
                          : 'text-orange-600'
                      }`}
                    />
                    #{player.rank}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Player</p>
                    <Link href={`/champions`}>
                      <p className="font-semibold hover:text-primary transition cursor-pointer">
                        {player.username}
                      </p>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg bg-background border border-border/50">
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <TrendingUp className="w-3 h-3" />
                        Level
                      </p>
                      <p className="font-bold text-lg">{player.level}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background border border-border/50">
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <Zap className="w-3 h-3" />
                        XP
                      </p>
                      <p className="font-bold text-lg">
                        {(player.total_xp / 1000).toFixed(1)}k
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground font-mono">
                    {formatAddress(player.wallet_address)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Full Leaderboard Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Players Rankings</CardTitle>
            <CardDescription>Full leaderboard standings</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading leaderboard...</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No players yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                        Rank
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                        Player
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">
                        Level
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                        Total XP
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry) => (
                      <tr
                        key={entry.rank}
                        className="border-b border-border/50 hover:bg-muted/30 transition"
                      >
                        <td className="py-4 px-4">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                              entry.rank <= 3
                                ? 'bg-primary/20 text-primary'
                                : 'bg-secondary/50 text-foreground'
                            }`}
                          >
                            {entry.rank}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold">{entry.username}</p>
                            <code className="text-xs text-muted-foreground font-mono">
                              {formatAddress(entry.wallet_address)}
                            </code>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge variant="outline">{entry.level}</Badge>
                        </td>
                        <td className="py-4 px-4 text-right font-semibold">
                          <span className="flex items-center justify-end gap-1">
                            <Zap className="w-4 h-4 text-primary" />
                            {entry.total_xp.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

