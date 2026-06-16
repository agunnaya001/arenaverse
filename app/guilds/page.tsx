'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/lib/web3-context';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GuildCard } from '@/components/guild-card';
import { Users, Coins, UserPlus, Loader2, AlertCircle, Crown, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Guild {
  id: string;
  name: string;
  description?: string;
  leader_id: string;
  member_count: number;
  treasury_balance: number;
  level: number;
}

export default function GuildsPage() {
  const { isConnected, address, connect } = useWeb3();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingGuild, setCreatingGuild] = useState(false);
  const [guildName, setGuildName] = useState('');
  const [guildDescription, setGuildDescription] = useState('');

  useEffect(() => {
    loadGuilds();
  }, []);

  const loadGuilds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('guilds')
        .select('*')
        .order('member_count', { ascending: false })
        .limit(20);

      if (error) throw error;
      setGuilds(data || []);
    } catch (error) {
      console.error('Failed to load guilds:', error);
      toast.error('Failed to load guilds');
    } finally {
      setLoading(false);
    }
  };

  const createGuild = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!guildName.trim()) {
      toast.error('Guild name is required');
      return;
    }

    setCreatingGuild(true);
    try {
      const { data, error } = await supabase
        .from('guilds')
        .insert({
          name: guildName,
          description: guildDescription,
          leader_id: address.toLowerCase(),
          member_count: 1,
          treasury_balance: 0,
          level: 1,
        })
        .select()
        .single();

      if (error) throw error;

      setGuilds([data, ...guilds]);
      setGuildName('');
      setGuildDescription('');
      toast.success('Guild created successfully!');
    } catch (error) {
      console.error('Failed to create guild:', error);
      toast.error('Failed to create guild');
    } finally {
      setCreatingGuild(false);
    }
  };

  const joinGuild = async (guildId: string) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      const { error } = await supabase
        .from('guild_members')
        .insert({
          guild_id: guildId,
          user_id: address.toLowerCase(),
          role: 'Member',
        });

      if (error) throw error;
      toast.success('Joined guild successfully!');
      loadGuilds();
    } catch (error) {
      console.error('Failed to join guild:', error);
      toast.error('Failed to join guild');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Guilds</h1>
            <p className="text-lg text-muted-foreground">
              Join guilds or create your own community
            </p>
          </div>
          {isConnected && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Coins className="w-4 h-4 mr-2" />
                  Create Guild
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Guild</DialogTitle>
                  <DialogDescription>
                    Start your own guild and invite members
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Guild Name</label>
                    <Input
                      placeholder="Epic Warriors"
                      value={guildName}
                      onChange={(e) => setGuildName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      placeholder="Describe your guild..."
                      value={guildDescription}
                      onChange={(e) => setGuildDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button onClick={createGuild} disabled={creatingGuild} className="w-full">
                    {creatingGuild ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Guild'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {!isConnected && (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <Button onClick={connect} variant="link" className="p-0 h-auto">
                Connect your wallet
              </Button>
              {' '}to create or join guilds
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="browse">Browse Guilds</TabsTrigger>
            {isConnected && <TabsTrigger value="my-guilds">My Guilds</TabsTrigger>}
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : guilds.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No guilds found</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {guilds.map((guild) => (
                  <GuildCard
                    key={guild.id}
                    id={guild.id}
                    name={guild.name}
                    description={guild.description}
                    memberCount={guild.member_count}
                    treasuryBalance={guild.treasury_balance}
                    level={guild.level}
                    onJoin={() => {
                      if (isConnected) {
                        joinGuild(guild.id);
                      } else {
                        connect();
                      }
                    }}
                    onView={() => {
                      toast.info('Guild details coming soon');
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Guilds Tab */}
          {isConnected && (
            <TabsContent value="my-guilds" className="space-y-6">
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">You haven't joined any guilds yet</p>
                    <Button className="mt-4" onClick={() => { /* Switch to browse tab */ }}>
                      Browse Guilds
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
