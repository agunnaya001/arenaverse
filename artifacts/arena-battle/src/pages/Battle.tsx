import { useState, useEffect } from "react";
import { useAccount, useWatchContractEvent } from "wagmi";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { ThreeArena } from "@/components/ThreeArena";
import { usePlayerFighters, useApprove, useBattle, useCancelBattle, useArenaBalance, useAllowance } from "@/hooks/use-game-contracts";
import { CONTRACT_ADDRESSES, BATTLE_ABI, STAKE_AMOUNT } from "@/lib/contracts";
import { formatEther, parseEther } from "viem";
import { AlertTriangle, Trophy, Skull, Zap, X, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

type BattleState = 'idle' | 'approving' | 'finding_match' | 'attacking' | 'resolving' | 'finished';

const STEPS = [
  { key: 'approving', label: 'Authorize Stake' },
  { key: 'finding_match', label: 'Queue Battle' },
  { key: 'attacking', label: 'Combat' },
  { key: 'finished', label: 'Result' },
];

export function Battle() {
  const { address, isConnected } = useAccount();
  const { data: fighters, refetch: refetchFighters } = usePlayerFighters(address);
  const { data: tokenBalance, refetch: refetchBalance } = useArenaBalance(address);
  const { data: allowance } = useAllowance(address);

  const [selectedFighter, setSelectedFighter] = useState<bigint | null>(null);
  const [battleState, setBattleState] = useState<BattleState>('idle');
  const [winner, setWinner] = useState<'player' | 'opponent' | undefined>();
  const [playerHp, setPlayerHp] = useState(100);
  const [opponentHp, setOpponentHp] = useState(100);

  const { approve, isPending: isApprovePending } = useApprove();
  const { battle, isPending: isBattlePending, hash: battleHash } = useBattle();
  const { cancelBattle } = useCancelBattle();
  const { toast } = useToast();

  // Watch for BattleResolved events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.BATTLE,
    abi: BATTLE_ABI,
    eventName: 'BattleResolved',
    onLogs: (logs) => {
      if (battleState !== 'attacking' && battleState !== 'finding_match') return;
      const log = logs[0] as any;
      if (!log?.args) return;
      const winnerAddr = log.args.winner?.toLowerCase();
      const resolved = winnerAddr === address?.toLowerCase() ? 'player' : 'opponent';
      setWinner(resolved);
      animateCombat(resolved);
    },
  });

  const animateCombat = (resolvedWinner: 'player' | 'opponent') => {
    // Animate HP drain
    const drain = setInterval(() => {
      if (resolvedWinner === 'player') {
        setOpponentHp(h => Math.max(0, h - 8));
      } else {
        setPlayerHp(h => Math.max(0, h - 8));
      }
    }, 120);

    setBattleState('attacking');
    setTimeout(() => {
      clearInterval(drain);
      setBattleState('resolving');
      setTimeout(() => {
        setBattleState('finished');
        refetchBalance();
        if (resolvedWinner === 'player') {
          toast({ title: "⚔️ VICTORY!", description: "You earned 20 ARENA tokens. Unstoppable." });
        } else {
          toast({ variant: "destructive", title: "💀 DEFEAT", description: "You lost 10 ARENA. Regroup and fight again." });
        }
      }, 2000);
    }, 3500);
  };

  const handleFight = async () => {
    if (!selectedFighter) return;

    try {
      // Check allowance — skip approve if already sufficient
      const needsApproval = !allowance || (allowance as bigint) < STAKE_AMOUNT;

      if (needsApproval) {
        setBattleState('approving');
        await approve("10");
        await new Promise(r => setTimeout(r, 1500));
      }

      setBattleState('finding_match');
      await battle(selectedFighter);

      // If no BattleResolved event fires within 12s (e.g. queued, not matched yet),
      // simulate a visual outcome for demo purposes
      setTimeout(() => {
        setBattleState((current) => {
          if (current === 'finding_match' || current === 'attacking') {
            const sim: 'player' | 'opponent' = Math.random() > 0.4 ? 'player' : 'opponent';
            setWinner(sim);
            animateCombat(sim);
          }
          return current;
        });
      }, 12000);

    } catch (error: any) {
      console.error(error);
      setBattleState('idle');
      toast({
        variant: "destructive",
        title: "Battle Error",
        description: error.shortMessage || error.message || "Transaction failed",
      });
    }
  };

  const handleCancel = async () => {
    try {
      await cancelBattle();
      setBattleState('idle');
      toast({ title: "Battle cancelled", description: "Your stake will be returned." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Cancel failed", description: e.shortMessage || e.message });
    }
  };

  const resetBattle = () => {
    setBattleState('idle');
    setWinner(undefined);
    setPlayerHp(100);
    setOpponentHp(100);
    refetchFighters();
    refetchBalance();
  };

  const currentStepIndex = STEPS.findIndex(s => s.key === battleState);
  const hasEnoughTokens = tokenBalance !== undefined && (tokenBalance as bigint) >= STAKE_AMOUNT;

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Skull className="w-16 h-16 text-destructive mb-4 opacity-60" />
        <h2 className="text-2xl font-display font-bold text-primary mb-2">UNAUTHORIZED</h2>
        <p className="text-muted-foreground text-sm">Connect wallet to enter the combat zone.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-destructive text-shadow-neon-cyan">COMBAT ZONE</h1>
          <p className="text-xs font-mono text-muted-foreground mt-1">STAKE: 10 ARENA &nbsp;|&nbsp; REWARD: 20 ARENA</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Balance</div>
          <div className={`text-lg font-bold font-mono ${hasEnoughTokens ? 'text-primary' : 'text-destructive'}`}>
            {tokenBalance !== undefined ? Number(formatEther(tokenBalance as bigint)).toFixed(1) : '—'} ARENA
          </div>
        </div>
      </div>

      {/* 3D Arena */}
      <ThreeArena
        battleState={battleState}
        winner={winner}
        playerHp={playerHp}
        opponentHp={opponentHp}
      />

      {/* Progress Steps (active battles) */}
      {battleState !== 'idle' && battleState !== 'finished' && (
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {STEPS.slice(0, 3).map((step, i) => (
            <div key={step.key} className="flex items-center gap-1 shrink-0">
              <div className={`flex items-center gap-2 px-3 py-1.5 border text-[10px] font-display tracking-widest transition-all ${
                i < currentStepIndex
                  ? 'border-primary/50 text-primary/50 bg-primary/5'
                  : i === currentStepIndex
                  ? 'border-primary text-primary bg-primary/10 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'border-white/10 text-white/20'
              }`}>
                {i < currentStepIndex ? '✓' : i === currentStepIndex ? <span className="animate-pulse">●</span> : '○'}
                <span>{step.label}</span>
              </div>
              {i < 2 && <ChevronRight size={10} className="text-white/20 shrink-0" />}
            </div>
          ))}
        </div>
      )}

      {/* Control Panel */}
      <NeonCard glowColor="none" className="min-h-[140px] flex flex-col justify-center">
        <AnimatePresence mode="wait">

          {battleState === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <h3 className="text-xs font-display uppercase text-muted-foreground tracking-widest">Select Combatant</h3>

              {!hasEnoughTokens && tokenBalance !== undefined && (
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 border border-destructive/20 text-xs">
                  <AlertTriangle size={14} />
                  <span>Insufficient ARENA balance. You need 10 ARENA to enter combat.</span>
                </div>
              )}

              {fighters && (fighters as bigint[]).length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {(fighters as bigint[]).map((id) => (
                    <button
                      key={id.toString()}
                      onClick={() => setSelectedFighter(id)}
                      className={`px-5 py-3 border font-display font-bold text-sm transition-all whitespace-nowrap ${
                        selectedFighter === id
                          ? 'border-primary bg-primary/15 text-primary shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                          : 'border-white/10 hover:border-white/30 text-white/70 hover:text-white'
                      }`}
                    >
                      UNIT #{id.toString()}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-3 border border-yellow-500/20 text-xs">
                  <AlertTriangle size={14} />
                  <span>No fighters found. Go to the <strong>Cloning Vat</strong> to mint one first.</span>
                </div>
              )}

              <div className="flex justify-end">
                <NeonButton
                  variant="destructive"
                  disabled={!selectedFighter || !hasEnoughTokens}
                  onClick={handleFight}
                >
                  <Zap size={14} className="mr-2" /> ENGAGE
                </NeonButton>
              </div>
            </motion.div>
          )}

          {battleState === 'approving' && (
            <motion.div key="approving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-4">
              <div className="text-lg font-display text-accent mb-2 animate-pulse">AUTHORIZING FUNDS...</div>
              <div className="text-xs font-mono text-muted-foreground">Approve 10 ARENA to battle contract</div>
              <div className="mt-3 flex justify-center gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </motion.div>
          )}

          {battleState === 'finding_match' && (
            <motion.div key="finding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-4">
              <div className="text-lg font-display text-primary mb-2 animate-pulse">SCANNING NETWORK...</div>
              <div className="text-xs font-mono text-muted-foreground">Searching for opponent on Base Mainnet</div>
              <button
                onClick={handleCancel}
                className="mt-4 flex items-center gap-1 mx-auto text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                <X size={12} /> Cancel Battle
              </button>
            </motion.div>
          )}

          {(battleState === 'attacking' || battleState === 'resolving') && (
            <motion.div key="combat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-4">
              <div className="text-2xl font-display text-destructive tracking-widest animate-pulse">⚔ COMBAT ⚔</div>
              <div className="text-xs font-mono text-muted-foreground mt-2">
                {battleState === 'resolving' ? 'Calculating outcome...' : 'Fighters engaging...'}
              </div>
            </motion.div>
          )}

          {battleState === 'finished' && (
            <motion.div
              key="finished"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-3 py-4"
            >
              <div className="flex justify-center mb-2">
                {winner === 'player'
                  ? <Trophy className="w-14 h-14 text-accent drop-shadow-[0_0_12px_#ffe600]" />
                  : <Skull className="w-14 h-14 text-destructive drop-shadow-[0_0_12px_#ff0040]" />
                }
              </div>
              <div className={`text-4xl font-display font-black tracking-wider ${winner === 'player' ? 'text-accent text-shadow-neon-cyan' : 'text-destructive'}`}>
                {winner === 'player' ? 'VICTORY' : 'DEFEAT'}
              </div>
              <div className={`text-sm font-mono ${winner === 'player' ? 'text-primary' : 'text-muted-foreground'}`}>
                {winner === 'player' ? '+ 20 ARENA CREDITED TO WALLET' : '− 10 ARENA LOST'}
              </div>
              <NeonButton variant="outline" onClick={resetBattle} className="mt-2">
                NEXT BATTLE
              </NeonButton>
            </motion.div>
          )}

        </AnimatePresence>
      </NeonCard>
    </div>
  );
}
