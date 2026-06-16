import { generateContractCode, validateContractVariables, TEMPLATES } from './contract-templates';

export interface GenerateContractRequest {
  templateKey: string;
  variables: Record<string, string>;
  description?: string;
}

export interface GenerateContractResponse {
  success: boolean;
  code?: string;
  variables?: Record<string, string>;
  template?: string;
  errors?: string[];
}

/**
 * Generate smart contract code
 */
export async function generateSmartContract(
  request: GenerateContractRequest
): Promise<GenerateContractResponse> {
  try {
    // Validate template exists
    const template = TEMPLATES[request.templateKey];
    if (!template) {
      return {
        success: false,
        errors: [`Unknown template: ${request.templateKey}`],
      };
    }

    // Validate variables
    const validation = validateContractVariables(request.templateKey, request.variables);
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    // Generate code
    const code = generateContractCode(request.templateKey, request.variables);
    if (!code) {
      return {
        success: false,
        errors: ['Failed to generate contract code'],
      };
    }

    return {
      success: true,
      code,
      variables: request.variables,
      template: request.templateKey,
    };
  } catch (error) {
    console.error('[v0] Contract generation failed:', error);
    return {
      success: false,
      errors: ['Failed to generate contract'],
    };
  }
}

/**
 * Get available templates
 */
export function getAvailableTemplates() {
  return Object.entries(TEMPLATES).map(([key, template]) => ({
    key,
    name: template.name,
    type: template.type,
    description: template.description,
    variables: template.variables,
  }));
}

/**
 * Validate Solidity syntax (basic checks)
 */
export function validateSolidityCode(code: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for required pragma
  if (!code.includes('pragma solidity')) {
    errors.push('Missing pragma solidity declaration');
  }

  // Check for license
  if (!code.includes('SPDX-License-Identifier')) {
    errors.push('Missing SPDX License Identifier');
  }

  // Check for contract declaration
  if (!code.includes('contract ')) {
    errors.push('Missing contract declaration');
  }

  // Check for unclosed braces
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push('Mismatched braces');
  }

  // Check for common issues
  if (code.includes('{{')) {
    errors.push('Unreplaced template variables detected');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Estimate contract complexity score
 */
export function estimateComplexity(code: string): number {
  let score = 0;

  // Count functions
  const functions = (code.match(/function\s+/g) || []).length;
  score += functions * 10;

  // Count state variables
  const variables = (code.match(/mapping\s*\(/g) || []).length;
  score += variables * 5;

  // Check for advanced features
  if (code.includes('modifier ')) score += 20;
  if (code.includes('event ')) score += 15;
  if (code.includes('assembly')) score += 30;
  if (code.includes('delegatecall')) score += 40;

  return Math.min(score, 100);
}

/**
 * Generate Solidity documentation comments
 */
export function generateDocumentation(
  contractName: string,
  description: string,
  functions: string[]
): string {
  let docs = `/**\n * @title ${contractName}\n`;
  docs += ` * @dev ${description}\n`;
  docs += ` */\n\n`;

  functions.forEach((fn) => {
    docs += `/// @dev ${fn}\n`;
  });

  return docs;
}

/**
 * Format code for display (syntax highlighting ready)
 */
export function formatCodeForDisplay(code: string): string {
  // Ensure consistent indentation
  const lines = code.split('\n');
  let indentLevel = 0;
  const formatted: string[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.endsWith('}') && !trimmed.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    const indented = '  '.repeat(indentLevel) + trimmed;
    formatted.push(indented);

    if ((trimmed.endsWith('{') && !trimmed.startsWith('}')) || trimmed.endsWith('(')) {
      indentLevel++;
    }
  });

  return formatted.join('\n');
}
