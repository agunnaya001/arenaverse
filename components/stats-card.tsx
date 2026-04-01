'use client';

import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent' | 'gold';
  className?: string;
}

const variantStyles = {
  default: {
    icon: 'bg-secondary text-foreground',
    glow: '',
  },
  primary: {
    icon: 'bg-primary/20 text-primary',
    glow: 'shadow-primary/10',
  },
  accent: {
    icon: 'bg-accent/20 text-accent',
    glow: 'shadow-accent/10',
  },
  gold: {
    icon: 'bg-arena-gold/20 text-arena-gold',
    glow: 'shadow-arena-gold/10',
  },
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'relative rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-border',
        variant !== 'default' && `shadow-lg hover:shadow-xl ${styles.glow}`,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              trend.isPositive ? 'text-green-500' : 'text-red-500'
            )}>
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
              <span className="text-muted-foreground">vs last week</span>
            </div>
          )}
        </div>
        <div className={cn(
          'rounded-xl p-3',
          styles.icon
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export function StatsGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {children}
    </div>
  );
}
