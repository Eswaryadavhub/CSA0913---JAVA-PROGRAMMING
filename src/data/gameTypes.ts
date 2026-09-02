export enum CellType {
  WALKABLE = 0,     // Open terrain
  OBSTACLE = 1,     // Blocked rock/water/ruins
  TOWER_ZONE = 2,   // Prepared defensive bastion platform
  ENEMY_PATH = 3,   // Marked pathway
  BASE = 4,         // Player HQ Crystal (target to defend)
  SPAWN = 5,        // Enemy invasion rift (spawn point)
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum GameState {
  MENU = 'MENU',
  DIFFICULTY_SELECTION = 'DIFFICULTY_SELECTION',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  WAVE_COMPLETE = 'WAVE_COMPLETE',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
}

export enum TowerType {
  BASIC = 'BASIC',
  RAPID = 'RAPID',
  HEAVY = 'HEAVY',
}

export enum TargetingMode {
  FIRST = 'FIRST',       // Furthest along the path
  CLOSEST = 'CLOSEST',   // Closest Euclidean distance to tower
  LOWEST_HP = 'LOWEST_HP', // Lowest absolute health
  STRONGEST = 'STRONGEST', // Highest max health
}

export enum EnemyType {
  BASIC = 'BASIC',       // Balanced soldier
  FAST = 'FAST',         // Agile scout
  STRONG = 'STRONG',     // Armored juggernaut
}

export interface TowerStats {
  id: TowerType;
  name: string;
  cost: number;
  damage: number;
  range: number;        // in pixels
  fireRate: number;     // shots per second
  splashRadius: number; // 0 for single target, > 0 for area effect
  projectileSpeed: number;
  color: string;
  projectileColor: string;
  description: string;
  bulletType: 'bullet' | 'laser' | 'cannon';
  upgradeCosts: [number, number]; // Cost for Level 2, Level 3
  damageMultiplierPerLevel: number;
  rangeMultiplierPerLevel: number;
  fireRateMultiplierPerLevel: number;
}

export interface EnemyStats {
  id: EnemyType;
  name: string;
  maxHealth: number;
  speed: number;        // pixels per second
  reward: number;       // coins granted on kill
  damageToBase: number; // HP deducted from base
  size: number;         // radius in pixels
  color: string;
  glowColor: string;
  description: string;
}

export interface WaveEnemyGroup {
  type: EnemyType;
  count: number;
  intervalSeconds: number;
  delayBeforeGroup: number;
}

export interface WaveConfig {
  waveNumber: number;
  groups: WaveEnemyGroup[];
  completionBonus: number;
}

export interface DifficultyConfig {
  name: Difficulty;
  label: string;
  startingCoins: number;
  startingHealth: number;
  enemyHealthMultiplier: number;
  enemySpeedMultiplier: number;
  rewardMultiplier: number;
  description: string;
}

export interface GameStats {
  score: number;
  enemiesDefeated: number;
  towersBuilt: number;
  towersUpgraded: number;
  coinsEarned: number;
  coinsSpent: number;
  wavesCompleted: number;
  damageDealt: number;
  baseDamageReceived: number;
  durationSeconds: number;
}
