import { Difficulty, DifficultyConfig } from './gameTypes';

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.EASY]: {
    name: Difficulty.EASY,
    label: 'Cadet (Easy)',
    startingCoins: 400,
    startingHealth: 100,
    enemyHealthMultiplier: 0.8,
    enemySpeedMultiplier: 0.88,
    rewardMultiplier: 1.25,
    description: 'Generous resources and weaker enemies. Recommended for learning mechanics and exploring A* paths.',
  },
  [Difficulty.MEDIUM]: {
    name: Difficulty.MEDIUM,
    label: 'Commander (Medium)',
    startingCoins: 300,
    startingHealth: 100,
    enemyHealthMultiplier: 1.0,
    enemySpeedMultiplier: 1.0,
    rewardMultiplier: 1.0,
    description: 'The standard balanced capstone specification. Requires tactical positioning and planned upgrades.',
  },
  [Difficulty.HARD]: {
    name: Difficulty.HARD,
    label: 'Veteran (Hard)',
    startingCoins: 220,
    startingHealth: 100,
    enemyHealthMultiplier: 1.35,
    enemySpeedMultiplier: 1.15,
    rewardMultiplier: 0.9,
    description: 'Relentless onslaught with reduced funds, fortified creep armor, and aggressive wave progression.',
  },
};
