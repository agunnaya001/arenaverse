'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  const [mounted, setMounted] = useState(false);
  const mockLeaderboard = [
    { rank: 1, address: '0x1234...5678', wins: 250, losses: 15, winRate: 94 },
    { rank: 2, address: '0x9876...5432', wins: 200, losses: 30, winRate: 87 },
    { rank: 3, address: '0xabcd...efgh', wins: 180, losses: 45, winRate: 80 },
    { rank: 4, address: '0xijkl...mnop', wins: 150, losses: 60, winRate: 71 },
    { rank: 5, address: '0xqrst...uvwx', wins: 120, losses: 80, winRate: 60 },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground">Top players by wins and win rate</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Global Rankings</CardTitle>
            <CardDescription>Top 100 players</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Rank</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Player</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Wins</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Losses</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeaderboard.map((entry) => (
                    <tr key={entry.rank} className="border-b border-border/50 hover:bg-muted/30 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {entry.rank}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <code className="text-sm font-mono">{entry.address}</code>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold">{entry.wins}</td>
                      <td className="py-4 px-4 text-right text-muted-foreground">{entry.losses}</td>
                      <td className="py-4 px-4 text-right">
                        <Badge variant={entry.winRate >= 80 ? 'default' : 'secondary'}>
                          {entry.winRate}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
