export interface BattleState {
  playerChampion: Champion;
  enemyChampion: Champion;
  playerHealth: number;
  enemyHealth: number;
  playerMana: number;
  enemyMana: number;
  turn: number;
  isPlayerTurn: boolean;
  battleLog: BattleAction[];
  battleOver: boolean;
  winner?: 'player' | 'enemy';
}

export interface Champion {
  id: string;
  name: string;
  class: string;
  level: number;
  health: number;
  mana: number;
  attack: number;
  defense: number;
  speed: number;
  currentHealth?: number;
  currentMana?: number;
}

export interface BattleAction {
  turn: number;
  actor: 'player' | 'enemy';
  action: string;
  damage?: number;
  healing?: number;
  message: string;
}

export interface Skill {
  id: string;
  name: string;
  manaCost: number;
  baseDamage: number;
  healAmount?: number;
  cooldown: number;
  description: string;
  type: 'attack' | 'heal' | 'buff' | 'debuff';
}

// Default skills for each class
const SKILLS_BY_CLASS: Record<string, Skill[]> = {
  Warrior: [
    {
      id: 'slash',
      name: 'Slash',
      manaCost: 0,
      baseDamage: 15,
      cooldown: 1,
      description: 'Basic melee attack',
      type: 'attack',
    },
    {
      id: 'power_slash',
      name: 'Power Slash',
      manaCost: 30,
      baseDamage: 45,
      cooldown: 2,
      description: 'Powerful slash dealing heavy damage',
      type: 'attack',
    },
    {
      id: 'shield_bash',
      name: 'Shield Bash',
      manaCost: 25,
      baseDamage: 20,
      cooldown: 2,
      description: 'Bash enemy with shield',
      type: 'attack',
    },
    {
      id: 'shield_ward',
      name: 'Shield Ward',
      manaCost: 40,
      baseDamage: 0,
      cooldown: 3,
      description: 'Reduce incoming damage by 30% for 2 turns',
      type: 'buff',
    },
  ],
  Mage: [
    {
      id: 'fireball',
      name: 'Fireball',
      manaCost: 25,
      baseDamage: 35,
      cooldown: 1,
      description: 'Cast a fireball at the enemy',
      type: 'attack',
    },
    {
      id: 'frost_bolt',
      name: 'Frost Bolt',
      manaCost: 20,
      baseDamage: 25,
      cooldown: 1,
      description: 'Slow enemy attack speed by 20%',
      type: 'debuff',
    },
    {
      id: 'arcane_missile',
      name: 'Arcane Missile',
      manaCost: 30,
      baseDamage: 50,
      cooldown: 3,
      description: 'Unleash arcane missiles',
      type: 'attack',
    },
    {
      id: 'mana_shield',
      name: 'Mana Shield',
      manaCost: 50,
      baseDamage: 0,
      cooldown: 4,
      description: 'Convert mana to temporary shield',
      type: 'buff',
    },
  ],
  Archer: [
    {
      id: 'shot',
      name: 'Arrow Shot',
      manaCost: 0,
      baseDamage: 18,
      cooldown: 1,
      description: 'Quick arrow shot',
      type: 'attack',
    },
    {
      id: 'charged_shot',
      name: 'Charged Shot',
      manaCost: 35,
      baseDamage: 60,
      cooldown: 3,
      description: 'Powerful charged arrow',
      type: 'attack',
    },
    {
      id: 'evasion',
      name: 'Evasion',
      manaCost: 20,
      baseDamage: 0,
      cooldown: 2,
      description: 'Dodge next attack',
      type: 'buff',
    },
    {
      id: 'volley',
      name: 'Arrow Volley',
      manaCost: 40,
      baseDamage: 40,
      cooldown: 2,
      description: 'Fire multiple arrows',
      type: 'attack',
    },
  ],
  Paladin: [
    {
      id: 'holy_strike',
      name: 'Holy Strike',
      manaCost: 20,
      baseDamage: 25,
      cooldown: 1,
      description: 'Holy melee attack',
      type: 'attack',
    },
    {
      id: 'divine_shield',
      name: 'Divine Shield',
      manaCost: 45,
      baseDamage: 0,
      cooldown: 3,
      description: 'Reduce damage taken by 40%',
      type: 'buff',
    },
    {
      id: 'heal',
      name: 'Healing Light',
      manaCost: 35,
      baseDamage: 0,
      healAmount: 40,
      cooldown: 2,
      description: 'Heal yourself',
      type: 'heal',
    },
    {
      id: 'consecration',
      name: 'Consecration',
      manaCost: 50,
      baseDamage: 30,
      cooldown: 3,
      description: 'Holy attack with protection',
      type: 'attack',
    },
  ],
};

export class BattleEngine {
  private state: BattleState;
  private skillCooldowns: Map<string, number> = new Map();

  constructor(playerChampion: Champion, enemyChampion: Champion) {
    // Generate AI enemy if not provided
    const enemy = enemyChampion || this.generateAIEnemy(playerChampion.level);

    this.state = {
      playerChampion,
      enemyChampion: enemy,
      playerHealth: playerChampion.health,
      enemyHealth: enemy.health,
      playerMana: playerChampion.mana,
      enemyMana: enemy.mana,
      turn: 1,
      isPlayerTurn: playerChampion.speed >= enemy.speed,
      battleLog: [],
      battleOver: false,
    };

    this.initializeCooldowns();
  }

  private initializeCooldowns() {
    const skills = SKILLS_BY_CLASS[this.state.playerChampion.class] || [];
    skills.forEach((skill) => {
      this.skillCooldowns.set(`player_${skill.id}`, 0);
      this.skillCooldowns.set(`enemy_${skill.id}`, 0);
    });
  }

  private generateAIEnemy(playerLevel: number): Champion {
    const classes = ['Warrior', 'Mage', 'Archer', 'Paladin'];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    const level = Math.max(1, playerLevel + Math.floor(Math.random() * 3) - 1);

    const baseStats: Record<string, any> = {
      Warrior: { health: 150, attack: 120, defense: 100, speed: 60 },
      Mage: { health: 100, attack: 160, defense: 60, speed: 80 },
      Archer: { health: 110, attack: 130, defense: 70, speed: 120 },
      Paladin: { health: 160, attack: 100, defense: 140, speed: 50 },
    };

    const stats = baseStats[randomClass];
    const multiplier = level / 10;

    return {
      id: `ai_${Date.now()}`,
      name: `${randomClass} Opponent`,
      class: randomClass,
      level,
      health: Math.round(stats.health * (1 + multiplier)),
      mana: 150,
      attack: Math.round(stats.attack * (1 + multiplier)),
      defense: Math.round(stats.defense * (1 + multiplier)),
      speed: stats.speed,
    };
  }

  getState(): BattleState {
    return { ...this.state };
  }

  getAvailableSkills(isPlayer: boolean): Skill[] {
    const champion = isPlayer
      ? this.state.playerChampion
      : this.state.enemyChampion;
    const skills = SKILLS_BY_CLASS[champion.class] || [];

    return skills.filter((skill) => {
      const cooldownKey = `${isPlayer ? 'player' : 'enemy'}_${skill.id}`;
      const currentCooldown = this.skillCooldowns.get(cooldownKey) || 0;
      return currentCooldown === 0;
    });
  }

  executeAction(isPlayer: boolean, skillId: string): BattleAction | null {
    if (this.state.battleOver) return null;

    const actor = isPlayer ? 'player' : 'enemy';
    const skills = SKILLS_BY_CLASS[
      isPlayer ? this.state.playerChampion.class : this.state.enemyChampion.class
    ] || [];
    const skill = skills.find((s) => s.id === skillId);

    if (!skill) return null;

    const cooldownKey = `${actor}_${skillId}`;
    const currentCooldown = this.skillCooldowns.get(cooldownKey) || 0;
    if (currentCooldown > 0) return null;

    const mana = isPlayer ? this.state.playerMana : this.state.enemyMana;
    if (mana < skill.manaCost) {
      return {
        turn: this.state.turn,
        actor,
        action: skill.name,
        message: `${isPlayer ? 'You' : 'Enemy'} not enough mana!`,
      };
    }

    // Deduct mana
    if (isPlayer) {
      this.state.playerMana = Math.max(0, this.state.playerMana - skill.manaCost);
    } else {
      this.state.enemyMana = Math.max(0, this.state.enemyMana - skill.manaCost);
    }

    // Set cooldown
    this.skillCooldowns.set(cooldownKey, skill.cooldown);

    let action: BattleAction = {
      turn: this.state.turn,
      actor,
      action: skill.name,
      message: '',
    };

    // Calculate damage/healing
    if (skill.type === 'attack' || skill.type === 'debuff') {
      const damage = this.calculateDamage(isPlayer, skill);
      action.damage = damage;

      if (isPlayer) {
        this.state.enemyHealth = Math.max(0, this.state.enemyHealth - damage);
        action.message = `${action.action} hits for ${damage} damage!`;
      } else {
        this.state.playerHealth = Math.max(0, this.state.playerHealth - damage);
        action.message = `Enemy ${action.action} hits for ${damage} damage!`;
      }
    } else if (skill.type === 'heal') {
      const heal = skill.healAmount || 30;
      action.healing = heal;

      if (isPlayer) {
        this.state.playerHealth = Math.min(
          this.state.playerChampion.health,
          this.state.playerHealth + heal
        );
        action.message = `You heal for ${heal} HP!`;
      } else {
        this.state.enemyHealth = Math.min(
          this.state.enemyChampion.health,
          this.state.enemyHealth + heal
        );
        action.message = `Enemy heals for ${heal} HP!`;
      }
    } else if (skill.type === 'buff') {
      action.message = `${isPlayer ? 'You' : 'Enemy'} use ${action.action}!`;
    }

    this.state.battleLog.push(action);

    // Check win conditions
    if (this.state.enemyHealth <= 0) {
      this.state.battleOver = true;
      this.state.winner = 'player';
    } else if (this.state.playerHealth <= 0) {
      this.state.battleOver = true;
      this.state.winner = 'enemy';
    } else {
      // Switch turn
      this.state.isPlayerTurn = !this.state.isPlayerTurn;
      if (!this.state.isPlayerTurn) {
        this.state.turn++;
      }

      // Decrease cooldowns
      this.skillCooldowns.forEach((cooldown, key) => {
        if (cooldown > 0) {
          this.skillCooldowns.set(key, cooldown - 1);
        }
      });
    }

    return action;
  }

  private calculateDamage(isPlayer: boolean, skill: Skill): number {
    const attacker = isPlayer
      ? this.state.playerChampion
      : this.state.enemyChampion;
    const defender = isPlayer
      ? this.state.enemyChampion
      : this.state.playerChampion;

    const baseDamage = skill.baseDamage + attacker.attack / 10;
    const defense = defender.defense / 10;
    const damage = Math.round(baseDamage - defense + Math.random() * 10);

    return Math.max(1, damage);
  }

  executeAITurn(): BattleAction | null {
    if (!this.state.isPlayerTurn && !this.state.battleOver) {
      const availableSkills = this.getAvailableSkills(false);
      if (availableSkills.length === 0) return null;

      const randomSkill = availableSkills[
        Math.floor(Math.random() * availableSkills.length)
      ];

      return this.executeAction(false, randomSkill.id);
    }

    return null;
  }
}
