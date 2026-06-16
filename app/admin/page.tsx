'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3 } from '@/lib/web3-context';
import { isAdmin } from '@/lib/contracts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Lock, Plus, BarChart3, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { isConnected, address } = useWeb3();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [collections] = useState([
    { id: 1, name: 'Legendary Warriors', minted: 150, maxSupply: 1000, status: 'Active' },
    { id: 2, name: 'Mystic Mages', minted: 75, maxSupply: 500, status: 'Active' },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isConnected && !isAdmin(address)) {
      router.push('/');
    }
  }, [mounted, isConnected, address, router]);

  if (!mounted) return null;

  if (!isConnected || !isAdmin(address)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Admin access only. Please connect with an admin wallet to continue.
            </p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">NFT Factory Admin</h1>
              <p className="text-muted-foreground">Create collections, generate NFTs, manage marketplace</p>
            </div>
            <Button asChild className="gap-2">
              <Link href="/admin/create-collection">
                <Plus className="w-4 h-4" />
                Create Collection
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="collections" className="space-y-6">
          <TabsList>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="generate">Generate NFTs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-4">
            {collections.length > 0 ? (
              <div className="grid gap-6">
                {collections.map((collection) => (
                  <Card key={collection.id}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                      <div>
                        <CardTitle>{collection.name}</CardTitle>
                        <CardDescription>Collection ID: {collection.id}</CardDescription>
                      </div>
                      <Badge>{collection.status}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Minted</p>
                          <p className="text-2xl font-bold">{collection.minted}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Max Supply</p>
                          <p className="text-2xl font-bold">{collection.maxSupply}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Progress</p>
                          <p className="text-2xl font-bold">{Math.round((collection.minted / collection.maxSupply) * 100)}%</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/collection/${collection.id}`}>View</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/generate/${collection.id}`}>Generate</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center mb-4">No collections yet. Create one to get started.</p>
                  <Button asChild className="w-full">
                    <Link href="/admin/create-collection">Create First Collection</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Generate Tab */}
          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>NFT Generation</CardTitle>
                <CardDescription>Generate and upload NFTs to your collections</CardDescription>
              </CardHeader>
              <CardContent>
                {collections.length > 0 ? (
                  <div className="space-y-3">
                    {collections.map((collection) => (
                      <Button key={collection.id} variant="outline" className="w-full justify-start" asChild>
                        <Link href={`/admin/generate/${collection.id}`}>
                          <Zap className="w-4 h-4 mr-2" />
                          {collection.name} - {collection.minted}/{collection.maxSupply} minted
                        </Link>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Create a collection first to generate NFTs.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Collections</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{collections.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Minted</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{collections.reduce((sum, c) => sum + c.minted, 0)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Supply</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{collections.reduce((sum, c) => sum + c.maxSupply, 0)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Minting Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">
                    {Math.round(
                      (collections.reduce((sum, c) => sum + c.minted, 0) /
                        collections.reduce((sum, c) => sum + c.maxSupply, 0)) *
                        100
                    )}%
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
