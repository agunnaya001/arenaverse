'use client';

import { PinataSDK } from 'pinata-web3';
import * as fal from '@fal-ai/client';
import { GeneratedNFT, NFTCollection, TraitDefinition, ChampionRarity, RARITY_COLORS } from './contracts';

// Initialize services
let pinata: PinataSDK | null = null;

function getPinata() {
  if (!pinata) {
    const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;
    if (!jwt || !gateway) {
      throw new Error('Pinata credentials not configured');
    }
    pinata = new PinataSDK({ pinataJwt: jwt, pinataGateway: gateway });
  }
  return pinata;
}

// Initialize Fal AI
if (process.env.NEXT_PUBLIC_FAL_KEY) {
  fal.config({ credentials: process.env.NEXT_PUBLIC_FAL_KEY });
}

export interface NFTGenerationConfig {
  name: string;
  description: string;
  traits: Record<string, string>;
  rarity: ChampionRarity;
  style?: string;
}

// Generate NFT image using Fal AI
export async function generateNFTImage(config: NFTGenerationConfig): Promise<string> {
  try {
    const prompt = buildImagePrompt(config);
    
    const result: any = await fal.subscribe('fal-ai/flux-pro', {
      input: {
        prompt,
        image_size: {
          width: 512,
          height: 512,
        },
        num_inference_steps: 30,
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log('Image generation progress:', update);
      },
    });

    if (result.data?.images?.[0]) {
      return result.data.images[0].url;
    }

    throw new Error('No image generated');
  } catch (error) {
    console.error('Error generating NFT image:', error);
    // Return placeholder if generation fails
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Crect fill='%23${RARITY_COLORS[config.rarity].substring(1)}' width='512' height='512'/%3E%3C/svg%3E`;
  }
}

// Build prompt for Fal AI based on traits
function buildImagePrompt(config: NFTGenerationConfig): string {
  const traitsList = Object.entries(config.traits)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  const rarityName = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'][config.rarity] || 'Common';

  return `A detailed fantasy game character portrait, ${config.name}, ${rarityName} tier champion. Traits: ${traitsList}. High quality, professional gaming art, mystical lighting, detailed features.`;
}

// Generate complete NFT metadata
export async function generateNFTMetadata(
  collection: NFTCollection,
  tokenId: number,
  config: NFTGenerationConfig
): Promise<GeneratedNFT> {
  console.log('[NFT Factory] Generating metadata for token:', tokenId);

  // Generate image
  const imageUrl = await generateNFTImage(config);

  // Calculate rarity score
  const rarityScore = calculateRarityScore(config.traits, collection.traits);

  const nft: GeneratedNFT = {
    tokenId: tokenId.toString(),
    name: config.name,
    description: config.description,
    image: imageUrl,
    attributes: Object.entries(config.traits).map(([trait_type, value]) => ({
      trait_type,
      value,
    })),
    rarity: config.rarity,
    rarityScore,
  };

  return nft;
}

// Calculate rarity score based on trait rarity
function calculateRarityScore(traits: Record<string, string>, traitDefs: TraitDefinition[]): number {
  let totalScore = 0;
  let count = 0;

  for (const [traitName, traitValue] of Object.entries(traits)) {
    const traitDef = traitDefs.find((t) => t.name.toLowerCase() === traitName.toLowerCase());
    if (traitDef) {
      const value = traitDef.values.find((v) => v.name.toLowerCase() === traitValue.toLowerCase());
      if (value) {
        totalScore += value.rarity;
        count++;
      }
    }
  }

  return count > 0 ? totalScore / count : 50;
}

// Upload metadata and image to IPFS
export async function uploadToIPFS(metadata: GeneratedNFT, imageFile?: Blob): Promise<{ metadataUri: string; imageUri: string }> {
  console.log('[NFT Factory] Uploading to IPFS via Pinata');

  const pinataClient = getPinata();
  let imageUri = metadata.image;

  // Upload image if provided as blob
  if (imageFile) {
    const imageUpload = await pinataClient.upload.file(imageFile);
    imageUri = `ipfs://${imageUpload.IpfsHash}`;
  }

  // Create metadata JSON
  const metadataJson = {
    name: metadata.name,
    description: metadata.description,
    image: imageUri,
    attributes: metadata.attributes,
    rarity: metadata.rarity,
    rarityScore: metadata.rarityScore,
  };

  // Upload metadata
  const metadataBlob = new Blob([JSON.stringify(metadataJson)], { type: 'application/json' });
  const metadataUpload = await pinataClient.upload.file(metadataBlob, {
    metadata: {
      name: `${metadata.name}-metadata.json`,
    },
  });

  return {
    metadataUri: `ipfs://${metadataUpload.IpfsHash}`,
    imageUri,
  };
}

// Generate multiple NFTs for a collection
export async function generateNFTBatch(
  collection: NFTCollection,
  count: number,
  startTokenId = 0
): Promise<GeneratedNFT[]> {
  console.log(`[NFT Factory] Generating ${count} NFTs for collection ${collection.name}`);

  const nfts: GeneratedNFT[] = [];

  for (let i = 0; i < count; i++) {
    const traits = selectRandomTraits(collection.traits);
    const rarity = selectRarity(collection.traits, traits);

    const config: NFTGenerationConfig = {
      name: `${collection.name} #${startTokenId + i}`,
      description: collection.description || `A ${['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'][rarity]} champion from ${collection.name}`,
      traits,
      rarity: rarity as ChampionRarity,
    };

    const nft = await generateNFTMetadata(collection, startTokenId + i, config);
    nfts.push(nft);

    // Add delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 500));
  }

  return nfts;
}

// Select random trait values from trait definitions
function selectRandomTraits(traitDefs: TraitDefinition[]): Record<string, string> {
  const traits: Record<string, string> = {};

  for (const traitDef of traitDefs) {
    const rarityWeights = traitDef.values.map((v) => v.rarity);
    const selectedValue = weightedRandom(traitDef.values, rarityWeights);
    traits[traitDef.name] = selectedValue.name;
  }

  return traits;
}

// Select rarity tier based on traits
function selectRarity(traitDefs: TraitDefinition[], selectedTraits: Record<string, string>): number {
  let totalRarity = 0;
  let count = 0;

  for (const [traitName, traitValue] of Object.entries(selectedTraits)) {
    const traitDef = traitDefs.find((t) => t.name.toLowerCase() === traitName.toLowerCase());
    if (traitDef) {
      const value = traitDef.values.find((v) => v.name.toLowerCase() === traitValue.toLowerCase());
      if (value) {
        totalRarity += value.rarity;
        count++;
      }
    }
  }

  const avgRarity = count > 0 ? totalRarity / count : 50;

  // Convert to rarity tier
  if (avgRarity < 20) return ChampionRarity.COMMON;
  if (avgRarity < 40) return ChampionRarity.RARE;
  if (avgRarity < 60) return ChampionRarity.EPIC;
  if (avgRarity < 80) return ChampionRarity.LEGENDARY;
  return ChampionRarity.MYTHIC;
}

// Weighted random selection
function weightedRandom<T extends { rarity: number }>(items: T[], weights?: number[]): T {
  const actualWeights = weights || items.map((item) => item.rarity);
  const totalWeight = actualWeights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    random -= actualWeights[i];
    if (random <= 0) {
      return items[i];
    }
  }

  return items[items.length - 1];
}

// Save collection to local storage (for demo)
export function saveCollection(collection: NFTCollection): void {
  const collections = getCollections();
  const existing = collections.findIndex((c) => c.id === collection.id);

  if (existing >= 0) {
    collections[existing] = collection;
  } else {
    collections.push(collection);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('nft_collections', JSON.stringify(collections));
  }
}

// Get all collections
export function getCollections(): NFTCollection[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem('nft_collections');
  return stored ? JSON.parse(stored) : [];
}

// Get collection by ID
export function getCollection(id: string): NFTCollection | null {
  const collections = getCollections();
  return collections.find((c) => c.id === id) || null;
}

// Delete collection
export function deleteCollection(id: string): void {
  const collections = getCollections();
  const filtered = collections.filter((c) => c.id !== id);

  if (typeof window !== 'undefined') {
    localStorage.setItem('nft_collections', JSON.stringify(filtered));
  }
}
