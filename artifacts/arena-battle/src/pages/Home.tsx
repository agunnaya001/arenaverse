import { Link } from "wouter";
import { motion } from "framer-motion";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonCard } from "@/components/ui/NeonCard";
import { useAccount } from "wagmi";
import { Swords, Zap, Shield, Hexagon } from "lucide-react";

export function Home() {
  const { isConnected } = useAccount();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden border border-primary/30 aspect-[16/9] md:aspect-[21/9] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
          alt="Cyberpunk Arena" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        
        <div className="relative z-20 text-center px-4">
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-display font-black text-white mb-4 text-shadow-neon-cyan"
          >
            ENTER THE <span className="text-primary">ARENA</span>
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-300 font-sans max-w-lg mx-auto mb-8"
          >
            Mint your cyber-fighter, stake ARENA tokens, and battle on Base Mainnet for ultimate glory.
          </motion.p>
          
          <motion.div variants={itemVariants}>
            {isConnected ? (
              <Link href="/battle" className="inline-block">
                <NeonButton className="px-8 py-4 text-lg">
                  FIGHT NOW
                </NeonButton>
              </Link>
            ) : (
              <div className="inline-block p-4 border border-dashed border-muted-foreground/50 text-muted-foreground bg-background/50 backdrop-blur-sm font-display tracking-widest text-sm">
                CONNECT WALLET TO PLAY
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NeonCard glowColor="primary">
          <Shield className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">MINT NFTs</h3>
          <p className="text-muted-foreground">Summon unique fighters with randomized stats. Choose between Warrior, Mage, or Rogue classes.</p>
        </NeonCard>
        
        <NeonCard glowColor="secondary">
          <Swords className="w-8 h-8 text-secondary mb-4" />
          <h3 className="text-xl font-bold mb-2">3D BATTLES</h3>
          <p className="text-muted-foreground">Watch your fighter clash in a fully simulated 3D WebGL arena rendered right in your browser.</p>
        </NeonCard>
        
        <NeonCard glowColor="accent">
          <Hexagon className="w-8 h-8 text-accent mb-4" />
          <h3 className="text-xl font-bold mb-2">EARN REWARDS</h3>
          <p className="text-muted-foreground">Stake 10 ARENA tokens per fight. Winner takes all. Climb the leaderboards and prove your worth.</p>
        </NeonCard>

        <NeonCard>
          <Zap className="w-8 h-8 text-white mb-4" />
          <h3 className="text-xl font-bold mb-2">BASE MAINNET</h3>
          <p className="text-muted-foreground">Powered by Base for lightning-fast, cheap transactions ensuring a seamless gaming experience.</p>
        </NeonCard>
      </motion.div>
    </motion.div>
  );
}
