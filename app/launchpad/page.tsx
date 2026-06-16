'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/lib/web3-context';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Rocket, CheckCircle, Clock, XCircle, ExternalLink, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface Deployment {
  id: string;
  contract_name: string;
  contract_type: string;
  contract_address?: string;
  status: string;
  transaction_hash?: string;
  verified: boolean;
  created_at: string;
  etherscan_url?: string;
}

const STATUS_CONFIG = {
  'Pending': { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  'Deploying': { icon: Loader2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  'Deployed': { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
  'Failed': { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
};

export default function LaunchpadPage() {
  const { isConnected, address, connect } = useWeb3();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      loadDeployments();
    }
  }, [isConnected, address]);

  const loadDeployments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('deployments')
        .select('*')
        .eq('user_id', address?.toLowerCase())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeployments(data || []);
    } catch (error) {
      console.error('Failed to load deployments:', error);
      toast.error('Failed to load deployments');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Launchpad</CardTitle>
            <CardDescription>Connect wallet to manage your deployments</CardDescription>
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
          <h1 className="text-4xl font-bold mb-2">Launchpad</h1>
          <p className="text-lg text-muted-foreground">
            Deploy and manage your smart contracts
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deploy">Deploy New</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Deployments</CardTitle>
                <CardDescription>Manage all your deployed contracts</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : deployments.length === 0 ? (
                  <div className="text-center py-12">
                    <Rocket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No deployments yet</p>
                    <Button className="mt-4">Deploy Your First Contract</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deployments.map((deployment) => {
                      const StatusIcon = STATUS_CONFIG[deployment.status as keyof typeof STATUS_CONFIG]?.icon || Clock;
                      const statusColor = STATUS_CONFIG[deployment.status as keyof typeof STATUS_CONFIG]?.color || 'text-gray-500';
                      const statusBg = STATUS_CONFIG[deployment.status as keyof typeof STATUS_CONFIG]?.bg || 'bg-gray-500/10';

                      return (
                        <Card key={deployment.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedDeployment(deployment)}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{deployment.contract_name}</h3>
                                <p className="text-sm text-muted-foreground">{deployment.contract_type}</p>
                                {deployment.contract_address && (
                                  <p className="text-xs text-muted-foreground font-mono mt-2">
                                    {deployment.contract_address.substring(0, 10)}...{deployment.contract_address.substring(-8)}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Badge variant="outline" className={`${statusBg} border-0`}>
                                  <StatusIcon className={`w-3 h-3 mr-1 ${statusColor}`} />
                                  <span className={statusColor}>{deployment.status}</span>
                                </Badge>
                                {deployment.verified && (
                                  <Badge className="bg-green-500/20 text-green-700 border-0">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                              {new Date(deployment.created_at).toLocaleDateString()}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deployment Detail Modal */}
            {selectedDeployment && (
              <Card className="border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedDeployment.contract_name} Details</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDeployment(null)}
                    >
                      ✕
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Contract Type</label>
                    <p className="text-muted-foreground">{selectedDeployment.contract_type}</p>
                  </div>
                  {selectedDeployment.contract_address && (
                    <div>
                      <label className="text-sm font-medium">Contract Address</label>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm font-mono break-all">{selectedDeployment.contract_address}</p>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={selectedDeployment.etherscan_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <p className="text-muted-foreground">{selectedDeployment.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deployed</label>
                    <p className="text-muted-foreground">
                      {new Date(selectedDeployment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedDeployment.etherscan_url && (
                    <Button asChild className="w-full">
                      <a href={selectedDeployment.etherscan_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on Etherscan
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Deploy Tab */}
          <TabsContent value="deploy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Deploy New Contract</CardTitle>
                <CardDescription>Generate and deploy a smart contract</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Use the AI Studio to generate a contract first, then deploy it here
                  </AlertDescription>
                </Alert>
                <Button className="w-full mt-4" asChild>
                  <a href="/ai-studio">Go to AI Studio</a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{deployments.length}</div>
                  <p className="text-sm text-muted-foreground">Total Deployments</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {deployments.filter(d => d.status === 'Deployed').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Successful</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {deployments.filter(d => d.verified).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
