import { EnemyType, WaveConfig } from '../data/gameTypes';
import { WAVES_CONFIG } from '../data/wavesData';

export enum WaveStatus {
  READY = 'READY',           // Ready to start wave
  SPAWNING = 'SPAWNING',     // Currently spawning enemies
  IN_PROGRESS = 'IN_PROGRESS', // All spawned, fighting remaining enemies
  COMPLETED = 'COMPLETED',   // Wave cleared, waiting to trigger next wave
  ALL_CLEARED = 'ALL_CLEARED', // All 10 waves successfully cleared!
}

interface SpawnQueueItem {
  type: EnemyType;
  spawnTime: number; // accumulated time when this enemy should spawn
}

export class WaveManager {
  private waves: WaveConfig[] = WAVES_CONFIG;
  private currentWaveIndex: number = 0;
  private status: WaveStatus = WaveStatus.READY;
  private spawnQueue: SpawnQueueItem[] = [];
  private waveTimer: number = 0;
  private totalEnemiesInCurrentWave: number = 0;
  private enemiesSpawnedCount: number = 0;

  constructor() {
    this.reset();
  }

  public reset() {
    this.currentWaveIndex = 0;
    this.status = WaveStatus.READY;
    this.spawnQueue = [];
    this.waveTimer = 0;
    this.totalEnemiesInCurrentWave = 0;
    this.enemiesSpawnedCount = 0;
  }

  public getCurrentWaveNumber(): number {
    return this.currentWaveIndex + 1;
  }

  public getTotalWaves(): number {
    return this.waves.length;
  }

  public getStatus(): WaveStatus {
    return this.status;
  }

  public getCurrentWaveConfig(): WaveConfig | null {
    if (this.currentWaveIndex < this.waves.length) {
      return this.waves[this.currentWaveIndex];
    }
    return null;
  }

  public getTotalEnemiesInWave(): number {
    return this.totalEnemiesInCurrentWave;
  }

  public getEnemiesSpawnedCount(): number {
    return this.enemiesSpawnedCount;
  }

  /**
   * Starts spawning the current wave
   */
  public startWave(): boolean {
    if (this.status !== WaveStatus.READY && this.status !== WaveStatus.COMPLETED) {
      return false;
    }

    if (this.currentWaveIndex >= this.waves.length) {
      this.status = WaveStatus.ALL_CLEARED;
      return false;
    }

    const config = this.waves[this.currentWaveIndex];
    this.spawnQueue = [];
    this.waveTimer = 0;
    this.enemiesSpawnedCount = 0;

    let accumulatedTime = 0;

    for (const group of config.groups) {
      accumulatedTime += group.delayBeforeGroup;
      for (let i = 0; i < group.count; i++) {
        this.spawnQueue.push({
          type: group.type,
          spawnTime: accumulatedTime,
        });
        accumulatedTime += group.intervalSeconds;
      }
    }

    this.totalEnemiesInCurrentWave = this.spawnQueue.length;
    this.status = WaveStatus.SPAWNING;
    return true;
  }

  /**
   * Updates wave timer and triggers enemy spawns when ready
   */
  public update(dt: number, onSpawnEnemy: (type: EnemyType) => void) {
    if (this.status !== WaveStatus.SPAWNING) return;

    this.waveTimer += dt;

    while (this.spawnQueue.length > 0 && this.spawnQueue[0].spawnTime <= this.waveTimer) {
      const next = this.spawnQueue.shift()!;
      this.enemiesSpawnedCount++;
      onSpawnEnemy(next.type);
    }

    if (this.spawnQueue.length === 0) {
      this.status = WaveStatus.IN_PROGRESS;
    }
  }

  /**
   * Called when all spawned enemies in the current wave are defeated
   */
  public completeCurrentWave(): number {
    const config = this.getCurrentWaveConfig();
    const bonus = config ? config.completionBonus : 50;

    if (this.currentWaveIndex + 1 >= this.waves.length) {
      this.status = WaveStatus.ALL_CLEARED;
    } else {
      this.currentWaveIndex++;
      this.status = WaveStatus.COMPLETED;
    }

    return bonus;
  }
}
