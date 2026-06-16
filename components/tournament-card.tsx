'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Trophy, Clock } from 'lucide-react';

interface TournamentCardProps {
  id: string;
  name: string;
  description?: string;
  participantCount: number;
  maxParticipants: number;
  prizePool: number;
  status: 'upcoming' | 'active' | 'completed';
  startDate: string;
  onJoin?: () => void;
  onView?: () => void;
}

export function TournamentCard({
  id,
  name,
  description,
  participantCount,
  maxParticipants,
  prizePool,
  status,
  startDate,
  onJoin,
  onView,
}: TournamentCardProps) {
  const statusConfig = {
    upcoming: { label: 'Upcoming', variant: 'outline' as const, color: 'text-blue-600' },
    active: { label: 'Active', variant: 'default' as const, color: 'text-green-600' },
    completed: { label: 'Completed', variant: 'outline' as const, color: 'text-muted-foreground' },
  };

  const config = statusConfig[status];
  const spotsAvailable = maxParticipants - participantCount;
  const fillPercentage = (participantCount / maxParticipants) * 100;

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="mb-1">{name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {description || 'No description provided'}
            </CardDescription>
          </div>
          <Badge variant={config.variant} className={config.color}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Participant Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Users className="w-4 h-4" />
              Participants
            </span>
            <span className="font-bold">
              {participantCount}/{maxParticipants}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
              style={{ width: `${Math.min(fillPercentage, 100)}%` }}
            />
          </div>
          {spotsAvailable > 0 && (
            <p className="text-xs text-muted-foreground">
              {spotsAvailable} spot{spotsAvailable !== 1 ? 's' : ''} available
            </p>
          )}
        </div>

        {/* Prize Pool & Start Date */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <div>
              <p className="text-xs text-muted-foreground">Prize Pool</p>
              <p className="text-sm font-bold">${prizePool.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Clock className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Starts</p>
              <p className="text-sm font-bold">
                {new Date(startDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onView}>
            View Details
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={onJoin}
            disabled={spotsAvailable === 0 || status === 'completed'}
          >
            {status === 'completed' ? 'Completed' : 'Join Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
