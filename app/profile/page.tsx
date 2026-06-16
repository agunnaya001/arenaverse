'use client';

import { useEffect, useState } from 'react';
import { useWeb3 } from '@/lib/web3-context';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Shield, Zap, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { isConnected, address, connect } = useWeb3();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [isConnected, address]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', address?.toLowerCase())
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setUsername(data.username || '');
        setBio(data.bio || '');
      } else {
        // Create new profile
        const newProfile = {
          wallet_address: address?.toLowerCase(),
          username: `Player_${address?.slice(2, 8)}`,
          total_xp: 0,
          level: 1,
          arena_tokens_earned: 0,
        };
        
        const { data: created, error: createError } = await supabase
          .from('users')
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;
        setProfile(created);
        setUsername(created.username);
        setBio(created.bio || '');
      }
    } catch (error) {
      console.error('[v0] Failed to load profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!username.trim()) {
        toast.error('Username cannot be empty');
        return;
      }

      const { error } = await supabase
        .from('users')
        .update({
          username,
          bio,
          updated_at: new Date().toISOString(),
        })
        .eq('wallet_address', address?.toLowerCase());

      if (error) throw error;

      setProfile({ ...profile, username, bio });
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('[v0] Failed to save profile:', error);
      toast.error('Failed to save profile');
    }
  };

  if (!mounted) return null;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>View and manage your player profile</CardDescription>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Loading Profile...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Player Profile</h1>
          <p className="text-muted-foreground">Manage your account and view statistics</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="edit">Edit Profile</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-semibold">{profile?.username || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Wallet</p>
                    <p className="font-mono text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{profile?.level || 1}</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total XP</p>
                    <p className="font-semibold">{profile?.total_xp || 0}</p>
                  </div>
                </div>

                {profile?.bio && (
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Bio</p>
                    <p className="text-foreground">{profile.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">ARENA Earned</p>
                    <p className="text-2xl font-bold">{profile?.arena_tokens_earned || 0}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">XP Progress</p>
                    <p className="text-2xl font-bold">{profile?.total_xp || 0}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="text-sm font-bold">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Today'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Edit Tab */}
          <TabsContent value="edit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Wallet Address</label>
                  <Input
                    value={address || ''}
                    disabled
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Your wallet address cannot be changed</p>
                </div>

                <div className="flex gap-3 pt-4">
                  {!editing ? (
                    <Button onClick={() => setEditing(true)}>Edit</Button>
                  ) : (
                    <>
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditing(false);
                          setUsername(profile?.username || '');
                          setBio(profile?.bio || '');
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Player Statistics</CardTitle>
                <CardDescription>Your game performance and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Current Level</p>
                    <p className="text-3xl font-bold text-primary">{profile?.level || 1}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Total XP</p>
                    <p className="text-3xl font-bold">{profile?.total_xp || 0}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground">ARENA Tokens</p>
                    <p className="text-3xl font-bold text-emerald-500">{profile?.arena_tokens_earned || 0}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-sm font-semibold">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
