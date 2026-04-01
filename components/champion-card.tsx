'use client';

import { useState } from 'react';
import { 
  Sword, 
  Zap, 
  Brain, 
  Heart, 
  TrendingUp,
  Lock,
  MoreVertical,
  ShoppingCart,
  Swords
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Champion } from '@/hooks/use-game-state';

interface ChampionCardProps {
  champion: Champion;
  showActions?: boolean;
  onSelect?: () => void;
  onBattle?: () => void;
  onList?: () => void;
  onUpgrade?: () => void;
  selected?: boolean;
  price?: string;
  compact?: boolean;
}

const rarityColors = {
  Common: 'from-slate-500 to-slate-600',
  Rare: 'from-blue-500 to-blue-600',
  Epic: 'from-purple-500 to-purple-600',
  Legendary: 'from-amber-500 to-orange-600',
};

const rarityBorderColors = {
  Common: 'border-slate-500/30',
  Rare: 'border-blue-500/30',
  Epic: 'border-purple-500/30',
  Legendary: 'border-amber-500/30',
};

const rarityGlowColors = {
  Common: '',
  Rare: 'shadow-blue-500/20',
  Epic: 'shadow-purple-500/20',
  Legendary: 'shadow-amber-500/30',
};

const classIcons = {
  Warrior: Sword,
  Mage: Brain,
  Rogue: Zap,
  Paladin: Heart,
};

export function ChampionCard({
  champion,
  showActions = true,
  onSelect,
  onBattle,
  onList,
  onUpgrade,
  selected = false,
  price,
  compact = false,
}: ChampionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ClassIcon = classIcons[champion.class];
  const totalPower = champion.stats.strength + champion.stats.agility + champion.stats.intelligence + champion.stats.vitality;

  if (compact) {
    return (
      <div
        className={cn(
          'relative group rounded-lg border bg-card overflow-hidden transition-all duration-300 cursor-pointer',
          rarityBorderColors[champion.rarity],
          selected && 'ring-2 ring-primary',
          champion.rarity !== 'Common' && `shadow-lg ${rarityGlowColors[champion.rarity]}`
        )}
        onClick={onSelect}
      >
        <div className="flex items-center gap-3 p-3">
          {/* Mini Avatar */}
          <div className={cn(
            'w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0',
            rarityColors[champion.rarity]
          )}>
            <ClassIcon className="w-6 h-6 text-white" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{champion.name}</h3>
              <Badge variant="outline" className="text-xs">
                Lv.{champion.level}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="secondary" 
                className={cn(
                  'text-xs',
                  champion.rarity === 'Legendary' && 'bg-amber-500/20 text-amber-400',
                  champion.rarity === 'Epic' && 'bg-purple-500/20 text-purple-400',
                  champion.rarity === 'Rare' && 'bg-blue-500/20 text-blue-400'
                )}
              >
                {champion.rarity}
              </Badge>
              <span className="text-xs text-muted-foreground">{champion.class}</span>
            </div>
          </div>

          {/* Power */}
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Power</div>
            <div className="font-bold text-primary">{totalPower}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative group rounded-xl border bg-card overflow-hidden transition-all duration-300',
        rarityBorderColors[champion.rarity],
        selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        champion.rarity !== 'Common' && `shadow-lg hover:shadow-xl ${rarityGlowColors[champion.rarity]}`,
        onSelect && 'cursor-pointer'
      )}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Staked Badge */}
      {champion.isStaked && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="secondary\" className="bg-primary/20 text-primary gap-1">
            <Lock className="w-3 h-3" />
            Staked
          </Badge>
        </div>
      )}

      {/* Actions Menu */}
      {showActions && (
        <div className="absolute top-3 right-3 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onBattle && !champion.isStaked && (
                <DropdownMenuItem onClick={onBattle}>
                  <Swords className="w-4 h-4 mr-2" />
                  Send to Battle
                </DropdownMenuItem>
              )}
              {onList && !champion.isStaked && (
                <DropdownMenuItem onClick={onList}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  List for Sale
                </DropdownMenuItem>
              )}
              {onUpgrade && (
                <DropdownMenuItem onClick={onUpgrade}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Upgrade
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Champion Image/Avatar */}
      <div className={cn(
        'relative aspect-square bg-gradient-to-br flex items-center justify-center',
        rarityColors[champion.rarity]
      )}>
        <ClassIcon className={cn(
          'w-20 h-20 text-white/80 transition-transform duration-300',
          isHovered && 'scale-110'
        )} />
        
        {/* Level Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-background/90 text-foreground font-bold">
            Level {champion.level}
          </Badge>
        </div>

        {/* Rarity Badge */}
        <div className="absolute bottom-3 right-3">
          <Badge 
            className={cn(
              'font-bold',
              champion.rarity === 'Legendary' && 'bg-amber-500 text-black',
              champion.rarity === 'Epic' && 'bg-purple-500 text-white',
              champion.rarity === 'Rare' && 'bg-blue-500 text-white',
              champion.rarity === 'Common' && 'bg-slate-500 text-white'
            )}
          >
            {champion.rarity}
          </Badge>
        </div>
      </div>

      {/* Champion Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg truncate">{champion.name}</h3>
          <Badge variant="outline">{champion.class}</Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <StatBar icon={Sword} label="STR" value={champion.stats.strength} max={50} color="text-red-400" />
          <StatBar icon={Zap} label="AGI" value={champion.stats.agility} max={50} color="text-yellow-400" />
          <StatBar icon={Brain} label="INT" value={champion.stats.intelligence} max={50} color="text-blue-400" />
          <StatBar icon={Heart} label="VIT" value={champion.stats.vitality} max={50} color="text-green-400" />
        </div>

        {/* Total Power */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-sm text-muted-foreground">Total Power</span>
          <span className="font-bold text-primary text-lg">{totalPower}</span>
        </div>

        {/* Price (if listing) */}
        {price && (
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-bold text-lg">{price} ETH</span>
          </div>
        )}

        {/* Experience Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Experience</span>
            <span>{champion.experience.toLocaleString()} XP</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(champion.experience % 1000) / 10}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBar({ 
  icon: Icon, 
  label, 
  value, 
  max, 
  color 
}: { 
  icon: typeof Sword; 
  label: string; 
  value: number; 
  max: number; 
  color: string;
}) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="flex items-center gap-2">
      <Icon className={cn('w-3.5 h-3.5', color)} />
      <div className="flex-1">
        <div className="flex items-center justify-between text-xs mb-0.5">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">{value}</span>
        </div>
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div 
            className={cn('h-full rounded-full transition-all', color.replace('text-', 'bg-'))}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
