import { useAccount } from "wagmi";
import { useTelegram } from "@/hooks/use-telegram";
import { NeonCard } from "@/components/ui/NeonCard";
import { formatAddress } from "@/lib/utils";
import { useGetPlayerStats, useGetBattleHistory } from "@workspace/api-client-react";
import { useArenaBalance, usePlayerFighters, useFighterStats, useOnChainPlayerStats } from "@/hooks/use-game-contracts";
import { Activity, ShieldAlert, Zap, History, Trophy, ExternalLink, Shield } from "lucide-react";
import { formatEther } from "viem";
import { motion } from "framer-motion";

function FighterStatRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[9px] font-mono mb-0.5">
        <span className="text-muted-foreground">{label}</span>
        <span style={{ color }}>{value}</span>
      </div>
      <div className="h-1 bg-white/10 overflow-hidden">
        <div className="h-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function FighterMiniCard({ tokenId }: { tokenId: bigint }) {
  const { data: stats } = useFighterStats(tokenId);
  const classNames = ['Warrior', 'Mage', 'Rogue'];
  const classColors = ['#00f0ff', '#ff00ff', '#ffe600'];
  const s = stats as any;
  const classIdx = s ? Number(s.class_ ?? s[0]) : 0;

  return (
    <div className="bg-card border border-white/10 hover:border-primary/30 p-4 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-display font-bold" style={{ color: classColors[classIdx] }}>
          {s ? classNames[classIdx] : '...'} #{tokenId.toString()}
        </div>
        {s && (
          <div className="text-[9px] font-mono text-muted-foreground">
            LVL {Number(s.level ?? s[4])}
          </div>
        )}
      </div>
      {s ? (
        <div className="space-y-1.5">
          <FighterStatRow label="ATK" value={Number(s.attack ?? s[1])} color={classColors[classIdx]} />
          <FighterStatRow label="DEF" value={Number(s.defense ?? s[2])} color={classColors[classIdx]} />
          <FighterStatRow label="SPD" value={Number(s.speed ?? s[3])} color={classColors[classIdx]} />
          <div className="flex justify-between text-[9px] font-mono mt-2 pt-2 border-t border-white/5">
            <span className="text-accent">{Number(s.wins ?? s[5])}W</span>
            <span className="text-destructive">{Number(s.losses ?? s[6])}L</span>
          </div>
        </div>
      ) : (
        <div className="text-[10px] text-muted-foreground animate-pulse">Loading...</div>
      )}
    </div>
  );
}

export function Profile() {
  const { address, isConnected } = useAccount();
  const { user, isTMA } = useTelegram();

  const { data: apiStats, isLoading: statsLoading } = useGetPlayerStats(address || '', {
    query: { enabled: !!address } as any
  });
  const { data: history, isLoading: historyLoading } = useGetBattleHistory({ address }, {
    query: { enabled: !!address } as any
  });
  const { data: tokenBalance } = useArenaBalance(address);
  const { data: fighters } = usePlayerFighters(address);
  const { data: onChainStats } = useOnChainPlayerStats(address);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="text-6xl mb-4 opacity-30">🕵️</div>
        <h2 className="text-2xl font-display font-bold text-primary mb-2">IDENTITY UNKNOWN</h2>
        <p className="text-muted-foreground text-sm">Connect wallet to access operative dossier.</p>
      </div>
    );
  }

  const chainStats = onChainStats as any;
  const wins = apiStats?.wins ?? (chainStats ? Number(chainStats.wins ?? chainStats[0]) : 0);
  const losses = apiStats?.losses ?? (chainStats ? Number(chainStats.losses ?? chainStats[1]) : 0);
  const total = (wins + losses) || 0;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
  const tokenStr = tokenBalance !== undefined ? Number(formatEther(tokenBalance as bigint)).toFixed(2) : '—';

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 bg-card/50 p-5 border border-white/10"
      >
        <div className="w-16 h-16 bg-muted border-2 border-primary/50 overflow-hidden shrink-0 flex items-center justify-center">
          {isTMA && user?.photoUrl ? (
            <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-primary font-display font-bold text-2xl">OP</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-display font-bold truncate">
            {isTMA && user?.username ? `@${user.username}` : 'OPERATIVE'}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-xs font-mono text-muted-foreground bg-black/50 px-2 py-0.5 border border-white/10">
              {formatAddress(address)}
            </div>
            <a
              href={`https://basescan.org/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary transition-colors"
            >
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] text-muted-foreground font-mono">ARENA BAL</div>
          <div className="text-lg font-bold text-primary font-mono">{tokenStr}</div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <NeonCard glowColor="primary" className="p-4 text-center">
          <Activity className="w-5 h-5 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold font-mono">{statsLoading ? '—' : total}</div>
          <div className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">Battles</div>
        </NeonCard>

        <NeonCard glowColor="accent" className="p-4 text-center">
          <Trophy className="w-5 h-5 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold font-mono text-accent">{statsLoading ? '—' : wins}</div>
          <div className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">Victories</div>
        </NeonCard>

        <NeonCard glowColor="none" className="p-4 text-center">
          <ShieldAlert className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
          <div className="text-2xl font-bold font-mono">{statsLoading ? '—' : losses}</div>
          <div className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">Defeats</div>
        </NeonCard>

        <NeonCard glowColor="secondary" className="p-4 text-center">
          <Zap className="w-5 h-5 text-secondary mx-auto mb-2" />
          <div className="text-2xl font-bold font-mono text-secondary">{winRate}%</div>
          <div className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">Win Rate</div>
        </NeonCard>
      </div>

      {/* Win rate bar */}
      {total > 0 && (
        <div>
          <div className="flex justify-between text-[10px] font-mono mb-1">
            <span className="text-accent">{wins}W</span>
            <span className="text-muted-foreground">Combat Performance</span>
            <span className="text-destructive">{losses}L</span>
          </div>
          <div className="h-2 bg-destructive/30 overflow-hidden border border-white/5">
            <motion.div
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${winRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Fighter Roster */}
      {fighters && (fighters as bigint[]).length > 0 && (
        <div>
          <h2 className="text-base font-display font-bold mb-3 flex items-center gap-2">
            <Shield size={14} className="text-primary" /> FIGHTER ROSTER
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(fighters as bigint[]).map(id => (
              <FighterMiniCard key={id.toString()} tokenId={id} />
            ))}
          </div>
        </div>
      )}

      {/* Combat Log */}
      <div>
        <h2 className="text-base font-display font-bold mb-3 flex items-center gap-2">
          <History size={14} className="text-primary" /> COMBAT LOG
        </h2>
        <div className="space-y-2">
          {historyLoading ? (
            <div className="text-center text-muted-foreground py-8 animate-pulse font-mono text-xs border border-dashed border-white/10">
              Retrieving logs...
            </div>
          ) : history && (history as any[]).length > 0 ? (
            (history as any[]).map((record) => {
              const isWinner = record.winner?.toLowerCase() === address?.toLowerCase();
              return (
                <div key={record.id} className="flex items-center justify-between p-3 bg-card border border-white/5 hover:border-white/15 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-10 ${isWinner ? 'bg-accent' : 'bg-destructive'}`} />
                    <div>
                      <div className={`text-xs font-display font-bold ${isWinner ? 'text-accent' : 'text-destructive'}`}>
                        {isWinner ? 'VICTORY' : 'DEFEAT'}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        vs {formatAddress(record.opponentAddress)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-mono font-bold ${isWinner ? 'text-primary' : 'text-muted-foreground'}`}>
                      {isWinner ? '+' : '−'}{record.tokensRewarded} ARENA
                    </div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-8 border border-dashed border-white/10 font-mono text-xs">
              No combat data found for this operative.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
