import { Link } from "wouter";
import { motion } from "framer-motion";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonCard } from "@/components/ui/NeonCard";
import { useAccount } from "wagmi";
import { useArenaBalance, usePlayerFighters } from "@/hooks/use-game-contracts";
import { Swords, Zap, Shield, Cpu, ChevronRight, Coins } from "lucide-react";
import { formatEther } from "viem";

const FEATURES = [
  {
    icon: Shield,
    title: "MINT NFTs",
    color: "primary" as const,
    desc: "Summon unique fighters with randomized stats. Choose Warrior, Mage, or Rogue.",
    href: "/mint",
  },
  {
    icon: Swords,
    title: "3D BATTLES",
    color: "secondary" as const,
    desc: "Watch your fighter clash in a fully simulated 3D WebGL arena rendered in your browser.",
    href: "/battle",
  },
  {
    icon: Coins,
    title: "EARN REWARDS",
    color: "accent" as const,
    desc: "Stake 10 ARENA per fight. Winner takes 20 ARENA. Climb the global leaderboard.",
    href: "/leaderboard",
  },
  {
    icon: Cpu,
    title: "BASE MAINNET",
    color: "none" as const,
    desc: "Powered by Base L2 for lightning-fast, near-zero gas transactions.",
    href: "/profile",
  },
];

const CONTRACT_LINKS = [
  { label: "ArenaToken", addr: "0x3b855F88CB93aA642EaEB13F59987C552Fc614b5" },
  { label: "FighterNFT", addr: "0x68f08b005b09B0F7D07E1c0B5CDe18E43CE2486A" },
  { label: "ArenaBattle", addr: "0xF6fc2B6a306B626548ca9dF25B31a22D0f8971CF" },
];

export function Home() {
  const { isConnected, address } = useAccount();
  const { data: tokenBalance } = useArenaBalance(address);
  const { data: fighters } = usePlayerFighters(address);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  } as const;
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 120 } },
  } as const;

  const fighterCount = fighters ? (fighters as bigint[]).length : 0;
  const balanceStr = tokenBalance !== undefined
    ? Number(formatEther(tokenBalance as bigint)).toFixed(2)
    : null;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">

      {/* Hero */}
      <motion.div variants={itemVariants} className="relative rounded-xl overflow-hidden border border-primary/30 aspect-[16/7] md:aspect-[21/8] flex items-center justify-center shadow-[0_0_60px_rgba(0,240,255,0.08)]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80 z-10" />
        <img
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="Cyberpunk Arena"
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />

        <div className="relative z-20 text-center px-4">
          <motion.div variants={itemVariants} className="text-xs font-mono text-primary/80 tracking-[0.4em] mb-4 uppercase">
            Base Mainnet · Blockchain Battle Game
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-7xl font-display font-black text-white mb-4 text-shadow-neon-cyan leading-none"
          >
            ENTER THE <span className="text-primary">ARENA</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-base md:text-lg text-gray-300 max-w-lg mx-auto mb-8 font-sans">
            Mint your cyber-fighter, stake ARENA tokens, and battle on Base Mainnet for ultimate glory.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 justify-center">
            {isConnected ? (
              <>
                <Link href="/battle">
                  <NeonButton className="px-8 py-3 text-base">
                    <Swords size={16} className="mr-2" /> FIGHT NOW
                  </NeonButton>
                </Link>
                <Link href="/mint">
                  <NeonButton variant="outline" className="px-6 py-3 text-base">
                    MINT FIGHTER
                  </NeonButton>
                </Link>
              </>
            ) : (
              <div className="p-4 border border-dashed border-muted-foreground/40 text-muted-foreground bg-background/50 backdrop-blur-sm font-display tracking-widest text-sm">
                CONNECT WALLET TO PLAY
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Stats (when connected) */}
      {isConnected && (
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          <div className="bg-card/50 border border-primary/20 p-4 flex items-center gap-3">
            <Zap size={20} className="text-primary shrink-0" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Arena Balance</div>
              <div className="text-base font-bold font-mono text-primary">{balanceStr ?? '—'} ARENA</div>
            </div>
          </div>
          <div className="bg-card/50 border border-secondary/20 p-4 flex items-center gap-3">
            <Shield size={20} className="text-secondary shrink-0" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Your Fighters</div>
              <div className="text-base font-bold font-mono text-secondary">{fighterCount} NFT{fighterCount !== 1 ? 's' : ''}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Features Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <motion.div key={f.title} variants={itemVariants}>
              <Link href={f.href}>
                <NeonCard glowColor={f.color} className="h-full cursor-pointer hover:scale-[1.01] transition-transform group">
                  <div className="flex items-start justify-between">
                    <Icon className={`w-7 h-7 mb-3 ${
                      f.color === 'primary' ? 'text-primary' :
                      f.color === 'secondary' ? 'text-secondary' :
                      f.color === 'accent' ? 'text-accent' : 'text-white'
                    }`} />
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white/60 transition-colors mt-1" />
                  </div>
                  <h3 className="text-lg font-display font-bold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </NeonCard>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Contract Addresses */}
      <motion.div variants={itemVariants} className="border-t border-white/5 pt-6">
        <div className="text-[10px] font-display text-muted-foreground tracking-widest mb-3">DEPLOYED CONTRACTS · BASE MAINNET</div>
        <div className="space-y-2">
          {CONTRACT_LINKS.map(({ label, addr }) => (
            <div key={addr} className="flex items-center justify-between text-xs font-mono bg-black/30 border border-white/5 px-3 py-2 hover:border-primary/30 transition-colors">
              <span className="text-muted-foreground">{label}</span>
              <a
                href={`https://basescan.org/address/${addr}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/70 hover:text-primary transition-colors flex items-center gap-1"
              >
                {addr.slice(0, 10)}...{addr.slice(-6)}
                <Zap size={10} />
              </a>
            </div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
