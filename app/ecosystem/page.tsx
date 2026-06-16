'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/lib/web3-context';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Coins, Flame, Trophy, Share2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface PortfolioStats {
  totalXP: number;
  level: number;
  wins: number;
  winRate: number;
  tokensEarned: number;
  nftsOwned: number;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

const mockChartData = [
  { day: 'Mon', xp: 400, earnings: 240 },
  { day: 'Tue', xp: 600, earnings: 420 },
  { day: 'Wed', xp: 500, earnings: 360 },
  { day: 'Thu', xp: 700, earnings: 580 },
  { day: 'Fri', xp: 650, earnings: 490 },
  { day: 'Sat', xp: 800, earnings: 620 },
  { day: 'Sun', xp: 720, earnings: 550 },
];

export default function EcosystemPage() {
  const { isConnected, address, connect } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    if (isConnected && address) {
      loadData();
    }
  }, [isConnected, address]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load stats
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('total_xp, level, wins, win_rate, arena_tokens_earned')
        .eq('wallet_address', address?.toLowerCase())
        .single();

      if (!userError && userData) {
        setStats({
          totalXP: userData.total_xp || 0,
          level: userData.level || 1,
          wins: userData.wins || 0,
          winRate: userData.win_rate || 0,
          tokensEarned: userData.arena_tokens_earned || 0,
          nftsOwned: 0,
        });
      }

      // Load activity feed
      const { data: activityData, error: activityError } = await supabase
        .from('activity_feed')
        .select('*')
        .eq('user_id', address?.toLowerCase())
        .order('created_at', { ascending: false })
        .limit(10);

      if (!activityError && activityData) {
        setActivities(
          activityData.map((a: any) => ({
            id: a.id,
            type: a.activity_type,
            description: `${a.activity_type.replace(/([A-Z])/g, ' $1').trim()}`,
            timestamp: a.created_at,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load ecosystem data');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Ecosystem Hub</CardTitle>
            <CardDescription>Connect wallet to view your ecosystem dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={connect} className="w-full">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Ecosystem Hub</h1>
          <p className="text-lg text-muted-foreground">
            Manage your gaming portfolio, guilds, and social presence
          </p>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Level</p>
                      <p className="text-2xl font-bold">{stats?.level || 1}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total XP</p>
                      <p className="text-2xl font-bold">{(stats?.totalXP || 0).toLocaleString()}</p>
                    </div>
                    <Flame className="w-8 h-8 text-orange-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Wins</p>
                      <p className="text-2xl font-bold">{stats?.wins || 0}</p>
                    </div>
                    <Trophy className="w-8 h-8 text-yellow-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Win Rate</p>
                      <p className="text-2xl font-bold">{(stats?.winRate || 0).toFixed(1)}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tokens</p>
                      <p className="text-2xl font-bold">{(stats?.tokensEarned || 0).toLocaleString()}</p>
                    </div>
                    <Coins className="w-8 h-8 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="guilds">Guilds</TabsTrigger>
                <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>XP & Earnings Trend</CardTitle>
                      <CardDescription>Last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={mockChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="xp" stroke="#3b82f6" />
                          <Line type="monotone" dataKey="earnings" stroke="#f59e0b" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Feed</CardTitle>
                      <CardDescription>Your recent activities</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {activities.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No activities yet</p>
                      ) : (
                        activities.map((activity) => (
                          <div key={activity.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                            <span className="text-sm">{activity.description}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Guilds Tab */}
              <TabsContent value="guilds" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>My Guilds</span>
                      <Button asChild>
                        <Link href="/guilds">View All</Link>
                      </Button>
                    </CardTitle>
                    <CardDescription>Guilds you're a member of</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">You haven't joined any guilds yet</p>
                      <Button variant="outline" className="mt-4" asChild>
                        <Link href="/guilds">Browse Guilds</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tournaments Tab */}
              <TabsContent value="tournaments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Active Tournaments</span>
                      <Button asChild>
                        <Link href="/tournaments">View All</Link>
                      </Button>
                    </CardTitle>
                    <CardDescription>Tournaments you can join</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No active tournaments</p>
                      <Button className="mt-4" asChild>
                        <Link href="/tournaments">Explore Tournaments</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Social Tab */}
              <TabsContent value="social" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Social Network</span>
                      <Button asChild>
                        <Link href="/social">View All</Link>
                      </Button>
                    </CardTitle>
                    <CardDescription>Connect with other players</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Share2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Build your social profile</p>
                      <Button className="mt-4" asChild>
                        <Link href="/social">Go to Social</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
