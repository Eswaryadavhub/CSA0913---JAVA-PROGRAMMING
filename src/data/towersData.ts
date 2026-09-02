import { TowerStats, TowerType } from './gameTypes';

export const TOWERS_CONFIG: Record<TowerType, TowerStats> = {
  [TowerType.BASIC]: {
    id: TowerType.BASIC,
    name: 'Gatling Sentry',
    cost: 100,
    damage: 25,
    range: 135,
    fireRate: 1.2, // shots per second
    splashRadius: 0,
    projectileSpeed: 380,
    color: '#3b82f6', // Bright blue
    projectileColor: '#60a5fa',
    description: 'Balanced automatic turret with consistent medium-range kinetic firepower.',
    bulletType: 'bullet',
    upgradeCosts: [80, 150],
    damageMultiplierPerLevel: 1.5,
    rangeMultiplierPerLevel: 1.15,
    fireRateMultiplierPerLevel: 1.2,
  },
  [TowerType.RAPID]: {
    id: TowerType.RAPID,
    name: 'Pulse Laser',
    cost: 125,
    damage: 12,
    range: 110,
    fireRate: 3.2, // fast burst fire
    splashRadius: 0,
    projectileSpeed: 600,
    color: '#10b981', // Emerald green
    projectileColor: '#34d399',
    description: 'High-frequency photon beam emitter specialized in eliminating swift scouts.',
    bulletType: 'laser',
    upgradeCosts: [100, 180],
    damageMultiplierPerLevel: 1.5,
    rangeMultiplierPerLevel: 1.12,
    fireRateMultiplierPerLevel: 1.25,
  },
  [TowerType.HEAVY]: {
    id: TowerType.HEAVY,
    name: 'Plasma Mortar',
    cost: 175,
    damage: 85,
    range: 180,
    fireRate: 0.45, // slow but heavy
    splashRadius: 55, // Area-of-effect damage
    projectileSpeed: 240,
    color: '#f59e0b', // Amber / orange
    projectileColor: '#fbbf24',
    description: 'Long-range seismic battery that launches explosive shells with AoE splash radius.',
    bulletType: 'cannon',
    upgradeCosts: [140, 240],
    damageMultiplierPerLevel: 1.6,
    rangeMultiplierPerLevel: 1.15,
    fireRateMultiplierPerLevel: 1.15,
  },
};
