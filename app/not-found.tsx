import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5">
      <div className="text-center space-y-6">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto" />
        <div className="space-y-2">
          <h1 className="text-5xl font-bold">404</h1>
          <p className="text-xl text-muted-foreground">Page Not Found</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Button asChild className="mt-8">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
