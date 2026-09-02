import { describe, it, expect } from 'vitest';
import { WaveManager, WaveStatus } from '../game/WaveManager';

describe('Wave Generation & Progressive Difficulty (TC14, TC16)', () => {
  it('initializes with Wave 1 and ready status', () => {
    const wm = new WaveManager();
    expect(wm.getCurrentWaveNumber()).toBe(1);
    expect(wm.getTotalWaves()).toBe(10);
    expect(wm.getStatus()).toBe(WaveStatus.READY);
  });

  it('queues enemies properly and spawns them based on elapsed delta time', () => {
    const wm = new WaveManager();
    const started = wm.startWave();
    expect(started).toBe(true);
    expect(wm.getStatus()).toBe(WaveStatus.SPAWNING);

    const spawnedTypes: string[] = [];
    // Advance simulation by 2 seconds
    wm.update(2.0, (type) => {
      spawnedTypes.push(type);
    });

    expect(spawnedTypes.length).toBeGreaterThan(0);
  });

  it('progresses through waves and flags ALL_CLEARED upon wave 10 completion', () => {
    const wm = new WaveManager();

    // Loop through all 10 waves
    for (let w = 1; w <= 10; w++) {
      expect(wm.getCurrentWaveNumber()).toBe(w);
      wm.startWave();
      const bonus = wm.completeCurrentWave();
      expect(bonus).toBeGreaterThan(0);
    }

    expect(wm.getStatus()).toBe(WaveStatus.ALL_CLEARED);
  });
});
