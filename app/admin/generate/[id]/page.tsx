'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { ArrowLeft, Zap, Loader2 } from 'lucide-react';

export default function GenerateNFTsPage({ params }: { params: { id: string } }) {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(10);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setProgress(0);

    // Simulate generation
    for (let i = 0; i < 100; i += 10) {
      await new Promise((r) => setTimeout(r, 300));
      setProgress(i);
    }

    // Simulate upload
    setUploadProgress(0);
    for (let i = 0; i < 100; i += 20) {
      await new Promise((r) => setTimeout(r, 200));
      setUploadProgress(i);
    }

    setProgress(100);
    setUploadProgress(100);
    setCompleted(true);
    setGenerating(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/admin" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Link>
          <h1 className="text-3xl font-bold">Generate NFTs</h1>
          <p className="text-muted-foreground">Generate and upload NFTs to IPFS via Pinata</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Generation Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Number of NFTs to Generate</label>
              <Input
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                disabled={generating}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Image Generation</label>
              <Badge>Fal AI Integration</Badge>
              <p className="text-xs text-muted-foreground mt-2">
                AI-powered image generation creates unique champion artwork for each NFT
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">IPFS Upload</label>
              <Badge>Pinata Integration</Badge>
              <p className="text-xs text-muted-foreground mt-2">
                Metadata and images automatically uploaded to IPFS via Pinata
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        {(generating || completed) && (
          <Card>
            <CardHeader>
              <CardTitle>Generation Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">NFT Generation</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">IPFS Upload</span>
                  <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>

              {completed && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <p className="text-sm font-medium text-primary">
                    Successfully generated and uploaded {count} NFTs!
                  </p>
                  <p className="text-xs text-primary/80 mt-1">
                    NFTs are ready for minting on Base network.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Preview */}
        {completed && (
          <Card>
            <CardHeader>
              <CardTitle>Generated NFTs Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-muted-foreground"
                  >
                    <p className="text-xs">NFT #{i + 1}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-between">
          <Button variant="outline" asChild disabled={generating}>
            <Link href="/admin">Cancel</Link>
          </Button>
          <Button onClick={handleGenerate} disabled={generating} className="gap-2">
            {generating && <Loader2 className="w-4 h-4 animate-spin" />}
            <Zap className="w-4 h-4" />
            {generating ? 'Generating...' : completed ? 'Generate More' : 'Start Generation'}
          </Button>
        </div>
      </div>
    </div>
  );
}
