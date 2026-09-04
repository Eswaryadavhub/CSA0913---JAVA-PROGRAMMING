import { EnemyStats, EnemyType } from './gameTypes';

export const ENEMIES_CONFIG: Record<EnemyType, EnemyStats> = {
  [EnemyType.BASIC]: {
    id: EnemyType.BASIC,
    name: 'Cyber Infantry',
    maxHealth: 100,
    speed: 55, // pixels per second
    reward: 20,
    damageToBase: 10,
    size: 14,
    color: '#ec4899', // Pinkish magenta
    glowColor: '#f43f5e',
    description: 'Standard cybernetic soldier with balanced hull strength and steady speed.',
  },
  [EnemyType.FAST]: {
    id: EnemyType.FAST,
    name: 'Stealth Speeder',
    maxHealth: 55,
    speed: 92, // fast runner
    reward: 25,
    damageToBase: 8,
    size: 11,
    color: '#d97706', // Tactical Amber
    glowColor: '#f59e0b',
    description: 'Lightweight reconnaissance drone capable of dashing past slow defenses.',
  },
  [EnemyType.STRONG]: {
    id: EnemyType.STRONG,
    name: 'Goliath Mech',
    maxHealth: 320,
    speed: 34, // slow tank
    reward: 45,
    damageToBase: 20,
    size: 18,
    color: '#991b1b', // Heavy Crimson
    glowColor: '#dc2626',
    description: 'Heavily armored siege titan with tremendous durability and high base threat.',
  },
};
