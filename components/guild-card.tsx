'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Coins, TrendingUp } from 'lucide-react';

interface GuildCardProps {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  treasuryBalance: number;
  level: number;
  onJoin?: () => void;
  onView?: () => void;
}

export function GuildCard({
  id,
  name,
  description,
  memberCount,
  treasuryBalance,
  level,
  onJoin,
  onView,
}: GuildCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 mb-1">
              {name}
              <Badge variant="outline" className="ml-auto">Level {level}</Badge>
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {description || 'No description provided'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Members</p>
              <p className="text-sm font-bold">{memberCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Coins className="w-4 h-4 text-yellow-600" />
            <div>
              <p className="text-xs text-muted-foreground">Treasury</p>
              <p className="text-sm font-bold">${treasuryBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Growth Indicator */}
        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
          <TrendingUp className="w-3 h-3" />
          <span>+12.5% this week</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onView}>
            View Details
          </Button>
          <Button size="sm" className="flex-1" onClick={onJoin}>
            Join Guild
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
