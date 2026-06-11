'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3 } from '@/lib/web3-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Lock } from 'lucide-react';

export default function AdminDashboard() {
  const { isConnected, isAdmin, address } = useWeb3();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isConnected || !isAdmin)) {
      router.push('/');
    }
  }, [mounted, isConnected, isAdmin, router]);

  if (!mounted || !isConnected || !isAdmin) {
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
              You need to be an admin to access this page. Please connect with an admin wallet.
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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage collections, generate NFTs, and monitor platform activity</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="collections" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="generator">NFT Generator</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="collections" className="space-y-6 mt-6">
            <CollectionsTab />
          </TabsContent>

          <TabsContent value="generator" className="space-y-6 mt-6">
            <GeneratorTab />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CollectionsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>NFT Collections</CardTitle>
          <CardDescription>Create and manage trait-based NFT collections</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Collections feature coming soon. Create collections with custom traits, rarity tiers, and auto-deploy to Base.
          </p>
          <Button className="gap-2">
            Create New Collection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function GeneratorTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>NFT Generator</CardTitle>
          <CardDescription>Generate and batch mint NFTs with AI-powered images via Fal AI</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Generator feature coming soon. Generate thousands of unique NFTs, upload to IPFS via Pinata, and batch mint on Base.
          </p>
          <Button className="gap-2">
            Start Generation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total NFTs Minted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0 ETH</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Royalties Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0 ETH</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Settings</CardTitle>
          <CardDescription>Configure platform settings and integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Pinata API Key</label>
            <p className="text-sm text-muted-foreground">Configured via NEXT_PUBLIC_PINATA_JWT</p>
          </div>
          <div>
            <label className="text-sm font-medium">Fal AI Key</label>
            <p className="text-sm text-muted-foreground">Configured via NEXT_PUBLIC_FAL_KEY</p>
          </div>
          <div>
            <label className="text-sm font-medium">Admin Wallet Address</label>
            <p className="text-sm font-mono text-muted-foreground">{process.env.NEXT_PUBLIC_ADMIN_ADDRESSES}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
