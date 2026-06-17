import { useState } from "react";
import { useAccount } from "wagmi";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { useMintFighter, usePlayerFighters, useFighterStats } from "@/hooks/use-game-contracts";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Eye, Star, CheckCircle2 } from "lucide-react";

const CLASS_DETAILS = [
  {
    id: 0,
    name: "Warrior",
    image: "warrior.png",
    color: "primary" as const,
    accent: "#00f0ff",
    icon: Shield,
    desc: "Iron-clad frontliner. High health, devastating melee strikes, and unbreakable defense.",
    statRanges: { atk: [70, 100], def: [50, 80], spd: [30, 55] },
    tag: "TANK",
  },
  {
    id: 1,
    name: "Mage",
    image: "mage.png",
    color: "secondary" as const,
    accent: "#ff00ff",
    icon: Zap,
    desc: "Glass cannon. Devastating arcane energy bursts with low defense but incredible attack.",
    statRanges: { atk: [90, 120], def: [20, 40], spd: [50, 70] },
    tag: "DPS",
  },
  {
    id: 2,
    name: "Rogue",
    image: "rogue.png",
    color: "accent" as const,
    accent: "#ffe600",
    icon: Eye,
    desc: "Speed demon. Critical strikes and evasion at lightning pace. Strike first, strike hard.",
    statRanges: { atk: [60, 90], def: [30, 50], spd: [80, 100] },
    tag: "SPEED",
  },
];

function StatBar({ label, min, max, color }: { label: string; min: number; max: number; color: string }) {
  const avg = (min + max) / 2;
  return (
    <div>
      <div className="flex justify-between text-[9px] font-mono mb-0.5">
        <span className="text-muted-foreground uppercase">{label}</span>
        <span style={{ color }}>{min}–{max}</span>
      </div>
      <div className="h-1.5 bg-white/10 overflow-hidden">
        <motion.div
          className="h-full"
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
          initial={{ width: 0 }}
          animate={{ width: `${avg}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function FighterCard({ tokenId, address }: { tokenId: bigint; address: string }) {
  const { data: stats } = useFighterStats(tokenId);
  const classNames = ['Warrior', 'Mage', 'Rogue'];
  const classColors = ['#00f0ff', '#ff00ff', '#ffe600'];

  const statsArr = stats as any;
  const className = statsArr ? classNames[Number(statsArr.class_) ?? statsArr[0]] : '—';
  const classColor = statsArr ? classColors[Number(statsArr.class_) ?? 0] : '#00f0ff';

  return (
    <div className="bg-card border border-white/10 hover:border-primary/40 p-3 transition-all flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center text-xl font-display font-bold border border-white/10"
           style={{ color: classColor, borderColor: `${classColor}33`, backgroundColor: `${classColor}11` }}>
        #{tokenId.toString()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-display font-bold" style={{ color: classColor }}>{className}</div>
        {statsArr ? (
          <div className="text-[9px] font-mono text-muted-foreground mt-0.5 space-x-2">
            <span>ATK {Number(statsArr.attack ?? statsArr[1])}</span>
            <span>DEF {Number(statsArr.defense ?? statsArr[2])}</span>
            <span>SPD {Number(statsArr.speed ?? statsArr[3])}</span>
            <span>LVL {Number(statsArr.level ?? statsArr[4])}</span>
          </div>
        ) : (
          <div className="text-[9px] text-muted-foreground animate-pulse">Loading stats...</div>
        )}
      </div>
      <div className="shrink-0">
        {statsArr && (
          <div className="text-[10px] font-mono text-accent">
            {Number(statsArr.wins ?? statsArr[5])}W / {Number(statsArr.losses ?? statsArr[6])}L
          </div>
        )}
      </div>
    </div>
  );
}

export function Mint() {
  const { address, isConnected } = useAccount();
  const [selectedClass, setSelectedClass] = useState<number>(0);
  const [justMinted, setJustMinted] = useState(false);
  const { mint, isPending, isConfirming, isSuccess } = useMintFighter();
  const { data: fighters, refetch: refetchFighters } = usePlayerFighters(address);
  const { toast } = useToast();

  const handleMint = async () => {
    if (!address) return;
    try {
      await mint(address, selectedClass);
      setJustMinted(true);
      toast({
        title: "Transaction Sent!",
        description: `Minting your ${CLASS_DETAILS[selectedClass].name}...`,
      });
      setTimeout(() => {
        refetchFighters();
        setJustMinted(false);
      }, 5000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Mint Failed",
        description: error.shortMessage || error.message || "Something went wrong",
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="text-6xl mb-4 opacity-40">🧬</div>
        <h2 className="text-2xl font-display font-bold text-primary mb-2">ACCESS DENIED</h2>
        <p className="text-muted-foreground text-sm">Connect your wallet to access the cloning vat.</p>
      </div>
    );
  }

  const selected = CLASS_DETAILS[selectedClass];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">CLONING VAT</h1>
        <p className="text-sm text-muted-foreground border-l-2 border-primary pl-4">
          Initialize a new combat shell. Stats are randomized upon manifestation.
        </p>
      </div>

      {/* Class Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CLASS_DETAILS.map((cls) => {
          const Icon = cls.icon;
          const isSelected = selectedClass === cls.id;
          return (
            <motion.div
              key={cls.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedClass(cls.id)}
              className="cursor-pointer"
            >
              <NeonCard
                glowColor={isSelected ? cls.color : 'none'}
                className={`h-full transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-55 hover:opacity-80'}`}
              >
                {/* Image */}
                <div className="aspect-[3/4] mb-4 bg-black/60 border border-white/10 overflow-hidden relative">
                  <img
                    src={`${import.meta.env.BASE_URL}images/${cls.image}`}
                    alt={cls.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {/* Class tag */}
                  <div
                    className="absolute top-2 right-2 text-[9px] font-display px-2 py-0.5 border"
                    style={{ color: cls.accent, borderColor: `${cls.accent}55`, backgroundColor: `${cls.accent}15` }}
                  >
                    {cls.tag}
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 border-2 animate-pulse" style={{ borderColor: cls.accent }} />
                  )}
                </div>

                {/* Name & Icon */}
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} style={{ color: cls.accent }} />
                  <h3 className="text-xl font-display font-bold" style={{ color: isSelected ? cls.accent : 'white' }}>
                    {cls.name}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{cls.desc}</p>

                {/* Stat Bars */}
                <div className="space-y-2">
                  <StatBar label="ATK" min={cls.statRanges.atk[0]} max={cls.statRanges.atk[1]} color={cls.accent} />
                  <StatBar label="DEF" min={cls.statRanges.def[0]} max={cls.statRanges.def[1]} color={cls.accent} />
                  <StatBar label="SPD" min={cls.statRanges.spd[0]} max={cls.statRanges.spd[1]} color={cls.accent} />
                </div>
              </NeonCard>
            </motion.div>
          );
        })}
      </div>

      {/* Mint Action */}
      <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <div className="text-sm font-display text-muted-foreground mb-1">SELECTED CLASS</div>
          <div className="text-xl font-bold font-display" style={{ color: selected.accent }}>
            {selected.name.toUpperCase()}
          </div>
          <div className="text-xs font-mono text-muted-foreground mt-1">COST: 0.01 ETH &nbsp;·&nbsp; Gas on Base</div>
        </div>

        <AnimatePresence mode="wait">
          {justMinted ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 text-accent font-display font-bold"
            >
              <CheckCircle2 size={20} className="text-accent" />
              FIGHTER INITIALIZING...
            </motion.div>
          ) : (
            <motion.div key="mint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <NeonButton
                onClick={handleMint}
                isLoading={isPending || isConfirming}
                className="min-w-[180px]"
              >
                <Star size={14} className="mr-2" />
                INITIALIZE CLONE
              </NeonButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fighter Roster */}
      {fighters && (fighters as bigint[]).length > 0 && (
        <div className="pt-4">
          <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            YOUR ROSTER
            <span className="text-xs font-mono text-muted-foreground">({(fighters as bigint[]).length} fighter{(fighters as bigint[]).length !== 1 ? 's' : ''})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(fighters as bigint[]).map((id) => (
              <FighterCard key={id.toString()} tokenId={id} address={address!} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
