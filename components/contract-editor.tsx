'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ContractEditorProps {
  code: string;
  contractType: string;
  contractName: string;
  onCopy?: () => void;
  onDownload?: () => void;
}

export function ContractEditor({
  code,
  contractType,
  contractName,
  onCopy,
  onDownload,
}: ContractEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${contractName}.sol`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Contract downloaded');
    onDownload?.();
  };

  if (!code) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contract Preview</CardTitle>
          <CardDescription>Generate a contract to see the code here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <p>No contract generated yet. Fill in the details and click generate.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Count lines for display
  const lineCount = code.split('\n').length;
  const codePreview = code.substring(0, 500);
  const isTruncated = code.length > 500;

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            {contractName}.sol
            <Badge variant="outline">{contractType}</Badge>
          </CardTitle>
          <CardDescription>{lineCount} lines of code</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Security Notice */}
        <div className="flex gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            Always audit smart contracts before deploying to mainnet. This is generated code and may require modifications.
          </p>
        </div>

        {/* Code Display */}
        <div className="relative">
          <div className="bg-slate-950 rounded-lg p-4 overflow-x-auto border border-slate-800">
            <pre className="text-sm font-mono text-slate-100 whitespace-pre-wrap break-words">
              {isTruncated ? (
                <>
                  {codePreview}
                  <span className="text-slate-500">
                    {'\n\n... '}
                    {code.length - 500}
                    {' more characters ...'}
                  </span>
                </>
              ) : (
                code
              )}
            </pre>
          </div>

          {/* Syntax Highlighting Hint */}
          <div className="mt-2 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Copy the code above and paste it into your editor or IDE for syntax highlighting.
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                navigator.clipboard.writeText(code);
                toast.success('Full code copied');
              }}
            >
              Copy All
            </Button>
          </div>
        </div>

        {/* Deployment Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Standard</p>
            <p className="font-mono text-sm font-bold">{contractType}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Size</p>
            <p className="font-mono text-sm">{(code.length / 1024).toFixed(2)} KB</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
