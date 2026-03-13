import { useAccount } from "wagmi";
import { useTelegram } from "@/hooks/use-telegram";
import { NeonCard } from "@/components/ui/NeonCard";
import { formatAddress } from "@/lib/utils";
import { useGetPlayerStats, useGetBattleHistory } from "@workspace/api-client-react";
import { Activity, ShieldAlert, Zap, History } from "lucide-react";

export function Profile() {
  const { address, isConnected } = useAccount();
  const { user, isTMA } = useTelegram();

  // Generated hooks. Requires address to be defined to run enabled: !!address
  const { data: stats, isLoading: statsLoading } = useGetPlayerStats(address || '', {
    query: { enabled: !!address }
  });
  
  const { data: history, isLoading: historyLoading } = useGetBattleHistory({ address }, {
    query: { enabled: !!address }
  });

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-display font-bold text-primary mb-4">IDENTITY UNKNOWN</h2>
        <p className="text-muted-foreground">Connect wallet to access operative dossier.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center gap-4 bg-card/50 p-6 border border-white/10">
        <div className="w-16 h-16 bg-muted border-2 border-primary/50 overflow-hidden shrink-0">
          {isTMA && user?.photoUrl ? (
            <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary font-display font-bold text-2xl">
              OP
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">
            {isTMA && user?.username ? `@${user.username}` : 'OPERATIVE'}
          </h1>
          <div className="text-sm font-mono text-muted-foreground bg-black/50 px-2 py-1 inline-block mt-1">
            {formatAddress(address)}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <NeonCard glowColor="primary" className="p-4 text-center">
          <Activity className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold font-mono">{statsLoading ? '-' : stats?.totalBattles || 0}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Deployments</div>
        </NeonCard>
        
        <NeonCard glowColor="accent" className="p-4 text-center">
          <Zap className="w-6 h-6 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold font-mono">{statsLoading ? '-' : stats?.wins || 0}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Victories</div>
        </NeonCard>

        <NeonCard glowColor="none" className="p-4 text-center">
          <ShieldAlert className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <div className="text-2xl font-bold font-mono">{statsLoading ? '-' : stats?.losses || 0}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Defeats</div>
        </NeonCard>

        <NeonCard glowColor="secondary" className="p-4 text-center">
          <div className="text-xl font-bold text-secondary mb-2 font-display">ARENA</div>
          <div className="text-xl font-bold font-mono text-secondary">{statsLoading ? '-' : stats?.tokensEarned || '0'}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Yield</div>
        </NeonCard>
      </div>

      {/* Combat Log */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <History className="text-primary" size={20} />
          <h2 className="text-xl font-display font-bold">COMBAT LOG</h2>
        </div>
        
        <NeonCard glowColor="none" className="p-0 bg-transparent border-none">
          {historyLoading ? (
            <div className="text-center text-muted-foreground py-8 animate-pulse font-mono text-sm">
              Retrieving logs...
            </div>
          ) : history && history.length > 0 ? (
            <div className="space-y-2">
              {history.map((record) => {
                const isWinner = record.winner.toLowerCase() === address?.toLowerCase();
                return (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-card border border-white/5 hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-12 ${isWinner ? 'bg-accent' : 'bg-destructive'}`} />
                      <div>
                        <div className={`font-display font-bold ${isWinner ? 'text-accent' : 'text-destructive'}`}>
                          {isWinner ? 'VICTORY' : 'DEFEAT'}
                        </div>
                        <div className="text-xs font-mono text-muted-foreground">
                          vs {formatAddress(record.opponentAddress)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono font-bold ${isWinner ? 'text-primary' : 'text-muted-foreground'}`}>
                        {isWinner ? '+' : '-'}{record.tokensRewarded} ARENA
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {new Date(record.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8 border border-dashed border-white/10 font-mono text-sm">
              No combat data found for this operative.
            </div>
          )}
        </NeonCard>
      </div>
    </div>
  );
}
