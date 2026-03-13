import { useState } from "react";
import { useAccount } from "wagmi";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { useMintFighter, usePlayerFighters } from "@/hooks/use-game-contracts";
import { FIGHTER_CLASSES } from "@/lib/contracts";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const CLASS_DETAILS = [
  { id: 0, name: "Warrior", image: "warrior.png", color: "primary", desc: "High Health, Heavy Attacks", stats: "ATK: 70-100 | DEF: 50-80" },
  { id: 1, name: "Mage", image: "mage.png", color: "secondary", desc: "Glass Cannon, Energy Blasts", stats: "ATK: 90-120 | DEF: 20-40" },
  { id: 2, name: "Rogue", image: "rogue.png", color: "accent", desc: "High Speed, Critical Strikes", stats: "ATK: 60-90 | SPD: 80-100" },
];

export function Mint() {
  const { address, isConnected } = useAccount();
  const [selectedClass, setSelectedClass] = useState<number>(0);
  const { mint, isPending, isConfirming } = useMintFighter();
  const { data: fighters } = usePlayerFighters(address);
  const { toast } = useToast();

  const handleMint = async () => {
    if (!address) return;
    try {
      await mint(address, selectedClass);
      toast({
        title: "Transaction Sent",
        description: "Minting your new fighter...",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Mint Failed",
        description: error.message || "Something went wrong",
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-display font-bold text-primary mb-4">ACCESS DENIED</h2>
        <p className="text-muted-foreground">You must connect your wallet to access the cloning vat.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">CLONING VAT</h1>
        <p className="text-muted-foreground border-l-2 border-primary pl-4">Initialize a new combat shell. Stats are randomized upon manifestation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CLASS_DETAILS.map((cls) => (
          <motion.div 
            key={cls.id}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedClass(cls.id)}
            className="cursor-pointer"
          >
            <NeonCard 
              glowColor={selectedClass === cls.id ? (cls.color as any) : 'none'}
              className={`h-full transition-all ${selectedClass === cls.id ? 'opacity-100 scale-[1.02]' : 'opacity-60 hover:opacity-80'}`}
            >
              <div className="aspect-square mb-4 bg-background/50 border border-white/10 overflow-hidden relative">
                <img 
                  src={`${import.meta.env.BASE_URL}images/${cls.image}`} 
                  alt={cls.name}
                  className="w-full h-full object-cover mix-blend-screen"
                />
                {selectedClass === cls.id && (
                  <div className="absolute inset-0 border-2 border-current animate-pulse" />
                )}
              </div>
              <h3 className="text-2xl font-display font-bold uppercase">{cls.name}</h3>
              <p className="text-xs text-muted-foreground mt-2">{cls.desc}</p>
              <div className="mt-4 font-mono text-[10px] text-primary/70">{cls.stats}</div>
            </NeonCard>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-8 border-t border-white/10">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-4 font-mono">COST: 0.01 ETH</div>
          <NeonButton 
            onClick={handleMint}
            isLoading={isPending || isConfirming}
            className="w-full md:w-64"
          >
            INITIALIZE CLONE
          </NeonButton>
        </div>
      </div>

      {fighters && fighters.length > 0 && (
        <div className="pt-12">
          <h2 className="text-xl font-display font-bold mb-4">YOUR ROSTER</h2>
          <div className="flex flex-wrap gap-4">
            {fighters.map((id, idx) => (
              <div key={idx} className="bg-card border border-white/10 p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 flex items-center justify-center font-display font-bold text-primary">
                  #{id.toString()}
                </div>
                <div>
                  <div className="text-sm font-bold">FIGHTER UNIT</div>
                  <div className="text-[10px] text-muted-foreground">READY FOR COMBAT</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
