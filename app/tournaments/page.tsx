'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/lib/web3-context';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TournamentCard } from '@/components/tournament-card';
import { Trophy, Users, Coins, Clock, Loader2, Swords, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Tournament {
  id: string;
  name: string;
  description?: string;
  status: string;
  entry_fee?: number;
  prize_pool?: number;
  max_participants?: number;
  current_participants: number;
  start_date?: string;
  end_date?: string;
}

const STATUS_BADGES = {
  'Upcoming': 'bg-blue-500/20 text-blue-700',
  'Active': 'bg-green-500/20 text-green-700',
  'Completed': 'bg-gray-500/20 text-gray-700',
};

export default function TournamentsPage() {
  const { isConnected, address, connect } = useWeb3();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: true })
        .limit(20);

      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      console.error('Failed to load tournaments:', error);
      toast.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  const joinTournament = async (tournamentId: string) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    setJoining(true);
    try {
      const { error } = await supabase
        .from('tournament_participants')
        .insert({
          tournament_id: tournamentId,
          user_id: address.toLowerCase(),
          champion_id: '00000000-0000-0000-0000-000000000000', // Placeholder
        });

      if (error) throw error;
      toast.success('Joined tournament successfully!');
      loadTournaments();
    } catch (error) {
      console.error('Failed to join tournament:', error);
      toast.error('Failed to join tournament');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tournaments</h1>
          <p className="text-lg text-muted-foreground">
            Compete in tournaments and win big prizes
          </p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {/* Active Tab */}
          <TabsContent value="active" className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : tournaments.filter(t => t.status === 'Active').length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No active tournaments</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tournaments
                  .filter(t => t.status === 'Active')
                  .map((tournament) => (
                    <TournamentCard
                      key={tournament.id}
                      id={tournament.id}
                      name={tournament.name}
                      description={tournament.description}
                      participantCount={tournament.current_participants}
                      maxParticipants={tournament.max_participants || 64}
                      prizePool={tournament.prize_pool || 0}
                      status="active"
                      startDate={tournament.start_date || new Date().toISOString()}
                      onJoin={() => {
                        if (isConnected) {
                          joinTournament(tournament.id);
                        } else {
                          connect();
                        }
                      }}
                      onView={() => setSelectedTournament(tournament)}
                    />
                  ))}
              </div>
            )}
          </TabsContent>

          {/* Upcoming Tab */}
          <TabsContent value="upcoming" className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : tournaments.filter(t => t.status === 'Upcoming').length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No upcoming tournaments</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tournaments
                  .filter(t => t.status === 'Upcoming')
                  .map((tournament) => (
                    <TournamentCard
                      key={tournament.id}
                      id={tournament.id}
                      name={tournament.name}
                      description={tournament.description}
                      participantCount={tournament.current_participants}
                      maxParticipants={tournament.max_participants || 64}
                      prizePool={tournament.prize_pool || 0}
                      status="upcoming"
                      startDate={tournament.start_date || new Date().toISOString()}
                      onJoin={() => {
                        if (isConnected) {
                          joinTournament(tournament.id);
                        } else {
                          connect();
                        }
                      }}
                      onView={() => setSelectedTournament(tournament)}
                    />
                  ))}
              </div>
            )}
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : tournaments.filter(t => t.status === 'Completed').length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No completed tournaments</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tournaments
                  .filter(t => t.status === 'Completed')
                  .map((tournament) => (
                    <TournamentCard
                      key={tournament.id}
                      id={tournament.id}
                      name={tournament.name}
                      description={tournament.description}
                      participantCount={tournament.current_participants}
                      maxParticipants={tournament.max_participants || 64}
                      prizePool={tournament.prize_pool || 0}
                      status="completed"
                      startDate={tournament.start_date || new Date().toISOString()}
                      onJoin={() => {
                        if (isConnected) {
                          joinTournament(tournament.id);
                        } else {
                          connect();
                        }
                      }}
                      onView={() => setSelectedTournament(tournament)}
                    />
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Tournament Detail */}
        {selectedTournament && (
          <Card className="mt-8 border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedTournament.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTournament(null)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Badge className={STATUS_BADGES[selectedTournament.status as keyof typeof STATUS_BADGES]}>
                  {selectedTournament.status}
                </Badge>
              </div>
              {selectedTournament.prize_pool && (
                <div>
                  <label className="text-sm font-medium">Prize Pool</label>
                  <p className="text-lg font-bold">{selectedTournament.prize_pool.toLocaleString()} ARENA</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-2 block">Participants</label>
                <Progress
                  value={
                    selectedTournament.max_participants
                      ? (selectedTournament.current_participants / selectedTournament.max_participants) * 100
                      : 0
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedTournament.current_participants} / {selectedTournament.max_participants || '∞'}
                </p>
              </div>
              {isConnected ? (
                <Button className="w-full" disabled={joining}>
                  {joining ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Swords className="w-4 h-4 mr-2" />
                      Join Tournament
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={connect} variant="outline" className="w-full">
                  Connect Wallet to Join
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function TournamentCard({
  tournament,
  isConnected,
  onJoin,
  onConnect,
  onSelect,
  joining,
}: {
  tournament: Tournament;
  isConnected: boolean;
  onJoin: () => void;
  onConnect: () => void;
  onSelect: () => void;
  joining: boolean;
}) {
  return (
    <Card
      className="cursor-pointer hover:border-primary/50 transition-colors"
      onClick={onSelect}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{tournament.name}</h3>
            <p className="text-sm text-muted-foreground">{tournament.description}</p>
          </div>
          <Badge className={STATUS_BADGES[tournament.status as keyof typeof STATUS_BADGES]}>
            {tournament.status}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {tournament.prize_pool && (
            <div>
              <p className="text-xs text-muted-foreground">Prize Pool</p>
              <p className="font-semibold flex items-center gap-1">
                <Coins className="w-4 h-4" />
                {tournament.prize_pool.toLocaleString()}
              </p>
            </div>
          )}
          {tournament.entry_fee && (
            <div>
              <p className="text-xs text-muted-foreground">Entry Fee</p>
              <p className="font-semibold">{tournament.entry_fee} ARENA</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">Participants</p>
            <p className="font-semibold flex items-center gap-1">
              <Users className="w-4 h-4" />
              {tournament.current_participants}
            </p>
          </div>
        </div>

        {isConnected ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onJoin();
            }}
            disabled={joining}
            className="w-full"
          >
            {joining ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                Join Now
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onConnect();
            }}
            variant="outline"
            className="w-full"
          >
            Connect to Join
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
