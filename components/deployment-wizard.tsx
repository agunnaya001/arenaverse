'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';

export type DeploymentStep = 'config' | 'review' | 'deploy' | 'verify';

interface DeploymentWizardProps {
  title: string;
  description: string;
  onDeploy?: () => void;
}

export function DeploymentWizard({
  title,
  description,
  onDeploy,
}: DeploymentWizardProps) {
  const [currentStep, setCurrentStep] = useState<DeploymentStep>('config');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentHash, setDeploymentHash] = useState('');

  const steps: { id: DeploymentStep; label: string; description: string }[] = [
    { id: 'config', label: 'Configure', description: 'Set deployment parameters' },
    { id: 'review', label: 'Review', description: 'Verify your settings' },
    { id: 'deploy', label: 'Deploy', description: 'Submit to blockchain' },
    { id: 'verify', label: 'Verify', description: 'Contract verification' },
  ];

  const stepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const handleNext = async () => {
    if (currentStep === 'deploy') {
      setIsDeploying(true);
      // Simulate deployment
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setDeploymentHash('0x' + Math.random().toString(16).slice(2, 66));
      setIsDeploying(false);
      setCurrentStep('verify');
    } else if (currentStep === 'config') {
      setCurrentStep('review');
    } else if (currentStep === 'review') {
      setCurrentStep('deploy');
    }
  };

  const handlePrev = () => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">
            Step {stepIndex + 1} of {steps.length}
          </span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-4 gap-2">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = steps.findIndex((s) => s.id === currentStep) > index;

          return (
            <div
              key={step.id}
              className="relative"
              onClick={() => {
                if (isCompleted) setCurrentStep(step.id);
              }}
            >
              <button
                className={`w-full p-3 rounded-lg border-2 transition-all text-center ${
                  isActive
                    ? 'border-primary bg-primary/10'
                    : isCompleted
                      ? 'border-green-500 bg-green-500/10 cursor-pointer hover:bg-green-500/20'
                      : 'border-muted bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : isActive ? (
                    <Clock className="w-5 h-5 text-primary" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                  )}
                </div>
                <p className={`text-xs font-medium truncate ${
                  isActive
                    ? 'text-foreground'
                    : isCompleted
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-muted-foreground'
                }`}>
                  {step.label}
                </p>
              </button>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="min-h-96">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{steps[stepIndex].label}</CardTitle>
              <CardDescription>{steps[stepIndex].description}</CardDescription>
            </div>
            <Badge variant="outline">{currentStep.toUpperCase()}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 'config' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Configure your deployment parameters. All settings are customizable.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">Network</span>
                  <span className="font-mono text-sm">Base Mainnet</span>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">Contract Type</span>
                  <span className="font-mono text-sm">ERC721</span>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">Gas Estimate</span>
                  <span className="font-mono text-sm">~250,000 gas</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Please verify all settings are correct before deploying. Changes cannot be made after deployment.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-sm">Deployment Summary</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm p-2 bg-muted rounded">
                    <span>Contract Name</span>
                    <span className="font-mono">MyNFT</span>
                  </div>
                  <div className="flex justify-between text-sm p-2 bg-muted rounded">
                    <span>Total Supply</span>
                    <span className="font-mono">10,000</span>
                  </div>
                  <div className="flex justify-between text-sm p-2 bg-muted rounded">
                    <span>Network</span>
                    <span className="font-mono">Base (Chain ID: 8453)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'deploy' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {isDeploying
                    ? 'Submitting your contract to the blockchain...'
                    : 'Click the Deploy button to submit your contract.'}
                </p>
              </div>
              {isDeploying && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Submitting to blockchain...</p>
                  </div>
                </div>
              )}
              {deploymentHash && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-xs text-green-600 dark:text-green-400 mb-2">Deployment Successful</p>
                  <p className="font-mono text-xs break-all text-green-700 dark:text-green-300">
                    {deploymentHash}
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 'verify' && (
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800 dark:text-green-200">
                  Your contract has been deployed successfully!
                </p>
              </div>
              {deploymentHash && (
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Contract Address</p>
                    <p className="font-mono text-sm break-all">{deploymentHash}</p>
                  </div>
                  <Button variant="outline" className="w-full gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View on Etherscan
                  </Button>
                  <Button className="w-full gap-2">
                    Verify on Etherscan
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3 justify-between pt-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 'config'}
        >
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={isDeploying || currentStep === 'verify'}
          className="gap-2"
        >
          {currentStep === 'deploy' ? (
            isDeploying ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                Deploy Now
                <ArrowRight className="w-4 h-4" />
              </>
            )
          ) : currentStep === 'verify' ? (
            'Deployment Complete'
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
