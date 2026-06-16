export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string; // 'number', 'boost_percentage', 'boost_number', 'date'
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  animation_url?: string;
  attributes: NFTAttribute[];
  properties?: Record<string, any>;
}

export interface NFTCollection {
  name: string;
  description: string;
  image: string;
  external_link?: string;
  seller_fee_basis_points?: number; // 10000 = 100%
  fee_recipient?: string;
}

export interface TraitValue {
  name: string;
  rarity: number; // 0-100, higher = rarer
  color?: string;
}

export interface TraitDefinition {
  name: string;
  values: TraitValue[];
}

/**
 * Generate NFT metadata
 */
export function generateNFTMetadata(
  name: string,
  description: string,
  imageUrl: string,
  attributes: NFTAttribute[],
  options?: {
    externalUrl?: string;
    animationUrl?: string;
    properties?: Record<string, any>;
  }
): NFTMetadata {
  return {
    name,
    description,
    image: imageUrl,
    external_url: options?.externalUrl,
    animation_url: options?.animationUrl,
    attributes,
    properties: options?.properties,
  };
}

/**
 * Calculate rarity score for an NFT
 */
export function calculateRarityScore(
  attributes: NFTAttribute[],
  traitDefinitions: TraitDefinition[]
): number {
  let totalScore = 0;

  attributes.forEach((attr) => {
    const traitDef = traitDefinitions.find((t) => t.name === attr.trait_type);
    if (!traitDef) return;

    const valueDef = traitDef.values.find((v) => v.name === attr.value);
    if (valueDef) {
      totalScore += valueDef.rarity;
    }
  });

  return Math.round(totalScore / attributes.length);
}

/**
 * Validate NFT metadata
 */
export function validateNFTMetadata(metadata: NFTMetadata): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!metadata.name || metadata.name.trim().length === 0) {
    errors.push('NFT name is required');
  }

  if (!metadata.description || metadata.description.trim().length === 0) {
    errors.push('NFT description is required');
  }

  if (!metadata.image || !isValidUrl(metadata.image)) {
    errors.push('Valid image URL is required');
  }

  if (metadata.external_url && !isValidUrl(metadata.external_url)) {
    errors.push('Invalid external URL');
  }

  if (!Array.isArray(metadata.attributes)) {
    errors.push('Attributes must be an array');
  }

  metadata.attributes.forEach((attr, index) => {
    if (!attr.trait_type) {
      errors.push(`Attribute ${index}: trait_type is required`);
    }
    if (attr.value === null || attr.value === undefined) {
      errors.push(`Attribute ${index}: value is required`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Convert metadata to JSON string
 */
export function metadataToJSON(metadata: NFTMetadata): string {
  return JSON.stringify(metadata, null, 2);
}

/**
 * Create trait definitions from examples
 */
export function createTraitDefinitions(
  examples: NFTMetadata[]
): TraitDefinition[] {
  const traitMap = new Map<string, Map<string, number>>();

  // Count occurrences
  examples.forEach((metadata) => {
    metadata.attributes.forEach((attr) => {
      if (!traitMap.has(attr.trait_type)) {
        traitMap.set(attr.trait_type, new Map());
      }
      const valueMap = traitMap.get(attr.trait_type)!;
      valueMap.set(String(attr.value), (valueMap.get(String(attr.value)) || 0) + 1);
    });
  });

  // Calculate rarity (inverse of frequency)
  const definitions: TraitDefinition[] = [];
  traitMap.forEach((valueMap, traitName) => {
    const values: TraitValue[] = [];
    const totalCount = examples.length;

    valueMap.forEach((count, valueName) => {
      const frequency = count / totalCount;
      const rarity = Math.round((1 - frequency) * 100);

      values.push({
        name: valueName,
        rarity,
      });
    });

    definitions.push({
      name: traitName,
      values: values.sort((a, b) => b.rarity - a.rarity),
    });
  });

  return definitions;
}

/**
 * Generate random NFT metadata from trait definitions
 */
export function generateRandomNFTMetadata(
  name: string,
  description: string,
  imageUrl: string,
  traits: TraitDefinition[],
  options?: {
    seed?: string;
    externalUrl?: string;
  }
): NFTMetadata {
  const rng = createSeededRandom(options?.seed);
  const attributes: NFTAttribute[] = [];

  traits.forEach((trait) => {
    const randomIndex = Math.floor(rng() * trait.values.length);
    const selectedValue = trait.values[randomIndex];

    attributes.push({
      trait_type: trait.name,
      value: selectedValue.name,
    });
  });

  return generateNFTMetadata(name, description, imageUrl, attributes, {
    externalUrl: options?.externalUrl,
  });
}

/**
 * Create seeded random number generator
 */
function createSeededRandom(seed?: string) {
  let x = 0;
  if (seed) {
    for (let i = 0; i < seed.length; i++) {
      x = ((x << 5) - x) + seed.charCodeAt(i);
      x = x & x; // Convert to 32bit integer
    }
  }

  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}

/**
 * Validate URL
 */
function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate IPFS-compatible metadata
 */
export function generateIPFSMetadata(metadata: NFTMetadata, ipfsHash: string): NFTMetadata {
  return {
    ...metadata,
    image: `ipfs://${ipfsHash}/image.png`,
    animation_url: metadata.animation_url
      ? `ipfs://${ipfsHash}/animation.mp4`
      : undefined,
  };
}

/**
 * Batch generate NFT metadata
 */
export function batchGenerateNFTMetadata(
  baseName: string,
  baseDescription: string,
  imageUrlTemplate: string, // Use {index} as placeholder
  count: number,
  attributes: (index: number) => NFTAttribute[]
): NFTMetadata[] {
  const metadata: NFTMetadata[] = [];

  for (let i = 0; i < count; i++) {
    const imageUrl = imageUrlTemplate.replace('{index}', String(i));
    metadata.push(
      generateNFTMetadata(
        `${baseName} #${i + 1}`,
        baseDescription,
        imageUrl,
        attributes(i)
      )
    );
  }

  return metadata;
}
