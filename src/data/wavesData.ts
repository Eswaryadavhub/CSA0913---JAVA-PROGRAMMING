import { EnemyType, WaveConfig } from './gameTypes';

export const WAVES_CONFIG: WaveConfig[] = [
  {
    waveNumber: 1,
    completionBonus: 50,
    groups: [
      { type: EnemyType.BASIC, count: 5, intervalSeconds: 1.8, delayBeforeGroup: 0.5 },
    ],
  },
  {
    waveNumber: 2,
    completionBonus: 65,
    groups: [
      { type: EnemyType.BASIC, count: 4, intervalSeconds: 1.5, delayBeforeGroup: 0.5 },
      { type: EnemyType.FAST, count: 3, intervalSeconds: 1.2, delayBeforeGroup: 1.0 },
    ],
  },
  {
    waveNumber: 3,
    completionBonus: 80,
    groups: [
      { type: EnemyType.BASIC, count: 5, intervalSeconds: 1.4, delayBeforeGroup: 0.5 },
      { type: EnemyType.FAST, count: 4, intervalSeconds: 1.1, delayBeforeGroup: 0.8 },
    ],
  },
  {
    waveNumber: 4,
    completionBonus: 100,
    groups: [
      { type: EnemyType.BASIC, count: 6, intervalSeconds: 1.3, delayBeforeGroup: 0.5 },
      { type: EnemyType.FAST, count: 4, intervalSeconds: 1.0, delayBeforeGroup: 0.6 },
      { type: EnemyType.STRONG, count: 2, intervalSeconds: 2.5, delayBeforeGroup: 1.5 },
    ],
  },
  {
    waveNumber: 5,
    completionBonus: 120,
    groups: [
      { type: EnemyType.BASIC, count: 8, intervalSeconds: 1.2, delayBeforeGroup: 0.5 },
      { type: EnemyType.FAST, count: 5, intervalSeconds: 0.9, delayBeforeGroup: 0.8 },
      { type: EnemyType.STRONG, count: 3, intervalSeconds: 2.2, delayBeforeGroup: 1.2 },
    ],
  },
  {
    waveNumber: 6,
    completionBonus: 140,
    groups: [
      { type: EnemyType.FAST, count: 9, intervalSeconds: 0.8, delayBeforeGroup: 0.5 },
      { type: EnemyType.BASIC, count: 6, intervalSeconds: 1.1, delayBeforeGroup: 1.0 },
      { type: EnemyType.STRONG, count: 4, intervalSeconds: 2.0, delayBeforeGroup: 1.5 },
    ],
  },
  {
    waveNumber: 7,
    completionBonus: 160,
    groups: [
      { type: EnemyType.BASIC, count: 10, intervalSeconds: 1.0, delayBeforeGroup: 0.5 },
      { type: EnemyType.FAST, count: 8, intervalSeconds: 0.75, delayBeforeGroup: 0.8 },
      { type: EnemyType.STRONG, count: 5, intervalSeconds: 1.8, delayBeforeGroup: 1.2 },
    ],
  },
  {
    waveNumber: 8,
    completionBonus: 180,
    groups: [
      { type: EnemyType.STRONG, count: 6, intervalSeconds: 1.8, delayBeforeGroup: 0.5 },
      { type: EnemyType.FAST, count: 10, intervalSeconds: 0.65, delayBeforeGroup: 1.0 },
      { type: EnemyType.BASIC, count: 8, intervalSeconds: 0.9, delayBeforeGroup: 1.2 },
    ],
  },
  {
    waveNumber: 9,
    completionBonus: 220,
    groups: [
      { type: EnemyType.BASIC, count: 12, intervalSeconds: 0.85, delayBeforeGroup: 0.5 },
      { type: EnemyType.FAST, count: 12, intervalSeconds: 0.6, delayBeforeGroup: 0.7 },
      { type: EnemyType.STRONG, count: 8, intervalSeconds: 1.5, delayBeforeGroup: 1.2 },
    ],
  },
  {
    waveNumber: 10,
    completionBonus: 300,
    groups: [
      { type: EnemyType.STRONG, count: 10, intervalSeconds: 1.4, delayBeforeGroup: 0.5 },
      { type: EnemyType.FAST, count: 15, intervalSeconds: 0.5, delayBeforeGroup: 0.8 },
      { type: EnemyType.STRONG, count: 5, intervalSeconds: 1.2, delayBeforeGroup: 1.5 },
    ],
  },
];
