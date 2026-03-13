import { useQuery } from "@tanstack/react-query";
import { NeonCard } from "@/components/ui/NeonCard";
import { Trophy, Skull, Swords } from "lucide-react";
import { formatAddress } from "@/lib/utils";
import { useAccount } from "wagmi";
import { useGetLeaderboard } from "@workspace/api-client-react";

export function Leaderboard() {
  const { address } = useAccount();
  
  // Using the generated hook. If backend isn't up, it will fail, which is expected behavior as per instructions.
  const { data: leaderboardData, isLoading, error } = useGetLeaderboard({ limit: 50 });

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-display font-bold text-accent text-shadow-neon-cyan mb-2">GLOBAL RANKING</h1>
        <p className="text-muted-foreground font-mono">Top combatants across the Base network</p>
      </div>

      <NeonCard glowColor="none" className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-white/5 font-display tracking-wider">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Operative</th>
                <th className="px-6 py-4 text-center">W/L Ratio</th>
                <th className="px-6 py-4 text-right">Earned (ARENA)</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground animate-pulse">
                    Accessing network data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-destructive">
                    Connection to data grid severed.
                  </td>
                </tr>
              ) : leaderboardData?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No data recorded yet.
                  </td>
                </tr>
              ) : (
                leaderboardData?.map((player) => {
                  const isCurrentUser = address?.toLowerCase() === player.address.toLowerCase();
                  
                  return (
                    <tr 
                      key={player.address} 
                      className={`border-b border-white/5 transition-colors hover:bg-white/5 font-mono ${
                        isCurrentUser ? 'bg-primary/10 border-l-2 border-l-primary' : ''
                      }`}
                    >
                      <td className="px-6 py-4 font-display font-bold text-lg">
                        {player.rank === 1 ? <Trophy className="text-accent inline mr-2" size={20}/> : 
                         player.rank === 2 ? <span className="text-gray-400 mr-2">#2</span> : 
                         player.rank === 3 ? <span className="text-orange-700 mr-2">#3</span> : 
                         <span className="text-muted-foreground">#{player.rank}</span>}
                      </td>
                      <td className={`px-6 py-4 font-bold ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                        {formatAddress(player.address)}
                        {isCurrentUser && <span className="ml-2 text-[10px] bg-primary text-black px-1 rounded">YOU</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-accent">{player.wins}W</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-destructive">{player.losses}L</span>
                        </div>
                        <div className="w-full bg-white/10 h-1 mt-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-accent h-full" 
                            style={{ width: `${player.totalBattles > 0 ? (player.wins / player.totalBattles) * 100 : 0}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-primary font-bold">
                        {player.tokensEarned}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </NeonCard>
    </div>
  );
}
