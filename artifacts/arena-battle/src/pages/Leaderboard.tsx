import { NeonCard } from "@/components/ui/NeonCard";
import { Trophy, Medal, Flame } from "lucide-react";
import { formatAddress } from "@/lib/utils";
import { useAccount } from "wagmi";
import { useGetLeaderboard } from "@workspace/api-client-react";
import { motion } from "framer-motion";

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="inline text-accent drop-shadow-[0_0_8px_#ffe600]" size={18} />;
  if (rank === 2) return <Medal className="inline text-gray-300" size={16} />;
  if (rank === 3) return <Medal className="inline text-amber-600" size={16} />;
  return <span className="text-muted-foreground font-mono text-sm">#{rank}</span>;
}

export function Leaderboard() {
  const { address } = useAccount();
  const { data: leaderboardData, isLoading, error } = useGetLeaderboard({ limit: 50 });

  const rows = leaderboardData as any[] | undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-display font-bold text-accent text-shadow-neon-cyan mb-2">GLOBAL RANKING</h1>
        <p className="text-muted-foreground font-mono text-sm">Top combatants across the Base network</p>
      </div>

      {/* Top 3 Podium */}
      {rows && rows.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* 2nd */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <NeonCard glowColor="none" className="text-center p-4 mt-6">
              <div className="text-2xl mb-1">🥈</div>
              <div className="text-xs font-mono text-gray-300 font-bold truncate">{formatAddress(rows[1].address)}</div>
              <div className="text-lg font-bold font-mono text-accent mt-1">{rows[1].wins}W</div>
              <div className="text-[9px] text-muted-foreground">{rows[1].tokensEarned} ARENA</div>
            </NeonCard>
          </motion.div>

          {/* 1st */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <NeonCard glowColor="accent" className="text-center p-4 border-accent/50">
              <div className="text-3xl mb-1">🏆</div>
              <div className="text-xs font-mono text-accent font-bold truncate">{formatAddress(rows[0].address)}</div>
              <div className="text-2xl font-bold font-mono text-accent mt-1">{rows[0].wins}W</div>
              <div className="text-[9px] text-muted-foreground">{rows[0].tokensEarned} ARENA</div>
            </NeonCard>
          </motion.div>

          {/* 3rd */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <NeonCard glowColor="none" className="text-center p-4 mt-8">
              <div className="text-2xl mb-1">🥉</div>
              <div className="text-xs font-mono text-amber-600 font-bold truncate">{formatAddress(rows[2].address)}</div>
              <div className="text-lg font-bold font-mono text-accent mt-1">{rows[2].wins}W</div>
              <div className="text-[9px] text-muted-foreground">{rows[2].tokensEarned} ARENA</div>
            </NeonCard>
          </motion.div>
        </div>
      )}

      {/* Full Table */}
      <NeonCard glowColor="none" className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-muted-foreground uppercase bg-white/5 font-display tracking-widest border-b border-white/10">
              <tr>
                <th className="px-5 py-4 w-16">Rank</th>
                <th className="px-5 py-4">Operative</th>
                <th className="px-5 py-4 text-center hidden sm:table-cell">Battles</th>
                <th className="px-5 py-4 text-center">W / L</th>
                <th className="px-5 py-4 text-right">ARENA</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td colSpan={5} className="px-5 py-3">
                      <div className="h-4 bg-white/5 animate-pulse rounded" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-destructive text-xs font-mono">
                    Connection to data grid severed.
                  </td>
                </tr>
              ) : !rows || rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground text-xs font-mono">
                    No data recorded yet. Be the first to fight!
                  </td>
                </tr>
              ) : (
                rows.map((player, i) => {
                  const isCurrentUser = address?.toLowerCase() === player.address.toLowerCase();
                  const winRate = player.totalBattles > 0
                    ? Math.round((player.wins / player.totalBattles) * 100)
                    : 0;

                  return (
                    <motion.tr
                      key={player.address}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`border-b border-white/5 transition-colors hover:bg-white/5 font-mono ${
                        isCurrentUser ? 'bg-primary/8 border-l-2 border-l-primary' : ''
                      }`}
                    >
                      <td className="px-5 py-3.5 font-display font-bold">
                        <RankBadge rank={player.rank} />
                      </td>
                      <td className={`px-5 py-3.5 font-bold text-sm ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                        <div className="flex items-center gap-2">
                          {player.rank <= 3 && <Flame size={12} className="text-accent" />}
                          {formatAddress(player.address)}
                          {isCurrentUser && (
                            <span className="text-[9px] bg-primary text-black px-1 font-display">YOU</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center text-muted-foreground text-xs hidden sm:table-cell">
                        {player.totalBattles}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-accent text-xs">{player.wins}W</span>
                          <span className="text-muted-foreground text-xs">/</span>
                          <span className="text-destructive text-xs">{player.losses}L</span>
                        </div>
                        <div className="w-16 bg-white/10 h-0.5 mt-1 mx-auto overflow-hidden">
                          <div className="bg-accent h-full" style={{ width: `${winRate}%` }} />
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right text-primary font-bold text-sm">
                        {player.tokensEarned}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </NeonCard>
    </div>
  );
}
