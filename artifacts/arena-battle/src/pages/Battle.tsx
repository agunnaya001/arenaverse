import { useState } from "react";
import { useAccount } from "wagmi";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { ThreeArena } from "@/components/ThreeArena";
import { usePlayerFighters, useApprove, useBattle, useArenaBalance } from "@/hooks/use-game-contracts";
import { formatEther } from "viem";
import { AlertTriangle, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BattleState = 'idle' | 'approving' | 'finding_match' | 'attacking' | 'resolving' | 'finished';

export function Battle() {
  const { address, isConnected } = useAccount();
  const { data: fighters } = usePlayerFighters(address);
  const { data: tokenBalance } = useArenaBalance(address);
  
  const [selectedFighter, setSelectedFighter] = useState<bigint | null>(null);
  const [battleState, setBattleState] = useState<BattleState>('idle');
  const [winner, setWinner] = useState<'player' | 'opponent' | undefined>();
  
  const { approve, isPending: isApprovePending } = useApprove();
  const { battle, isPending: isBattlePending } = useBattle();
  const { toast } = useToast();

  const handleFight = async () => {
    if (!selectedFighter) return;

    try {
      // 1. Approve 10 ARENA tokens
      setBattleState('approving');
      await approve("10");
      
      // Simulate slight delay for UX
      await new Promise(r => setTimeout(r, 2000));
      
      // 2. Call Battle
      setBattleState('finding_match');
      await battle(selectedFighter);
      
      // 3. Simulate Combat Animation Sequence
      setBattleState('attacking');
      setWinner('player'); // Mocking combat visual logic here
      
      setTimeout(() => {
        setBattleState('resolving');
        setTimeout(() => {
          setBattleState('finished');
          toast({
            title: "VICTORY!",
            description: "You earned 20 ARENA tokens.",
          });
        }, 2000);
      }, 2000);

    } catch (error: any) {
      console.error(error);
      setBattleState('idle');
      toast({
        variant: "destructive",
        title: "Battle Error",
        description: error.message || "Failed to engage combat",
      });
    }
  };

  const resetBattle = () => {
    setBattleState('idle');
    setWinner(undefined);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-display font-bold text-primary mb-4">UNAUTHORIZED</h2>
        <p className="text-muted-foreground">Connect wallet to enter the combat zone.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-destructive text-shadow-neon-cyan">COMBAT ZONE</h1>
          <p className="text-sm font-mono text-muted-foreground">STAKING: 10 ARENA | REWARD: 20 ARENA</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground font-mono">BALANCE</div>
          <div className="text-xl font-bold text-primary">{tokenBalance ? formatEther(tokenBalance) : '0.0'} ARENA</div>
        </div>
      </div>

      {/* 3D Visualization */}
      <ThreeArena battleState={battleState} winner={winner} />

      {/* Status / Controls */}
      <NeonCard glowColor="none" className="min-h-[150px] flex flex-col justify-center">
        {battleState === 'idle' && (
          <div className="space-y-4">
            <h3 className="text-sm font-display uppercase text-muted-foreground">SELECT COMBATANT</h3>
            {fighters && fighters.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {fighters.map((id) => (
                  <button
                    key={id.toString()}
                    onClick={() => setSelectedFighter(id)}
                    className={`px-6 py-3 border font-display font-bold transition-all whitespace-nowrap ${
                      selectedFighter === id 
                        ? 'border-primary bg-primary/20 text-primary box-shadow-neon-cyan' 
                        : 'border-white/10 hover:border-white/30 text-white'
                    }`}
                  >
                    UNIT #{id.toString()}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-3 border border-yellow-500/20">
                <AlertTriangle size={16} />
                <span className="text-sm">No fighters found. Go to the Cloning Vat to mint one.</span>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <NeonButton 
                variant="destructive"
                disabled={!selectedFighter}
                onClick={handleFight}
              >
                ENGAGE
              </NeonButton>
            </div>
          </div>
        )}

        {battleState === 'approving' && (
          <div className="text-center animate-pulse">
            <div className="text-xl font-display text-accent mb-2">AUTHORIZING FUNDS...</div>
            <div className="text-xs font-mono text-muted-foreground">Awaiting signature for 10 ARENA</div>
          </div>
        )}

        {battleState === 'finding_match' && (
          <div className="text-center">
            <div className="text-xl font-display text-primary mb-2 animate-pulse">SCANNING NETWORK...</div>
            <div className="text-xs font-mono text-muted-foreground">Searching for opponent in Base Mainnet</div>
          </div>
        )}

        {(battleState === 'attacking' || battleState === 'resolving') && (
          <div className="text-center">
            <div className="text-2xl font-display text-destructive animate-bounce tracking-widest">COMBAT IN PROGRESS</div>
            <div className="text-xs font-mono text-muted-foreground mt-2">Calculating outcome vector...</div>
          </div>
        )}

        {battleState === 'finished' && (
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-2">
              {winner === 'player' ? <Trophy className="w-12 h-12 text-accent" /> : <AlertTriangle className="w-12 h-12 text-destructive" />}
            </div>
            <div className={`text-3xl font-display font-bold ${winner === 'player' ? 'text-accent' : 'text-destructive'}`}>
              {winner === 'player' ? 'VICTORY' : 'DEFEAT'}
            </div>
            <div className="text-sm font-mono text-muted-foreground">
              {winner === 'player' ? '+ 20 ARENA CREDITED' : '- 10 ARENA LOST'}
            </div>
            <NeonButton variant="outline" onClick={resetBattle} className="mt-4">
              NEXT BATTLE
            </NeonButton>
          </div>
        )}
      </NeonCard>
    </div>
  );
}
