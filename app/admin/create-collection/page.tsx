'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function CreateCollectionPage() {
  const [collection, setCollection] = useState({
    name: '',
    symbol: '',
    description: '',
    maxSupply: 1000,
    royaltyPercentage: 10,
  });

  const [traits, setTraits] = useState([
    { name: 'Class', values: ['Warrior', 'Mage', 'Rogue', 'Paladin'] },
    { name: 'Rarity', values: ['Common', 'Rare', 'Epic', 'Legendary'] },
  ]);

  const [newTrait, setNewTrait] = useState({ name: '', value: '' });

  const handleAddTrait = () => {
    if (newTrait.name && newTrait.value) {
      const existing = traits.find(t => t.name === newTrait.name);
      if (existing) {
        existing.values.push(newTrait.value);
      } else {
        setTraits([...traits, { name: newTrait.name, values: [newTrait.value] }]);
      }
      setNewTrait({ name: '', value: '' });
    }
  };

  const handleRemoveTrait = (traitName: string, valueIndex: number) => {
    setTraits(traits.map(t => {
      if (t.name === traitName) {
        return { ...t, values: t.values.filter((_, i) => i !== valueIndex) };
      }
      return t;
    }).filter(t => t.values.length > 0));
  };

  const handleCreate = () => {
    console.log('Creating collection:', { collection, traits });
    alert('Collection created successfully!');
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
          <h1 className="text-3xl font-bold">Create NFT Collection</h1>
          <p className="text-muted-foreground">Define traits, rarity, and metadata for your collection</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Collection Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Collection Name</label>
              <Input
                placeholder="e.g., Legendary Warriors"
                value={collection.name}
                onChange={(e) => setCollection({ ...collection, name: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Token Symbol</label>
                <Input
                  placeholder="e.g., LW"
                  value={collection.symbol}
                  onChange={(e) => setCollection({ ...collection, symbol: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Max Supply</label>
                <Input
                  type="number"
                  min="1"
                  value={collection.maxSupply}
                  onChange={(e) => setCollection({ ...collection, maxSupply: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                placeholder="Describe your collection..."
                className="w-full h-24 px-3 py-2 border border-input rounded-md bg-background text-foreground"
                value={collection.description}
                onChange={(e) => setCollection({ ...collection, description: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Royalty Percentage</label>
              <Input
                type="number"
                min="0"
                max="50"
                value={collection.royaltyPercentage}
                onChange={(e) => setCollection({ ...collection, royaltyPercentage: parseInt(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground mt-1">% earned on secondary sales</p>
            </div>
          </CardContent>
        </Card>

        {/* Traits */}
        <Card>
          <CardHeader>
            <CardTitle>NFT Traits</CardTitle>
            <CardDescription>Define trait types and values for NFT generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Existing Traits */}
            <div className="space-y-3">
              {traits.map((trait) => (
                <div key={trait.name} className="space-y-2">
                  <p className="text-sm font-medium">{trait.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {trait.values.map((value, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-2">
                        {value}
                        <button
                          onClick={() => handleRemoveTrait(trait.name, idx)}
                          className="hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Trait */}
            <div className="space-y-3 pt-4 border-t border-border/50">
              <p className="text-sm font-medium">Add Trait Value</p>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Trait type"
                  value={newTrait.name}
                  onChange={(e) => setNewTrait({ ...newTrait, name: e.target.value })}
                />
                <Input
                  placeholder="Trait value"
                  value={newTrait.value}
                  onChange={(e) => setNewTrait({ ...newTrait, value: e.target.value })}
                />
                <Button onClick={handleAddTrait} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin">Cancel</Link>
          </Button>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Collection
          </Button>
        </div>
      </div>
    </div>
  );
}
