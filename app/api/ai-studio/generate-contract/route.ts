import { NextRequest, NextResponse } from 'next/server';
import {
  generateSmartContract,
  getAvailableTemplates,
  validateSolidityCode,
  estimateComplexity,
  formatCodeForDisplay,
} from '@/lib/ai/contract-generator';

/**
 * POST /api/ai-studio/generate-contract
 * Generate smart contract code from template
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
    const { templateKey, variables, description } = body;

    if (!templateKey || !variables) {
      return NextResponse.json(
        { error: 'Missing required fields: templateKey, variables' },
        { status: 400 }
      );
    }

    // Generate contract
    const result = await generateSmartContract({
      templateKey,
      variables,
      description,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to generate contract', errors: result.errors },
        { status: 400 }
      );
    }

    // Validate Solidity code
    const validation = validateSolidityCode(result.code!);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Generated code has issues', errors: validation.errors },
        { status: 400 }
      );
    }

    // Estimate complexity
    const complexity = estimateComplexity(result.code!);

    // Format for display
    const formatted = formatCodeForDisplay(result.code!);

    return NextResponse.json(
      {
        success: true,
        code: formatted,
        rawCode: result.code,
        template: result.template,
        variables: result.variables,
        validation: {
          valid: validation.valid,
          errors: validation.errors,
        },
        metrics: {
          complexity,
          codeLength: result.code!.length,
          lines: result.code!.split('\n').length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Contract generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate contract' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai-studio/generate-contract
 * Get available contract templates
 */
export async function GET(request: NextRequest) {
  try {
    const templates = getAvailableTemplates();

    return NextResponse.json(
      {
        templates,
        count: templates.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Template fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
