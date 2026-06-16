'use client';

import { useState } from 'react';
import { useWeb3 } from '@/lib/web3-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Zap, Code, Wand2, Calculator, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const CONTRACT_TYPES = [
  { value: 'ERC20', label: 'ERC20 Token', description: 'Create a fungible token' },
  { value: 'ERC721', label: 'ERC721 NFT', description: 'Create non-fungible tokens' },
  { value: 'ERC1155', label: 'ERC1155 Multi', description: 'Create multi-token standard' },
  { value: 'DAO', label: 'DAO Governance', description: 'Create a DAO contract' },
  { value: 'Staking', label: 'Staking Pool', description: 'Create a staking contract' },
];

export default function AIStudioPage() {
  const { isConnected, address, connect } = useWeb3();
  const [activeTab, setActiveTab] = useState('contract');
  const [loading, setLoading] = useState(false);
  const [contractType, setContractType] = useState<string>('');
  const [contractName, setContractName] = useState('');
  const [contractDescription, setContractDescription] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [nftName, setNftName] = useState('');
  const [nftSupply, setNftSupply] = useState('');
  const [tokenomicsSupply, setTokenomicsSupply] = useState('');
  const [vestingMonths, setVestingMonths] = useState('');

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>AI Smart Contract Studio</CardTitle>
            <CardDescription>Connect wallet to use the contract generator</CardDescription>
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

  const generateContract = async () => {
    if (!contractType || !contractName) {
      toast.error('Please fill in contract type and name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai-studio/generate-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: contractType,
          name: contractName,
          description: contractDescription,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate contract');
      const data = await response.json();
      setGeneratedCode(data.code);
      toast.success('Contract generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate contract');
    } finally {
      setLoading(false);
    }
  };

  const generateNFTMetadata = async () => {
    if (!nftName || !nftSupply) {
      toast.error('Please fill in NFT name and supply');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai-studio/nft-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nftName,
          supply: parseInt(nftSupply),
        }),
      });

      if (!response.ok) throw new Error('Failed to generate metadata');
      const data = await response.json();
      toast.success(`Generated ${data.metadataCount} NFT metadata files`);
    } catch (error) {
      console.error('Metadata generation error:', error);
      toast.error('Failed to generate NFT metadata');
    } finally {
      setLoading(false);
    }
  };

  const calculateTokenomics = async () => {
    if (!tokenomicsSupply) {
      toast.error('Please enter total supply');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai-studio/tokenomics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalSupply: parseInt(tokenomicsSupply),
          vestingMonths: parseInt(vestingMonths) || 12,
        }),
      });

      if (!response.ok) throw new Error('Failed to calculate tokenomics');
      const data = await response.json();
      toast.success('Tokenomics calculated successfully!');
    } catch (error) {
      console.error('Tokenomics error:', error);
      toast.error('Failed to calculate tokenomics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Smart Contract Studio</h1>
          <p className="text-lg text-muted-foreground">
            Generate, analyze, and deploy smart contracts with AI assistance
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="contract">
              <Code className="w-4 h-4 mr-2" />
              Smart Contracts
            </TabsTrigger>
            <TabsTrigger value="nft">
              <ImageIcon className="w-4 h-4 mr-2" />
              NFT Studio
            </TabsTrigger>
            <TabsTrigger value="tokenomics">
              <Calculator className="w-4 h-4 mr-2" />
              Tokenomics
            </TabsTrigger>
          </TabsList>

          {/* Smart Contracts Tab */}
          <TabsContent value="contract" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Configuration</CardTitle>
                  <CardDescription>Set up your smart contract parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Contract Type</label>
                    <Select value={contractType} onValueChange={setContractType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contract type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTRACT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Contract Name</label>
                    <Input
                      placeholder="MyToken"
                      value={contractName}
                      onChange={(e) => setContractName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      placeholder="Describe your contract's purpose..."
                      value={contractDescription}
                      onChange={(e) => setContractDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button onClick={generateContract} disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Contract
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Generated Code</CardTitle>
                  <CardDescription>Your smart contract Solidity code</CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedCode ? (
                    <div className="space-y-2">
                      <div className="bg-muted p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                        <pre>{generatedCode.substring(0, 500)}...</pre>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Zap className="w-4 h-4 mr-2" />
                        Copy to Clipboard
                      </Button>
                    </div>
                  ) : (
                    <div className="h-96 flex items-center justify-center text-muted-foreground">
                      Generated code will appear here
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* NFT Studio Tab */}
          <TabsContent value="nft" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>NFT Metadata Generator</CardTitle>
                <CardDescription>Create and customize NFT metadata in bulk</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">NFT Collection Name</label>
                    <Input
                      placeholder="My NFT Collection"
                      value={nftName}
                      onChange={(e) => setNftName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Total Supply</label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={nftSupply}
                      onChange={(e) => setNftSupply(e.target.value)}
                    />
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    AI will generate unique metadata, traits, and rarity values for each NFT
                  </AlertDescription>
                </Alert>

                <Button onClick={generateNFTMetadata} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate NFT Metadata
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tokenomics Tab */}
          <TabsContent value="tokenomics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tokenomics Calculator</CardTitle>
                <CardDescription>Model your token distribution and vesting schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Total Supply</label>
                    <Input
                      type="number"
                      placeholder="1000000"
                      value={tokenomicsSupply}
                      onChange={(e) => setTokenomicsSupply(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Vesting Period (months)</label>
                    <Input
                      type="number"
                      placeholder="12"
                      value={vestingMonths}
                      onChange={(e) => setVestingMonths(e.target.value)}
                    />
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Calculator will generate allocation breakdown: team (20%), liquidity (30%), community (50%)
                  </AlertDescription>
                </Alert>

                <Button onClick={calculateTokenomics} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Tokenomics
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
