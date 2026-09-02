import { describe, it, expect } from 'vitest';
import { GameEngine } from '../game/GameEngine';
import { TargetingMode, TowerType } from '../data/gameTypes';
import { Enemy } from '../game/Enemy';
import { Tower } from '../game/Tower';

describe('Tower Placement, Targeting & Upgrades (TC04, TC05, TC06, TC10)', () => {
  it('validates allowed placement on defensive bastion zones', () => {
    const engine = new GameEngine();
    engine.startNewGame();

    // In DEFAULT_GRID_MAP: (6, 0) is TOWER_ZONE (2)
    const validation = engine.canPlaceTowerAt(6, 0, TowerType.BASIC);
    expect(validation.allowed).toBe(true);
  });

  it('prohibits placing towers directly on enemy march paths', () => {
    const engine = new GameEngine();
    engine.startNewGame();

    // In DEFAULT_GRID_MAP: (2, 2) is ENEMY_PATH (3)
    const validation = engine.canPlaceTowerAt(2, 2, TowerType.BASIC);
    expect(validation.allowed).toBe(false);
    expect(validation.reason).toContain('enemy march routes');
  });

  it('prohibits placing towers on environmental obstacles', () => {
    const engine = new GameEngine();
    engine.startNewGame();

    // In DEFAULT_GRID_MAP: (2, 0) is OBSTACLE (1)
    const validation = engine.canPlaceTowerAt(2, 0, TowerType.BASIC);
    expect(validation.allowed).toBe(false);
    expect(validation.reason).toContain('obstacles');
  });

  it('prohibits placing towers when coins are insufficient', () => {
    const engine = new GameEngine();
    engine.startNewGame();
    engine.economy.spend(250, 'Drain coins'); // Remaining: 50 coins (Basic Tower costs 100)

    const validation = engine.canPlaceTowerAt(6, 0, TowerType.BASIC);
    expect(validation.allowed).toBe(false);
    expect(validation.reason).toContain('Insufficient funds');
  });

  it('upgrades tower stats and caps at maximum rank', () => {
    const tower = new Tower('tower-1', TowerType.BASIC, { x: 6, y: 0 });
    const initialDamage = tower.damage;
    const initialRange = tower.range;

    expect(tower.level).toBe(1);
    expect(tower.getUpgradeCost()).toBe(80);

    // Upgrade to level 2
    const upgradedTo2 = tower.upgrade();
    expect(upgradedTo2).toBe(true);
    expect(tower.level).toBe(2);
    expect(tower.damage).toBeGreaterThan(initialDamage);
    expect(tower.range).toBeGreaterThan(initialRange);
    expect(tower.getUpgradeCost()).toBe(150);

    // Upgrade to level 3
    const upgradedTo3 = tower.upgrade();
    expect(upgradedTo3).toBe(true);
    expect(tower.level).toBe(3);
    expect(tower.getUpgradeCost()).toBe(0); // Max rank reached

    // Attempting further upgrade fails
    const upgradedTo4 = tower.upgrade();
    expect(upgradedTo4).toBe(false);
  });

  it('targets enemies correctly using FIRST targeting strategy', () => {
    const tower = new Tower('tower-test', TowerType.BASIC, { x: 5, y: 5 });
    tower.targetingMode = TargetingMode.FIRST;

    // Create 2 enemies in range
    const enemy1 = new Enemy('e1', TowerType.BASIC as any, [{ x: 5, y: 5 }]);
    enemy1.x = tower.x + 20;
    enemy1.y = tower.y;
    enemy1.distanceTraveled = 120;

    const enemy2 = new Enemy('e2', TowerType.BASIC as any, [{ x: 5, y: 5 }]);
    enemy2.x = tower.x + 40;
    enemy2.y = tower.y;
    enemy2.distanceTraveled = 250; // Further along path

    const target = tower.findTarget([enemy1, enemy2]);
    expect(target?.id).toBe('e2');
  });
});
