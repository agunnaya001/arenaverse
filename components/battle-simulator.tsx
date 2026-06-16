'use client';

import React, { useState, useEffect } from 'react';
import { BattleEngine, BattleState, BattleAction, Skill } from '@/lib/game/battle-engine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Scroll, Zap, Heart, Sword, Shield } from 'lucide-react';

interface BattleSimulatorProps {
  playerChampion: any;
  onBattleEnd?: (result: { won: boolean; xpEarned: number }) => void;
}

export function BattleSimulator({ playerChampion, onBattleEnd }: BattleSimulatorProps) {
  const [battleEngine, setBattleEngine] = useState<BattleEngine | null>(null);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [battleLog, setBattleLog] = useState<BattleAction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize battle
    const engine = new BattleEngine(playerChampion, null);
    setBattleEngine(engine);
    setBattleState(engine.getState());
    setAvailableSkills(engine.getAvailableSkills(true));
  }, [playerChampion]);

  const handlePlayerAction = async (skillId: string) => {
    if (!battleEngine || !battleState) return;

    setLoading(true);

    // Player action
    const playerAction = battleEngine.executeAction(true, skillId);
    if (playerAction) {
      setBattleLog((prev) => [...prev, playerAction]);
    }

    let updatedState = battleEngine.getState();

    // Check if battle is over
    if (!updatedState.battleOver) {
      // Small delay for AI
      await new Promise((r) => setTimeout(r, 800));

      // Enemy action
      const enemyAction = battleEngine.executeAITurn();
      if (enemyAction) {
        setBattleLog((prev) => [...prev, enemyAction]);
      }

      updatedState = battleEngine.getState();
    }

    setBattleState(updatedState);
    setAvailableSkills(battleEngine.getAvailableSkills(true));

    // Check if battle is over
    if (updatedState.battleOver && onBattleEnd) {
      const xpEarned =
        (updatedState.winner === 'player' ? 100 : 25) *
        (updatedState.enemyChampion.level || 1);
      onBattleEnd({
        won: updatedState.winner === 'player',
        xpEarned,
      });
    }

    setLoading(false);
  };

  if (!battleState) return null;

  const playerHealthPercent = (battleState.playerHealth / battleState.playerChampion.health) * 100;
  const enemyHealthPercent = (battleState.enemyHealth / battleState.enemyChampion.health) * 100;
  const playerManaPercent = (battleState.playerMana / battleState.playerChampion.mana) * 100;
  const enemyManaPercent = (battleState.enemyMana / battleState.enemyChampion.mana) * 100;

  return (
    <div className="space-y-6">
      {/* Battle Arena */}
      <Card className="border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Battle Arena - Turn {battleState.turn}</span>
            {battleState.isPlayerTurn && !battleState.battleOver && (
              <Badge className="bg-primary">Your Turn</Badge>
            )}
            {!battleState.isPlayerTurn && !battleState.battleOver && (
              <Badge variant="outline">Enemy Turn</Badge>
            )}
            {battleState.battleOver && (
              <Badge
                className={
                  battleState.winner === 'player'
                    ? 'bg-emerald-500'
                    : 'bg-destructive'
                }
              >
                {battleState.winner === 'player' ? 'Victory!' : 'Defeat'}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Combatants */}
          <div className="grid grid-cols-2 gap-8">
            {/* Player */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">
                  {battleState.playerChampion.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Lvl {battleState.playerChampion.level} {battleState.playerChampion.class}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    HP
                  </span>
                  <span>
                    {Math.max(0, Math.round(battleState.playerHealth))}/
                    {battleState.playerChampion.health}
                  </span>
                </div>
                <Progress
                  value={Math.max(0, playerHealthPercent)}
                  className="h-3 bg-destructive/20"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    Mana
                  </span>
                  <span>
                    {Math.round(battleState.playerMana)}/
                    {battleState.playerChampion.mana}
                  </span>
                </div>
                <Progress
                  value={Math.max(0, playerManaPercent)}
                  className="h-3 bg-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 rounded bg-background border border-border/50">
                  <span className="text-muted-foreground">ATK</span>
                  <p className="font-bold">{battleState.playerChampion.attack}</p>
                </div>
                <div className="p-2 rounded bg-background border border-border/50">
                  <span className="text-muted-foreground">DEF</span>
                  <p className="font-bold">{battleState.playerChampion.defense}</p>
                </div>
              </div>
            </div>

            {/* Enemy */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">
                  {battleState.enemyChampion.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Lvl {battleState.enemyChampion.level} {battleState.enemyChampion.class}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    HP
                  </span>
                  <span>
                    {Math.max(0, Math.round(battleState.enemyHealth))}/
                    {battleState.enemyChampion.health}
                  </span>
                </div>
                <Progress
                  value={Math.max(0, enemyHealthPercent)}
                  className="h-3 bg-destructive/20"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    Mana
                  </span>
                  <span>
                    {Math.round(battleState.enemyMana)}/
                    {battleState.enemyChampion.mana}
                  </span>
                </div>
                <Progress
                  value={Math.max(0, enemyManaPercent)}
                  className="h-3 bg-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 rounded bg-background border border-border/50">
                  <span className="text-muted-foreground">ATK</span>
                  <p className="font-bold">{battleState.enemyChampion.attack}</p>
                </div>
                <div className="p-2 rounded bg-background border border-border/50">
                  <span className="text-muted-foreground">DEF</span>
                  <p className="font-bold">{battleState.enemyChampion.defense}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!battleState.battleOver && battleState.isPlayerTurn && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Select an action:</p>
              <div className="grid grid-cols-2 gap-3">
                {availableSkills.map((skill) => (
                  <Button
                    key={skill.id}
                    onClick={() => handlePlayerAction(skill.id)}
                    disabled={loading}
                    variant="outline"
                    className="text-left h-auto py-3 px-4"
                  >
                    <div className="flex flex-col gap-1 text-start">
                      <span className="font-semibold">{skill.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Cost: {skill.manaCost} Mana
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {!battleState.battleOver && !battleState.isPlayerTurn && (
            <div className="text-center">
              <p className="text-muted-foreground">Enemy is taking their turn...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Battle Log */}
      <Card className="border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scroll className="w-5 h-5" />
            Battle Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {battleLog.length === 0 ? (
              <p className="text-sm text-muted-foreground">Battle started...</p>
            ) : (
              battleLog.map((action, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded text-sm ${
                    action.actor === 'player'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  <span className="font-semibold">
                    {action.actor === 'player' ? 'You' : 'Enemy'}
                  </span>{' '}
                  - {action.message}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
