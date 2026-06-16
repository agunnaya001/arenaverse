import { NextRequest, NextResponse } from 'next/server';
import {
  generateNFTMetadata,
  calculateRarityScore,
  validateNFTMetadata,
  metadataToJSON,
  createTraitDefinitions,
  generateRandomNFTMetadata,
  batchGenerateNFTMetadata,
} from '@/lib/ai/nft-metadata';

/**
 * POST /api/ai-studio/nft-metadata
 * Generate NFT metadata
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, imageUrl, attributes, externalUrl, mode } = body;

    if (!name || !description || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, imageUrl' },
        { status: 400 }
      );
    }

    let metadata;

    if (mode === 'random') {
      // Generate random metadata
      const { traits, seed } = body;
      if (!traits) {
        return NextResponse.json(
          { error: 'Missing traits for random generation' },
          { status: 400 }
        );
      }

      metadata = generateRandomNFTMetadata(name, description, imageUrl, traits, {
        seed,
        externalUrl,
      });
    } else if (mode === 'batch') {
      // Batch generate metadata
      const { count, imageUrlTemplate, attributeTemplate } = body;
      if (!count || !imageUrlTemplate || !attributeTemplate) {
        return NextResponse.json(
          { error: 'Missing fields for batch generation' },
          { status: 400 }
        );
      }

      const results = batchGenerateNFTMetadata(
        name,
        description,
        imageUrlTemplate,
        count,
        (index) => attributeTemplate(index)
      );

      return NextResponse.json(
        {
          success: true,
          metadata: results,
          count: results.length,
        },
        { status: 200 }
      );
    } else {
      // Single metadata generation
      metadata = generateNFTMetadata(name, description, imageUrl, attributes || [], {
        externalUrl,
      });
    }

    // Validate
    const validation = validateNFTMetadata(metadata);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid metadata', errors: validation.errors },
        { status: 400 }
      );
    }

    // Calculate rarity if traits provided
    let rarityScore: number | undefined;
    if (body.traitDefinitions && metadata.attributes.length > 0) {
      rarityScore = calculateRarityScore(metadata.attributes, body.traitDefinitions);
    }

    return NextResponse.json(
      {
        success: true,
        metadata,
        json: metadataToJSON(metadata),
        rarityScore,
        validation: {
          valid: validation.valid,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] NFT metadata generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate metadata' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/ai-studio/nft-metadata
 * Analyze and create trait definitions from examples
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { examples } = body;

    if (!Array.isArray(examples) || examples.length === 0) {
      return NextResponse.json(
        { error: 'Missing examples array' },
        { status: 400 }
      );
    }

    // Create trait definitions from examples
    const traits = createTraitDefinitions(examples);

    return NextResponse.json(
      {
        success: true,
        traits,
        count: traits.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Trait definition creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create trait definitions' },
      { status: 500 }
    );
  }
}
